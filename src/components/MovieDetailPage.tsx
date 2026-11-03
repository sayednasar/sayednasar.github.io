import React, { useState } from 'react';
import { 
  Play, Download, Plus, Check, Share2, ArrowLeft, Star, Clock, 
  Calendar, Film, Globe, HardDrive, CheckCircle2, ShieldAlert,
  ThumbsUp, Volume2, Copy, Sparkles, Server, ChevronRight
} from 'lucide-react';
import { Movie } from '../types/movie';
import { navigateTo } from '../utils/storage';

interface MovieDetailPageProps {
  movie: Movie;
  allMovies: Movie[];
  isInList: boolean;
  isLiked: boolean;
  onToggleList: () => void;
  onToggleLike: () => void;
  onPlay: (movie: Movie) => void;
  onOpenDownload: (movie: Movie) => void;
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({
  movie,
  allMovies,
  isInList,
  isLiked,
  onToggleList,
  onToggleLike,
  onPlay,
  onOpenDownload,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadingServer, setDownloadingServer] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Recommendations: movies with same category or shared genres
  const similarMovies = allMovies
    .filter((m) => m.id !== movie.id && (m.category === movie.category || m.genres.some((g) => movie.genres.includes(g))))
    .slice(0, 6);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleStartDownload = (serverName: string, directUrl: string) => {
    setDownloadingServer(serverName);
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadingServer(null), 1200);
          // Trigger download anchor
          const link = document.createElement('a');
          link.href = directUrl;
          link.download = `${movie.slug}.mkv`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-16 sm:pt-20 pb-20 select-none">
      {/* Top Breadcrumb & Share Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-zinc-400 border-b border-zinc-800/80">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigateTo({ type: 'home' })}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </button>
          <span>/</span>
          <button
            onClick={() => navigateTo({ type: 'category', category: movie.category })}
            className="hover:text-white transition-colors"
          >
            {movie.category}
          </button>
          <span>/</span>
          <span className="text-zinc-200 font-semibold truncate max-w-[200px] sm:max-w-xs">
            {movie.title}
          </span>
        </div>

        {/* Share & Copy Direct Link */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-md text-xs font-medium border border-zinc-700 transition-colors"
            title="Copy this movie's unique URL to share"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Movie Page URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Hero Showcase */}
      <div className="relative w-full min-h-[500px] md:min-h-[580px] bg-black overflow-hidden">
        {/* Backdrop Image */}
        <img
          src={movie.backdrop || movie.poster}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105"
        />

        {/* Gradient fades */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent w-full md:w-4/5" />

        {/* Movie Info Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 flex flex-col md:flex-row items-center md:items-end gap-8 z-10">
          {/* Movie Poster */}
          <div className="w-48 sm:w-56 md:w-64 shrink-0 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-black ring-1 ring-white/10 bg-zinc-900">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Column */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            {/* Tag & Category */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                FilmyZilla Exclusive
              </span>
              <span className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded">
                {movie.matchScore}% Match
              </span>
              <span className="bg-zinc-800 text-zinc-300 text-xs font-semibold px-2 py-0.5 rounded border border-zinc-700">
                {movie.quality}
              </span>
              <span className="text-xs text-amber-400 font-bold bg-amber-950/50 border border-amber-600/30 px-2 py-0.5 rounded">
                {movie.rating}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-wide text-white drop-shadow-lg leading-tight">
              {movie.title}
            </h1>

            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                Original Title: {movie.originalTitle}
              </p>
            )}

            {/* Metadata Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm text-zinc-300">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                {movie.year} ({movie.releaseDate})
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="border border-zinc-700 px-1.5 py-0.5 rounded text-xs">
                {movie.ageRating}
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                {movie.duration}
              </span>
              {movie.boxOffice && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="text-emerald-400 font-semibold">{movie.boxOffice}</span>
                </>
              )}
            </div>

            {/* Audio & Subtitles */}
            <div className="space-y-1 text-xs text-zinc-300">
              <p>
                <strong className="text-white">Audio Tracks:</strong>{' '}
                <span className="text-zinc-200">{movie.audioLanguages.join(' | ')}</span>
              </p>
              <p>
                <strong className="text-white">Subtitles:</strong>{' '}
                <span className="text-zinc-400">{movie.subtitles.join(', ')}</span>
              </p>
            </div>

            {/* Synopsis */}
            <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl drop-shadow">
              {movie.description}
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              <button
                onClick={() => onPlay(movie)}
                className="flex items-center gap-2 px-6 py-2.5 sm:py-3 bg-white hover:bg-zinc-200 text-black font-bold text-sm sm:text-base rounded-md transition-all active:scale-95 shadow-xl"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Stream Player</span>
              </button>

              <button
                onClick={() => {
                  const elem = document.getElementById('download-hub');
                  elem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-6 py-2.5 sm:py-3 bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-sm sm:text-base rounded-md transition-all active:scale-95 shadow-lg shadow-red-950/40"
              >
                <Download className="w-5 h-5" />
                <span>Download Links</span>
              </button>

              <button
                onClick={onToggleList}
                className={`flex items-center gap-2 px-4 py-2.5 sm:py-3 rounded-md border text-sm font-semibold transition-all active:scale-95 ${
                  isInList
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                }`}
              >
                {isInList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isInList ? 'In My List' : 'Add to List'}</span>
              </button>

              <button
                onClick={onToggleLike}
                className={`p-3 rounded-md border text-sm transition-all active:scale-95 ${
                  isLiked
                    ? 'bg-[#E50914] text-white border-red-500'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                }`}
                title="Like movie"
              >
                <ThumbsUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* FilmyZilla Multi-Server Direct Download Hub */}
        <section id="download-hub" className="bg-[#181818] border border-zinc-800 rounded-xl p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-[#E50914] rounded-md text-white">
                  <Server className="w-5 h-5" />
                </span>
                <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white">
                  FilmyZilla Fast Download Mirrors
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Direct high-speed cloud mirrors with multi-threaded resume support. Select desired quality:
              </p>
            </div>
            <div className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-full flex items-center gap-1.5 self-start">
              <CheckCircle2 className="w-4 h-4" />
              <span>All 4 Servers Online & Active</span>
            </div>
          </div>

          {/* Download Servers List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {movie.downloadServers.map((srv, idx) => (
              <div
                key={idx}
                className="bg-black/60 border border-zinc-800 hover:border-zinc-700 rounded-lg p-4 space-y-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{srv.serverName}</span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{srv.audioTrack}</p>
                  </div>
                  <span className="bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] font-black text-xs px-2 py-0.5 rounded">
                    {srv.resolution}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                  <span className="flex items-center gap-1 text-zinc-300 font-medium">
                    <HardDrive className="w-3.5 h-3.5 text-zinc-500" />
                    File Size: {srv.size}
                  </span>
                  <span className="text-emerald-400 font-bold">Speed: {srv.speed}</span>
                </div>

                {/* Download Button / Progress Bar */}
                {downloadingServer === srv.serverName ? (
                  <div className="space-y-1.5">
                    <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#E50914] h-full transition-all duration-300 rounded-full"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-zinc-400">
                      <span>Generating secure link...</span>
                      <span>{downloadProgress}%</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartDownload(srv.serverName, srv.directUrl)}
                    className="w-full py-2 bg-[#E50914] hover:bg-[#b80710] text-white text-xs sm:text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-md shadow-red-950/30"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {srv.resolution} ({srv.size})</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* FilmyZilla Disclaimer info */}
          <div className="p-3 bg-zinc-900/80 rounded-md border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Tip: Use VLC Media Player or MX Player for dual-audio switching (Hindi / English / Original). If a link doesn't respond, switch to Mirror 2.
            </span>
          </div>
        </section>

        {/* Web Series Episodes Guide (if applicable) */}
        {movie.episodes && movie.episodes.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white">
                Episodes & Season Guide
              </h3>
              <span className="text-xs text-zinc-400">{movie.episodes.length} Episodes available</span>
            </div>

            <div className="space-y-3">
              {movie.episodes.map((ep) => (
                <div
                  key={ep.episode}
                  className="bg-[#181818] border border-zinc-800 hover:border-zinc-700 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-28 sm:w-36 aspect-[16/9] rounded overflow-hidden bg-black shrink-0">
                      <img
                        src={ep.thumbnail}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <button
                          onClick={() => onPlay(movie)}
                          className="w-8 h-8 rounded-full bg-white/90 text-black flex items-center justify-center"
                        >
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {ep.episode}. {ep.title}
                      </h4>
                      <span className="text-xs text-zinc-400">{ep.duration}</span>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{ep.synopsis}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onPlay(movie)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Ep {ep.episode}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cast & Director & Details Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[#181818] border border-zinc-800 rounded-xl p-5 space-y-4">
            <h3 className="font-bebas text-xl sm:text-2xl tracking-wide text-white">
              Movie Synopsis & Credits
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {movie.description}
            </p>
            <div className="border-t border-zinc-800 pt-3 space-y-2 text-xs sm:text-sm">
              <p>
                <span className="text-zinc-500 font-medium">Director: </span>
                <span className="text-white font-semibold">{movie.director}</span>
              </p>
              <p>
                <span className="text-zinc-500 font-medium">Starring: </span>
                <span className="text-zinc-200">{movie.starring.join(', ')}</span>
              </p>
              <p>
                <span className="text-zinc-500 font-medium">Genres: </span>
                <span className="text-zinc-200">{movie.genres.join(', ')}</span>
              </p>
              <p>
                <span className="text-zinc-500 font-medium">FilmyZilla Category: </span>
                <span className="text-[#E50914] font-semibold">{movie.filmyzillaTag}</span>
              </p>
            </div>
          </div>

          {/* Quick Share Card */}
          <div className="bg-[#181818] border border-zinc-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bebas text-xl sm:text-2xl tracking-wide text-white">
                Share With Friends
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Every movie on FilmyZilla has its own dedicated page URL. Copy below:
              </p>
              <div className="mt-3 p-2.5 bg-black/60 rounded border border-zinc-800 text-xs font-mono text-zinc-300 break-all select-all">
                {currentUrl}
              </div>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Copy Movie Page URL'}</span>
            </button>
          </div>
        </section>

        {/* More Like This / Recommended Grid */}
        {similarMovies.length > 0 && (
          <section className="space-y-4">
            <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide text-white">
              More Like This
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {similarMovies.map((sim) => (
                <div
                  key={sim.id}
                  onClick={() => navigateTo({ type: 'movie', slug: sim.slug })}
                  className="group bg-zinc-900 rounded-md overflow-hidden cursor-pointer border border-zinc-800 hover:border-zinc-600 transition-all hover:scale-105"
                >
                  <div className="aspect-[2/3] w-full bg-black relative">
                    <img
                      src={sim.poster}
                      alt={sim.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-[#E50914] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                      {sim.quality}
                    </div>
                  </div>
                  <div className="p-2 space-y-1">
                    <h4 className="text-xs font-semibold text-white truncate group-hover:text-[#E50914] transition-colors">
                      {sim.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span>{sim.year}</span>
                      <span className="text-emerald-400 font-bold">{sim.matchScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
