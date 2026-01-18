"use client";

import { useState } from "react";
import BuildCard from "../components/BuildCard";
import FilterBar from "../components/FilterBar";
import buildsData from "../data/builds.json";

const cardColors = [
  "bg-warm-pink",
  "bg-warm-green",
  "bg-warm-blue",
  "bg-warm-coral",
  "bg-warm-lavender",
];

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  const sortedBuilds = [...buildsData.builds].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  const filteredBuilds = sortedBuilds.filter((build) => {
    // Tag filter: build must have at least one selected tag
    if (selectedTags.length > 0 && !build.tags.some((tag) => selectedTags.includes(tag))) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = build.projectName.toLowerCase().includes(query);
      const matchesDescription = build.description.toLowerCase().includes(query);
      const matchesBuilder = build.builderName.toLowerCase().includes(query);
      if (!matchesName && !matchesDescription && !matchesBuilder) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-warm-bg">
      <header className="bg-warm-bg border-b border-warm-text/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif text-warm-text">Claude</span>
            <span className="text-2xl font-serif text-warm-text/70">Showcase</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-warm-text mb-3 sm:mb-4">
            Claude Showcase
          </h1>
          <p className="text-base sm:text-lg text-warm-text/70 font-sans">
            Student builds powered by Claude Code
          </p>
        </div>

        <div className="mb-6 sm:mb-10">
          <FilterBar
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearFilters={handleClearFilters}
          />
        </div>

        {filteredBuilds.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-warm-text/60 font-sans">
              No projects match your filters.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 min-h-[44px] px-4 py-2 text-warm-coral hover:text-warm-coral/80 font-medium transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredBuilds.map((build, index) => (
              <BuildCard
                key={build.id}
                projectName={build.projectName}
                builderName={build.builderName}
                school={build.school}
                description={build.description}
                tags={build.tags}
                githubUrl={build.githubUrl}
                videoUrl={build.videoUrl}
                colorClass={cardColors[index % cardColors.length]}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
