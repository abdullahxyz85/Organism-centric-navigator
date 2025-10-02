import { Search, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { RotatingEarth } from './RotatingEarth';

interface HeroProps {
  onSearch: (query: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <div className="flex items-center mb-4">
              <Sparkles className="w-10 h-10 text-cyan-400 mr-3" />
              <h1 className="text-5xl font-bold text-white">
                Explore NASA Space Biology
              </h1>
            </div>

            <p className="mt-4 text-xl text-gray-300 leading-relaxed">
              Discover decades of space biology experiments. Search by organism, explore conditions like microgravity and radiation, and uncover insights from NASA's bioscience research.
            </p>

            <form onSubmit={handleSubmit} className="mt-10">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for an organism (e.g., Arabidopsis, E. coli)..."
                  className="w-full pl-12 pr-4 py-4 text-lg bg-white/10 backdrop-blur-md border-2 border-white/20 text-white placeholder-gray-400 rounded-xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                className="mt-4 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/50"
              >
                Search Experiments
              </button>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="text-sm text-gray-400">Popular:</span>
              {['Arabidopsis', 'E. coli', 'Saccharomyces', 'Human cells', 'C. elegans'].map((org) => (
                <button
                  key={org}
                  onClick={() => onSearch(org)}
                  className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                >
                  {org}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <RotatingEarth />
          </div>
        </div>
      </div>
    </div>
  );
}
