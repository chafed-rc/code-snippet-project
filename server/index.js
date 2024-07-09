const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const WebSocket = require('ws');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) return res.sendStatus(403);
    req.user = { userId: decodedToken.userId, username: decodedToken.username };
    next();
  });
};

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// WebSocket server
const wss = new WebSocket.Server({ noServer: true });

// Handle WebSocket connections
wss.on('connection', (ws, request) => {
  console.log(`New WebSocket connection for user ${ws.userId}`);

  ws.on('message', (message) => {
    console.log('Received:', message);
    // Handle incoming messages if needed
  });

  ws.on('close', () => {
    console.log(`WebSocket disconnected for user ${ws.userId}`);
  });
});

// Modify your broadcast function to send messages only to the correct user
function broadcast(userId, message) {
  wss.clients.forEach((client) => {
    if (client.userId === userId && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Server upgrade to handle WebSocket connections
server.on('upgrade', (request, socket, head) => {
  const token = request.url.split('token=')[1];
  
  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.userId = decoded.userId;
      wss.emit('connection', ws, request);
    });
  });
});

// Signup endpoint
app.post("/api/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userCheckQuery = "SELECT * FROM users WHERE username = $1 OR email = $2";
    const userCheckResult = await pool.query(userCheckQuery, [username, email]);

    if (userCheckResult.rows.length > 0) {
      return res.status(400).json({ error: "Username or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserQuery = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email";
    const newUser = await pool.query(insertUserQuery, [username, email, hashedPassword]);

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const userQuery = "SELECT * FROM users WHERE username = $1";
    const userResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.userid, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login successful",
      user: { userid: user.userid, username: user.username, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all snippets for a user
app.get("/api/snippets", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const snippetsQuery = `
      SELECT id, title, language, tags, content, is_archived, is_published
      FROM snippets
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const snippetsResult = await pool.query(snippetsQuery, [userId]);

    res.json(snippetsResult.rows);
  } catch (error) {
    console.error("Error fetching snippets:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Archive snippet
app.put("/api/snippets/:id/archive", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "UPDATE snippets SET is_archived = true WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Snippet not found or unauthorized" });
    }

    broadcast(userId, { type: 'ARCHIVE_SNIPPET', payload: result.rows[0] });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error archiving snippet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Remove snippet permanently
app.delete("/api/snippets/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "DELETE FROM snippets WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Snippet not found or unauthorized" });
    }

    broadcast(userId, { type: 'DELETE_SNIPPET', payload: result.rows[0] });

    res.json({ message: "Snippet deleted successfully" });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Restore a snippet
app.put("/api/snippets/:id/restore", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "UPDATE snippets SET is_archived = false WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Snippet not found or unauthorized" });
    }

    broadcast(userId, { type: 'RESTORE_SNIPPET', payload: result.rows[0] });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error restoring snippet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new snippet
app.post("/api/snippets", authenticateToken, async (req, res) => {
  const { title, language, tags, content } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "INSERT INTO snippets (user_id, title, language, tags, content) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [userId, title, language, tags, content]
    );

    broadcast(userId, { type: 'CREATE_SNIPPET', payload: result.rows[0] });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating snippet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a snippet
// Update a snippet
app.put("/api/snippets/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user.userId;

  console.log(`Attempting to update snippet ${id} for user ${userId}`, updates);

  try {
    // Build the dynamic update query
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    const values = Object.values(updates);

    const query = `
      UPDATE snippets 
      SET ${setClause} 
      WHERE id = $${values.length + 1} AND user_id = $${values.length + 2} 
      RETURNING *
    `;

    console.log('Executing query:', query);
    console.log('Query values:', [...values, id, userId]);

    const result = await pool.query(query, [...values, id, userId]);

    if (result.rows.length === 0) {
      console.log(`No snippet found with id ${id} for user ${userId}`);
      return res.status(404).json({ error: "Snippet not found or unauthorized" });
    }

    console.log(`Successfully updated snippet ${id}`, result.rows[0]);

    broadcast(userId, { type: 'UPDATE_SNIPPET', payload: result.rows[0] });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating snippet:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Get a single snippet by ID
app.get("/api/snippets/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const snippetQuery = `
      SELECT id, title, language, tags, content, is_archived, is_published
      FROM snippets
      WHERE id = $1 AND user_id = $2
    `;
    const snippetResult = await pool.query(snippetQuery, [id, userId]);

    if (snippetResult.rows.length === 0) {
      return res.status(404).json({ error: "Snippet not found or unauthorized" });
    }

    res.json(snippetResult.rows[0]);
  } catch (error) {
    console.error("Error fetching snippet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});