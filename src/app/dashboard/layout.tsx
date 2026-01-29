'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    } else {
      // Fade in when logged in
      setTimeout(() => setIsVisible(true), 50);
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <div 
      className={`transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Layout>{children}</Layout>
    </div>
  );
}
