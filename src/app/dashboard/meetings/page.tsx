'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Video, Play, FileText, Search } from 'lucide-react';
import { meetings } from '../../../data/sab-content';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type Meeting = (typeof meetings)[number];

function filterMeetings(meetingsList: Meeting[], query: string): Meeting[] {
  if (!query.trim()) return meetingsList;
  const q = query.trim().toLowerCase();
  return meetingsList.filter((m) => {
    if (m.title.toLowerCase().includes(q)) return true;
    if (m.summary.toLowerCase().includes(q)) return true;
    const takeaways = (m as Meeting & { takeaways?: string[] }).takeaways;
    if (Array.isArray(takeaways) && takeaways.some((t) => t.toLowerCase().includes(q)))
      return true;
    return false;
  });
}

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMeetings = useMemo(
    () => filterMeetings(meetings, searchQuery),
    [searchQuery]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Meetings</h1>
        <p className="text-slate-400 text-lg">
          Archive of past meetings, discussions, and reference materials.
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="meetings-search" className="sr-only">
          Search archive
        </label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            id="meetings-search"
            type="text"
            placeholder="Search archive..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-card rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-slate-400 border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-nok-blue/50 focus:border-nok-blue/50 transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredMeetings.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No meetings found matching your search.
          </p>
        ) : (
          filteredMeetings.map((meeting) => {
            const m = meeting as Meeting & {
              takeaways?: string[];
              recordingLink?: string | null;
              deckLink?: string | null;
            };
            return (
              <div
                key={meeting.id}
                className="glass-card p-6 rounded-xl card-glow transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <Video className="text-nok-blue" size={26} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white mb-1">
                      {meeting.title}
                    </h2>
                    <p className="text-nok-blue font-semibold mb-3">
                      {formatDate(meeting.date)}
                    </p>
                    <p className="text-slate-100 leading-relaxed mb-4">
                      {meeting.summary}
                    </p>

                    {Array.isArray(m.takeaways) && m.takeaways.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-slate-400 text-sm uppercase tracking-wide mb-2">
                          Key Takeaways
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-slate-200 leading-relaxed">
                          {m.takeaways.map((takeaway, i) => (
                            <li key={i}>{takeaway}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                      {m.recordingLink && (
                        <a
                          href={m.recordingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2 px-4 rounded-lg btn-glow transition-all duration-200"
                        >
                          <Play size={18} />
                          Watch Recording
                        </a>
                      )}
                      {m.deckLink && (
                        <a
                          href={m.deckLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold py-2 px-4 rounded-lg btn-glow transition-all duration-200"
                        >
                          <FileText size={18} />
                          View Deck
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
