import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
              ChurnPredictor
            </span>
          </div>
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                About
              </a>
              <Link to="/login" className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile menu */}
      {isMenuOpen && <div className="md:hidden bg-gray-900 bg-opacity-95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <a href="#features" className="block px-3 py-2 text-gray-300 hover:text-white">
              Features
            </a>
            <Link to="/dashboard" className="block px-3 py-2 text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
              Dashboard
            </Link>
            <a href="#" className="block px-3 py-2 text-gray-300 hover:text-white">
              About
            </a>
            <Link to="/login" className="mt-2 w-full inline-block text-center bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Get Started
            </Link>
          </div>
        </div>}
    </header>;
}