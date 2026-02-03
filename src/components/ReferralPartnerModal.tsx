'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Logo from './Logo';

const REFERRAL_DASHBOARD_URL = 'https://nok-referral-program.vercel.app/dashboard/current-partners';

interface ReferralPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferralPartnerModal({ isOpen, onClose }: ReferralPartnerModalProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl rounded-xl p-6 lg:p-8 backdrop-blur-xl bg-slate-900/80 border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex justify-end items-start -mt-1 -mr-1 mb-6">
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg text-slate-400 hover:text-white transition-all duration-200 hover:ring-2 hover:ring-nok-blue/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                      aria-label="Close"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <Dialog.Title className="sr-only">
                    Referral Partner Program
                  </Dialog.Title>

                  <div className="text-center mb-0">
                    <div className="flex items-center justify-center mb-10 mt-4">
                      <Logo size="large-modal" />
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                      Grow together. Shape the future of recommerce.
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
                      Join the leader in reverse supply chain solutions. Refer brands, track your progress, and unlock mutual growth.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <a
                      href={REFERRAL_DASHBOARD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg btn-glow transition-all duration-200 text-base"
                    >
                      Access the Referral Partner Dashboard
                    </a>
                  </div>
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
