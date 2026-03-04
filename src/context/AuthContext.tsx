'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../lib/supabase/client';

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
  const supabase = createClient();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      const session = data.session;
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email ?? null);
      setIsLoading(false);
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const login = (_email: string, _password: string): boolean => {
    // Supabase login is handled in LoginCard; this remains for compatibility.
    router.push('/login');
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUserEmail(null);
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
