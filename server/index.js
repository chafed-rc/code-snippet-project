const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

  console.log("Auth Header:", authHeader);
  console.log("Token:", token);

  if (token == null) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.sendStatus(403);
    }
    console.log("Decoded token:", decodedToken);
    req.user = { userId: decodedToken.userId, username: decodedToken.username };
    next();
  });
};

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

    console.log("New user created:", newUser.rows[0]);
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

    console.log("User logged in:", user);

    const token = jwt.sign(
      { userId: user.userid, username: user.username },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );

    console.log("Created token:", token);
    console.log("Token payload:", { userId: user.userid, username: user.username });

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
    console.log("Fetching snippets for user:", userId);

    const snippetsQuery = `
      SELECT id, title, language, tags, content, is_archived, is_published
      FROM snippets
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const snippetsResult = await pool.query(snippetsQuery, [userId]);

    console.log("Snippets found:", snippetsResult.rows.length);
    res.json(snippetsResult.rows);
  } catch (error) {
    console.error("Error fetching snippets:", error);
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

    console.log("Snippet restored:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error restoring snippet:", error);
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

    console.log("Snippet deleted:", id);
    res.json({ message: "Snippet deleted successfully" });
  } catch (error) {
    console.error("Error deleting snippet:", error);
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

    console.log("Snippet archived:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error archiving snippet:", error);
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

    console.log("New snippet created:", result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating snippet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a snippet
app.put("/api/snippets/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, language, tags, content } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "UPDATE snippets SET title = $1, language = $2, tags = $3, content = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
      [title, language, tags, content, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Snippet not found or unauthorized" });
    }

    console.log("Snippet updated:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating snippet:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});