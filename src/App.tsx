import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { SearchDashboard } from "./pages/SearchDashboard";
import { SpaceBackground } from "./components/SpaceBackground";

type Page = "home" | "explore" | "dashboard" | "organisms" | "about";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/explore") {
        setCurrentPage("explore");
      } else if (path === "/dashboard") {
        setCurrentPage("dashboard");
      } else if (path === "/organisms") {
        setCurrentPage("organisms");
      } else if (path === "/about") {
        setCurrentPage("about");
      } else {
        setCurrentPage("home");
      }
    };

    handlePopState();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage("dashboard");
    window.history.pushState({}, "", "/dashboard");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onSearch={handleSearch} />;
      case "dashboard":
        return <SearchDashboard searchQuery={searchQuery} />;
      case "explore":
      case "organisms":
        return <ExplorePage searchQuery={searchQuery} />;
      case "about":
        return (
          <div className="min-h-screen py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-8 text-center">
                About Space Biology Navigator
                <span className="block text-2xl lg:text-3xl font-normal text-cyan-400 mt-2">
                  by Astra Innovators
                </span>
              </h1>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-8 lg:p-12 space-y-8">
                <div className="text-center mb-12">
                  <div className="flex items-center justify-center mb-6">
                    <img
                      src="/nasa-logo-web-rgb.png"
                      alt="NASA Logo"
                      className="w-20 h-20 object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    NASA Space Apps Challenge 2025
                  </h2>
                  <p className="text-cyan-400 font-semibold text-lg mb-4">
                    Team: Astra Innovators
                  </p>
                  <p className="text-gray-300 text-lg">
                    Built for the NASA Space Apps Challenge to revolutionize
                    access to space biology research
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      Our Mission
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Space Biology Navigator addresses a critical challenge:
                      making NASA's decades of space biology and bioscience
                      research more accessible and discoverable for scientists,
                      engineers, students, and policymakers worldwide.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Through our organism-centric approach, users can quickly
                      find relevant publications, understand experimental
                      conditions, and discover insights through AI-powered
                      summaries, saving countless hours of manual research.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      Technology Stack
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full mr-3"></div>
                        <span className="text-gray-300">
                          React & TypeScript for robust frontend
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mr-3"></div>
                        <span className="text-gray-300">
                          Tailwind CSS for responsive design
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                        <span className="text-gray-300">
                          Modern data architecture
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                        <span className="text-gray-300">
                          AI/ML for content summarization
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-8">
                  <h3 className="text-xl font-bold text-white mb-4 text-center">
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <h4 className="font-semibold text-white mb-2">
                        Smart Search
                      </h4>
                      <p className="text-sm text-gray-400">
                        Organism-centric search with intelligent filtering
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <h4 className="font-semibold text-white mb-2">
                        AI Summaries
                      </h4>
                      <p className="text-sm text-gray-400">
                        Automated research paper summarization
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <span className="text-2xl">📊</span>
                      </div>
                      <h4 className="font-semibold text-white mb-2">
                        Data Visualization
                      </h4>
                      <p className="text-sm text-gray-400">
                        Interactive charts and knowledge graphs
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-300 text-sm">
                    This project represents the future of scientific research
                    discovery, making decades of NASA research accessible to the
                    global scientific community.
                  </p>
                </div>
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
