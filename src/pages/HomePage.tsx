import { FeatureCard } from "../components/FeatureCard";
import {
  Database,
  Search,
  Filter,
  Globe,
  TrendingUp,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { RotatingEarth } from "../components/RotatingEarth";
import { Link } from "../components/Link";

interface HomePageProps {
  onSearch: (query: string) => void;
}

export function HomePage({ onSearch: _ }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="mb-8">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Explore NASA
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                    Space Biology
                  </span>
                </h1>
              </div>

              <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl text-justify">
                Discover decades of space biology experiments. Search by
                organism, explore conditions like microgravity and radiation,
                and uncover insights from NASA's bioscience research.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105"
                >
                  Start Exploring
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-semibold rounded-xl hover:border-cyan-400 hover:bg-white/20 transition-all"
                >
                  Learn More
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <span className="text-sm text-gray-400">
                  Popular organisms:
                </span>
                {[
                  "Arabidopsis",
                  "E. coli",
                  "Saccharomyces",
                  "Human cells",
                  "C. elegans",
                ].map((org) => (
                  <Link
                    key={org}
                    href="/dashboard"
                    className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    {org}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <RotatingEarth />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Why Use Space Biology Navigator?
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Access decades of NASA's space biology research in one place. Find
              experiments faster, explore relationships between organisms and
              conditions, and discover insights.
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
              icon={TrendingUp}
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

      {/* About Section */}
      <section className="py-12 lg:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-lg p-8 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  About This Project
                  <span className="block text-lg font-normal text-cyan-400 mt-2">
                    Created by Astra Innovators
                  </span>
                </h2>
                <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                  <p>
                    Space Biology Navigator was created by{" "}
                    <span className="text-cyan-400 font-semibold">
                      Astra Innovators
                    </span>{" "}
                    for the NASA Space Apps Challenge 2025 to make NASA's
                    bioscience research more accessible and discoverable.
                  </p>
                  <p>
                    Our mission is to help scientists, engineers, students, and
                    policymakers quickly find relevant information about space
                    biology experiments without manually searching through
                    hundreds of publications.
                  </p>
                  <p>
                    Built with modern web technologies and AI-powered
                    summarization, this innovative tool represents the future of
                    scientific research discovery and demonstrates our team's
                    commitment to advancing space science accessibility.
                  </p>
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center mt-8 text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                >
                  Learn more about our mission
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 border border-cyan-400/30">
                <h3 className="text-xl font-bold text-white mb-6">
                  Project Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Target Organisms</span>
                    <span className="font-bold text-cyan-400">
                      Growing Collection
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">NASA Publications</span>
                    <span className="font-bold text-cyan-400">
                      Decades of Research
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Conditions Tracked</span>
                    <span className="font-bold text-cyan-400">
                      Multiple Variables
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Research Impact</span>
                    <span className="font-bold text-cyan-400">
                      Global Scientific Community
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 lg:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The brilliant minds behind Space Biology Navigator - Team Astra
              Innovators
            </p>
          </div>

          {/* Team Cards Grid */}
          <div className="space-y-8">
            {/* First Row - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
              {/* Team Member 1 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/30 flex items-center justify-center overflow-hidden">
                  {/* Team member photo */}
                  <img
                    src="/team/Azeem.webp"
                    alt="Muhammad Azeem Azam"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Muhammad Azeem Azam
                </h3>
                <p className="text-cyan-400 text-sm font-medium mb-2">
                  AI Engineer
                </p>
                <p className="text-gray-400 text-sm">
                  Great backend developer, contributed in backend part
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/30 flex items-center justify-center overflow-hidden">
                  {/* Team member photo */}
                  <img
                    src="/team/khabab.webp"
                    alt="Khabab Akhtar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Khabab Akhtar
                </h3>
                <p className="text-cyan-400 text-sm font-medium mb-2">
                  Electronic AI Engineer
                </p>
                <p className="text-gray-400 text-sm">
                  His expertise help us in creating a good UI
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/30 flex items-center justify-center overflow-hidden">
                  {/* Team member photo */}
                  <img
                    src="/team/abdullah (2).png"
                    alt="Abdullah Jameel"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Abdullah Jameel
                </h3>
                <p className="text-cyan-400 text-sm font-medium mb-2">
                  Software Engineer
                </p>
                <p className="text-gray-400 text-sm">
                  Abdullah contributed in frontend part and created dynamic
                  slides
                </p>
              </div>
            </div>

            {/* Second Row - 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
              {/* Team Member 4 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/30 flex items-center justify-center overflow-hidden">
                  {/* Team member photo */}
                  <img
                    src="/team/fouzia.jpg"
                    alt="Fouzia Akbar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Fouzia Akbar
                </h3>
                <p className="text-cyan-400 text-sm font-medium mb-2">
                  Software Engineer
                </p>
                <p className="text-gray-400 text-sm">
                  His experticise help us in frontend as well as backend part,
                  and her communication skill with teamates.
                </p>
              </div>

              {/* Team Member 5 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/30 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for team member photo */}
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">TM5</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Nishitha Varsha
                </h3>
                <p className="text-cyan-400 text-sm font-medium mb-2">
                  Software Engineer
                </p>
                <p className="text-gray-400 text-sm">
                  Nishita help us to stay motivated like how the things we need
                  to manage, she help us how we can contributed on tasks
                </p>
              </div>

              {/* Team Member 6 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all group">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/30 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for team member photo */}
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">TM6</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Ahmad Raza
                </h3>
                <p className="text-cyan-400 text-sm font-medium mb-2">
                  Software Engineer
                </p>
                <p className="text-gray-400 text-sm">
                  Contributed in slides and Video Demo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl p-8 lg:p-16 border border-cyan-400/30">
            <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Explore Space Biology?
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Start your journey into NASA's space biology research. Search for
              an organism or browse our comprehensive collection.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105 text-lg"
            >
              Start Exploring Now
              <ArrowRight className="ml-3 w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
