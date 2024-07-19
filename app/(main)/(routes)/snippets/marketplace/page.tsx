'use client'

import { useState, useEffect } from 'react';
import { useSnippets, Snippet as SnippetType, MarketplaceSnippet } from '@/hooks/use-snippets';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

const SnippetCard = ({ snippet, onAddToCollection }: { snippet: MarketplaceSnippet; onAddToCollection: (snippet: MarketplaceSnippet) => Promise<void> }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCollection = async () => {
    setIsAdding(true);
    try {
      await onAddToCollection(snippet);
    } catch (error) {
      console.error('Error adding to collection:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
      <div className="p-1 bg-gray-700 flex items-center space-x-1">
        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <h2 className="text-white text-lg sm:text-xl font-semibold mb-2 sm:mb-3 truncate">{snippet.title}</h2>
        <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          {snippet.tags.map((tag: string, index: number) => (
            <span key={index} className="bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 flex items-center">
          <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 mr-2"></span>
          {snippet.language}
        </p>
        <div className="bg-gray-900 p-3 sm:p-4 rounded-lg overflow-hidden mb-4 flex-grow">
          <pre className="text-green-400 text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap h-full">
            <code>
              {snippet.content.slice(0, 150)}
              {snippet.content.length > 150 && '...'}
            </code>
          </pre>
        </div>
        <button
          onClick={handleAddToCollection}
          disabled={isAdding}
          className="w-full bg-rose-500 text-white px-4 py-2 rounded font-semibold hover:bg-rose-600 transition-colors duration-300 disabled:opacity-50 text-sm sm:text-base"
        >
          {isAdding ? 'Adding...' : 'Add to My Collection'}
        </button>
      </div>
    </div>
  );
};

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