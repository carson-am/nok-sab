'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated' && !!session;
  const userEmail = session?.user?.email ?? null;

  const login = (_email: string, _password: string): boolean => {
    // Login is handled by LoginCard via signIn(); no-op here for interface compatibility.
    return false;
  };

  const logout = () => {
    signOut({ callbackUrl: '/login' });
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
