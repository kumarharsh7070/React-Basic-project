
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthContextType } from '../types.ts';
import { api } from '../services/api.ts';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const userProfile = await api.loadUserFromToken();
        if(userProfile) {
          setUser(userProfile);
          setToken(storedToken);
        } else {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token: receivedToken, user: loggedInUser } = await api.login(email, password);
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser({ ...loggedInUser, id: loggedInUser._id });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name: string, email: string, password: string, bio: string) => {
    try {
      const { token: receivedToken, user: newUser } = await api.register(name, email, password, bio);
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser({ ...newUser, id: newUser._id });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    logout,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
