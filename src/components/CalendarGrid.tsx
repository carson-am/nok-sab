'use client';

import { calendarEvents } from '../data/sab-content';
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  isSameMonth
} from 'date-fns';

interface CalendarGridProps {
  month: Date;
  onDayClick: (date: Date, events: typeof calendarEvents) => void;
}

export default function CalendarGrid({ month, onDayClick }: CalendarGridProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 }); // Sunday
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const today = new Date();
  
  // Group events by date
  const eventsByDate = calendarEvents.reduce((acc, event) => {
    const eventDate = new Date(event.date + 'T00:00:00');
    const dateKey = format(eventDate, 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, typeof calendarEvents>);

  const getEventsForDay = (day: Date): typeof calendarEvents => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return eventsByDate[dateKey] || [];
  };

  return (
    <div className="w-full">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-slate-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, month);
          const isTodayDate = isToday(day);
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={day.toISOString()}
              onClick={hasEvents ? () => onDayClick(day, dayEvents) : undefined}
              className={`
                glass-card p-2 rounded-lg min-h-[100px] transition-all duration-200
                ${isCurrentMonth ? 'opacity-100' : 'opacity-40'}
                ${isTodayDate ? 'border-2 border-nok-blue bg-nok-blue/10' : 'border border-white/5'}
                ${hasEvents ? 'cursor-pointer card-glow' : ''}
                ${hasEvents && !isTodayDate ? 'hover:border-nok-blue/50' : ''}
              `}
            >
              <div className={`
                text-sm font-medium mb-1
                ${isCurrentMonth ? 'text-white' : 'text-slate-500'}
                ${isTodayDate ? 'text-nok-blue font-bold' : ''}
              `}>
                {format(day, 'd')}
              </div>
              
              {/* Event Indicators */}
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="bg-nok-blue/20 text-nok-blue text-xs px-2 py-1 rounded truncate font-medium"
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-slate-400 px-2">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
