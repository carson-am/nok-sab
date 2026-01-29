interface RosterCardProps {
  name: string;
  title: string;
  company: string;
  onContact: () => void;
}

export default function RosterCard({ name, title, company, onContact }: RosterCardProps) {
  return (
    <div className="glass-card p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
      <p className="text-slate-400 mb-1">{title}</p>
      <p className="text-slate-400 mb-4">{company}</p>
      <button
        onClick={onContact}
        className="w-full bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Contact Member
      </button>
    </div>
  );
}
