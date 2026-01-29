'use client';

import { presentations } from '../../../data/sab-content';
import PresentationCard from '../../../components/PresentationCard';

export default function PresentationsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Strategic Resources</h1>
        <p className="text-slate-400 text-lg">
          Download presentations, reports, and strategic documents from past meetings and sessions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {presentations.map((presentation) => (
          <PresentationCard
            key={presentation.id}
            title={presentation.title}
            filename={presentation.filename}
          />
        ))}
      </div>
    </div>
  );
}
