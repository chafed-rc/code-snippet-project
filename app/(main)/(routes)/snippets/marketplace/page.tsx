'use client'

import { useState, useEffect } from 'react';
import { useSnippets, MarketplaceSnippet } from '@/hooks/use-snippets';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import SnippetCard from './snippet-card';

const MarketplacePage = () => {
  const [marketplaceSnippets, setMarketplaceSnippets] = useState<MarketplaceSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getMarketplace, createSnippet } = useSnippets();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMarketplaceSnippets = async () => {
      try {
        console.log("Fetching marketplace snippets...");
        const snippets = await getMarketplace();
        console.log("Fetched snippets:", snippets);
        setMarketplaceSnippets(snippets);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching snippets:", err);
        setError('Failed to fetch marketplace snippets');
        setLoading(false);
      }
    };

    fetchMarketplaceSnippets();
  }, [getMarketplace]);

  const handleAddToCollection = async (snippet: MarketplaceSnippet) => {
    if (!user) {
      toast.error('You must be logged in to add snippets to your collection');
      return;
    }

    try {
      const newSnippet = await createSnippet({
        title: snippet.title,
        language: snippet.language,
        tags: snippet.tags,
        content: snippet.content,
      });

      toast.success('Snippet added to your collection');
      return newSnippet;
    } catch (error) {
      console.error('Error adding snippet to collection:', error);
      toast.error('Failed to add snippet to your collection');
      throw error;
    }
  };

  if (loading) return <div className="text-white text-2xl text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-2xl text-center mt-10">{error}</div>;
  if (marketplaceSnippets.length === 0) return <div className="text-white text-2xl text-center mt-10">No snippets available.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 sm:mb-8 text-center">Snippet Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {marketplaceSnippets.map((snippet) => (
          <SnippetCard 
            key={snippet.id} 
            snippet={snippet} 
            onAddToCollection={handleAddToCollection}
          />
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
