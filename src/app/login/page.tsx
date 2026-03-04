import { Suspense } from 'react';
import LoginCard from '../../components/LoginCard';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>}>
      <LoginCard />
    </Suspense>
  );
}
