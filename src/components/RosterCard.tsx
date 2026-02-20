import Image from 'next/image';
import { User } from 'lucide-react';

interface RosterCardProps {
  name: string;
  title: string;
  company: string;
  buttonLabel: string;
  onContact: () => void;
  tags?: string[];
  location?: string;
  imagePath?: string | null;
}

const AVATAR_SIZE = 96;

function displayName(name: string): string {
  const first = name.split(' ')[0];
  if (first === 'Blake' || first === 'Chad') return `${name} (Observer)`;
  return name;
}

export default function RosterCard({ name, title, company, buttonLabel, onContact, tags, location, imagePath }: RosterCardProps) {
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
      <div className="mb-4 flex justify-center">
        {imagePath ? (
          <Image
            src={imagePath}
            alt={name}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
            <User className="text-slate-400" size={40} />
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{displayName(name)}</h3>
      <p className="text-slate-400 mb-1">{title}</p>
      {location && (
        <p className="text-slate-500 text-sm mb-2">{location}</p>
      )}
      <p className="text-slate-400 mb-3">{company}</p>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2.5 py-1 rounded-full bg-white/10 text-xs text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <span className="inline-block w-full bg-nok-blue text-white font-semibold py-2 px-4 rounded-lg btn-glow text-center">
        {buttonLabel}
      </span>
    </div>
  );
}
