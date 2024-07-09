import { useState, useCallback, useEffect } from 'react';
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

export function useGetSnippetById(snippetId: string) {
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  const fetchSnippet = useCallback(async () => {
    if (!token || !user) {
      setError("No token or user available");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

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
      setSnippet(data);
    } catch (error) {
      console.error('Error fetching snippet:', error);
      setError('Failed to fetch snippet');
    } finally {
      setLoading(false);
    }
  }, [token, user, snippetId]);

  useEffect(() => {
    fetchSnippet();
  }, [fetchSnippet]);

  return { snippet, loading, error };
}