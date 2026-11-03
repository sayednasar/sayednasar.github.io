import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, ViewRoute } from '../types/movie';
import { MovieCard } from './MovieCard';
import { navigateTo } from '../utils/storage';

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  isTop10?: boolean;
  categoryRoute?: ViewRoute;
  myList: string[];
  likedList?: string[];
  onToggleList: (id: string) => void;
  onToggleLike?: (id: string) => void;
  onPlay: (movie: Movie) => void;
  onOpenDownload: (movie: Movie) => void;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  subtitle,
  movies,
  isTop10 = false,
  categoryRoute,
  myList,
  likedList = [],
  onToggleList,
  onToggleLike,
  onPlay,
  onOpenDownload,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative my-6 sm:my-8 px-4 sm:px-6 lg:px-8 space-y-2 group/row">
      {/* Row Header */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <h2
            onClick={() => categoryRoute && navigateTo(categoryRoute)}
            className={`font-bebas text-2xl sm:text-3xl tracking-wide text-zinc-100 flex items-center gap-2 ${
              categoryRoute ? 'cursor-pointer hover:text-white transition-colors' : ''
            }`}
          >
            <span>{title}</span>
            {categoryRoute && (
              <span className="text-xs font-sans font-semibold text-[#E50914] opacity-0 group-hover/row:opacity-100 transition-opacity">
                Explore All &gt;
              </span>
            )}
          </h2>
          {subtitle && (
            <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
              ({subtitle})
            </span>
          )}
        </div>
        <span className="text-xs font-semibold text-zinc-500">
          {movies.length} movies
        </span>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Scroll Chevron */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all rounded-r-md cursor-pointer hover:scale-105"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1"
        >
          {movies.map((movie, idx) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              top10Index={isTop10 ? idx + 1 : undefined}
              isInList={myList.includes(movie.id)}
              isLiked={likedList.includes(movie.id)}
              onToggleList={() => onToggleList(movie.id)}
              onToggleLike={onToggleLike ? () => onToggleLike(movie.id) : undefined}
              onPlay={onPlay}
              onOpenDownload={onOpenDownload}
            />
          ))}
        </div>

        {/* Right Scroll Chevron */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-40 w-10 sm:w-12 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all rounded-l-md cursor-pointer hover:scale-105"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>
    </div>
  );
};
