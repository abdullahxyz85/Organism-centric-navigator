import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { SpaceBackground } from './components/SpaceBackground';

type Page = 'home' | 'explore' | 'organisms' | 'about';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/explore') {
        setCurrentPage('explore');
      } else if (path === '/organisms') {
        setCurrentPage('organisms');
      } else if (path === '/about') {
        setCurrentPage('about');
      } else {
        setCurrentPage('home');
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('explore');
    window.history.pushState({}, '', '/explore');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onSearch={handleSearch} />;
      case 'explore':
      case 'organisms':
        return <ExplorePage searchQuery={searchQuery} />;
      case 'about':
        return (
          <div className="min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl font-bold text-white mb-6">About Space Biology Navigator</h1>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-8 space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  Space Biology Navigator is a dynamic dashboard created for the NASA Space Apps Challenge 2025.
                  Our mission is to make NASA's decades of space biology and bioscience research more accessible
                  and discoverable for scientists, engineers, students, and policymakers.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  The platform provides an organism-centric approach to exploring space biology experiments,
                  allowing users to quickly find relevant publications, understand experimental conditions,
                  and discover insights through AI-powered summaries.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Built with modern web technologies including React, TypeScript, Tailwind CSS, and Supabase,
                  this tool represents a new way to interact with scientific research data.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <HomePage onSearch={handleSearch} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <SpaceBackground />
      <Header />
      {renderPage()}
    </div>
  );
}

export default App;
