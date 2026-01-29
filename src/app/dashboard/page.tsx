import { Target, Compass, Activity } from 'lucide-react';
import OverviewHero from '../../components/OverviewHero';
import {
  overviewWelcome,
  overviewContent,
  boardStatus,
} from '../../data/sab-content';

function ContentWithHighlight({
  content,
  highlight,
}: {
  content: string;
  highlight: string;
}) {
  if (!highlight || !content.includes(highlight)) {
    return <p className="text-slate-100 leading-relaxed">{content}</p>;
  }
  const [before, after] = content.split(highlight);
  return (
    <p className="text-slate-100 leading-relaxed">
      {before}
      <span className="text-nok-blue font-semibold">{highlight}</span>
      {after}
    </p>
  );
}

export default function OverviewPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <OverviewHero />

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">
          {overviewWelcome.title}
        </h1>
        <p className="text-slate-400 text-lg">{overviewWelcome.subtitle}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3 mb-8">
        <div className="glass-card p-6 rounded-xl card-glow transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-nok-blue flex-shrink-0" size={26} strokeWidth={1.5} />
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              {overviewContent.mission.title}
            </h2>
          </div>
          <ContentWithHighlight
            content={overviewContent.mission.content}
            highlight={overviewContent.mission.highlight}
          />
        </div>

        <div className="glass-card p-6 rounded-xl card-glow transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <Compass className="text-nok-blue flex-shrink-0" size={26} strokeWidth={1.5} />
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              {overviewContent.boardPurpose.title}
            </h2>
          </div>
          <ContentWithHighlight
            content={overviewContent.boardPurpose.content}
            highlight={overviewContent.boardPurpose.highlight}
          />
        </div>

        <div className="glass-card p-6 rounded-xl card-glow transition-all duration-200">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-nok-blue flex-shrink-0" size={26} strokeWidth={1.5} />
            <h2 className="text-2xl lg:text-3xl font-bold text-white">
              {overviewContent.memberImpact.title}
            </h2>
          </div>
          <ContentWithHighlight
            content={overviewContent.memberImpact.content}
            highlight={overviewContent.memberImpact.highlight}
          />
        </div>
      </div>

      <div className="glass-card rounded-xl px-6 py-4 border border-white/5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {boardStatus.map((item, index) => (
            <span key={item.label} className="flex items-center gap-x-2">
              {index > 0 && (
                <span className="text-slate-600" aria-hidden>
                  |
                </span>
              )}
              <span className="text-slate-400">{item.label}:</span>
              <span className="text-slate-200 font-medium">{item.value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
