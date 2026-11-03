import React from 'react';
import { Globe, Heart, Github, Download, Film } from 'lucide-react';
import { CATEGORIES } from '../data/movies';
import { navigateTo } from '../utils/storage';

interface FooterProps {
  onOpenZipExport: () => void;
  onOpenUpload: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenZipExport, onOpenUpload }) => {
  return (
    <footer className="w-full bg-[#141414] border-t border-zinc-800/80 text-zinc-500 text-xs py-12 sm:py-16 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Brand & Tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
          <div>
            <span className="font-bebas text-3xl tracking-wider text-[#E50914]">
              FILMYZILLA
            </span>
            <p className="text-xs text-zinc-400 mt-1 max-w-md">
              Watch & Download Bollywood, South Indian Hindi Dubbed, Hollywood Dual Audio Movies & Hindi Web Series with separate dedicated pages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-xs font-semibold border border-zinc-700 transition-colors"
            >
              + Upload Movie
            </button>
            <button
              onClick={onOpenZipExport}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E50914] hover:bg-[#b80710] text-white rounded text-xs font-bold transition-all shadow-md shadow-red-950/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>GitHub .ZIP</span>
            </button>
          </div>
        </div>

        {/* Quick Category Links */}
        <div>
          <h4 className="text-zinc-400 font-semibold mb-3 uppercase tracking-wider text-[11px]">
            FilmyZilla Categories
          </h4>
          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs">
            {CATEGORIES.map((cat, i) => (
              <button
                key={i}
                onClick={() => navigateTo({ type: 'category', category: cat.value })}
                className="hover:text-zinc-200 transition-colors underline-offset-4 hover:underline"
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => navigateTo({ type: 'top10' })}
              className="hover:text-zinc-200 transition-colors underline-offset-4 hover:underline"
            >
              Top 10 Blockbusters
            </button>
            <button
              onClick={() => navigateTo({ type: 'my-list' })}
              className="hover:text-zinc-200 transition-colors underline-offset-4 hover:underline"
            >
              My Saved List
            </button>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] text-zinc-500">
          <ul className="space-y-2">
            <li><a href="#/" className="hover:underline">FAQ</a></li>
            <li><a href="#/" className="hover:underline">Investor Relations</a></li>
            <li><a href="#/" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#/" className="hover:underline">Speed Test</a></li>
          </ul>
          <ul className="space-y-2">
            <li><a href="#/" className="hover:underline">Help Center</a></li>
            <li><a href="#/" className="hover:underline">Jobs</a></li>
            <li><a href="#/" className="hover:underline">Cookie Preferences</a></li>
            <li><a href="#/" className="hover:underline">Legal Notices</a></li>
          </ul>
          <ul className="space-y-2">
            <li><a href="#/" className="hover:underline">Account</a></li>
            <li><a href="#/" className="hover:underline">Ways to Watch</a></li>
            <li><a href="#/" className="hover:underline">Corporate Info</a></li>
            <li><a href="#/" className="hover:underline">Only on FilmyZilla</a></li>
          </ul>
          <ul className="space-y-2">
            <li><a href="#/" className="hover:underline">Media Center</a></li>
            <li><a href="#/" className="hover:underline">Terms of Use</a></li>
            <li><a href="#/" className="hover:underline">Contact Us</a></li>
            <li>
              <button onClick={onOpenZipExport} className="text-[#E50914] font-semibold hover:underline">
                Export to GitHub
              </button>
            </li>
          </ul>
        </div>

        {/* Language selector & Copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800/60">
          <div className="flex items-center gap-2 border border-zinc-700 bg-black/60 rounded px-2.5 py-1 text-zinc-300">
            <Globe className="w-3.5 h-3.5" />
            <select className="bg-transparent text-xs focus:outline-none cursor-pointer">
              <option className="bg-zinc-900" value="en">English (US)</option>
              <option className="bg-zinc-900" value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <p className="text-[11px] text-zinc-600">
            © {new Date().getFullYear()} FilmyZilla Entertainment Inc. All rights reserved. Netflix UI edition.
          </p>
        </div>
      </div>
    </footer>
  );
};
