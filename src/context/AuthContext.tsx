import { createContext, useState, type ReactNode } from 'react';
import type { Credentials } from '../types';

interface AuthContextType {
  credentials: Credentials | null;
  isAuthenticated: boolean;
  login: (creds: Credentials) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'green_api_credentials';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [credentials, setCredentials] = useState<Credentials | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Credentials) : null;
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const isAuthenticated = !!credentials;

  const login = (creds: Credentials) => {
    setCredentials(creds);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
  };

  const logout = () => {
    setCredentials(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ credentials, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};