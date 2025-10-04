import { useState, useEffect } from "react";
import { OrganismCard } from "../components/OrganismCard";
import { PaperCard } from "../components/PaperCard";
import { FilterPanel } from "../components/FilterPanel";
import { PaperDetailModal } from "../components/PaperDetailModal";
import { mockAPI } from "../lib/mockData";
import { Organism, Paper, ExperimentWithDetails } from "../lib/types";
import { Loader2, AlertCircle } from "lucide-react";

interface ExplorePageProps {
  searchQuery?: string;
}

export function ExplorePage({ searchQuery }: ExplorePageProps) {
  const [organisms, setOrganisms] = useState<Organism[]>([]);
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(
    null
  );
  const [experiments, setExperiments] = useState<ExperimentWithDetails[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<{
    paper: Paper;
    conditions: string[];
    keyResults: string | null;
  } | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrganisms();
  }, [searchQuery]);

  useEffect(() => {
    if (selectedOrganism) {
      loadExperiments();
    }
  }, [selectedOrganism, selectedConditions]);

  const loadOrganisms = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await mockAPI.getOrganisms(
        searchQuery
      );

      if (fetchError) throw fetchError;
      setOrganisms(data || []);

      if (data && data.length === 1) {
        setSelectedOrganism(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load organisms");
    } finally {
      setLoading(false);
    }
  };

  const loadExperiments = async () => {
    if (!selectedOrganism) return;

    setLoading(true);
    try {
      const { data, error: fetchError } = await mockAPI.getExperiments(
        selectedOrganism.id,
        selectedConditions
      );

      if (fetchError) throw fetchError;
      setExperiments(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load experiments"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOrganismClick = (organism: Organism) => {
    setSelectedOrganism(organism);
    setSelectedConditions([]);
  };

  const handleBackToOrganisms = () => {
    setSelectedOrganism(null);
    setExperiments([]);
    setSelectedConditions([]);
  };

  const handlePaperClick = (experiment: ExperimentWithDetails) => {
    setSelectedPaper({
      paper: experiment.papers,
      conditions: experiment.conditions,
      keyResults: experiment.key_results,
    });
  };

  if (loading && organisms.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading organisms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (organisms.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              No Organisms Found
            </h2>
            <p className="text-gray-300 mb-6">
              {searchQuery
                ? `No organisms found matching "${searchQuery}". Try a different search term.`
                : "No organisms available yet. Sample data will be added soon."}
            </p>
            <button
              onClick={() => window.history.pushState({}, "", "/")}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedOrganism ? (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "All Organisms"}
              </h1>
              <p className="text-gray-300">
                {organisms.length} organism{organisms.length !== 1 ? "s" : ""}{" "}
                found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organisms.map((organism) => (
                <OrganismCard
                  key={organism.id}
                  organism={organism}
                  onClick={handleOrganismClick}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={handleBackToOrganisms}
              className="mb-6 text-cyan-400 hover:text-cyan-300 font-medium"
            >
              ← Back to organisms
            </button>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {selectedOrganism.name}
              </h1>
              {selectedOrganism.scientific_name && (
                <p className="text-lg text-gray-400 italic mb-2">
                  {selectedOrganism.scientific_name}
                </p>
              )}
              {selectedOrganism.description && (
                <p className="text-gray-300 mb-4">
                  {selectedOrganism.description}
                </p>
              )}
              <div className="flex items-center space-x-4">
                <span className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg font-medium border border-cyan-400/30">
                  {selectedOrganism.category.replace("_", " ")}
                </span>
                <span className="text-gray-300">
                  {experiments.length} experiment
                  {experiments.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <FilterPanel
                  selectedConditions={selectedConditions}
                  onConditionsChange={setSelectedConditions}
                />
              </div>

              <div className="lg:col-span-3">
                {loading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-300">Loading experiments...</p>
                  </div>
                ) : experiments.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      No Experiments Found
                    </h3>
                    <p className="text-gray-300">
                      {selectedConditions.length > 0
                        ? "Try removing some filters to see more results."
                        : "No experiments available for this organism yet."}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {experiments.map((experiment) => (
                      <PaperCard
                        key={experiment.id}
                        paper={experiment.papers}
                        conditions={experiment.conditions}
                        onClick={() => handlePaperClick(experiment)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedPaper && (
        <PaperDetailModal
          paper={selectedPaper.paper}
          conditions={selectedPaper.conditions}
          keyResults={selectedPaper.keyResults || undefined}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </div>
  );
}
