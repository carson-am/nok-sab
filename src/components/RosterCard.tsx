import { User } from 'lucide-react';

interface RosterCardProps {
  name: string;
  title: string;
  company: string;
  buttonLabel: string;
  onContact: () => void;
  expertise?: string[];
  location?: string;
}

export default function RosterCard({ name, title, company, buttonLabel, onContact, expertise, location }: RosterCardProps) {
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

      {/* Location */}
      {location && (
        <p className="text-slate-500 text-sm mb-2">{location}</p>
      )}

      {/* Company */}
      <p className="text-slate-400 mb-3">{company}</p>

      {/* Expertise pills */}
      {expertise && expertise.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {expertise.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2.5 py-1 rounded-full bg-white/10 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Details (presentational; whole card is clickable) */}
      <span className="inline-block w-full bg-nok-blue text-white font-semibold py-2 px-4 rounded-lg btn-glow text-center">
        {buttonLabel}
      </span>
    </div>
  );
}
