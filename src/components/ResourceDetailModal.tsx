'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';

export interface ResourceDetailModalResource {
  id: number;
  title: string;
  filename?: string;
  description?: string;
  category?: string;
  fileType?: string;
  fileSize?: string;
  downloadLink?: string;
}

interface ResourceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: ResourceDetailModalResource | null;
}

export default function ResourceDetailModal({
  isOpen,
  onClose,
  resource,
}: ResourceDetailModalProps) {
  if (!resource) return null;

  const canDownload = resource.downloadLink || resource.filename;

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
              <Dialog.Panel className="w-full max-w-lg rounded-xl p-5 lg:p-6 backdrop-blur-xl bg-slate-900/80 border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
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

                  <Dialog.Title className="sr-only">
                    {resource.title}
                  </Dialog.Title>

                  <div>
                    {resource.category && (
                      <p className="text-slate-400 text-sm font-medium mb-1">
                        {resource.category}
                      </p>
                    )}
                    <h2 className="text-2xl font-bold text-white mb-3">
                      {resource.title}
                    </h2>
                    {resource.description && (
                      <p className="text-slate-100 leading-relaxed text-base mb-4">
                        {resource.description}
                      </p>
                    )}
                    {canDownload && (
                      <a
                        href={
                          resource.downloadLink ||
                          (resource.filename
                            ? `/downloads/${resource.filename}`
                            : '#')
                        }
                        download={resource.filename || undefined}
                        className="inline-flex items-center justify-center gap-2 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg btn-glow transition-all duration-200 text-base w-full sm:w-auto"
                      >
                        <Download size={20} />
                        Download
                      </a>
                    )}
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
