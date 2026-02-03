'use client';

import {
  FileText,
  Download,
  BarChart3,
  Map,
  Cpu,
  Leaf,
  Settings,
  Presentation,
} from 'lucide-react';

interface PresentationCardProps {
  title: string;
  filename?: string;
  description?: string;
  category?: string;
  fileType?: string;
  fileSize?: string;
  downloadLink?: string;
  onCardClick?: () => void;
}

function getCategoryIcon(category?: string) {
  switch (category) {
    case 'Nok Resources':
      return Presentation;
    case 'Quarterly Reviews':
      return BarChart3;
    case 'Strategy & Roadmaps':
      return Map;
    case 'Market Research':
      return BarChart3;
    case 'Technology & Innovation':
      return Cpu;
    case 'Sustainability & ESG':
      return Leaf;
    case 'Operations':
      return Settings;
    default:
      return FileText;
  }
}

export default function PresentationCard({
  title,
  filename,
  description,
  category,
  fileType,
  fileSize,
  downloadLink,
  onCardClick,
}: PresentationCardProps) {
  const Icon = getCategoryIcon(category);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    if (downloadLink) {
      link.href = downloadLink;
    } else if (filename) {
      link.href = `/downloads/${filename}`;
    } else {
      return;
    }
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card p-6 rounded-xl flex flex-col h-full card-glow transition-all duration-200">
      <div
        role="button"
        tabIndex={0}
        onClick={onCardClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onCardClick?.();
          }
        }}
        className={`flex-1 min-w-0 ${onCardClick ? 'cursor-pointer' : ''}`}
        aria-label={onCardClick ? `View details for ${title}` : undefined}
      >
        <div className="flex items-start gap-4 mb-3">
          <div className="flex-shrink-0">
            <Icon className="text-nok-blue" size={32} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            {description && (
              <p className="text-slate-100 leading-relaxed text-sm line-clamp-2 mb-3">
                {description}
              </p>
            )}
          </div>
        </div>
        {fileType && (
          <p className="text-slate-400 text-xs mb-3">
            {fileType}
          </p>
        )}
      </div>
      <div className="mt-auto">
        <button
          onClick={handleDownload}
          className="w-full bg-nok-blue hover:bg-[#2563eb] text-white font-semibold py-3 px-4 rounded-lg btn-glow flex items-center justify-center gap-2 transition-all duration-200"
        >
          <Download size={18} />
          Download
        </button>
      </div>
    </div>
  );
}
