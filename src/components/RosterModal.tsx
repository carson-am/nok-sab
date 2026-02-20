'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Linkedin, User } from 'lucide-react';
import Image from 'next/image';

interface RosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    name: string;
    title: string;
    company: string;
    bio: string;
    linkedin?: string;
    location?: string;
    imagePath?: string | null;
    tags?: string[];
  } | null;
}

export default function RosterModal({ isOpen, onClose, member }: RosterModalProps) {
  if (!member) return null;

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
              <Dialog.Panel className="glass-card w-full max-w-2xl rounded-xl p-6 lg:p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <Dialog.Title className="text-2xl font-bold text-white">
                      {member.name}
                    </Dialog.Title>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-lg text-slate-400 hover:text-white transition-all duration-200 hover:ring-2 hover:ring-nok-blue/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                      aria-label="Close"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-shrink-0 flex justify-center md:justify-start">
                      {member.imagePath ? (
                        <Image
                          src={member.imagePath}
                          alt={member.name}
                          width={180}
                          height={180}
                          className="rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-[180px] h-[180px] rounded-xl bg-slate-700 flex items-center justify-center">
                          <User className="text-slate-400" size={72} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg text-nok-blue font-semibold mb-1">{member.title}</p>
                      <p className="text-lg font-bold text-white mb-4">{member.company}</p>
                      <p className="text-slate-100 leading-relaxed">{member.bio}</p>
                    </div>
                  </div>

                  <div
                    className="h-px w-full mb-6"
                    style={{
                      background: 'linear-gradient(to right, transparent, rgba(59, 130, 246, 0.6), transparent)',
                    }}
                  />

                  {member.linkedin && member.linkedin !== '#' && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-nok-blue text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    >
                      <Linkedin size={20} />
                      LinkedIn Profile
                    </a>
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
