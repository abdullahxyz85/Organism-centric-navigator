// Type definitions for the application
export interface Organism {
  id: string;
  name: string;
  common_name: string | null;
  scientific_name: string | null;
  synonyms: string[];
  category: string;
  description: string | null;
  image_url: string | null;
  experiment_count: number;
  created_at: string;
}

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  publication_date: string | null;
  journal: string | null;
  doi: string | null;
  abstract: string | null;
  pdf_url: string | null;
  summary: string | null;
  key_findings: string[];
  created_at: string;
}

export interface Experiment {
  id: string;
  paper_id: string | null;
  organism_id: string | null;
  conditions: string[];
  duration_days: number | null;
  key_results: string | null;
  metrics: Record<string, any>;
  created_at: string;
}

export interface Condition {
  id: string;
  name: string;
  category: string;
  description: string | null;
  created_at: string;
}

export interface ExperimentWithDetails {
  id: string;
  paper_id: string;
  organism_id: string;
  conditions: string[];
  key_results: string | null;
  papers: Paper;
}

// API Response Types
export interface ScientificDetails {
  classification: string;
  response_mechanisms: string[];
  experimental_findings: string;
  applications: string;
}

export interface SearchResult {
  organism_name: string;
  condition?: string;
  description: string;
  scientific_details: ScientificDetails;
  relevant_chunks: string[];
}

export interface SearchRequest {
  query: string;
  condition?: string;
}