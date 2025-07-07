import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (user: any, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Restore auth state from cookies/localStorage on mount
  useEffect(() => {
    const tokenFromCookie = Cookies.get('token');
    const userFromStorage = localStorage.getItem('user');

    if (tokenFromCookie && userFromStorage) {
      try {
        const userData = JSON.parse(userFromStorage);
        setUser(userData);
        setToken(tokenFromCookie);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        // Clear invalid data
        Cookies.remove('token');
        localStorage.removeItem('user');
      }
    }
    setIsInitialized(true);
  }, []);

  const login = (user: any, token: string) => {
    setUser(user);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    Cookies.remove('token');
    localStorage.removeItem('user');
  };

  const value = useMemo(() => ({ user, token, login, logout }), [user, token]);

  // Don't render children until auth state is initialized
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
} 