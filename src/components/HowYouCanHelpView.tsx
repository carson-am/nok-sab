'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import {
  howYouCanHelpIntroTitle,
  howYouCanHelpIntroBody,
  gettingStarted,
  strategicRocks,
  teamMembers,
} from '../data/sab-content';
import TeamMemberModal, { type TeamMemberModalMember } from './TeamMemberModal';

function IntroWithRocksHighlight({ text }: { text: string }) {
  const parts = text.split(/(Rocks)/i);
  return (
    <p className="text-lg text-slate-100 leading-relaxed">
      {parts.map((part, i) =>
        part.toLowerCase() === 'rocks' ? (
          <span key={i} className="text-nok-blue font-semibold">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

interface QuarterlyNeedsCategory {
  category: string;
  items: string[];
}

function QuarterlyNeedsList({ needs }: { needs: QuarterlyNeedsCategory[] }) {
  const renderItemWithICPLink = (item: string) => {
    if (item.includes('ICP')) {
      const parts = item.split('ICP');
      return (
        <>
          {parts[0]}
          <a
            href="/nok-icp.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-nok-blue underline hover:text-[#2563eb] transition-colors duration-200"
          >
            ICP
          </a>
          {parts[1]}
        </>
      );
    }
    return item;
  };

  return (
    <div className="space-y-4 mt-6 text-left">
      {needs.map((category, catIndex) => (
        <div key={catIndex} className="space-y-2">
          <h5 className="text-nok-blue font-semibold text-base text-center">
            {category.category}
          </h5>
          <ul className="space-y-2">
            {category.items.map((item, itemIndex) => (
              <li
                key={itemIndex}
                className="flex items-start gap-2 text-slate-200 text-sm leading-relaxed"
              >
                <span
                  className="w-2 h-2 rounded-full bg-nok-blue flex-shrink-0 mt-1.5"
                  aria-hidden
                />
                <span className="text-left">{renderItemWithICPLink(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function HowYouCanHelpView() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMemberModalMember | null>(null);

  return (
    <>
      <TeamMemberModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />

      <div className="relative min-h-full overflow-hidden">
        {/* Background: unified radial gradient (center deep navy, edges black) + subtle orb */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at center, var(--nok-navy-center) 0%, var(--nok-navy-edge) 100%)',
            }}
          />
          <div
            className="absolute w-[600px] h-[600px] rounded-full -top-1/4 -right-1/4 bg-nok-blue pointer-events-none orb-glow"
            style={{ filter: 'blur(80px)' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col min-h-full">
          <div className="space-y-8">
            {/* Intro */}
            <div className="bg-transparent rounded-xl p-6 lg:p-8 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {howYouCanHelpIntroTitle}
              </h3>
              <div className="text-slate-100 leading-relaxed space-y-4">
                {howYouCanHelpIntroBody.split('\n\n').map((paragraph, i) => (
                  <IntroWithRocksHighlight key={i} text={paragraph} />
                ))}
              </div>
            </div>

            {/* Strategic Rocks Accordions */}
            <div className="space-y-4">
            {strategicRocks.map((section, index) => {
              const leader = teamMembers.find((m) => m.id === section.leaderId);
              const isExpanded = expandedIndex === index;

              return (
                <motion.div
                  key={section.departmentName}
                  className="bg-transparent rounded-xl border border-white/10 overflow-hidden card-glow"
                  whileHover={{ boxShadow: '0 0 20px rgba(59, 130, 246, 0.25)' }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {leader && (
                        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-nok-blue/50">
                          <Image
                            src={leader.imagePath}
                            alt={leader.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white">
                        {section.departmentName} {leader && `(${leader.name.split(' ')[0]})`}
                      </h3>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="text-slate-400" size={24} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0 border-t border-white/10">
                          {/* How You Can Help - single unified card with contact at bottom */}
                          <div className="pt-6 p-5 lg:p-6 rounded-xl bg-white/5 backdrop-blur-md border border-blue-500/30 text-center space-y-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                            <h4 className="text-lg font-bold text-white">How You Can Help</h4>
                            {section.quarterlyNeeds && (
                              <QuarterlyNeedsList needs={section.quarterlyNeeds} />
                            )}
                            {section.leaderId === 1 && leader ? (
                              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-3">
                                <a
                                  href="/nok-icp.pdf"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2.5 px-5 rounded-lg btn-glow transition-all duration-200 hover:brightness-110"
                                >
                                  View Our ICP
                                </a>
                                <a
                                  href="https://nok-referral-program.vercel.app/dashboard/current-partners"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2.5 px-5 rounded-lg btn-glow transition-all duration-200 hover:brightness-110"
                                >
                                  Referral Dashboard
                                </a>
                                <button
                                  type="button"
                                  onClick={() => setSelectedMember(leader)}
                                  className="bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2.5 px-5 rounded-lg btn-glow transition-all duration-200"
                                >
                                  Contact {leader.name.split(' ')[0]}
                                </button>
                              </div>
                            ) : leader ? (
                              <div className="flex flex-col items-center text-center pt-3">
                                <button
                                  type="button"
                                  onClick={() => setSelectedMember(leader)}
                                  className="bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2.5 px-5 rounded-lg btn-glow transition-all duration-200"
                                >
                                  Contact {leader.name.split(' ')[0]}
                                </button>
                              </div>
                            ) : null}
                          </div>

                          {/* Q1 2026 Priorities and Key Scorecard Metrics (below How You Can Help) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            {/* Left: Q1 2026 Priorities (Rocks) */}
                            <div>
                              <h4 className="text-nok-blue font-semibold mb-4">
                                Q1 2026 Priorities (Rocks)
                              </h4>
                              <ul className="space-y-3">
                                {section.rocks.map((rock, i) => {
                                  const isTaskWhy = typeof rock === 'object' && rock !== null && 'task' in rock && 'why' in rock;
                                  if (isTaskWhy) {
                                    return (
                                      <li key={i} className="space-y-1">
                                        <div className="font-bold text-white">{rock.task}</div>
                                        <div className="text-nok-blue/80 text-sm italic leading-relaxed">{rock.why}</div>
                                      </li>
                                    );
                                  }
                                  return (
                                    <li
                                      key={i}
                                      className="flex items-start gap-3 text-slate-200 text-sm leading-relaxed"
                                    >
                                      <span
                                        className="flex-shrink-0 w-5 h-5 rounded border-2 border-nok-blue mt-0.5"
                                        aria-hidden
                                      />
                                      <span>{rock}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>

                            {/* Right: Key Scorecard Metrics */}
                            <div>
                              <h4 className="text-nok-blue font-semibold mb-4">
                                Key Scorecard Metrics
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {section.scorecardMetrics.map((metric, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center px-3 py-2 rounded-lg bg-transparent border border-white/10 text-slate-200 text-sm"
                                  >
                                    {metric}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
            </div>
          </div>

          {/* Footer: Getting Started */}
          <div className="flex-1 flex flex-col justify-center text-center pt-12 pb-4">
            <h3 className="text-xl font-bold text-white mb-3">
              {gettingStarted.title}
            </h3>
            <div className="max-w-2xl mx-auto space-y-4">
              {gettingStarted.body.split('\n\n').map((paragraph, i) => (
                <p
                  key={i}
                  className="text-slate-200 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
