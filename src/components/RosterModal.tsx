'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Mail, Phone, Linkedin } from 'lucide-react';
import Image from 'next/image';

interface RosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    name: string;
    title: string;
    company: string;
    bio: string;
    email: string;
    phone: string;
    linkedin?: string;
  } | null;
}

const DEFAULT_HEADSHOT = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop';

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
                <div className="flex justify-between items-start mb-6">
                  <Dialog.Title className="text-2xl font-bold text-white">
                    {member.name}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <Image
                      src={DEFAULT_HEADSHOT}
                      alt={member.name}
                      width={120}
                      height={120}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-white font-semibold mb-1">{member.title}</p>
                    <p className="text-slate-400 mb-4">{member.company}</p>
                    <p className="text-slate-400 leading-relaxed">{member.bio}</p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="text-nok-blue" size={20} />
                    <a
                      href={`mailto:${member.email}`}
                      className="text-white hover:text-nok-blue transition-colors duration-200"
                    >
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="text-nok-blue" size={20} />
                    <a
                      href={`tel:${member.phone}`}
                      className="text-white hover:text-nok-blue transition-colors duration-200"
                    >
                      {member.phone}
                    </a>
                  </div>
                  {member.linkedin && member.linkedin !== '#' && (
                    <div className="flex items-center gap-3">
                      <Linkedin className="text-nok-blue" size={20} />
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-nok-blue transition-colors duration-200"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
