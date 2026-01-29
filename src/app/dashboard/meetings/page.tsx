import { meetings } from '../../../data/sab-content';
import { Video } from 'lucide-react';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function MeetingsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Meetings</h1>
        <p className="text-slate-400 text-lg">
          Archive of past Strategic Advisory Board meetings and discussions.
        </p>
      </div>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="glass-card p-6 rounded-xl card-glow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Video className="text-nok-blue" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2">{meeting.title}</h2>
                <p className="text-nok-blue font-medium mb-3">{formatDate(meeting.date)}</p>
                <p className="text-slate-400 leading-relaxed">{meeting.summary}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
