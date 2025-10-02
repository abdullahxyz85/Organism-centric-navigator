import { Database } from '../lib/database.types';
import { Calendar, Users, ExternalLink, FileText } from 'lucide-react';

type Paper = Database['public']['Tables']['papers']['Row'];

interface PaperCardProps {
  paper: Paper;
  conditions?: string[];
  onClick: (paper: Paper) => void;
}

export function PaperCard({ paper, conditions = [], onClick }: PaperCardProps) {
  const formatDate = (date: string | null) => {
    if (!date) return 'Date unavailable';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      onClick={() => onClick(paper)}
      className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all p-6 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
            {paper.title}
          </h3>
        </div>
        <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
      </div>

      {paper.summary && (
        <div className="mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-400/30">
          <p className="text-sm text-gray-300 line-clamp-3">
            <span className="font-semibold text-cyan-400">AI Summary:</span> {paper.summary}
          </p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        {paper.authors && paper.authors.length > 0 && (
          <div className="flex items-center text-sm text-gray-400">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ' et al.' : ''}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-400">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{formatDate(paper.publication_date)}</span>
          {paper.journal && <span className="ml-2">• {paper.journal}</span>}
        </div>
      </div>

      {conditions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {conditions.map((condition, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-400/30"
            >
              {condition}
            </span>
          ))}
        </div>
      )}

      {paper.key_findings && paper.key_findings.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-cyan-400 mb-1">Key Findings:</p>
          <ul className="text-sm text-gray-300 space-y-1">
            {paper.key_findings.slice(0, 2).map((finding, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-cyan-400 mr-2">•</span>
                <span className="line-clamp-1">{finding}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center group-hover:translate-x-1 transition-transform">
          View Details
          <ExternalLink className="w-4 h-4 ml-1" />
        </button>
        {paper.doi && (
          <span className="text-xs text-gray-500">DOI: {paper.doi}</span>
        )}
      </div>
    </div>
  );
}
