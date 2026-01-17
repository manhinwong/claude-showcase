import BuildCard from "../components/BuildCard";
import buildsData from "../data/builds.json";

export default function Home() {
  const sortedBuilds = [...buildsData.builds].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">Claude</span>
            <span className="text-2xl font-light text-gray-600">Showcase</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Claude Showcase
          </h1>
          <p className="text-lg text-gray-600">
            Student builds powered by Claude Code
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBuilds.map((build) => (
            <BuildCard
              key={build.id}
              projectName={build.projectName}
              builderName={build.builderName}
              school={build.school}
              description={build.description}
              tags={build.tags}
              githubUrl={build.githubUrl}
              videoUrl={build.videoUrl}
              difficulty={build.difficulty}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
