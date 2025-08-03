
import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types.ts';

interface PostCardProps {
  post: Post;
}

// Helper to format time since post from an ISO string
const timeAgo = (isoDate: string): string => {
  if (!isoDate) return '';
  const seconds = Math.floor((new Date().getTime() - new Date(isoDate).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    const years = Math.floor(interval);
    return `${years}y ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const months = Math.floor(interval);
    return `${months}mo ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const days = Math.floor(interval);
    return `${days}d ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const hours = Math.floor(interval);
    return `${hours}h ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    const minutes = Math.floor(interval);
    return `${minutes}m ago`;
  }
  return `${Math.floor(seconds)}s ago`;
}


const PostCard: React.FC<PostCardProps> = ({ post }) => {
  if (!post.author) {
    // This can happen briefly while author data is loading
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6">
      <div className="flex items-center mb-4">
        <Link to={`/profile/${post.author.id}`}>
            <img
            className="h-12 w-12 rounded-full object-cover mr-4"
            src={post.author.avatarUrl}
            alt={post.author.name}
            />
        </Link>
        <div>
          <Link to={`/profile/${post.author.id}`} className="font-bold text-gray-900 dark:text-white hover:underline">
            {post.author.name}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">{post.author.bio}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(post.timestamp)}</p>
        </div>
      </div>
      <p className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
    </div>
  );
};

export default PostCard;
