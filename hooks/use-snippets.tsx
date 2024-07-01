import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface Snippet {
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

  
    const fetchSnippets = useCallback(async () => {
      if (!token || !user) {
        console.log("No token or user available, aborting fetch");
        return;
      }
  
      console.log("Fetching snippets for user:", user.id);
  
      try {
        const response = await fetch(`http://localhost:5000/api/snippets`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // ... rest of the fetch logic
      } catch (error) {
        console.error('Error fetching snippets:', error);
      }
    }, [token, user]);
  
  useEffect(() => {
    fetchSnippets();
  }, [fetchSnippets]);

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

      await fetchSnippets();
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

      await fetchSnippets();
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

      await fetchSnippets();
    } catch (error) {
      console.error('Error archiving snippet:', error);
      throw error;
    }
  };

  return { snippets, fetchSnippets, restoreSnippet, removeSnippet, archiveSnippet };
}