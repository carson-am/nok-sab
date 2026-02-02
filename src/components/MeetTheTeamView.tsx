'use client';

import { useState } from 'react';
import Image from 'next/image';
import { teamMembers } from '../data/sab-content';
import TeamMemberModal from './TeamMemberModal';

type TeamMember = (typeof teamMembers)[number];

function TeamCard({ member, onViewDetails }: { member: TeamMember; onViewDetails: () => void }) {
  return (
    <div className="glass-card p-6 rounded-xl card-glow transition-all duration-200 flex flex-col items-center text-center">
      <div className="w-40 h-40 rounded-full overflow-hidden flex-shrink-0 mb-4 aspect-square">
        <Image
          src={member.imagePath}
          alt={member.name}
          width={160}
          height={160}
          className="w-full h-full aspect-square object-cover"
        />
      </div>
      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
      <p className="text-nok-blue font-semibold mb-4">{member.title}</p>
      <button
        onClick={onViewDetails}
        className="bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-2.5 px-5 rounded-lg btn-glow transition-all duration-200"
      >
        View Details
      </button>
    </div>
  );
}

export default function MeetTheTeamView() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const row1 = teamMembers.slice(0, 3);
  const row2 = teamMembers.slice(3, 5);

  return (
    <div className="space-y-10">
      <TeamMemberModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />

      {/* Row 1: Three members */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {row1.map((member) => (
          <TeamCard
            key={member.id}
            member={member}
            onViewDetails={() => setSelectedMember(member)}
          />
        ))}
      </div>

      {/* Row 2: Two members centered */}
      <div className="flex justify-center gap-6">
        {row2.map((member) => (
          <TeamCard
            key={member.id}
            member={member}
            onViewDetails={() => setSelectedMember(member)}
          />
        ))}
      </div>
    </div>
  );
}
