'use client';

import { useState } from 'react';
import { rosterMembers, rosterPageCopy, rosterButtonLabel } from '../../../data/sab-content';
import RosterCard from '../../../components/RosterCard';
import RosterModal from '../../../components/RosterModal';

export default function RosterPage() {
  const [selectedMember, setSelectedMember] = useState<typeof rosterMembers[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleContact = (member: typeof rosterMembers[0]) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Roster</h1>
        <p className="text-slate-400 text-lg">
          {rosterPageCopy.headerDescription}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rosterMembers.map((member) => (
          <RosterCard
            key={member.id}
            name={member.name}
            title={member.title}
            company={member.company}
            buttonLabel={rosterButtonLabel}
            onContact={() => handleContact(member)}
            expertise={member.expertise}
            location={member.location}
          />
        ))}
      </div>

      <RosterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        member={selectedMember}
      />
    </div>
  );
}
