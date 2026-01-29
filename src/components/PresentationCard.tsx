'use client';

import { FileText, Download } from 'lucide-react';

interface PresentationCardProps {
  title: string;
  filename: string;
}

export default function PresentationCard({ title, filename }: PresentationCardProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `/downloads/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card p-6 rounded-xl flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <FileText className="text-nok-blue" size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        </div>
      </div>
      <div className="mt-auto">
        <button
          onClick={handleDownload}
          className="w-full bg-nok-orange hover:bg-[#e55a2b] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Download size={18} />
          Download PDF
        </button>
      </div>
    </div>
  );
}
