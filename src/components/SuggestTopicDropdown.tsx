'use client';

import { useState } from 'react';
import { Menu } from '@headlessui/react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, ChevronDown } from 'lucide-react';
import { suggestTopicOptions } from '../data/sab-content';

export default function SuggestTopicDropdown() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [otherText, setOtherText] = useState('');

  const handleSelect = (option: string) => {
    if (option === 'Other') {
      setSelectedOption('Other');
    } else {
      setSelectedOption(option);
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button
            className="inline-flex items-center gap-2 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2.5 px-5 rounded-lg btn-glow transition-all duration-200"
            aria-label="Suggest a topic"
          >
            <MessageSquarePlus size={18} />
            Suggest a Topic
            <ChevronDown
              size={18}
              className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </Menu.Button>

          <Menu.Items
            className="absolute left-0 mt-2 w-72 origin-top-left rounded-xl glass-card border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-hidden z-50 focus:outline-none"
          >
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="py-2"
            >
            {suggestTopicOptions.map((option) => (
              <Menu.Item key={option}>
                {({ active }) => (
                  <button
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 ${
                      active
                        ? 'bg-nok-blue/20 text-white'
                        : 'text-slate-200'
                    } hover:bg-nok-blue/20 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]`}
                  >
                    {option}
                  </button>
                )}
              </Menu.Item>
            ))}
            {selectedOption === 'Other' && (
              <div className="px-4 py-3 border-t border-white/10 mt-2">
                <label htmlFor="suggest-other" className="sr-only">
                  Describe your topic
                </label>
                <textarea
                  id="suggest-other"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Describe your topic..."
                  rows={3}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-nok-blue/50 focus:border-nok-blue/50 transition-all"
                />
              </div>
            )}
            </motion.div>
          </Menu.Items>
        </>
      )}
    </Menu>
  );
}
