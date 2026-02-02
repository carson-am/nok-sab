'use client';

import { calendarEvents } from '../data/sab-content';
import { format } from 'date-fns';
import { Calendar, Video } from 'lucide-react';

export default function OverviewHero() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextEvent = calendarEvents
    .map((event) => ({
      ...event,
      dateObj: new Date(event.date + 'T00:00:00'),
    }))
    .filter((event) => {
      event.dateObj.setHours(0, 0, 0, 0);
      return event.dateObj >= today;
    })
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())[0];

  if (!nextEvent) return null;

  const formattedDate = format(nextEvent.dateObj, 'EEEE, MMMM d, yyyy');

  return (
    <div className="mb-8">
      <div className="glass-card card-glow border-l-4 border-nok-blue rounded-xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs text-slate-400 uppercase tracking-wide">
              NEXT UP
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 mb-2">
              {nextEvent.title}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formattedDate}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1">
                <Video size={14} />
                {nextEvent.time}
              </span>
              {nextEvent.location && (
                <>
                  <span className="hidden sm:inline">·</span>
                  <span>{nextEvent.location}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex-shrink-0">
            {nextEvent.meetingLink ? (
              <a
                href={nextEvent.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg btn-glow transition-all duration-200"
              >
                <Video size={18} />
                Join Meeting
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 bg-slate-600 text-slate-300 font-semibold py-3 px-6 rounded-lg">
                View details
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
