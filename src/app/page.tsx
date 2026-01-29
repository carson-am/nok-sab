'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import LoginCard from '../components/LoginCard';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      setIsTransitioning(true);
      // Small delay to allow fade effect
      setTimeout(() => {
        router.push('/dashboard');
      }, 300);
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    return (
      <div 
        className={`min-h-screen transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <LoginCard />
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-opacity duration-300 opacity-100">
      <LoginCard />
    </div>
  );
}
