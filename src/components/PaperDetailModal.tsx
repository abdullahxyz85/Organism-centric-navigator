import { Database } from '../lib/database.types';
import { X, Calendar, Users, ExternalLink, BookOpen } from 'lucide-react';

type Paper = Database['public']['Tables']['papers']['Row'];

interface PaperDetailModalProps {
  paper: Paper;
  conditions?: string[];
  keyResults?: string;
  onClose: () => void;
}

export function PaperDetailModal({ paper, conditions = [], keyResults, onClose }: PaperDetailModalProps) {
  const formatDate = (date: string | null) => {
    if (!date) return 'Date unavailable';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900 pr-8">{paper.title}</h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {paper.summary && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-start space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-blue-900">AI-Generated Summary</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{paper.summary}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paper.authors && paper.authors.length > 0 && (
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Users className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Authors</p>
                  <p className="text-sm text-gray-600">{paper.authors.join(', ')}</p>
                </div>
              </div>
            )}

            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Publication Info</p>
                <p className="text-sm text-gray-600">{formatDate(paper.publication_date)}</p>
                {paper.journal && <p className="text-sm text-gray-600">{paper.journal}</p>}
                {paper.doi && <p className="text-xs text-gray-500 mt-1">DOI: {paper.doi}</p>}
              </div>
            </div>
          </div>

          {conditions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Experimental Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {conditions.map((condition, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 text-sm font-medium rounded-full border border-cyan-200"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}

          {keyResults && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Experimental Results</h3>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-gray-700">{keyResults}</p>
              </div>
            </div>
          )}

          {paper.key_findings && paper.key_findings.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Key Findings</h3>
              <ul className="space-y-2">
                {paper.key_findings.map((finding, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-gray-700">
                    <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {paper.abstract && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Abstract</h3>
              <p className="text-gray-700 leading-relaxed">{paper.abstract}</p>
            </div>
          )}

          {paper.pdf_url && (
            <div className="pt-4 border-t border-gray-200">
              <a
                href={paper.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                <span>View Full Paper</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
