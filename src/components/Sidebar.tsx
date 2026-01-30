'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Video, FileText, Users, Menu, X, MessageSquare, LogOut, Handshake } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import ReferralPartnerModal from './ReferralPartnerModal';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Meetings', href: '/dashboard/meetings', icon: Video },
  { name: 'Strategic Resources', href: '/dashboard/presentations', icon: FileText },
  { name: 'Roster', href: '/dashboard/roster', icon: Users },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass-card rounded-lg text-white"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 glass-card border-r border-white/10 z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link
            href="/dashboard"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block cursor-pointer hover:brightness-105 transition-all duration-200"
          >
            <div className="p-6 border-b border-white/10" style={{ background: 'transparent' }}>
              <Logo size="medium" />
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-nok-blue/20 text-white border border-nok-blue'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Gradient separator */}
          <div className="px-4">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* Referral Partner Program */}
          <div className="p-4">
            <button
              type="button"
              onClick={() => {
                setIsReferralModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <Handshake size={20} />
              <span className="font-medium">Referral Partner Program</span>
            </button>
          </div>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
            >
              <LogOut size={18} />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>

          {/* Slack Button */}
          <div className="p-4 border-t border-white/10">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-3 glass-card border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors duration-200"
              onClick={() => {
                // Placeholder - does nothing for now
                console.log('Join Slack Discussion clicked');
              }}
            >
              <MessageSquare size={18} />
              <span className="font-medium">Join the Slack Discussion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <ReferralPartnerModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </>
  );
}
