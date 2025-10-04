import {
  Search,
  Filter,
  TrendingUp,
  FileText,
  Calendar,
  Globe,
  Leaf,
  Microscope,
  Users,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { mockAPI, mockConditions } from "../lib/mockData";
import { Organism, Paper, SearchResult } from "../lib/types";
import { apiService } from "../lib/api";
import { SearchResult as SearchResultComponent } from "../components/SearchResult";

interface SearchDashboardProps {
  searchQuery?: string;
}

export function SearchDashboard({ searchQuery = "" }: SearchDashboardProps) {
  const [query, setQuery] = useState(searchQuery);
  const [activeTab, setActiveTab] = useState<"ai-search" | "organisms" | "papers">(
    "ai-search"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [organisms, setOrganisms] = useState<Organism[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    connected: boolean;
    message: string;
  } | null>(null);

  // Check API status on component mount
  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    try {
      const health = await apiService.getHealth();
      setApiStatus({
        connected: health.api === "healthy" && health.openai === "healthy",
        message: "AI Search Ready"
      });
    } catch (error) {
      setApiStatus({
        connected: false,
        message: "Failed to connect to API"
      });
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load organisms
      const { data: organismsData } = await mockAPI.getOrganisms(
        query || undefined
      );
      setOrganisms(organismsData || []);

      // For papers, we'll use the mock papers data filtered by search query
      if (query) {
        const filtered =
          mockAPI.mockPapers?.filter(
            (paper) =>
              paper.title.toLowerCase().includes(query.toLowerCase()) ||
              paper.authors.some((author) =>
                author.toLowerCase().includes(query.toLowerCase())
              ) ||
              (paper.summary &&
                paper.summary.toLowerCase().includes(query.toLowerCase()))
          ) || [];
        setPapers(filtered);
      } else {
        setPapers(mockAPI.mockPapers || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const performAISearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchResult(null);

    try {
      const condition = selectedConditions.length > 0 ? selectedConditions[0] : undefined;
      const result = await apiService.searchOrganism({
        query: query.trim(),
        condition
      });
      
      setSearchResult(result);
    } catch (error) {
      console.error("AI Search error:", error);
      setError(error instanceof Error ? error.message : "Failed to perform AI search");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "ai-search") {
      performAISearch();
    } else {
      loadData();
    }
  };

  // Available filter conditions from mock data
  const availableConditions = mockConditions.map((c) => c.name);

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Space Biology Research Dashboard
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mb-4">
            Search and explore NASA's space biology experiments. Find organisms,
            papers, and insights from decades of research.
          </p>
          
          {/* API Status */}
          {apiStatus && (
            <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
              apiStatus.connected 
                ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                : 'bg-red-500/20 text-red-300 border border-red-400/30'
            }`}>
              {apiStatus.connected ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-2" />
              )}
              <span>
                {apiStatus.message}
              </span>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for organisms, papers, conditions, or keywords..."
                className="w-full pl-14 pr-4 py-4 text-lg bg-white/10 backdrop-blur-md border-2 border-white/20 text-white placeholder-gray-400 rounded-xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                type="submit"
                disabled={loading || !apiStatus?.connected}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : activeTab === "ai-search" ? (
                  "AI Search"
                ) : (
                  "Search Experiments"
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-lg hover:border-cyan-400 hover:bg-white/20 transition-all"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-3">
            <span className="text-sm text-gray-400">Quick search:</span>
            {[
              "Arabidopsis microgravity",
              "E. coli radiation",
              "Yeast space",
              "Human cells ISS",
              "Plant growth",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">
                  Filter by Conditions
                </h3>
                {selectedConditions.length > 0 && (
                  <button
                    onClick={() => setSelectedConditions([])}
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {availableConditions.map((condition) => {
                  const isSelected = selectedConditions.includes(condition);
                  return (
                    <button
                      key={condition}
                      onClick={() => toggleCondition(condition)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                      }`}
                    >
                      {condition}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
            <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">150+</div>
            <div className="text-sm text-gray-400">Organisms</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
            <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">1,200+</div>
            <div className="text-sm text-gray-400">Publications</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">850+</div>
            <div className="text-sm text-gray-400">Experiments</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center">
            <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">30+</div>
            <div className="text-sm text-gray-400">Years</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab("ai-search")}
            className={`px-6 py-3 font-semibold rounded-lg transition-all ${
              activeTab === "ai-search"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            🤖 AI Search
          </button>
          <button
            onClick={() => setActiveTab("organisms")}
            className={`px-6 py-3 font-semibold rounded-lg transition-all ${
              activeTab === "organisms"
                ? "bg-cyan-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Organisms ({organisms.length})
          </button>
          <button
            onClick={() => setActiveTab("papers")}
            className={`px-6 py-3 font-semibold rounded-lg transition-all ${
              activeTab === "papers"
                ? "bg-cyan-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Papers ({papers.length})
          </button>
        </div>

        {/* Results */}
        <div className="pb-12">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Searching...</p>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-xl p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                    <span className="text-red-300">{error}</span>
                  </div>
                </div>
              )}

              {/* AI Search Results */}
              {activeTab === "ai-search" && (
                <div>
                  {searchResult ? (
                    <SearchResultComponent result={searchResult} />
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-12 h-12 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        AI-Powered Research Search
                      </h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        Enter a query about organisms, conditions, or research topics to get intelligent insights from NASA's space biology database.
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {[
                          "E. coli microgravity",
                          "Arabidopsis radiation resistance", 
                          "Yeast space environment",
                          "Bacterial biofilm formation",
                          "Plant growth in space"
                        ].map((example) => (
                          <button
                            key={example}
                            onClick={() => setQuery(example)}
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                          >
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "organisms" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {organisms.map((organism) => (
                    <div
                      key={organism.id}
                      className="bg-white/5 backdrop-blur-md rounded-xl border-2 border-white/10 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all p-6 group cursor-pointer"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          {organism.category === "plant" ? (
                            <Leaf className="w-8 h-8 text-green-400" />
                          ) : organism.category === "microbe" ? (
                            <Microscope className="w-8 h-8 text-blue-400" />
                          ) : (
                            <FileText className="w-8 h-8 text-purple-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                            {organism.name}
                          </h3>
                          {organism.common_name && (
                            <p className="text-sm text-gray-400 italic mb-2">
                              {organism.common_name}
                            </p>
                          )}
                          {organism.description && (
                            <p className="text-sm text-gray-300 line-clamp-3 mb-3">
                              {organism.description}
                            </p>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full font-medium border border-cyan-400/30">
                                {organism.category.replace("_", " ")}
                              </span>
                              <span className="text-gray-400">
                                {organism.experiment_count} experiments
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "papers" && (
                <div className="space-y-6">
                  {papers.map((paper) => (
                    <div
                      key={paper.id}
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
                          <p className="text-sm text-gray-300">
                            <span className="font-semibold text-cyan-400">
                              AI Summary:
                            </span>{" "}
                            {paper.summary}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        {paper.authors && paper.authors.length > 0 && (
                          <div className="flex items-center text-sm text-gray-400">
                            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">
                              {paper.authors.slice(0, 3).join(", ")}
                              {paper.authors.length > 3 ? " et al." : ""}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-400">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>
                            {paper.publication_date
                              ? new Date(paper.publication_date).getFullYear()
                              : "Unknown"}
                          </span>
                          {paper.journal && (
                            <span className="ml-2">• {paper.journal}</span>
                          )}
                        </div>
                      </div>

                      {paper.key_findings && paper.key_findings.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-cyan-400 mb-1">
                            Key Findings:
                          </p>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {paper.key_findings
                              .slice(0, 2)
                              .map((finding, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="text-cyan-400 mr-2">•</span>
                                  <span>{finding}</span>
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
                          <span className="text-xs text-gray-500">
                            DOI: {paper.doi}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
