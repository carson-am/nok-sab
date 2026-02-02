'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface ImmersiveViewProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  centerTitle?: boolean;
}

export default function ImmersiveView({
  isOpen,
  onClose,
  title,
  children,
  centerTitle = false,
}: ImmersiveViewProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 lg:px-8 py-4 border-b border-white/10">
              {/* Logo */}
              <div className="flex flex-col">
                <h1
                  className="font-extrabold text-white"
                  style={{
                    color: '#FFFFFF',
                    letterSpacing: '-0.02em',
                    fontSize: '2rem',
                    lineHeight: '1',
                  }}
                >
                  nok
                </h1>
                <p
                  className="font-bold uppercase"
                  style={{
                    color: '#ff5a1f',
                    fontSize: '0.7rem',
                    lineHeight: '1',
                    marginTop: '0.25rem',
                  }}
                >
                  RECOMMERCE
                </p>
              </div>

              {/* Back Button */}
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2.5 px-5 rounded-lg btn-glow transition-all duration-200"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
                <h2 className={`text-3xl font-bold text-white ${centerTitle ? 'text-center mb-4' : 'mb-6'}`}>{title}</h2>
                <div className="text-slate-100">{children}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
