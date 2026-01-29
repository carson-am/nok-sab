'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Video, Calendar, MapPin, Download } from 'lucide-react';
import { format } from 'date-fns';

interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  location?: string;
  meetingLink?: string | null;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
}

export default function EventModal({ isOpen, onClose, event }: EventModalProps) {
  if (!event) return null;

  const eventDate = new Date(event.date + 'T00:00:00');
  const formattedDate = format(eventDate, 'EEEE, MMMM d, yyyy');

  const handleAddToCalendar = () => {
    // Parse time (e.g., "2:00 PM EST" or "10:00 AM EST")
    const timeMatch = event.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    
    let startDate: Date;
    let endDate: Date;
    
    if (timeMatch) {
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();
      let hour24 = hours;
      if (ampm === 'PM' && hours !== 12) hour24 += 12;
      if (ampm === 'AM' && hours === 12) hour24 = 0;

      startDate = new Date(eventDate);
      startDate.setHours(hour24, minutes, 0, 0);
    } else {
      // Fallback: default to noon if time parsing fails
      startDate = new Date(eventDate);
      startDate.setHours(12, 0, 0, 0);
    }
    
    endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1); // Default 1 hour duration

    // Generate .ics file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Nok Strategic Advisory Board//Calendar Event//EN
BEGIN:VEVENT
DTSTART:${format(startDate, "yyyyMMdd'T'HHmmss")}
DTEND:${format(endDate, "yyyyMMdd'T'HHmmss")}
SUMMARY:${event.title.replace(/,/g, '\\,')}
DESCRIPTION:${event.description.replace(/,/g, '\\,')}
LOCATION:${event.location ? event.location.replace(/,/g, '\\,') : ''}
${event.meetingLink ? `URL:${event.meetingLink}` : ''}
END:VEVENT
END:VCALENDAR`;

    // Download file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
                    {event.title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-slate-400">
                    <Calendar className="text-nok-blue" size={20} />
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span>{event.time}</span>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-3 text-slate-400">
                      <MapPin className="text-nok-blue" size={20} />
                      <span>{event.location}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-slate-400 leading-relaxed">{event.description}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/10">
                  {event.meetingLink && (
                    <a
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg btn-glow transition-colors duration-200"
                    >
                      <Video size={18} />
                      Join Meeting
                    </a>
                  )}
                  <button
                    onClick={handleAddToCalendar}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg btn-glow transition-colors duration-200"
                  >
                    <Download size={18} />
                    Add to Calendar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
