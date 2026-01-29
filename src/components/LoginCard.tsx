'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (login(email, password)) {
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const handlePasswordRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy flow - just show success message or reset view
    setShowPasswordRecovery(false);
    setRecoveryEmail('');
    // Could add a toast notification here
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Column - Branding */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="max-w-xl text-center">
          <div className="mb-8" style={{ background: 'transparent' }}>
            <Image
              src="/logo.png"
              alt="Nok Logo"
              width={300}
              height={120}
              className="mx-auto"
              style={{ 
                background: 'transparent',
                mixBlendMode: 'plus-lighter'
              }}
              priority
            />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            The Strategic Advisory Board.
          </h1>
          <p className="text-base lg:text-lg text-slate-400 leading-relaxed">
            Architecting the future of recommerce. An exclusive forum for industry leaders to redefine the circular economy.
          </p>
        </div>
      </div>

      {/* Right Column - Login Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-8">
        <div className="glass-card p-8 w-full max-w-md rounded-xl">
          {!showPasswordRecovery ? (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
                <p className="text-slate-400 text-sm">
                  Provide your credentials to access the Strategic Advisory Board portal.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-nok-blue focus:ring-1 focus:ring-nok-blue"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-nok-blue focus:ring-1 focus:ring-nok-blue"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-400 text-sm">{error}</div>
                )}

                <button
                  type="submit"
                  className="w-full bg-nok-blue text-white font-semibold py-3 px-4 rounded-lg btn-glow"
                >
                  Sign In
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowPasswordRecovery(true)}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                <p className="text-slate-400 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handlePasswordRecovery} className="space-y-6">
                <div>
                  <label htmlFor="recovery-email" className="block text-sm font-medium text-white mb-2">
                    Email
                  </label>
                  <input
                    id="recovery-email"
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-nok-blue focus:ring-1 focus:ring-nok-blue"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-nok-blue text-white font-semibold py-3 px-4 rounded-lg btn-glow"
                >
                  Send Reset Link
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordRecovery(false);
                      setRecoveryEmail('');
                    }}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
