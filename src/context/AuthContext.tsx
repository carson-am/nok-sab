'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';

interface AuthContextType {
  isLoggedIn: boolean;
  userEmail: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isLoaded: authLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user } = useUser();

  const isLoggedIn = !!isSignedIn;
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? null;
  const isLoading = !authLoaded;

  const login = (_email: string, _password: string): boolean => {
    router.push('/login');
    return false;
  };

  const logout = async () => {
    await signOut({ redirectUrl: '/login' });
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userEmail,
        login,
        logout,
        isLoading,
      }}
    >
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
