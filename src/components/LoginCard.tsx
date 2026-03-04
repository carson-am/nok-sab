'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../lib/supabase/client';
import Logo from './Logo';

// Debug: verify Supabase URL is available in browser
console.log('Current Supabase URL in browser:', process.env.NEXT_PUBLIC_SUPABASE_URL);

export default function LoginCard() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setSuccessMessage('Password updated. You can sign in now.');
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      console.error('Supabase Login Error:', signInError.message);
      setError('Invalid email or password');
    } else {
      window.location.href = '/dashboard';
    }
    setIsSubmitting(false);
  };

  const handleForgotSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
      });
      if (resetError) {
        setError(resetError.message);
      } else {
        setResetSent(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-xl text-center">
            <div className="mb-8" style={{ background: 'transparent' }}>
              <Logo size="large" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Strategic Advisory Board
            </h1>
            <p className="text-base lg:text-lg text-slate-400 leading-relaxed">
              Architecting the future of recommerce.
            </p>
          </div>
        </div>
        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <div className="glass-card p-8 w-full max-w-md rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Forgot Password?</h2>
            <p className="text-slate-400 text-sm text-center mb-6">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
            {resetSent ? (
              <div className="space-y-4">
                <p className="text-slate-300 text-center text-sm">
                  Check your email for the reset link. It may take a few minutes to arrive.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetSent(false);
                    setForgotEmail('');
                  }}
                  className="w-full text-slate-400 hover:text-white text-sm py-2"
                >
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-6">
                <div className="text-left">
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-nok-blue/60 focus:border-transparent"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-nok-blue text-white font-semibold py-3 px-4 rounded-lg btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send reset link'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError(null);
                    setForgotEmail('');
                  }}
                  className="w-full text-slate-400 hover:text-white text-sm py-2"
                >
                  Back to sign in
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
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

      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="glass-card p-8 w-full max-w-md rounded-xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
            <p className="text-slate-400 text-sm">
              Sign in with your Strategic Advisory Board credentials.
            </p>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm text-center">
              {successMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
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
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
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
              disabled={isSubmitting}
              className="w-full bg-nok-blue text-white font-semibold py-3 px-4 rounded-lg btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>

            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="w-full text-slate-400 hover:text-white text-sm text-center py-2"
            >
              Forgot Password?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
