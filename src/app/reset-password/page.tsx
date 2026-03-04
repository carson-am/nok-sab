'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase/client';
import Logo from '../../components/Logo';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    await supabase.auth.signOut();
    router.push('/login?reset=success');
  };

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
            Set a new password for your account.
          </p>
        </div>
      </div>

      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="glass-card p-8 w-full max-w-md rounded-xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">New Password</h2>
            <p className="text-slate-400 text-sm">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-nok-blue/60 focus:border-transparent"
                placeholder="Enter new password"
                required
                minLength={6}
              />
            </div>

            <div className="text-left">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-900/60 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-nok-blue/60 focus:border-transparent"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={success}
              className="w-full bg-nok-blue text-white font-semibold py-3 px-4 rounded-lg btn-glow disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {success ? 'Redirecting…' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
