import React from 'react';

interface ContentModalProps {
  content: string;
  onClose: () => void;
}

export const ContentModal = ({ content, onClose }: ContentModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 overflow-auto">
      <div className="bg-gray-800 p-6 rounded-lg max-w-3xl w-full mx-4 my-8 sm:mx-auto sm:my-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-semibold">Snippet Content</h2>
          <button
            onClick={onClose}
            className="text-white bg-rose-500 hover:bg-rose-600 px-3 py-1 rounded transition-colors duration-300"
          >
            Close
          </button>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-[75vh]">
          <pre className="text-green-400 text-sm whitespace-pre-wrap">
            <code>{content}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
