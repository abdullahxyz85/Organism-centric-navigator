import { Rocket } from 'lucide-react';
import { Link } from './Link';

export function Header() {
  return (
    <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Rocket className="w-8 h-8 text-cyan-400" />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white">Space Biology Navigator</span>
              <span className="text-xs text-cyan-300">NASA Bioscience Research</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <Link href="/explore" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Explore
            </Link>
            <Link href="/organisms" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Organisms
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
