import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  wallet_address?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, walletAddress?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateWalletAddress: (walletAddress: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('supabase.auth.token');
        if (token) {
          const profile = await apiClient.getProfile();
          setUser(profile.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('supabase.auth.token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(email, password);
      localStorage.setItem('supabase.auth.token', response.token);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, walletAddress?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.register(email, password, walletAddress);
      localStorage.setItem('supabase.auth.token', response.token);
      setUser(response.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiClient.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('supabase.auth.token');
      setUser(null);
      setLoading(false);
    }
  };

  const updateWalletAddress = async (walletAddress: string) => {
    try {
      await apiClient.updateProfile(walletAddress);
      if (user) {
        setUser({ ...user, wallet_address: walletAddress });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update wallet address';
      setError(errorMessage);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateWalletAddress,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 