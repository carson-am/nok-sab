'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { presentations } from '../../../data/sab-content';
import PresentationCard from '../../../components/PresentationCard';

type Resource = (typeof presentations)[number];

function filterResources(resources: Resource[], query: string): Resource[] {
  if (!query.trim()) return resources;
  const q = query.trim().toLowerCase();
  return resources.filter((r) => {
    if (r.title.toLowerCase().includes(q)) return true;
    if (r.description && r.description.toLowerCase().includes(q)) return true;
    if (r.category && r.category.toLowerCase().includes(q)) return true;
    return false;
  });
}

function groupByCategory(resources: Resource[]): Record<string, Resource[]> {
  return resources.reduce((acc, resource) => {
    const category = resource.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);
}

export default function PresentationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResources = useMemo(
    () => filterResources(presentations, searchQuery),
    [searchQuery]
  );

  const groupedResources = useMemo(
    () => groupByCategory(filteredResources),
    [filteredResources]
  );

  const categories = Object.keys(groupedResources).sort();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Strategic Resources</h1>
        <p className="text-slate-400 text-lg">
          Access presentations, reports, and strategic materials from past meetings.
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor="resources-search" className="sr-only">
          Search resources
        </label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            id="resources-search"
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-card rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-slate-400 border border-white/10 bg-white/5 focus:outline-none focus:ring-2 focus:ring-nok-blue/50 focus:border-nok-blue/50 transition-all duration-200"
          />
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="text-slate-400 text-center py-8">
          No resources found matching your search.
        </p>
      ) : (
        <div className="space-y-10">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-xl font-bold text-white mb-4">{category}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groupedResources[category].map((resource) => (
                  <PresentationCard
                    key={resource.id}
                    title={resource.title}
                    filename={resource.filename}
                    description={resource.description}
                    category={resource.category}
                    fileType={resource.fileType}
                    fileSize={resource.fileSize}
                    downloadLink={resource.downloadLink}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
