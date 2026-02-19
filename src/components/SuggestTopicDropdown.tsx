'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquarePlus, ChevronDown, Check, X } from 'lucide-react';
import { suggestTopicOptions } from '../data/sab-content';
import { useAuth } from '../context/AuthContext';
import { sendTopicSuggestion } from '../app/actions/sendTopicSuggestion';

export default function SuggestTopicDropdown() {
  const { userEmail } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [otherText, setOtherText] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 10000);
    return () => clearTimeout(timer);
  }, [showToast]);

  useEffect(() => {
    if (!showErrorToast) return;
    const timer = setTimeout(() => setShowErrorToast(false), 10000);
    return () => clearTimeout(timer);
  }, [showErrorToast]);

  const toggleOption = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await sendTopicSuggestion({
      selectedTopics: selectedOptions,
      otherText,
      submittedByEmail: userEmail ?? null,
    });
    setIsSubmitting(false);
    if (result.success) {
      setIsOpen(false);
      setSelectedOptions([]);
      setOtherText('');
      setShowToast(true);
    } else {
      setShowErrorToast(true);
    }
  };

  const showOtherInput = selectedOptions.includes('Other');

  return (
    <>
      <div ref={dropdownRef} className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2.5 px-5 rounded-lg btn-glow transition-all duration-200"
          aria-label="Suggest a topic"
          aria-expanded={isOpen}
        >
          <MessageSquarePlus size={18} />
          Suggest a Topic
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 w-72 origin-top-left rounded-xl glass-card border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden z-50"
            >
              <div className="py-2">
                {suggestTopicOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleOption(option)}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-nok-blue/20 hover:text-white transition-all duration-200 flex items-center gap-3"
                    role="checkbox"
                    aria-checked={selectedOptions.includes(option)}
                  >
                    <span
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedOptions.includes(option)
                          ? 'border-nok-blue bg-nok-blue'
                          : 'border-slate-500'
                      }`}
                    >
                      {selectedOptions.includes(option) && (
                        <Check size={12} className="text-white" strokeWidth={3} />
                      )}
                    </span>
                    {option}
                  </button>
                ))}

                <AnimatePresence>
                  {showOtherInput && (
                    <motion.div
                      key="other-input"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 border-t border-white/10">
                        <label htmlFor="suggest-other" className="sr-only">
                          Describe your topic
                        </label>
                        <input
                          id="suggest-other"
                          type="text"
                          value={otherText}
                          onChange={(e) => setOtherText(e.target.value)}
                          placeholder="Describe your topic..."
                          className="w-full px-4 py-2 text-sm bg-black/20 border border-white/10 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-nok-blue focus:ring-1 focus:ring-nok-blue transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="px-4 py-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2.5 px-4 rounded-lg btn-glow transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4"
          >
            <div className="backdrop-blur-xl bg-slate-900/90 border border-nok-blue/50 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.2)] p-4 pr-10 relative">
              <p className="text-slate-100 text-sm font-medium">
                Thank you, your response has been recorded!
              </p>
              <button
                type="button"
                onClick={() => setShowToast(false)}
                className="absolute top-3 right-3 p-1 rounded text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
        {showErrorToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4"
          >
            <div className="backdrop-blur-xl bg-slate-900/90 border border-red-500/50 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] p-4 pr-10 relative">
              <p className="text-slate-100 text-sm font-medium">
                Something went wrong. Please try again.
              </p>
              <button
                type="button"
                onClick={() => setShowErrorToast(false)}
                className="absolute top-3 right-3 p-1 rounded text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
