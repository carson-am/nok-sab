'use client';

import { useState } from 'react';
import { Target, Compass, Zap } from 'lucide-react';
import OverviewHero from '../../components/OverviewHero';
import VideoHeroAccordion from '../../components/VideoHeroAccordion';
import ImmersiveView from '../../components/ImmersiveView';
import WhoIsNokView from '../../components/WhoIsNokView';
import MeetTheTeamView from '../../components/MeetTheTeamView';
import HowYouCanHelpView from '../../components/HowYouCanHelpView';
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
  const [activeImmersiveView, setActiveImmersiveView] = useState<
    'who-is-nok' | 'meet-the-team' | 'how-you-can-help' | null
  >(null);

  return (
    <>
      {/* Immersive Views */}
      <ImmersiveView
        isOpen={activeImmersiveView === 'who-is-nok'}
        onClose={() => setActiveImmersiveView(null)}
        title="Who is Nok?"
        centerTitle
      >
        <WhoIsNokView />
      </ImmersiveView>

      <ImmersiveView
        isOpen={activeImmersiveView === 'meet-the-team'}
        onClose={() => setActiveImmersiveView(null)}
        title="Meet the Team"
      >
        <MeetTheTeamView />
      </ImmersiveView>

      <ImmersiveView
        isOpen={activeImmersiveView === 'how-you-can-help'}
        onClose={() => setActiveImmersiveView(null)}
        title="How You Can Help"
      >
        <HowYouCanHelpView />
      </ImmersiveView>

      <div className="max-w-6xl mx-auto">
        <VideoHeroAccordion />
        <OverviewHero />

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white mb-2">
          {overviewWelcome.title}
        </h1>
        <p className="text-slate-400 text-lg">{overviewWelcome.subtitle}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3 mb-8">
        {/* Mission Card */}
        <div className="flex flex-col">
          <button
            onClick={() => setActiveImmersiveView('who-is-nok')}
            className="w-full mb-4 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg btn-glow transition-all duration-200"
          >
            Who is Nok?
          </button>
          <div className="glass-card p-6 rounded-xl card-glow transition-all duration-200 flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-nok-blue flex-shrink-0" size={26} strokeWidth={1.5} />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                {overviewContent.mission.title}
              </h2>
            </div>
            <div className="flex-1 min-h-0">
              <ContentWithHighlight
                content={overviewContent.mission.content}
                highlight={overviewContent.mission.highlight}
              />
            </div>
          </div>
        </div>

        {/* Purpose Card */}
        <div className="flex flex-col">
          <button
            onClick={() => setActiveImmersiveView('meet-the-team')}
            className="w-full mb-4 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg btn-glow transition-all duration-200"
          >
            Meet the Team
          </button>
          <div className="glass-card p-6 rounded-xl card-glow transition-all duration-200 flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-3 mb-4">
              <Compass className="text-nok-blue flex-shrink-0" size={26} strokeWidth={1.5} />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                {overviewContent.boardPurpose.title}
              </h2>
            </div>
            <div className="flex-1 min-h-0">
              <ContentWithHighlight
                content={overviewContent.boardPurpose.content}
                highlight={overviewContent.boardPurpose.highlight}
              />
            </div>
          </div>
        </div>

        {/* Impact Card */}
        <div className="flex flex-col">
          <button
            onClick={() => setActiveImmersiveView('how-you-can-help')}
            className="w-full mb-4 bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg btn-glow transition-all duration-200"
          >
            How You Can Help
          </button>
          <div className="glass-card p-6 rounded-xl card-glow transition-all duration-200 flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-nok-blue flex-shrink-0" size={26} strokeWidth={1.5} />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                {overviewContent.memberImpact.title}
              </h2>
            </div>
            <div className="flex-1 min-h-0">
              <ContentWithHighlight
                content={overviewContent.memberImpact.content}
                highlight={overviewContent.memberImpact.highlight}
              />
            </div>
          </div>
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
    </>
  );
}
