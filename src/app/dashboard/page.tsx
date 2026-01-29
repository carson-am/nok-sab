import { overviewContent } from '../../data/sab-content';

export default function OverviewPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome</h1>
        <p className="text-slate-400 text-lg">
          Welcome to the Nok Strategic Advisory Board portal. Access resources, connect with members, and stay informed about board activities.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="glass-card p-6 rounded-xl card-glow">
          <h2 className="text-2xl font-bold text-white mb-4">{overviewContent.mission.title}</h2>
          <p className="text-slate-400 leading-relaxed">{overviewContent.mission.content}</p>
        </div>

        <div className="glass-card p-6 rounded-xl card-glow">
          <h2 className="text-2xl font-bold text-white mb-4">{overviewContent.boardPurpose.title}</h2>
          <p className="text-slate-400 leading-relaxed">{overviewContent.boardPurpose.content}</p>
        </div>

        <div className="glass-card p-6 rounded-xl card-glow">
          <h2 className="text-2xl font-bold text-white mb-4">{overviewContent.memberImpact.title}</h2>
          <p className="text-slate-400 leading-relaxed">{overviewContent.memberImpact.content}</p>
        </div>
      </div>
    </div>
  );
}
