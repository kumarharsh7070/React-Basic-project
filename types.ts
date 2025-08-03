
export interface User {
  id?: string; // MongoDB uses _id, so we'll map it to id. Optional for creation.
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
}

export interface Post {
  id:string;
  content: string;
  authorId: string;
  timestamp: string; // ISO Date String from backend
  author?: User; // Optional: denormalized author data
}

export interface AuthContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean; error?: string;}>;
  register: (name: string, email: string, password: string, bio: string) => Promise<{success: boolean; error?: string;}>;
  logout: () => void;
  loadUser: () => Promise<void>;
}