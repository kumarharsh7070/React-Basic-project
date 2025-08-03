import React, { useState, useEffect, useCallback } from 'react';
import { Post } from '../types.ts';
import { api } from '../services/api.ts';
import PostCard from '../components/PostCard.tsx';
import CreatePostForm from '../components/CreatePostForm.tsx';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedPosts = await api.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = (newPost: Post) => {
    // Add the new post to the top of the feed for immediate feedback
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  return (
    <div>
      <CreatePostForm onPostCreated={handlePostCreated} />
      {isLoading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading feed...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            No posts yet. Be the first to share!
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;