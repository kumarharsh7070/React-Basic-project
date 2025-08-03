
import { User, Post } from '../types.ts';
import { GoogleGenAI } from "@google/genai";

// Base URL for the backend API. 
// Make sure your backend server is running on port 5001.
const API_BASE_URL = 'http://localhost:5001/api';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Content-Type': 'application/json', 'x-auth-token': token } : { 'Content-Type': 'application/json' };
};

export const api = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to login');
    return data; // Returns { token, user }
  },

  register: async (name: string, email: string, password: string, bio: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, bio }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to register');
    return data; // Returns { token, user }
  },

  loadUserFromToken: async (): Promise<User | null> => {
     const token = localStorage.getItem('token');
     if (!token) return null;
     
     const response = await fetch(`${API_BASE_URL}/auth`, {
         method: 'GET',
         headers: getAuthHeaders(),
     });
     if (!response.ok) {
         localStorage.removeItem('token');
         return null;
     }
     const user = await response.json();
     return { ...user, id: user._id };
  },
  
  getUser: async (userId: string): Promise<User | null> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!response.ok) return null;
    const user = await response.json();
    return { ...user, id: user._id };
  },

  getPosts: async (): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const posts = await response.json();
    return posts.map((p: any) => ({ ...p, id: p._id, timestamp: p.createdAt }));
  },

  getPostsByUser: async (userId: string): Promise<Post[]> => {
    const response = await fetch(`${API_BASE_URL}/posts/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const posts = await response.json();
    return posts.map((p: any) => ({ ...p, id: p._id, timestamp: p.createdAt }));
  },

  createPost: async (content: string): Promise<Post> => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
    });
    const post = await response.json();
    return { ...post, id: post._id, timestamp: post.createdAt };
  },

  getPostSuggestion: async (draft: string): Promise<string> => {
    try {
      const prompt = `You are a creative assistant for a social media platform for developers called DevConnect. Your goal is to help users write engaging posts.
  
      Instructions:
      - Keep the tone professional but friendly and concise.
      - The output should be a short post, ideally 2-4 sentences long.
      - Include 1-3 relevant hashtags like #dev, #coding, #software, etc.
      - If the user provides a draft, refine it or expand upon it.
      - If the user's input is empty, suggest a post about a current, interesting topic in software development (e.g., AI, new frameworks, WASM, etc.).
      
      User's draft: "${draft}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      console.error("Gemini API error:", error);
      if (error instanceof Error && error.message.includes('API key not valid')) {
          return "AI feature is not available. The API key is invalid or missing.";
      }
      return "Sorry, I couldn't come up with a suggestion right now. Please try again.";
    }
  },
};
