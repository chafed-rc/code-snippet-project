import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MarketplaceSnippet, useSnippets } from '@/hooks/use-snippets';
import { ContentModal } from './content-modal';

interface SnippetCardProps {
  snippet: MarketplaceSnippet;
  onAddToCollection: (snippet: MarketplaceSnippet) => Promise<void>;
}

const SnippetCard = ({ snippet, onAddToCollection }: SnippetCardProps) => {
  const { getUserById } = useSnippets();
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const user = await getUserById(snippet.id);
        setUsername(user.username);
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [getUserById, snippet.id]);

  const handleAddToCollection = async () => {
    setIsAdding(true);
    try {
      await onAddToCollection(snippet);
      toast.success('Snippet added to your collection');
    } catch (error) {
      console.error('Error adding to collection:', error);
      toast.error('Failed to add snippet to your collection');
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full cursor-pointer" onClick={handleOpenModal}>
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
          <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 flex items-center">
            <span className="mr-2">Created by:</span>
            <span className="font-semibold">{username || 'Loading...'}</span>
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
            onClick={(e) => {
              e.stopPropagation(); // Prevent opening the modal when clicking the button
              handleAddToCollection();
            }}
            disabled={isAdding}
            className="w-full bg-rose-500 text-white px-4 py-2 rounded font-semibold hover:bg-rose-600 transition-colors duration-300 disabled:opacity-50 text-sm sm:text-base"
          >
            {isAdding ? 'Adding...' : 'Add to My Collection'}
          </button>
        </div>
      </div>
      {isModalOpen && <ContentModal content={snippet.content} onClose={handleCloseModal} />}
    </>
  );
};

export default SnippetCard;
