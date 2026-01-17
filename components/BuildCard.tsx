interface BuildCardProps {
  projectName: string;
  builderName: string;
  school: string;
  description: string;
  tags: string[];
  githubUrl: string;
  videoUrl: string;
  difficulty: string;
}

const tagColors: Record<string, string> = {
  productivity: "bg-blue-100 text-blue-800",
  automation: "bg-green-100 text-green-800",
  creative: "bg-purple-100 text-purple-800",
  tool: "bg-orange-100 text-orange-800",
  "data analysis": "bg-yellow-100 text-yellow-800",
  game: "bg-red-100 text-red-800",
};

const difficultyColors: Record<string, string> = {
  beginner: "bg-green-500 text-white",
  intermediate: "bg-yellow-500 text-white",
  advanced: "bg-red-500 text-white",
};

function getEmbedUrl(url: string): string | null {
  if (!url || url.startsWith("[")) return null;

  // YouTube: youtube.com/watch?v=ID or youtu.be/ID
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Loom: loom.com/share/ID
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  return null;
}

export default function BuildCard({
  projectName,
  builderName,
  school,
  description,
  tags,
  githubUrl,
  videoUrl,
  difficulty,
}: BuildCardProps) {
  return (
    <div className="relative border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 bg-white">
      <span
        className={`absolute top-3 right-3 px-2 py-1 text-xs font-medium rounded-full ${
          difficultyColors[difficulty] || "bg-gray-500 text-white"
        }`}
      >
        {difficulty}
      </span>

      <h3 className="text-lg font-semibold text-gray-900 pr-20 mb-1">
        {projectName}
      </h3>

      <p className="text-sm text-gray-600 mb-3">
        {builderName} · {school}
      </p>

      <p className="text-sm text-gray-700 mb-4">{description}</p>

      {getEmbedUrl(videoUrl) && (
        <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden bg-gray-100">
          <iframe
            src={getEmbedUrl(videoUrl)!}
            title={`${projectName} demo`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag) => (
          <span
            key={tag}
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              tagColors[tag] || "bg-gray-100 text-gray-800"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Demo
        </a>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Code
        </a>
      </div>
    </div>
  );
}
