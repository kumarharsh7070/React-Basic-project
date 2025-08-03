
import React, { useState } from 'react';
import { api } from '../services/api.ts';
import { Post } from '../types.ts';

interface CreatePostFormProps {
    onPostCreated: (newPost: Post) => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsLoading(true);
    try {
        // The backend infers the user from the auth token
        const newPost = await api.createPost(content);
        onPostCreated(newPost);
        setContent('');
    } catch (error) {
        console.error("Failed to create post", error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleAskAi = async () => {
    setIsAiLoading(true);
    try {
      const suggestion = await api.getPostSuggestion(content);
      setContent(suggestion);
    } catch (error) {
      console.error("Failed to get AI suggestion", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
          rows={3}
          placeholder="What's on your mind? Or ask our AI for a suggestion!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading || isAiLoading}
        />
        <div className="flex justify-end items-center mt-3 space-x-2">
          <button
            type="button"
            onClick={handleAskAi}
            disabled={isLoading || isAiLoading}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 disabled:bg-purple-400 dark:disabled:bg-purple-800 disabled:cursor-not-allowed transition-colors flex items-center"
            aria-label="Ask AI for a post suggestion"
          >
            {isAiLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Thinking...</span>
              </>
            ) : (
              '✨ Ask AI'
            )}
          </button>
          <button
            type="submit"
            disabled={!content.trim() || isLoading || isAiLoading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
