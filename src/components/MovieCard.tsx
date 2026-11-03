import React, { useState } from 'react';
import { Play, Plus, Check, Download, ChevronRight, ThumbsUp, Star } from 'lucide-react';
import { Movie } from '../types/movie';
import { navigateTo } from '../utils/storage';

interface MovieCardProps {
  movie: Movie;
  top10Index?: number;
  isInList: boolean;
  isLiked?: boolean;
  onToggleList: () => void;
  onToggleLike?: () => void;
  onPlay: (movie: Movie) => void;
  onOpenDownload: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  top10Index,
  isInList,
  isLiked,
  onToggleList,
  onToggleLike,
  onPlay,
  onOpenDownload,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo({ type: 'movie', slug: movie.slug });
  };

  return (
    <div
      className="relative shrink-0 select-none group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* If Top 10 Row: Large Stylized Outline Number */}
      {top10Index !== undefined ? (
        <div className="flex items-end">
          <div className="font-bebas text-7xl sm:text-8xl md:text-9xl font-black text-transparent [-webkit-text-stroke:3px_#404040] select-none -mr-4 sm:-mr-6 z-0 leading-none">
            {top10Index}
          </div>
          <div
            onClick={handleOpenPage}
            className="relative z-10 w-32 sm:w-44 md:w-52 aspect-[2/3] rounded-md overflow-hidden bg-zinc-900 cursor-pointer shadow-lg transition-transform duration-300 group-hover:scale-105"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
            />
            {/* Top Quality Badge */}
            <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-[10px] font-bold text-white px-1.5 py-0.5 rounded border border-white/20">
              {movie.quality}
            </div>
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
              <span className="text-xs font-bold text-white line-clamp-1">{movie.title}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">{movie.matchScore}% Match</span>
            </div>
          </div>
        </div>
      ) : (
        /* Regular Card */
        <div
          onClick={handleOpenPage}
          className="w-36 sm:w-48 md:w-56 aspect-[16/9] sm:aspect-[16/10] rounded-md overflow-hidden bg-zinc-900 cursor-pointer shadow-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/60 relative"
        >
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Clean Overlay Badges */}
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <span className="bg-[#E50914] text-[10px] font-black uppercase text-white px-1.5 py-0.5 rounded">
              FZ
            </span>
            <span className="bg-black/75 backdrop-blur-xs text-[10px] font-bold text-zinc-200 px-1.5 py-0.5 rounded border border-white/10">
              {movie.quality}
            </span>
          </div>

          {/* Bottom title bar */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2 sm:p-2.5">
            <h4 className="text-xs sm:text-sm font-semibold text-white truncate drop-shadow">
              {movie.title}
            </h4>
            <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-0.5">
              <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
              <span>{movie.year}</span>
              <span className="text-zinc-300 font-medium truncate max-w-[90px]">{movie.audioLanguages[0]?.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Netflix Preview Card on Desktop Hover */}
      {isHovered && (
        <div
          className="hidden lg:block absolute -top-8 left-1/2 -translate-x-1/2 w-72 bg-[#181818] rounded-lg shadow-2xl shadow-black z-50 overflow-hidden border border-zinc-700/80 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card Media Preview */}
          <div
            className="relative aspect-[16/9] w-full bg-black cursor-pointer"
            onClick={handleOpenPage}
          >
            <img
              src={movie.backdrop || movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
              <span className="text-xs font-bold text-white drop-shadow truncate">{movie.title}</span>
            </div>
          </div>

          {/* Interactive Action Bar */}
          <div className="p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play Button */}
                <button
                  onClick={() => onPlay(movie)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center transition-transform active:scale-90"
                  title="Play"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>

                {/* Add to list */}
                <button
                  onClick={onToggleList}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform active:scale-90 ${
                    isInList
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-600'
                  }`}
                  title={isInList ? 'In My List' : 'Add to My List'}
                >
                  {isInList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </button>

                {/* Like / Thumbs Up */}
                {onToggleLike && (
                  <button
                    onClick={onToggleLike}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform active:scale-90 ${
                      isLiked
                        ? 'bg-[#E50914] text-white border-red-500'
                        : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-600'
                    }`}
                    title="I like this"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Fast Download */}
                <button
                  onClick={() => onOpenDownload(movie)}
                  className="w-8 h-8 rounded-full bg-[#E50914] hover:bg-[#b80710] text-white flex items-center justify-center transition-transform active:scale-90 shadow-md shadow-red-950"
                  title="Download links"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              {/* View Full Movie Page */}
              <button
                onClick={handleOpenPage}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600 flex items-center justify-center transition-transform active:scale-90"
                title="View Dedicated Movie Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Match & Details */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-400 font-bold">{movie.matchScore}% Match</span>
              <span className="border border-zinc-700 text-zinc-300 px-1 py-0.2 rounded text-[10px]">
                {movie.ageRating}
              </span>
              <span className="text-zinc-400">{movie.duration}</span>
              <span className="border border-zinc-700 text-zinc-300 px-1 py-0.2 rounded text-[10px] font-semibold">
                {movie.quality}
              </span>
            </div>

            {/* Audio Language & Genres */}
            <div className="text-[11px] text-zinc-400 line-clamp-1">
              <span className="text-zinc-300 font-medium">Audio:</span> {movie.audioLanguages.join(', ')}
            </div>
            <div className="flex flex-wrap gap-1 text-[10px] text-zinc-400">
              {movie.genres.map((g, i) => (
                <span key={i} className="hover:text-white transition-colors">
                  {g}{i < movie.genres.length - 1 ? ' •' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
