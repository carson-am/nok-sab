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
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user } = useUser();

  const isLoggedIn = !!isSignedIn;
  const userEmail = user?.primaryEmailAddress?.emailAddress ?? null;

  const login = (_email: string, _password: string): boolean => {
    // Login is handled via Clerk sign-in on the primary referral domain.
    router.push('/login');
    return false;
  };

  const logout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userEmail,
        login,
        logout,
        isLoading: !isLoaded,
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
