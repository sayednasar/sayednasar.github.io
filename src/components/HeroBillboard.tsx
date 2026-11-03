import React from 'react';
import { Play, Info, Download, Plus, Check, Volume2, VolumeX, Flame } from 'lucide-react';
import { Movie } from '../types/movie';
import { navigateTo } from '../utils/storage';

interface HeroBillboardProps {
  movie: Movie;
  isInList: boolean;
  onToggleList: () => void;
  onPlay: (movie: Movie) => void;
  onOpenDownload: (movie: Movie) => void;
}

export const HeroBillboard: React.FC<HeroBillboardProps> = ({
  movie,
  isInList,
  onToggleList,
  onPlay,
  onOpenDownload,
}) => {
  return (
    <div className="relative w-full h-[78vh] min-h-[550px] max-h-[820px] select-none overflow-hidden bg-black">
      {/* Background Cinematic Image */}
      <img
        src={movie.backdrop}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover object-top opacity-70 scale-105 transition-transform duration-1000 ease-out"
      />

      {/* Dramatic Netflix Multidirectional Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent w-full md:w-3/4" />
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#141414]/90 to-transparent" />

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-24 z-10">
        <div className="max-w-2xl space-y-4">
          {/* FilmyZilla Exclusive Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider rounded">
              <Flame className="w-3.5 h-3.5 fill-current" />
              TOP #1 IN MOVIES TODAY
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
              {movie.matchScore}% Match
            </span>
            <span className="text-xs text-zinc-300 border border-zinc-700 bg-black/40 px-2 py-0.5 rounded font-medium">
              {movie.quality}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-bebas text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] leading-none">
            {movie.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-300">
            <span className="font-semibold text-white">{movie.year}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span className="border border-zinc-700 bg-black/40 px-1.5 py-0.5 rounded text-xs font-semibold">
              {movie.ageRating}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>{movie.duration}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span className="text-amber-400 font-semibold">{movie.audioLanguages[0]}</span>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed drop-shadow-md">
            {movie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {/* Play Button */}
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 px-6 py-2.5 sm:py-3 bg-white hover:bg-zinc-200 text-black font-bold text-sm sm:text-base rounded-md transition-all active:scale-95 shadow-xl hover:shadow-white/20"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play Now</span>
            </button>

            {/* Fast Download Button */}
            <button
              onClick={() => onOpenDownload(movie)}
              className="flex items-center gap-2 px-5 py-2.5 sm:py-3 bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-sm sm:text-base rounded-md transition-all active:scale-95 shadow-xl shadow-red-950/40"
            >
              <Download className="w-5 h-5" />
              <span>Fast Download</span>
            </button>

            {/* More Info / Details Button with URL */}
            <button
              onClick={() => navigateTo({ type: 'movie', slug: movie.slug })}
              className="flex items-center gap-2 px-5 py-2.5 sm:py-3 bg-zinc-700/80 hover:bg-zinc-600/90 text-white font-semibold text-sm sm:text-base rounded-md backdrop-blur-sm transition-all active:scale-95"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>

            {/* Add to List Button */}
            <button
              onClick={onToggleList}
              className={`p-2.5 sm:p-3 rounded-full border transition-all active:scale-95 ${
                isInList
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-black/60 hover:bg-black/80 text-white border-zinc-600'
              }`}
              title={isInList ? 'Remove from My List' : 'Add to My List'}
            >
              {isInList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
