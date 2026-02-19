'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in from sessionStorage
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const email = sessionStorage.getItem('userEmail');
    setIsLoggedIn(loggedIn);
    setUserEmail(email || null);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Accept any valid email format + any non-empty password
    const isValidEmail = emailRegex.test(email);
    const hasPassword = password.length > 0;

    if (isValidEmail && hasPassword) {
      setIsLoggedIn(true);
      setUserEmail(email);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('userEmail', email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userEmail');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
