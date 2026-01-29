'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Video, FileText, Users, Menu, X, MessageSquare } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Meetings', href: '/dashboard/meetings', icon: Video },
  { name: 'Presentations', href: '/dashboard/presentations', icon: FileText },
  { name: 'Roster', href: '/dashboard/roster', icon: Users },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
          <div className="p-6 border-b border-white/10" style={{ background: 'transparent' }}>
            <Image
              src="/logo.png"
              alt="Nok Logo"
              width={180}
              height={72}
              className="w-full"
              style={{
                background: 'transparent',
                mixBlendMode: 'screen',
                filter: 'brightness(1.2)',
                objectFit: 'contain'
              }}
              priority
            />
          </div>

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
    </>
  );
}
