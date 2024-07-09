import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';

export interface Snippet {
  id: number;
  title: string;
  tags: string[];
  content: string;
  language: string;
  is_archived: boolean;
  is_published: boolean;
}

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const fetchSnippets = useCallback(async () => {
    if (!token || !user) {
      console.log("No token or user available, aborting fetch");
      return;
    }

    console.log("Fetching snippets for user:", user.userid);

    try {
      const response = await fetch(`http://localhost:5000/api/snippets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch snippets');
      }

      const data = await response.json();
      setSnippets(data);
    } catch (error) {
      console.error('Error fetching snippets:', error);
    }
  }, [token, user]);

  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

  useEffect(() => {
    if (!token) return;

    const ws = new WebSocket(`ws://localhost:5000?token=${token}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received WebSocket message:', message);

      switch (message.type) {
        case 'CREATE_SNIPPET':
          setSnippets((prevSnippets) => [message.payload, ...prevSnippets]);
          break;
        case 'ARCHIVE_SNIPPET':
          setSnippets((prevSnippets) =>
            prevSnippets.map((snippet) =>
              snippet.id === message.payload.id ? { ...snippet, is_archived: true } : snippet
            )
          );
          break;
        case 'DELETE_SNIPPET':
          setSnippets((prevSnippets) =>
            prevSnippets.filter((snippet) => snippet.id !== message.payload.id)
          );
          break;
        case 'UPDATE_SNIPPET':
          setSnippets((prevSnippets) =>
            prevSnippets.map((snippet) =>
              snippet.id === message.payload.id ? message.payload : snippet
            )
          );
          break;
        case 'RESTORE_SNIPPET':
          setSnippets((prevSnippets) =>
            prevSnippets.map((snippet) =>
              snippet.id === message.payload.id ? { ...snippet, is_archived: false } : snippet
            )
          );
          break;
        case 'CONNECTION':
          console.log(message.message);
          break;
        default:
          console.log('Unknown message type:', message.type);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, [token]);

  const restoreSnippet = async (snippetId: number) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/snippets/${snippetId}/restore`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to restore snippet');
      }

    } catch (error) {
      console.error('Error restoring snippet:', error);
      throw error;
    }
  };

  const removeSnippet = async (snippetId: number) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/snippets/${snippetId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to remove snippet');
      }

    } catch (error) {
      console.error('Error removing snippet:', error);
      throw error;
    }
  };

  const archiveSnippet = async (snippetId: number) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/snippets/${snippetId}/archive`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to archive snippet');
      }

    } catch (error) {
      console.error('Error archiving snippet:', error);
      throw error;
    }
  };

  const getSnippetById = useCallback(async (snippetId: number): Promise<Snippet> => {
    if (!token || !user) {
      throw new Error("No token or user available");
    }

    try {
      const response = await fetch(`http://localhost:5000/api/snippets/${snippetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch snippet');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching snippet:', error);
      throw error;
    }
  }, [token, user]);

  const updateSnippet = useCallback(async (snippetId: number, updates: Partial<Snippet>) => {
    if (!user || !token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/snippets/${snippetId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update snippet');
      }

      const updatedSnippet = await response.json();

      // Update the local state
      setSnippets((prevSnippets) =>
        prevSnippets.map((snippet) =>
          snippet.id === snippetId ? { ...snippet, ...updatedSnippet } : snippet
        )
      );

      return updatedSnippet;
    } catch (error) {
      console.error('Error updating snippet:', error);
      throw error;
    }
  }, [token, user]);

  return { snippets, fetchSnippets, restoreSnippet, removeSnippet, archiveSnippet, getSnippetById, updateSnippet };
}