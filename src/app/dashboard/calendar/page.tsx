import { calendarEvents } from '../../../data/sab-content';
import { Calendar as CalendarIcon } from 'lucide-react';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function CalendarPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Calendar</h1>
        <p className="text-slate-400 text-lg">
          Upcoming events and meetings for the Strategic Advisory Board.
        </p>
      </div>

      <div className="space-y-4">
        {calendarEvents.map((event, index) => (
          <div key={event.id} className="glass-card p-6 rounded-xl card-glow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <CalendarIcon className="text-nok-blue" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">{event.title}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <span className="text-nok-blue font-medium">
                    {formatDate(event.date)}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400">{event.time}</span>
                </div>
                <p className="text-slate-400 leading-relaxed">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
