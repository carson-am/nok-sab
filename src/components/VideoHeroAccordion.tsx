'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play } from 'lucide-react';

export default function VideoHeroAccordion() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8">
      <motion.div
        className="glass-card rounded-xl border border-nok-blue/50 card-glow overflow-hidden cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ borderColor: 'rgba(59, 130, 246, 0.7)' }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Play className="text-nok-blue" size={24} />
            <h2 className="text-xl font-bold text-white">Welcome from Maddy</h2>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="text-slate-400" size={24} />
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-0">
                <div className="flex justify-center">
                  <video
                    className="w-full max-w-4xl rounded-lg"
                    controls
                    poster="/api/placeholder/800/450"
                  >
                    <source src="" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
