import { Hero } from '../components/Hero';
import { FeatureCard } from '../components/FeatureCard';
import { Database, Search, Filter, Sparkles, Globe, TrendingUp } from 'lucide-react';

interface HomePageProps {
  onSearch: (query: string) => void;
}

export function HomePage({ onSearch }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <Hero onSearch={onSearch} />

      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Use Space Biology Navigator?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Access decades of NASA's space biology research in one place. Find experiments faster, explore relationships between organisms and conditions, and discover insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Search}
              title="Organism-Centric Search"
              description="Search by organism name and instantly see all related space biology experiments, papers, and summaries."
            />
            <FeatureCard
              icon={Filter}
              title="Smart Filtering"
              description="Filter experiments by conditions like microgravity, radiation, temperature, and more to find exactly what you need."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Summaries"
              description="Get quick insights with AI-generated summaries of complex research papers, saving you hours of reading."
            />
            <FeatureCard
              icon={Database}
              title="Comprehensive Database"
              description="Access a curated collection of NASA bioscience publications spanning decades of space research."
            />
            <FeatureCard
              icon={Globe}
              title="Multi-Organism Coverage"
              description="Explore research on plants, microbes, animals, and human cells studied in space environments."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Research Insights"
              description="Discover trends, compare results across experiments, and identify research gaps in space biology."
            />
          </div>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Explore?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start your journey into NASA's space biology research. Search for an organism or browse our collection.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/50"
          >
            Start Exploring
          </button>
        </div>
      </section>

      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  About This Project
                </h2>
                <p className="text-gray-300 mb-4">
                  Space Biology Navigator was created for the NASA Space Apps Challenge 2025 to make NASA's bioscience research more accessible and discoverable.
                </p>
                <p className="text-gray-300 mb-4">
                  Our mission is to help scientists, engineers, students, and policymakers quickly find relevant information about space biology experiments without manually searching through hundreds of publications.
                </p>
                <p className="text-gray-300">
                  Built with modern web technologies and AI-powered summarization, this tool represents the future of scientific research discovery.
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-8 border border-cyan-400/30">
                <h3 className="font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Organisms</span>
                    <span className="font-bold text-cyan-400">Growing</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Publications</span>
                    <span className="font-bold text-cyan-400">Expanding</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Conditions Tracked</span>
                    <span className="font-bold text-cyan-400">Multiple</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Research Span</span>
                    <span className="font-bold text-cyan-400">Decades</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
