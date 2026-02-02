'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Mail, Phone, Linkedin, Copy } from 'lucide-react';
import Image from 'next/image';

export interface TeamMemberModalMember {
  id: number;
  name: string;
  title: string;
  imagePath: string;
  bio: string;
  email: string;
  phone: string;
  linkedin?: string;
}

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMemberModalMember | null;
}

export default function TeamMemberModal({ isOpen, onClose, member }: TeamMemberModalProps) {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null);

  const handleCopy = async (field: 'email' | 'phone', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // fallback ignored
    }
  };

  if (!member) return null;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[110]" onClose={onClose}>
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
              <Dialog.Panel className="glass-card w-full max-w-xl rounded-xl p-6 lg:p-8 border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="text-center"
                >
                  <div className="flex justify-end items-start -mt-1 -mr-1 mb-4">
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg text-slate-400 hover:text-white transition-all duration-200 hover:ring-2 hover:ring-nok-blue/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                      aria-label="Close"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <Dialog.Title className="sr-only">{member.name}</Dialog.Title>

                  <div className="w-40 h-40 rounded-2xl overflow-hidden flex-shrink-0 mx-auto mb-4">
                    <Image
                      src={member.imagePath}
                      alt={member.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-1">{member.name}</h2>
                  <p className="text-nok-blue font-semibold mb-4">{member.title}</p>

                  <p className="text-slate-100 leading-relaxed text-center mb-6 max-w-lg mx-auto">
                    {member.bio}
                  </p>

                  <div
                    className="h-px w-full mb-6"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(59, 130, 246, 0.6), transparent)',
                    }}
                  />

                  <div className="space-y-2 text-left max-w-sm mx-auto">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                    >
                      <Mail className="text-nok-blue flex-shrink-0 transition-all duration-200 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={20} />
                      <span className="flex-1 text-white group-hover:text-nok-blue transition-colors duration-200 truncate">
                        {member.email}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopy('email', member.email);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-slate-400 hover:text-white transition-all duration-200 flex-shrink-0"
                        aria-label="Copy email"
                      >
                        <Copy size={16} />
                      </button>
                    </a>
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                    >
                      <Phone className="text-nok-blue flex-shrink-0 transition-all duration-200 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={20} />
                      <span className="flex-1 text-white group-hover:text-nok-blue transition-colors duration-200">
                        {member.phone}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCopy('phone', member.phone);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded text-slate-400 hover:text-white transition-all duration-200 flex-shrink-0"
                        aria-label="Copy phone"
                      >
                        <Copy size={16} />
                      </button>
                    </a>
                    {member.linkedin && member.linkedin !== '#' && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                      >
                        <Linkedin className="text-nok-blue flex-shrink-0 transition-all duration-200 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" size={20} />
                        <span className="flex-1 text-white group-hover:text-nok-blue transition-colors duration-200">
                          LinkedIn Profile
                        </span>
                      </a>
                    )}
                  </div>

                  {copiedField && (
                    <p className="mt-3 text-xs text-nok-blue text-center">
                      {copiedField === 'email' ? 'Email copied' : 'Phone copied'}
                    </p>
                  )}
                </motion.div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
