
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { User, Post } from '../types.ts';
import { api } from '../services/api.ts';
import PostCard from '../components/PostCard.tsx';

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const [userData, userPosts] = await Promise.all([
        api.getUser(userId),
        api.getPostsByUser(userId),
      ]);
      setUser(userData);
      setPosts(userPosts);
    } catch (error) {
      console.error("Failed to fetch profile data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (isLoading) {
    return <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-gray-500 dark:text-gray-400">User not found.</div>;
  }

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center">
            <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-24 h-24 rounded-full object-cover mr-6 border-4 border-blue-500"
            />
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                <p className="text-md text-gray-600 dark:text-gray-300 mt-1">{user.bio}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
            </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{user.name}'s Posts</h2>
      {posts.length > 0 ? (
        posts.map(post => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-500 dark:text-gray-400">
            This user hasn't posted anything yet.
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
