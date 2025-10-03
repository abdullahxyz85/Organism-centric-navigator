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
} from "lucide-react";
import { useState } from "react";

interface SearchDashboardProps {
  searchQuery?: string;
}

export function SearchDashboard({ searchQuery = "" }: SearchDashboardProps) {
  const [query, setQuery] = useState(searchQuery);
  const [activeTab, setActiveTab] = useState<"organisms" | "papers">(
    "organisms"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", query);
  };

  // Sample filter conditions
  const availableConditions = [
    "Microgravity",
    "Radiation",
    "Temperature",
    "Magnetic Field",
    "Atmospheric Pressure",
    "Space Environment",
  ];

  const toggleCondition = (condition: string) => {
    if (selectedConditions.includes(condition)) {
      setSelectedConditions(selectedConditions.filter((c) => c !== condition));
    } else {
      setSelectedConditions([...selectedConditions, condition]);
    }
  };

  // Sample data - replace with real data later
  const sampleOrganisms = [
    {
      id: "1",
      name: "Arabidopsis thaliana",
      commonName: "Thale Cress",
      description:
        "Model plant organism extensively studied in microgravity conditions. Used to understand plant growth and development in space.",
      experimentCount: 45,
      category: "Plant",
      conditions: ["Microgravity", "Radiation", "Temperature"],
    },
    {
      id: "2",
      name: "Escherichia coli",
      commonName: "E. coli",
      description:
        "Bacterial model organism for space biology research. Studies focus on bacterial behavior and antibiotic resistance in space.",
      experimentCount: 32,
      category: "Microbe",
      conditions: ["Microgravity", "Radiation"],
    },
    {
      id: "3",
      name: "Saccharomyces cerevisiae",
      commonName: "Baker's Yeast",
      description:
        "Yeast species used to study cellular responses in space environments and DNA repair mechanisms.",
      experimentCount: 28,
      category: "Microbe",
      conditions: ["Microgravity", "Radiation", "Magnetic Field"],
    },
    {
      id: "4",
      name: "Caenorhabditis elegans",
      commonName: "C. elegans",
      description:
        "Nematode worm used for studying muscle development and aging in microgravity conditions.",
      experimentCount: 23,
      category: "Animal",
      conditions: ["Microgravity", "Temperature"],
    },
  ];

  const samplePapers = [
    {
      id: "1",
      title:
        "Microgravity Effects on Arabidopsis Gene Expression During Spaceflight",
      authors: ["Smith, J.", "Johnson, A.", "Williams, K."],
      year: 2023,
      journal: "Nature Microgravity",
      summary:
        "This comprehensive study examines how microgravity conditions affect gene expression patterns in Arabidopsis thaliana during ISS experiments, revealing significant changes in stress response pathways and cell wall formation genes.",
      conditions: ["Microgravity", "Gene Expression"],
      keyFindings: [
        "50% upregulation in stress response genes",
        "Altered cell wall formation pathways",
        "Changes in gravitropic response mechanisms",
      ],
      doi: "10.1038/s41526-023-00123-4",
    },
    {
      id: "2",
      title:
        "Bacterial Growth Patterns and Antibiotic Resistance in Space Environment",
      authors: ["Johnson, M.", "Davis, R.", "Brown, L."],
      year: 2022,
      journal: "Space Biology Journal",
      summary:
        "Investigation of E. coli growth characteristics under various space conditions including microgravity and radiation exposure, with focus on antibiotic resistance development.",
      conditions: ["E. coli", "Growth Patterns", "Space Environment"],
      keyFindings: [
        "Increased antibiotic resistance in microgravity",
        "Altered biofilm formation",
        "Changes in membrane permeability",
      ],
      doi: "10.1016/j.spacebio.2022.03.015",
    },
    {
      id: "3",
      title: "DNA Repair Mechanisms in Yeast Exposed to Space Radiation",
      authors: ["Chen, X.", "Miller, S.", "Garcia, P."],
      year: 2023,
      journal: "Radiation Biology",
      summary:
        "Analysis of DNA repair pathways in Saccharomyces cerevisiae following exposure to cosmic radiation during long-duration spaceflight missions.",
      conditions: ["Radiation", "DNA Repair", "Yeast"],
      keyFindings: [
        "Enhanced homologous recombination",
        "Upregulation of DNA damage checkpoints",
        "Increased mutation rates in specific genes",
      ],
      doi: "10.1080/09553002.2023.2187456",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Space Biology Research Dashboard
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Search and explore NASA's space biology experiments. Find organisms,
            papers, and insights from decades of research.
          </p>
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
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/50"
              >
                Search Experiments
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
            onClick={() => setActiveTab("organisms")}
            className={`px-6 py-3 font-semibold rounded-lg transition-all ${
              activeTab === "organisms"
                ? "bg-cyan-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Organisms ({sampleOrganisms.length})
          </button>
          <button
            onClick={() => setActiveTab("papers")}
            className={`px-6 py-3 font-semibold rounded-lg transition-all ${
              activeTab === "papers"
                ? "bg-cyan-500 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Papers ({samplePapers.length})
          </button>
        </div>

        {/* Results */}
        <div className="pb-12">
          {activeTab === "organisms" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleOrganisms.map((organism) => (
                <div
                  key={organism.id}
                  className="bg-white/5 backdrop-blur-md rounded-xl border-2 border-white/10 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all p-6 group cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      {organism.category === "Plant" ? (
                        <Leaf className="w-8 h-8 text-green-400" />
                      ) : organism.category === "Microbe" ? (
                        <Microscope className="w-8 h-8 text-blue-400" />
                      ) : (
                        <FileText className="w-8 h-8 text-purple-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                        {organism.name}
                      </h3>
                      <p className="text-sm text-gray-400 italic mb-2">
                        {organism.commonName}
                      </p>
                      <p className="text-sm text-gray-300 line-clamp-3 mb-3">
                        {organism.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full font-medium border border-cyan-400/30">
                            {organism.category}
                          </span>
                          <span className="text-gray-400">
                            {organism.experimentCount} experiments
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {organism.conditions
                            .slice(0, 3)
                            .map((condition, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-md"
                              >
                                {condition}
                              </span>
                            ))}
                          {organism.conditions.length > 3 && (
                            <span className="px-2 py-1 bg-white/10 text-gray-400 text-xs rounded-md">
                              +{organism.conditions.length - 3} more
                            </span>
                          )}
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
              {samplePapers.map((paper) => (
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

                  <div className="mb-4 p-3 bg-cyan-500/10 rounded-lg border border-cyan-400/30">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-cyan-400">
                        AI Summary:
                      </span>{" "}
                      {paper.summary}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">
                        {paper.authors.slice(0, 3).join(", ")}
                        {paper.authors.length > 3 ? " et al." : ""}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{paper.year}</span>
                      <span className="ml-2">• {paper.journal}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.conditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-xs font-medium rounded-full border border-cyan-400/30"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-cyan-400 mb-1">
                      Key Findings:
                    </p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {paper.keyFindings.slice(0, 2).map((finding, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-cyan-400 mr-2">•</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                      View Details
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </button>
                    <span className="text-xs text-gray-500">
                      DOI: {paper.doi}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
