import { User } from 'lucide-react';

interface RosterCardProps {
  name: string;
  title: string;
  company: string;
  buttonLabel: string;
  onContact: () => void;
}

export default function RosterCard({ name, title, company, buttonLabel, onContact }: RosterCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onContact}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onContact();
        }
      }}
      className="glass-card p-6 rounded-xl card-glow text-center cursor-pointer transition-all duration-200"
    >
      {/* Circular headshot placeholder */}
      <div className="mb-4 flex justify-center">
        <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
          <User className="text-slate-400" size={40} />
        </div>
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>

      {/* Title */}
      <p className="text-slate-400 mb-1">{title}</p>

      {/* Company */}
      <p className="text-slate-400 mb-4">{company}</p>

      {/* Details (presentational; whole card is clickable) */}
      <span className="inline-block w-full bg-nok-blue text-white font-semibold py-2 px-4 rounded-lg btn-glow text-center">
        {buttonLabel}
      </span>
    </div>
  );
}
