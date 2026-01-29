'use client';

import { useState } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import NextMeetingWidget from '../../../components/NextMeetingWidget';
import CalendarGrid from '../../../components/CalendarGrid';
import EventModal from '../../../components/EventModal';
import { calendarEvents } from '../../../data/sab-content';

type CalendarEvent = typeof calendarEvents[0];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [direction, setDirection] = useState(0);

  const goToPreviousMonth = () => {
    setDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDayClick = (date: Date, events: typeof calendarEvents) => {
    if (events.length > 0) {
      // If multiple events, show the first one (could be enhanced to show list)
      setSelectedEvent(events[0]);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const monthYear = format(currentMonth, 'MMMM yyyy');

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Calendar</h1>
        <p className="text-slate-400 text-lg">
          Upcoming events and meetings for the Strategic Advisory Board.
        </p>
      </div>

      {/* Next Meeting Widget */}
      <NextMeetingWidget />

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 glass-card rounded-lg text-white hover:bg-white/5 transition-colors duration-200"
          aria-label="Previous month"
        >
          <ChevronLeft size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-white">{monthYear}</h2>
        
        <button
          onClick={goToNextMonth}
          className="p-2 glass-card rounded-lg text-white hover:bg-white/5 transition-colors duration-200"
          aria-label="Next month"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Calendar Grid with Swipe Animation */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentMonth.getTime()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <CalendarGrid month={currentMonth} onDayClick={handleDayClick} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </div>
  );
}
