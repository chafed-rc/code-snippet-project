'use client';

import { useSnippets } from '@/hooks/use-snippets';
import { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { tsxLanguage, jsxLanguage } from "@codemirror/lang-javascript";
import { Snippet } from '@/hooks/use-snippets';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface SnippetPageProps {
  params: {
    snippetId: string;
  };
}

const SnippetDetailComponent = ({ params }: SnippetPageProps) => {
  const { snippets, getSnippetById, updateSnippet } = useSnippets();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const snippetId = parseInt(params.snippetId, 10);
        const fetchedSnippet = await getSnippetById(snippetId);
        setSnippet(fetchedSnippet);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch snippet');
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [params.snippetId, getSnippetById]);

  useEffect(() => {
    const currentSnippet = snippets.find(s => s.id.toString() === params.snippetId);
    if (currentSnippet) {
      setSnippet(currentSnippet);
    }
  }, [snippets, params.snippetId]);



  if (loading) return <p className=''>Loading...</p>;
  if (error) return <p className='text-white text-center pt-40 font-semibold text-3xl'>{`Error: ${error} :(`}</p>;
  if (!snippet) return <p className='flex items-center justify-center text-center text-4xl font-bold text-white'>{`No snippet found :(`}</p>;

  return (
    <div className='mt-32'>
      <div className='md:max-w-3xl lg:max-w-4xl mx-auto p-2'>
        <h1 className='text-white text-4xl mb-4 font-semibold'>{snippet.title}</h1>
        <div className='flex justify-between items-center flex-wrap gap-2 mb-4'>
          <div className='flex flex-row gap-2 items-center'>
            {(
              snippet.tags.map((tag, index) => (
                <span
                  key={index}
                  className='bg-rose-500 text-white px-2 py-1 rounded text-sm font-medium'
                >
                  {tag.toUpperCase()}
                </span>
              ))
            )}
          </div>
        </div>
        <div className='bg-gray-800 rounded overflow-hidden shadow-lg'>
          <div className='flex items-center p-4 bg-gray-700'>
            <div className='flex space-x-2'>
              <div className='w-3 h-3 bg-red-500 rounded-full'></div>
              <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
              <div className='w-3 h-3 bg-green-500 rounded-full'></div>
            </div>
          </div>
          <CodeMirror
            theme={dracula}
            value={snippet.content}
            height='400px'
            className='rounded-b-lg'
            editable={false}
            extensions={[tsxLanguage, jsxLanguage]}
            onChange={(value) => setSnippet(prev => prev ? {...prev, content: value} : null)}
          />
        </div>
      </div>
    </div>
  );
};

export default SnippetDetailComponent;