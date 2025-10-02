/*
  # Space Biology Navigator Database Schema

  ## Overview
  Creates a comprehensive database schema for NASA space biology experiments navigator,
  enabling users to search and explore organism-centric space research data.

  ## New Tables

  ### `organisms`
  Stores information about biological organisms studied in space
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Primary organism name
  - `common_name` (text) - Common/popular name
  - `scientific_name` (text) - Scientific taxonomic name
  - `synonyms` (text[]) - Alternative names for search
  - `category` (text) - Type: plant, microbe, animal, human_cells
  - `description` (text) - Brief description
  - `image_url` (text) - Organism image URL
  - `experiment_count` (integer) - Number of related experiments
  - `created_at` (timestamptz) - Record creation timestamp

  ### `papers`
  Stores NASA space biology publications
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Paper title
  - `authors` (text[]) - List of authors
  - `publication_date` (date) - Publication date
  - `journal` (text) - Journal name
  - `doi` (text) - Digital Object Identifier
  - `abstract` (text) - Paper abstract
  - `pdf_url` (text) - Link to full PDF
  - `summary` (text) - AI-generated summary
  - `key_findings` (text[]) - Extracted key findings
  - `created_at` (timestamptz) - Record creation timestamp

  ### `experiments`
  Links organisms to papers with experimental details
  - `id` (uuid, primary key) - Unique identifier
  - `paper_id` (uuid, foreign key) - Reference to paper
  - `organism_id` (uuid, foreign key) - Reference to organism
  - `conditions` (text[]) - Experimental conditions (microgravity, radiation, etc.)
  - `duration_days` (integer) - Experiment duration
  - `key_results` (text) - Main experimental results
  - `metrics` (jsonb) - Quantitative metrics and data
  - `created_at` (timestamptz) - Record creation timestamp

  ### `conditions`
  Catalog of experimental conditions for filtering
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, unique) - Condition name
  - `category` (text) - Category: environmental, physical, chemical
  - `description` (text) - Condition description
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Allow public read access for all tables (this is a public research database)
  - Restrict write access to authenticated users only

  ## Indexes
  - Full-text search indexes on organisms and papers
  - Performance indexes on foreign keys
  - Array search indexes for conditions and synonyms
*/

-- Create organisms table
CREATE TABLE IF NOT EXISTS organisms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  common_name text,
  scientific_name text,
  synonyms text[] DEFAULT '{}',
  category text NOT NULL,
  description text,
  image_url text,
  experiment_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create papers table
CREATE TABLE IF NOT EXISTS papers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  authors text[] DEFAULT '{}',
  publication_date date,
  journal text,
  doi text,
  abstract text,
  pdf_url text,
  summary text,
  key_findings text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create conditions table
CREATE TABLE IF NOT EXISTS conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  category text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create experiments table (junction table with additional data)
CREATE TABLE IF NOT EXISTS experiments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id uuid REFERENCES papers(id) ON DELETE CASCADE,
  organism_id uuid REFERENCES organisms(id) ON DELETE CASCADE,
  conditions text[] DEFAULT '{}',
  duration_days integer,
  key_results text,
  metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_experiments_paper ON experiments(paper_id);
CREATE INDEX IF NOT EXISTS idx_experiments_organism ON experiments(organism_id);
CREATE INDEX IF NOT EXISTS idx_experiments_conditions ON experiments USING gin(conditions);
CREATE INDEX IF NOT EXISTS idx_organisms_synonyms ON organisms USING gin(synonyms);
CREATE INDEX IF NOT EXISTS idx_organisms_category ON organisms(category);
CREATE INDEX IF NOT EXISTS idx_papers_date ON papers(publication_date DESC);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_organisms_name_search ON organisms USING gin(to_tsvector('english', name || ' ' || COALESCE(common_name, '') || ' ' || COALESCE(scientific_name, '')));
CREATE INDEX IF NOT EXISTS idx_papers_title_search ON papers USING gin(to_tsvector('english', title || ' ' || COALESCE(abstract, '')));

-- Enable Row Level Security
ALTER TABLE organisms ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditions ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view organisms"
  ON organisms FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view papers"
  ON papers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view experiments"
  ON experiments FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view conditions"
  ON conditions FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for authenticated write access
CREATE POLICY "Authenticated users can insert organisms"
  ON organisms FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert papers"
  ON papers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert experiments"
  ON experiments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert conditions"
  ON conditions FOR INSERT
  TO authenticated
  WITH CHECK (true);