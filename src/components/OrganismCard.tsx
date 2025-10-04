import { Organism } from "../lib/types";
import { FileText, Leaf } from "lucide-react";

interface OrganismCardProps {
  organism: Organism;
  onClick: (organism: Organism) => void;
}

const categoryIcons = {
  plant: Leaf,
  microbe: FileText,
  animal: FileText,
  human_cells: FileText,
};

export function OrganismCard({ organism, onClick }: OrganismCardProps) {
  const Icon =
    categoryIcons[organism.category as keyof typeof categoryIcons] || FileText;

  return (
    <button
      onClick={() => onClick(organism)}
      className="w-full bg-white/5 backdrop-blur-md rounded-xl border-2 border-white/10 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all p-6 text-left group"
    >
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          {organism.image_url ? (
            <img
              src={organism.image_url}
              alt={organism.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Icon className="w-8 h-8 text-cyan-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
            {organism.name}
          </h3>
          {organism.scientific_name && (
            <p className="text-sm text-gray-400 italic mb-2">
              {organism.scientific_name}
            </p>
          )}
          {organism.description && (
            <p className="text-sm text-gray-300 line-clamp-2">
              {organism.description}
            </p>
          )}
          <div className="mt-3 flex items-center space-x-4 text-sm">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full font-medium border border-cyan-400/30">
              {organism.category.replace("_", " ")}
            </span>
            <span className="text-gray-400">
              {organism.experiment_count} experiments
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
