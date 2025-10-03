import { Menu, X } from "lucide-react";
import { Link } from "./Link";
import { useState } from "react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity group"
          >
            {/* NASA Logo */}
            <img
              src="/nasa-logo-web-rgb.png"
              alt="NASA Logo"
              className="w-10 h-10 object-contain"
            />

            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl text-white leading-tight">
                  Astra Innovators
                </span>
                <span className="px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full">
                  2025
                </span>
              </div>
              <span className="text-xs text-cyan-300 leading-tight">
                Powered by NASA Space Apps Challenge
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/explore"
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Explore
            </Link>
            <Link
              href="/organisms"
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Organisms
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              About
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-cyan-400 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/explore"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Explore
              </Link>
              <Link
                href="/organisms"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Organisms
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
