// hooks/use-update-snippet.ts

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface Snippet {
  id: number;
  title: string;
  language: string;
  content: string;
  tags: string[];
  // Add other properties as needed
}

export function useUpdateSnippet() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const updateSnippet = async (snippetId: number, updates: Partial<Snippet>) => {
    if (!token) {
      setError("No authentication token available");
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/snippets/${snippetId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update snippet');
      }

      const updatedSnippet = await response.json();
      setIsUpdating(false);
      return updatedSnippet;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setIsUpdating(false);
    }
  };

  return { updateSnippet, isUpdating, error };
}