import {
  Microscope,
  FileText,
  TrendingUp,
  Target,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { SearchResult as SearchResultType } from "../lib/types";

interface SearchResultProps {
  result: SearchResultType;
}

export function SearchResult({ result }: SearchResultProps) {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    scientificDetails: true,
    relevantChunks: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getConditionColor = (condition?: string) => {
    const colors = {
      microgravity: "from-purple-500 to-indigo-600",
      radiation: "from-red-500 to-orange-600",
      temperature: "from-blue-500 to-cyan-600",
      hypoxia: "from-green-500 to-emerald-600",
      default: "from-gray-500 to-slate-600"
    };
    return colors[condition as keyof typeof colors] || colors.default;
  };

  const getOrganismIcon = (organismName: string) => {
    const name = organismName.toLowerCase();
    if (name.includes('coli') || name.includes('bacteria')) {
      return <Microscope className="w-6 h-6 text-blue-400" />;
    } else if (name.includes('plant') || name.includes('arabidopsis')) {
      return <FileText className="w-6 h-6 text-green-400" />;
    } else {
      return <Target className="w-6 h-6 text-purple-400" />;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all p-6 mb-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
            {getOrganismIcon(result.organism_name)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {result.organism_name}
            </h2>
            {result.condition && (
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getConditionColor(result.condition)} text-white`}>
                <Target className="w-4 h-4 mr-1" />
                {result.condition}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
          className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-white/10 rounded-lg transition-colors"
          title="Copy result data"
        >
          <Copy className="w-5 h-5" />
        </button>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('description')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <h3 className="text-lg font-semibold text-white flex items-center">
            <FileText className="w-5 h-5 mr-2 text-cyan-400" />
            Description
          </h3>
          {expandedSections.description ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.description && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <p className="text-gray-300 leading-relaxed">
              {result.description}
            </p>
          </div>
        )}
      </div>

      {/* Scientific Details Section */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('scientificDetails')}
          className="flex items-center justify-between w-full mb-3 text-left"
        >
          <h3 className="text-lg font-semibold text-white flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
            Scientific Details
          </h3>
          {expandedSections.scientificDetails ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>
        {expandedSections.scientificDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Classification */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-cyan-400 mb-2 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Classification
              </h4>
              <p className="text-gray-300">{result.scientific_details.classification}</p>
            </div>

            {/* Response Mechanisms */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-blue-400 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Response Mechanisms
              </h4>
              {result.scientific_details.response_mechanisms.length > 0 ? (
                <ul className="space-y-1">
                  {result.scientific_details.response_mechanisms.map((mechanism, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>{mechanism}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-sm">No specific mechanisms identified</p>
              )}
            </div>

            {/* Experimental Findings */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 md:col-span-2">
              <h4 className="text-sm font-semibold text-green-400 mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-1" />
                Experimental Findings
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {result.scientific_details.experimental_findings}
              </p>
            </div>

            {/* Applications */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 md:col-span-2">
              <h4 className="text-sm font-semibold text-purple-400 mb-2 flex items-center">
                <ExternalLink className="w-4 h-4 mr-1" />
                Applications
              </h4>
              <p className="text-gray-300 leading-relaxed">
                {result.scientific_details.applications}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Relevant Chunks Section */}
      {result.relevant_chunks && result.relevant_chunks.length > 0 && (
        <div>
          <button
            onClick={() => toggleSection('relevantChunks')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <h3 className="text-lg font-semibold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-orange-400" />
              Source Content ({result.relevant_chunks.length})
            </h3>
            {expandedSections.relevantChunks ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          {expandedSections.relevantChunks && (
            <div className="space-y-3">
              {result.relevant_chunks.map((chunk, idx) => (
                <div key={idx} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-semibold text-orange-400 bg-orange-500/20 px-2 py-1 rounded-full">
                      Chunk {idx + 1}
                    </span>
                    <button
                      onClick={() => copyToClipboard(chunk)}
                      className="text-gray-400 hover:text-orange-400 transition-colors"
                      title="Copy chunk"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {chunk}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
