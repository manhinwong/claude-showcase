"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BuildCard from "../components/BuildCard";
import FilterBar from "../components/FilterBar";
import buildsData from "../data/builds.json";

interface Build {
  id: string;
  projectName: string;
  builderName: string;
  school: string;
  githubUrl?: string;
  websiteUrl?: string;
  artifactUrl?: string;
  videoUrl: string;
  description: string;
  tags: string[];
  submittedAt: string;
  featured: boolean;
}

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
  const [dynamicBuilds, setDynamicBuilds] = useState<Build[]>([]);

  // Load dynamic builds from API on mount
  useEffect(() => {
    const loadBuilds = async () => {
      try {
        const response = await fetch('/api/submit');
        if (response.ok) {
          const kvBuilds = await response.json();
          setDynamicBuilds(kvBuilds);
        }
      } catch (error) {
        console.error('Failed to load dynamic builds:', error);
      }
    };

    loadBuilds();
  }, []);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSearchQuery("");
  };

  // Merge dynamic builds from KV with static builds from JSON
  // Deduplicate by ID (KV builds take precedence)
  const allBuilds = [
    ...dynamicBuilds,
    ...(buildsData.builds as Build[]).filter(
      (staticBuild) => !dynamicBuilds.some((kvBuild) => kvBuild.id === staticBuild.id)
    ),
  ];

  // Sort by submission date (newest first)
  const sortedBuilds = [...allBuilds].sort(
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-serif text-warm-text">Claude</span>
              <span className="text-xl sm:text-2xl font-serif text-warm-text/70">Showcase</span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="px-3 sm:px-4 py-2 text-sm font-medium text-warm-text/70 hover:text-warm-text transition-colors"
              >
                Gallery
              </Link>
              <Link
                href="/submit"
                className="px-4 sm:px-5 py-2.5 text-sm font-semibold bg-warm-coral text-white rounded-xl hover:bg-[#c47a5f] active:bg-[#b86f55] transition-colors shadow-sm"
              >
                Submit Build
              </Link>
            </nav>
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
                websiteUrl={build.websiteUrl}
                artifactUrl={build.artifactUrl}
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
