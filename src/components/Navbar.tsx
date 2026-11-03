import React, { useState, useEffect } from 'react';
import { Search, Bell, Download, PlusCircle, Film, Sparkles, ChevronDown, Check, Menu, X, ArrowLeft } from 'lucide-react';
import { ViewRoute, MovieCategory } from '../types/movie';
import { navigateTo } from '../utils/storage';

interface NavbarProps {
  currentRoute: ViewRoute;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  myListCount: number;
  onOpenUpload: () => void;
  onOpenZipExport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  searchQuery,
  setSearchQuery,
  myListCount,
  onOpenUpload,
  onOpenZipExport,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; route: ViewRoute }[] = [
    { label: 'Home', route: { type: 'home' } },
    { label: 'Bollywood', route: { type: 'category', category: 'Bollywood' } },
    { label: 'South Hindi Dubbed', route: { type: 'category', category: 'South Hindi Dubbed' } },
    { label: 'Hollywood Dubbed', route: { type: 'category', category: 'Hollywood Dubbed' } },
    { label: 'Web Series', route: { type: 'category', category: 'Web Series' } },
    { label: '300MB Mobile', route: { type: 'category', category: '300MB Movies' } },
    { label: 'Top 10', route: { type: 'top10' } },
    { label: 'My List', route: { type: 'my-list' } },
  ];

  const isCurrentActive = (linkRoute: ViewRoute) => {
    if (linkRoute.type === currentRoute.type) {
      if (linkRoute.type === 'category' && currentRoute.type === 'category') {
        return linkRoute.category === currentRoute.category;
      }
      return true;
    }
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled || mobileMenuOpen
          ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl border-b border-white/5'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Logo */}
          <button
            onClick={() => {
              setSearchQuery('');
              navigateTo({ type: 'home' });
            }}
            className="group flex items-center gap-2 focus:outline-none text-left"
            title="FilmyZilla - Home"
          >
            <span className="font-bebas text-3xl sm:text-4xl tracking-wider text-[#E50914] drop-shadow-[0_2px_10px_rgba(229,9,20,0.5)] group-hover:scale-105 transition-transform">
              FILMYZILLA
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-zinc-400 border border-zinc-700 rounded px-1.5 py-0.5 ml-0.5">
              Netflix UI
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium">
            {navLinks.map((link, idx) => {
              const active = isCurrentActive(link.route);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchQuery('');
                    navigateTo(link.route);
                  }}
                  className={`transition-colors py-1 ${
                    active
                      ? 'text-white font-bold border-b-2 border-[#E50914]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {link.label}
                  {link.label === 'My List' && myListCount > 0 && (
                    <span className="ml-1.5 bg-[#E50914] text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                      {myListCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <div className="flex items-center bg-black/80 border border-zinc-700 rounded-md overflow-hidden transition-all duration-300 w-44 sm:w-64 md:w-72">
                <Search className="w-4 h-4 text-zinc-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, actors, genres..."
                  autoFocus
                  className="w-full bg-transparent text-xs sm:text-sm text-white px-2 py-1.5 focus:outline-none placeholder:text-zinc-500"
                />
                <button
                  onClick={() => {
                    if (searchQuery) {
                      setSearchQuery('');
                    } else {
                      setSearchOpen(false);
                    }
                  }}
                  className="p-1.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-zinc-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Search movies"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Upload Movie Button */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-700 rounded-md transition-all active:scale-95 shadow-sm"
            title="Upload/Import new movie to FilmyZilla"
          >
            <PlusCircle className="w-4 h-4 text-[#E50914]" />
            <span className="hidden md:inline">Upload Movie</span>
          </button>

          {/* Download GitHub Zip Button */}
          <button
            onClick={onOpenZipExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-white bg-[#E50914] hover:bg-[#b80710] rounded-md shadow-lg shadow-red-950/40 transition-all active:scale-95"
            title="Download full project ZIP to upload on GitHub"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub ZIP</span>
          </button>

          {/* Profile / Avatar */}
          <div className="relative group cursor-pointer pl-1">
            <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center font-bold text-sm shadow-md ring-1 ring-white/20">
              FZ
            </div>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-zinc-300 hover:text-white rounded-md"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#141414] border-b border-zinc-800 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link, idx) => {
            const active = isCurrentActive(link.route);
            return (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery('');
                  setMobileMenuOpen(false);
                  navigateTo(link.route);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium flex items-center justify-between ${
                  active
                    ? 'bg-[#E50914] text-white font-bold'
                    : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                {link.label === 'My List' && myListCount > 0 && (
                  <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">
                    {myListCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
