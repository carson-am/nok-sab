'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';
import Logo from './Logo';

export default function LoginCard() {
  const router = useRouter();
  const signInRes = useSignIn();

  // Clerk v5 signal guard – wait until the resource is loaded
  if (!signInRes || !signInRes.isLoaded) {
    return null;
  }

  const { signIn, setActive } = signInRes;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!signInRes.isLoaded || !signIn) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive?.({ session: result.createdSessionId });
        router.push('/dashboard');
      } else {
        setError('Unable to complete sign in. Please try again.');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - Branding */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="max-w-xl text-center">
          <div className="mb-8" style={{ background: 'transparent' }}>
            <Logo size="large" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Strategic Advisory Board
          </h1>
          <p className="text-base lg:text-lg text-slate-400 leading-relaxed">
            Architecting the future of recommerce. An exclusive forum for industry leaders to redefine the circular economy.
          </p>
        </div>
      </div>

      {/* Right Column - Login Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="glass-card p-8 w-full max-w-md rounded-xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
            <p className="text-slate-400 text-sm">
              Sign in with your Strategic Advisory Board credentials.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="text-left">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-nok-blue/60 focus:border-transparent"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="text-left">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-nok-blue/60 focus:border-transparent"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={!signInRes.isLoaded || isSubmitting}
              className="w-full bg-nok-blue text-white font-semibold py-3 px-4 rounded-lg btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>

            <p className="text-slate-500 text-xs text-center">
              If you do not have SAB credentials, please contact the Nok team to request access.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
