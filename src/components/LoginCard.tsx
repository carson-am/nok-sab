'use client';

import { SignInButton } from '@clerk/nextjs';
import Logo from './Logo';

export default function LoginCard() {
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
              Sign in to access the portal.
            </p>
          </div>

          <div className="space-y-6">
            <SignInButton mode="redirect">
              <button
                type="button"
                className="w-full bg-nok-blue text-white font-semibold py-3 px-4 rounded-lg btn-glow"
              >
                Sign In
              </button>
            </SignInButton>
            <p className="text-slate-400 text-xs text-center">
              You&apos;ll be redirected to the Nok Referral Portal to sign in securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
