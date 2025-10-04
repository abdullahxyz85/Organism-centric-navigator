import {
  Organism,
  Paper,
  Experiment,
  Condition,
  ExperimentWithDetails,
} from "./types";

// Mock data for organisms
export const mockOrganisms: Organism[] = [
  {
    id: "1",
    name: "Arabidopsis thaliana",
    common_name: "Thale cress",
    scientific_name: "Arabidopsis thaliana",
    synonyms: ["Mouse-ear cress", "Thale cress"],
    category: "plant",
    description:
      "A small flowering plant native to Eurasia and Africa. Widely used as a model organism in plant biology and genetics research.",
    image_url: null,
    experiment_count: 24,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Escherichia coli",
    common_name: "E. coli",
    scientific_name: "Escherichia coli",
    synonyms: ["E. coli"],
    category: "microbe",
    description:
      "A gram-negative bacterium commonly found in the lower intestine of warm-blooded organisms. Extensively used in molecular biology research.",
    image_url: null,
    experiment_count: 18,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Saccharomyces cerevisiae",
    common_name: "Baker's yeast",
    scientific_name: "Saccharomyces cerevisiae",
    synonyms: ["Brewer's yeast", "Baker's yeast"],
    category: "microbe",
    description:
      "A species of yeast used in baking and brewing, and as a model organism in molecular and cell biology research.",
    image_url: null,
    experiment_count: 15,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Human cell cultures",
    common_name: "Human cells",
    scientific_name: "Homo sapiens",
    synonyms: ["Human cells", "Human tissue"],
    category: "human_cells",
    description:
      "Various human cell lines used to study the effects of space conditions on human physiology and cellular processes.",
    image_url: null,
    experiment_count: 32,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Caenorhabditis elegans",
    common_name: "Roundworm",
    scientific_name: "Caenorhabditis elegans",
    synonyms: ["C. elegans", "Nematode"],
    category: "animal",
    description:
      "A free-living transparent nematode widely used as a model organism for studying genetics, development, and neurobiology.",
    image_url: null,
    experiment_count: 12,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    name: "Drosophila melanogaster",
    common_name: "Fruit fly",
    scientific_name: "Drosophila melanogaster",
    synonyms: ["Fruit fly", "Vinegar fly"],
    category: "animal",
    description:
      "A species of fly widely used in biological research, particularly in genetics and developmental biology studies.",
    image_url: null,
    experiment_count: 8,
    created_at: "2024-01-01T00:00:00Z",
  },
];

// Mock data for papers
export const mockPapers: Paper[] = [
  {
    id: "1",
    title:
      "Effects of Microgravity on Arabidopsis Root Development and Gene Expression",
    authors: ["Smith, J.A.", "Johnson, M.B.", "Williams, C.D."],
    publication_date: "2023-08-15",
    journal: "Plant Space Biology Journal",
    doi: "10.1234/psb.2023.001",
    abstract:
      "This study investigates the impact of microgravity conditions on root development patterns and gene expression profiles in Arabidopsis thaliana.",
    pdf_url: "https://example.com/paper1.pdf",
    summary:
      "Microgravity significantly altered root gravitropism and affected expression of over 200 genes involved in cell wall modification and stress response pathways.",
    key_findings: [
      "Root gravitropism was completely eliminated in microgravity conditions",
      "Cell wall-related genes showed 3-fold upregulation",
      "Stress response pathways were activated within 24 hours",
    ],
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Radiation Tolerance Mechanisms in E. coli During Space Flight",
    authors: ["Anderson, K.L.", "Brown, T.M.", "Davis, R.N."],
    publication_date: "2023-06-20",
    journal: "Microbiology in Space",
    doi: "10.1234/mis.2023.015",
    abstract:
      "Investigation of DNA repair mechanisms and radiation tolerance in E. coli exposed to cosmic radiation during a 6-month ISS mission.",
    pdf_url: "https://example.com/paper2.pdf",
    summary:
      "E. coli demonstrated enhanced DNA repair capabilities and developed novel stress response mechanisms when exposed to cosmic radiation.",
    key_findings: [
      "Enhanced expression of DNA repair genes by 400%",
      "Novel protein complexes formed for radiation protection",
      "Survival rates improved 50% compared to ground controls",
    ],
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    title:
      "Cellular Metabolism Changes in Human Tissue Cultures in Microgravity",
    authors: ["Wilson, S.R.", "Martinez, A.C.", "Taylor, J.K."],
    publication_date: "2023-09-10",
    journal: "Human Space Medicine",
    doi: "10.1234/hsm.2023.008",
    abstract:
      "Comprehensive analysis of metabolic pathway alterations in human cell cultures exposed to simulated and actual microgravity conditions.",
    pdf_url: "https://example.com/paper3.pdf",
    summary:
      "Human cells showed significant metabolic reprogramming with increased glycolysis and altered mitochondrial function in microgravity.",
    key_findings: [
      "Glycolytic flux increased by 60% in microgravity",
      "Mitochondrial respiration efficiency decreased by 25%",
      "Calcium signaling pathways were disrupted",
      "Cell cycle progression was delayed in G1/S transition",
    ],
    created_at: "2024-01-01T00:00:00Z",
  },
];

// Mock data for conditions
export const mockConditions: Condition[] = [
  {
    id: "1",
    name: "Microgravity",
    category: "gravity",
    description: "Reduced gravitational force environment",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Cosmic Radiation",
    category: "radiation",
    description: "Exposure to high-energy cosmic particles",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Temperature Variation",
    category: "temperature",
    description: "Extreme temperature fluctuations",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Vacuum Exposure",
    category: "atmosphere",
    description: "Exposure to space vacuum conditions",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "5",
    name: "Magnetic Field Changes",
    category: "magnetic",
    description: "Altered magnetic field environment",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "6",
    name: "Isolation Stress",
    category: "psychological",
    description: "Stress from isolation and confinement",
    created_at: "2024-01-01T00:00:00Z",
  },
];

// Mock data for experiments
export const mockExperiments: Experiment[] = [
  {
    id: "1",
    paper_id: "1",
    organism_id: "1",
    conditions: ["Microgravity", "Temperature Variation"],
    duration_days: 30,
    key_results:
      "Significant changes in root development patterns with complete loss of gravitropism and altered gene expression profiles.",
    metrics: { survival_rate: 95, growth_rate: 0.8 },
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    paper_id: "2",
    organism_id: "2",
    conditions: ["Cosmic Radiation", "Microgravity"],
    duration_days: 180,
    key_results:
      "Enhanced DNA repair mechanisms and improved radiation tolerance compared to ground controls.",
    metrics: { survival_rate: 88, mutation_rate: 0.12 },
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    paper_id: "3",
    organism_id: "4",
    conditions: ["Microgravity", "Magnetic Field Changes"],
    duration_days: 14,
    key_results:
      "Metabolic reprogramming with increased glycolysis and altered mitochondrial function.",
    metrics: { viability: 92, metabolic_activity: 1.6 },
    created_at: "2024-01-01T00:00:00Z",
  },
];

// Mock API functions to replace Supabase calls
export const mockAPI = {
  // Expose mock data for direct access if needed
  mockPapers,
  mockOrganisms,
  mockConditions,
  mockExperiments,

  // Get organisms with optional search
  getOrganisms: async (
    searchQuery?: string
  ): Promise<{ data: Organism[] | null; error: any }> => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

    let data = mockOrganisms;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = mockOrganisms.filter(
        (organism) =>
          organism.name.toLowerCase().includes(query) ||
          (organism.common_name &&
            organism.common_name.toLowerCase().includes(query)) ||
          (organism.scientific_name &&
            organism.scientific_name.toLowerCase().includes(query)) ||
          organism.synonyms.some((synonym) =>
            synonym.toLowerCase().includes(query)
          )
      );
    }

    return {
      data: data.sort((a, b) => b.experiment_count - a.experiment_count),
      error: null,
    };
  },

  // Get experiments for an organism with optional condition filtering
  getExperiments: async (
    organismId: string,
    selectedConditions: string[] = []
  ): Promise<{ data: ExperimentWithDetails[] | null; error: any }> => {
    await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate network delay

    let experiments = mockExperiments.filter(
      (exp) => exp.organism_id === organismId
    );

    if (selectedConditions.length > 0) {
      experiments = experiments.filter((exp) =>
        selectedConditions.some((condition) =>
          exp.conditions.includes(condition)
        )
      );
    }

    const experimentsWithDetails: ExperimentWithDetails[] = experiments.map(
      (exp) => {
        const paper = mockPapers.find((p) => p.id === exp.paper_id);
        return {
          id: exp.id,
          paper_id: exp.paper_id!,
          organism_id: exp.organism_id!,
          conditions: exp.conditions,
          key_results: exp.key_results,
          papers: paper!,
        };
      }
    );

    return { data: experimentsWithDetails, error: null };
  },

  // Get all conditions
  getConditions: async (): Promise<{
    data: { name: string }[] | null;
    error: any;
  }> => {
    await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate network delay

    const conditions = mockConditions.map((c) => ({ name: c.name }));
    return {
      data: conditions.sort((a, b) => a.name.localeCompare(b.name)),
      error: null,
    };
  },
};
