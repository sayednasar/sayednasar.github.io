import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBillboard } from './components/HeroBillboard';
import { MovieRow } from './components/MovieRow';
import { MovieDetailPage } from './components/MovieDetailPage';
import { CategoryView } from './components/CategoryView';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { DownloadModal } from './components/DownloadModal';
import { UploadMovieModal } from './components/UploadMovieModal';
import { GitHubZipModal } from './components/GitHubZipModal';
import { Footer } from './components/Footer';
import { Movie, ViewRoute } from './types/movie';
import { 
  getAllMovies, 
  getMyList, 
  toggleMyList, 
  getLikedMovies, 
  toggleLikeMovie, 
  parseCurrentRoute,
  navigateTo 
} from './utils/storage';
import { Search, Film, Sparkles, Flame, Zap, ShieldCheck } from 'lucide-react';

export default function App() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [currentRoute, setCurrentRoute] = useState<ViewRoute>({ type: 'home' });
  const [myList, setMyList] = useState<string[]>([]);
  const [likedList, setLikedList] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activePlayerMovie, setActivePlayerMovie] = useState<Movie | null>(null);
  const [activeDownloadMovie, setActiveDownloadMovie] = useState<Movie | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isZipExportOpen, setIsZipExportOpen] = useState(false);

  // Initialize data and hash listener
  useEffect(() => {
    setAllMovies(getAllMovies());
    setMyList(getMyList());
    setLikedList(getLikedMovies());
    setCurrentRoute(parseCurrentRoute());

    const handleHashChange = () => {
      const parsed = parseCurrentRoute();
      setCurrentRoute(parsed);
      if (parsed.type === 'upload') setIsUploadOpen(true);
      if (parsed.type === 'github-export') setIsZipExportOpen(true);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleToggleList = (movieId: string) => {
    const updated = toggleMyList(movieId);
    setMyList(updated);
  };

  const handleToggleLike = (movieId: string) => {
    const updated = toggleLikeMovie(movieId);
    setLikedList(updated);
  };

  const handleMovieAdded = (newMovie: Movie) => {
    setAllMovies((prev) => [newMovie, ...prev.filter((m) => m.id !== newMovie.id)]);
  };

  // Groupings for Home Carousels
  const featuredHeroMovie = useMemo(() => {
    return allMovies.find((m) => m.isFeaturedHero) || allMovies[0];
  }, [allMovies]);

  const top10Movies = useMemo(() => {
    return allMovies
      .filter((m) => m.top10Rank !== undefined)
      .sort((a, b) => (a.top10Rank || 99) - (b.top10Rank || 99))
      .slice(0, 10);
  }, [allMovies]);

  const bollywoodMovies = useMemo(() => {
    return allMovies.filter((m) => m.category === 'Bollywood');
  }, [allMovies]);

  const southHindiMovies = useMemo(() => {
    return allMovies.filter((m) => m.category === 'South Hindi Dubbed');
  }, [allMovies]);

  const hollywoodDubbedMovies = useMemo(() => {
    return allMovies.filter((m) => m.category === 'Hollywood Dubbed');
  }, [allMovies]);

  const webSeries = useMemo(() => {
    return allMovies.filter((m) => m.category === 'Web Series');
  }, [allMovies]);

  const mobile300MbMovies = useMemo(() => {
    return allMovies.filter((m) => m.category === '300MB Movies');
  }, [allMovies]);

  const punjabiMovies = useMemo(() => {
    return allMovies.filter((m) => m.category === 'Punjabi');
  }, [allMovies]);

  // Live search filtering
  const searchedMovies = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allMovies.filter((m) => {
      return (
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.genres.some((g) => g.toLowerCase().includes(q)) ||
        m.starring.some((s) => s.toLowerCase().includes(q)) ||
        m.director.toLowerCase().includes(q) ||
        m.audioLanguages.some((a) => a.toLowerCase().includes(q)) ||
        m.filmyzillaTag.toLowerCase().includes(q)
      );
    });
  }, [allMovies, searchQuery]);

  // Find movie for dedicated movie detail page
  const selectedDetailMovie = useMemo(() => {
    if (currentRoute.type === 'movie') {
      return allMovies.find((m) => m.slug === currentRoute.slug) || null;
    }
    return null;
  }, [currentRoute, allMovies]);

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col font-sans">
      {/* Sticky Top Navbar */}
      <Navbar
        currentRoute={currentRoute}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        myListCount={myList.length}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenZipExport={() => setIsZipExportOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If user is searching, show live Search Results grid */}
        {searchQuery.trim() ? (
          <div className="max-w-7xl mx-auto pt-24 pb-20 px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide text-white flex items-center gap-2">
                  <Search className="w-6 h-6 text-[#E50914]" />
                  <span>Search Results for "{searchQuery}"</span>
                </h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Found {searchedMovies.length} matching movies & series
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-zinc-400 hover:text-white underline"
              >
                Clear Search
              </button>
            </div>

            {searchedMovies.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <Film className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">No results found for "{searchQuery}"</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Try searching with different keywords, actor names, or upload this movie using the "+ Upload Movie" button.
                </p>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-4 py-2 bg-[#E50914] text-white text-xs font-bold rounded-md"
                >
                  Upload "{searchQuery}" to FilmyZilla
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {searchedMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => {
                      setSearchQuery('');
                      navigateTo({ type: 'movie', slug: movie.slug });
                    }}
                    className="group bg-zinc-900 rounded-md overflow-hidden cursor-pointer border border-zinc-800 hover:border-zinc-600 transition-all hover:scale-105"
                  >
                    <div className="aspect-[2/3] w-full bg-black relative">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-[#E50914] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                        {movie.quality}
                      </div>
                    </div>
                    <div className="p-2 space-y-1">
                      <h4 className="text-xs font-semibold text-white truncate group-hover:text-[#E50914]">
                        {movie.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>{movie.year}</span>
                        <span className="text-emerald-400 font-bold">{movie.matchScore}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Route switch */
          <>
            {/* 1. DEDICATED MOVIE PAGE (Each movie has its own URL and page!) */}
            {currentRoute.type === 'movie' && (
              selectedDetailMovie ? (
                <MovieDetailPage
                  movie={selectedDetailMovie}
                  allMovies={allMovies}
                  isInList={myList.includes(selectedDetailMovie.id)}
                  isLiked={likedList.includes(selectedDetailMovie.id)}
                  onToggleList={() => handleToggleList(selectedDetailMovie.id)}
                  onToggleLike={() => handleToggleLike(selectedDetailMovie.id)}
                  onPlay={(m) => setActivePlayerMovie(m)}
                  onOpenDownload={(m) => setActiveDownloadMovie(m)}
                />
              ) : (
                <div className="max-w-4xl mx-auto pt-32 pb-20 px-4 text-center space-y-4">
                  <h2 className="text-2xl font-bold text-white">Movie Not Found</h2>
                  <p className="text-sm text-zinc-400">
                    The requested movie URL could not be found or may have been updated.
                  </p>
                  <button
                    onClick={() => navigateTo({ type: 'home' })}
                    className="px-5 py-2.5 bg-[#E50914] text-white font-bold rounded-md text-sm"
                  >
                    Return to Homepage
                  </button>
                </div>
              )
            )}

            {/* 2. CATEGORY, TOP 10, OR MY LIST VIEWS */}
            {(currentRoute.type === 'category' || currentRoute.type === 'top10' || currentRoute.type === 'my-list') && (
              <CategoryView
                route={currentRoute}
                allMovies={allMovies}
                myList={myList}
                likedList={likedList}
                onToggleList={handleToggleList}
                onToggleLike={handleToggleLike}
                onPlay={(m) => setActivePlayerMovie(m)}
                onOpenDownload={(m) => setActiveDownloadMovie(m)}
              />
            )}

            {/* 3. HOME PAGE (NETFLIX CAROUSELS & BILLBOARD) */}
            {currentRoute.type === 'home' && (
              <div className="space-y-4 pb-16">
                {/* Hero Billboard */}
                {featuredHeroMovie && (
                  <HeroBillboard
                    movie={featuredHeroMovie}
                    isInList={myList.includes(featuredHeroMovie.id)}
                    onToggleList={() => handleToggleList(featuredHeroMovie.id)}
                    onPlay={(m) => setActivePlayerMovie(m)}
                    onOpenDownload={(m) => setActiveDownloadMovie(m)}
                  />
                )}

                {/* Carousels Rows with Negative Margin for Netflix overlap */}
                <div className="relative -mt-16 sm:-mt-24 z-20 space-y-2 sm:space-y-4">
                  {/* Row 1: Top 10 in India Today */}
                  {top10Movies.length > 0 && (
                    <MovieRow
                      title="Top 10 Blockbusters in India Today"
                      subtitle="Ranked #1 to #10"
                      movies={top10Movies}
                      isTop10={true}
                      categoryRoute={{ type: 'top10' }}
                      myList={myList}
                      likedList={likedList}
                      onToggleList={handleToggleList}
                      onToggleLike={handleToggleLike}
                      onPlay={(m) => setActivePlayerMovie(m)}
                      onOpenDownload={(m) => setActiveDownloadMovie(m)}
                    />
                  )}

                  {/* Row 2: South Indian Hindi Dubbed Blockbusters */}
                  {southHindiMovies.length > 0 && (
                    <MovieRow
                      title="South Indian Hindi Dubbed Movies"
                      subtitle="High-octane mass action cinema"
                      movies={southHindiMovies}
                      categoryRoute={{ type: 'category', category: 'South Hindi Dubbed' }}
                      myList={myList}
                      likedList={likedList}
                      onToggleList={handleToggleList}
                      onToggleLike={handleToggleLike}
                      onPlay={(m) => setActivePlayerMovie(m)}
                      onOpenDownload={(m) => setActiveDownloadMovie(m)}
                    />
                  )}

                  {/* Row 3: Latest Bollywood Blockbusters */}
                  {bollywoodMovies.length > 0 && (
                    <MovieRow
                      title="Latest Bollywood Hits & Blockbusters"
                      subtitle="2024 - 2025 releases"
                      movies={bollywoodMovies}
                      categoryRoute={{ type: 'category', category: 'Bollywood' }}
                      myList={myList}
                      likedList={likedList}
                      onToggleList={handleToggleList}
                      onToggleLike={handleToggleLike}
                      onPlay={(m) => setActivePlayerMovie(m)}
                      onOpenDownload={(m) => setActiveDownloadMovie(m)}
                    />
                  )}

                  {/* Row 4: Hollywood Hindi Dubbed & Dual Audio */}
                  {hollywoodDubbedMovies.length > 0 && (
                    <MovieRow
                      title="Hollywood Hindi Dubbed & Dual Audio"
                      subtitle="4K UHD, IMAX & Dolby Atmos"
                      movies={hollywoodDubbedMovies}
                      categoryRoute={{ type: 'category', category: 'Hollywood Dubbed' }}
                      myList={myList}
                      likedList={likedList}
                      onToggleList={handleToggleList}
                      onToggleLike={handleToggleLike}
                      onPlay={(m) => setActivePlayerMovie(m)}
                      onOpenDownload={(m) => setActiveDownloadMovie(m)}
                    />
                  )}

                  {/* Row 5: Top Hindi Web Series */}
                  {webSeries.length > 0 && (
                    <MovieRow
                      title="Binge-Worthy Hindi Web Series"
                      subtitle="Full Season Complete Packs"
                      movies={webSeries}
                      categoryRoute={{ type: 'category', category: 'Web Series' }}
                      myList={myList}
                      likedList={likedList}
                      onToggleList={handleToggleList}
                      onToggleLike={handleToggleLike}
                      onPlay={(m) => setActivePlayerMovie(m)}
                      onOpenDownload={(m) => setActiveDownloadMovie(m)}
                    />
                  )}

                  {/* Row 6: 300MB Mobile Compressed Super Fast */}
                  {mobile300MbMovies.length > 0 && (
                    <MovieRow
                      title="FilmyZilla 300MB Mobile Ultra-Compressed"
                      subtitle="Low data usage high speed downloads"
                      movies={mobile300MbMovies}
                      categoryRoute={{ type: 'category', category: '300MB Movies' }}
                      myList={myList}
                      likedList={likedList}
                      onToggleList={handleToggleList}
                      onToggleLike={handleToggleLike}
                      onPlay={(m) => setActivePlayerMovie(m)}
                      onOpenDownload={(m) => setActiveDownloadMovie(m)}
                    />
                  )}

                  {/* Row 7: Punjabi Movies */}
                  {punjabiMovies.length > 0 && (
                    <MovieRow
                      title="Punjabi Superhits & Regional Cinema"
                      subtitle="Comedy, Romance & Action"
                      movies={punjabiMovies}
                      categoryRoute={{ type: 'category', category: 'Punjabi' }}
                      myList={myList}
                      likedList={likedList}
                      onToggleList={handleToggleList}
                      onToggleLike={handleToggleLike}
                      onPlay={(m) => setActivePlayerMovie(m)}
                      onOpenDownload={(m) => setActiveDownloadMovie(m)}
                    />
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenZipExport={() => setIsZipExportOpen(true)}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Video Player Modal */}
      {activePlayerMovie && (
        <VideoPlayerModal
          movie={activePlayerMovie}
          onClose={() => setActivePlayerMovie(null)}
        />
      )}

      {/* Download Multi-Server Modal */}
      {activeDownloadMovie && (
        <DownloadModal
          movie={activeDownloadMovie}
          onClose={() => setActiveDownloadMovie(null)}
        />
      )}

      {/* Upload/Add Movie Modal */}
      {isUploadOpen && (
        <UploadMovieModal
          onClose={() => setIsUploadOpen(false)}
          onMovieAdded={handleMovieAdded}
        />
      )}

      {/* GitHub ZIP Exporter Modal */}
      {isZipExportOpen && (
        <GitHubZipModal
          onClose={() => setIsZipExportOpen(false)}
        />
      )}
    </div>
  );
}
