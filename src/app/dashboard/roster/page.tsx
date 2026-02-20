'use client';

import { useState } from 'react';
import { rosterMembers, rosterPageCopy, rosterButtonLabel } from '../../../data/sab-content';
import RosterCard from '../../../components/RosterCard';
import RosterModal from '../../../components/RosterModal';

const SAB_ROLE = 'Strategic Advisory Board';
const BOD_ROLE = 'Board of Directors';

export default function RosterPage() {
  const [selectedMember, setSelectedMember] = useState<typeof rosterMembers[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sabMembers = rosterMembers.filter((m) => m.role === SAB_ROLE);
  const directorsMembers = rosterMembers.filter((m) => m.role === BOD_ROLE);

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

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">{SAB_ROLE}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sabMembers.map((member) => (
            <RosterCard
              key={member.id}
              name={member.name}
              title={member.title}
              company={member.company}
              location={member.location}
              buttonLabel={rosterButtonLabel}
              onContact={() => handleContact(member)}
              tags={member.tags}
              imagePath={member.imagePath ?? undefined}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-white mb-4">{BOD_ROLE}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {directorsMembers.map((member) => (
            <RosterCard
              key={member.id}
              name={member.name}
              title={member.title}
              company={member.company}
              location={member.location}
              buttonLabel={rosterButtonLabel}
              onContact={() => handleContact(member)}
              tags={member.tags}
              imagePath={member.imagePath ?? undefined}
            />
          ))}
        </div>
      </section>

      <RosterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        member={selectedMember}
      />
    </div>
  );
}
