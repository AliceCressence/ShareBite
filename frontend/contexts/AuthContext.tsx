import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Check auth status on mount and periodically
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
        // Try to refresh the token
        await attemptRefresh();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Attempt to refresh the access token
  const attemptRefresh = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        // After successful refresh, check auth again
        const meResponse = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (meResponse.ok) {
          const userData = await meResponse.json();
          setUser(userData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // After successful login, get user info
        await checkAuth();
        return { success: true };
      } else {
        return {
          success: false,
          error: data.detail || 'Login failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Clear any local storage if needed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
      router.push('/');
    }
  };

  const refreshAuth = async () => {
    await checkAuth();
  };

  useEffect(() => {
    checkAuth();

    // Set up periodic token refresh (every 10 minutes)
    const interval = setInterval(async () => {
      if (user) {
        await attemptRefresh();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Auto-refresh token before it expires
  useEffect(() => {
    if (!user) return;

    // Set up refresh 2 minutes before token expires (13 minutes)
    const refreshTimeout = setTimeout(async () => {
      await attemptRefresh();
    }, 13 * 60 * 1000);

    return () => clearTimeout(refreshTimeout);
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
