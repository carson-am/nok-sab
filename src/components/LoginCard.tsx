'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn, useUser, useClerk } from '@clerk/nextjs';
import Logo from './Logo';

export default function LoginCard() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const signIn = useSignIn() as any;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAdvisorCheck, setPendingAdvisorCheck] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'code'>('email');
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (!pendingAdvisorCheck || !clerkUser) return;
    const role = (clerkUser.publicMetadata as { role?: string })?.role;
    setPendingAdvisorCheck(false);
    if (role !== 'advisor') {
      signOut?.();
      setError('Invalid Credentials.');
      return;
    }
    router.push('/dashboard');
  }, [pendingAdvisorCheck, clerkUser, signOut, router]);

  if (!signIn || !signIn.isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400 text-lg">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await signIn.signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await signIn.setActive({ session: result.createdSessionId });
        setPendingAdvisorCheck(true);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await signIn.create({ strategy: 'reset_password_email_code', identifier: forgotEmail });
      setResetStep('code');
    } catch (err) {
      setError('Could not send reset code. Check the email address.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotReset = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: resetCode,
        password: newPassword,
      });
      if (result.status === 'complete') {
        await signOut?.();
        setResetSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError('Reset failed. Please try again.');
      }
    } catch (err) {
      setError('Invalid code or password. Please try again.');
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
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">Strategic Advisory Board</h1>
            <p className="text-base lg:text-lg text-slate-400 leading-relaxed">
              Architecting the future of recommerce.
            </p>
          </div>
        </div>
        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <div className="glass-card p-8 w-full max-w-md rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Forgot Password?</h2>
            {resetSuccess ? (
              <p className="text-slate-300 text-center">Password updated. Redirecting to sign in...</p>
            ) : resetStep === 'email' ? (
              <form onSubmit={handleForgotSendCode} className="space-y-6">
                <div className="text-left">
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-sm text-white"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-nok-blue text-white font-semibold py-3 px-4 rounded-lg btn-glow disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Send reset code'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setError(null); setResetStep('email'); }}
                  className="w-full text-slate-400 hover:text-white text-sm"
                >
                  Back to sign in
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotReset} className="space-y-6">
                <div className="text-left">
                  <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-1">Code from email</label>
                  <input
                    id="code"
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-sm text-white"
                    placeholder="Enter code"
                    required
                  />
                </div>
                <div className="text-left">
                  <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-1">New password</label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-sm text-white"
                    placeholder="New password"
                    required
                    minLength={8}
                  />
                </div>
                {error && <div className="text-red-400 text-sm text-center">{error}</div>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-nok-blue text-white font-semibold py-3 px-4 rounded-lg btn-glow disabled:opacity-60"
                >
                  {isSubmitting ? 'Resetting...' : 'Reset password'}
                </button>
                <button
                  type="button"
                  onClick={() => { setResetStep('email'); setError(null); }}
                  className="w-full text-slate-400 hover:text-white text-sm"
                >
                  Back
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
              className="w-full text-slate-400 hover:text-white text-sm text-center"
            >
              Forgot Password?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
