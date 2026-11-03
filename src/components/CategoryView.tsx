import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowLeft, Flame, Sparkles, Check, Film } from 'lucide-react';
import { Movie, MovieCategory, ViewRoute } from '../types/movie';
import { MovieCard } from './MovieCard';
import { navigateTo } from '../utils/storage';

interface CategoryViewProps {
  route: ViewRoute;
  allMovies: Movie[];
  myList: string[];
  likedList: string[];
  onToggleList: (id: string) => void;
  onToggleLike: (id: string) => void;
  onPlay: (movie: Movie) => void;
  onOpenDownload: (movie: Movie) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  route,
  allMovies,
  myList,
  likedList,
  onToggleList,
  onToggleLike,
  onPlay,
  onOpenDownload,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedQuality, setSelectedQuality] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'year' | 'rating'>('match');

  // Compute title & base filtered movies
  const { title, subtitle, baseMovies } = useMemo(() => {
    if (route.type === 'category') {
      return {
        title: route.category,
        subtitle: `All ${route.category} Movies & Series on FilmyZilla`,
        baseMovies: allMovies.filter((m) => m.category === route.category),
      };
    }
    if (route.type === 'top10') {
      return {
        title: 'Top 10 Blockbusters Today',
        subtitle: 'Most watched movies across India & global Hindi audiences',
        baseMovies: allMovies.filter((m) => m.top10Rank !== undefined).sort((a, b) => (a.top10Rank || 99) - (b.top10Rank || 99)),
      };
    }
    if (route.type === 'my-list') {
      return {
        title: 'My List',
        subtitle: 'Your saved movies and web series',
        baseMovies: allMovies.filter((m) => myList.includes(m.id)),
      };
    }
    return { title: 'Movies', subtitle: '', baseMovies: allMovies };
  }, [route, allMovies, myList]);

  // Extract distinct genres for filters
  const genres = useMemo(() => {
    const set = new Set<string>();
    baseMovies.forEach((m) => m.genres.forEach((g) => set.add(g)));
    return ['All', ...Array.from(set)];
  }, [baseMovies]);

  // Apply genre, quality, and sort
  const filteredMovies = useMemo(() => {
    let result = [...baseMovies];

    if (selectedGenre !== 'All') {
      result = result.filter((m) => m.genres.includes(selectedGenre));
    }

    if (selectedQuality !== 'All') {
      result = result.filter((m) => m.quality.toLowerCase().includes(selectedQuality.toLowerCase()));
    }

    if (sortBy === 'match') {
      result.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'year') {
      result.sort((a, b) => b.year - a.year);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    }

    return result;
  }, [baseMovies, selectedGenre, selectedQuality, sortBy]);

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-24 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back and Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <button
              onClick={() => navigateTo({ type: 'home' })}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Browse</span>
            </button>
            <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide text-white flex items-center gap-3">
              <span>{title}</span>
              <span className="text-sm font-sans font-normal text-zinc-400 border border-zinc-700 bg-zinc-900 px-2 py-0.5 rounded-full">
                {filteredMovies.length} Available
              </span>
            </h1>
            {subtitle && <p className="text-xs sm:text-sm text-zinc-400">{subtitle}</p>}
          </div>

          {/* Controls: Sort and Filter */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Quality Filter */}
            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-700 rounded-md p-1">
              {['All', '4K', '1080p', 'HD'].map((q) => (
                <button
                  key={q}
                  onClick={() => setSelectedQuality(q)}
                  className={`px-2.5 py-1 rounded transition-colors font-medium ${
                    selectedQuality === q
                      ? 'bg-[#E50914] text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-[#E50914] cursor-pointer"
            >
              <option value="match">Sort: Match %</option>
              <option value="year">Sort: Newest Year</option>
              <option value="rating">Sort: High Rating</option>
            </select>
          </div>
        </div>

        {/* Genre Filter Pills */}
        {genres.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
            <span className="text-zinc-500 font-semibold mr-1 flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Genres:
            </span>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border text-xs ${
                  selectedGenre === genre
                    ? 'bg-white text-black font-bold border-white'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border-zinc-800'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        )}

        {/* Grid Display */}
        {filteredMovies.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No movies found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {route.type === 'my-list'
                ? "You haven't added any movies to your list yet. Browse and click the '+' icon on any movie to save it here!"
                : 'No movies match the selected filters. Try choosing different genres or resolutions.'}
            </p>
            <button
              onClick={() => {
                setSelectedGenre('All');
                setSelectedQuality('All');
                if (route.type === 'my-list') navigateTo({ type: 'home' });
              }}
              className="px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-md"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 pt-2">
            {filteredMovies.map((movie, idx) => (
              <div key={movie.id} className="relative group">
                <MovieCard
                  movie={movie}
                  top10Index={route.type === 'top10' ? idx + 1 : undefined}
                  isInList={myList.includes(movie.id)}
                  isLiked={likedList.includes(movie.id)}
                  onToggleList={() => onToggleList(movie.id)}
                  onToggleLike={() => onToggleLike(movie.id)}
                  onPlay={onPlay}
                  onOpenDownload={onOpenDownload}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
