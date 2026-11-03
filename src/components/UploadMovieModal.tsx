import React, { useState } from 'react';
import { X, PlusCircle, Sparkles, Film, Link, Upload, CheckCircle, Database } from 'lucide-react';
import { Movie, MovieCategory } from '../types/movie';
import { CATEGORIES } from '../data/movies';
import { saveCustomMovie, navigateTo } from '../utils/storage';

interface UploadMovieModalProps {
  onClose: () => void;
  onMovieAdded: (movie: Movie) => void;
}

export const UploadMovieModal: React.FC<UploadMovieModalProps> = ({ onClose, onMovieAdded }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MovieCategory>('Bollywood');
  const [year, setYear] = useState('2025');
  const [genres, setGenres] = useState('Action, Thriller');
  const [quality, setQuality] = useState<'4K UHD' | '1080p' | '720p' | 'HD'>('1080p');
  const [audio, setAudio] = useState('Hindi Clean Audio [Org]');
  const [posterUrl, setPosterUrl] = useState('');
  const [backdropUrl, setBackdropUrl] = useState('');
  const [description, setDescription] = useState('');
  const [director, setDirector] = useState('');
  const [starring, setStarring] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [error, setError] = useState('');

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleQuickPreset = (presetType: 'chhaava' | 'leo' | 'jailer') => {
    if (presetType === 'chhaava') {
      setTitle('Chhaava');
      setCategory('Bollywood');
      setYear('2025');
      setGenres('Action, Historical, Drama');
      setQuality('4K UHD');
      setAudio('Hindi Original [Dolby Atmos]');
      setPosterUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80');
      setBackdropUrl('https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=80');
      setDescription('The heroic saga of Chhatrapati Sambhaji Maharaj, the valiant son of Shivaji Maharaj, who defended the Maratha Empire against the vast Mughal armies with unmatched courage.');
      setDirector('Laxman Utekar');
      setStarring('Vicky Kaushal, Rashmika Mandanna, Akshaye Khanna, Ashutosh Rana');
      setDownloadLink('https://filmyzillaz1.com/download/chhaava-2025-4k-hindi.mkv');
    } else if (presetType === 'leo') {
      setTitle('Leo (Bloody Sweet)');
      setCategory('South Hindi Dubbed');
      setYear('2024');
      setGenres('Action, Crime, Thriller');
      setQuality('4K UHD');
      setAudio('Hindi Clean Audio Org, Tamil');
      setPosterUrl('https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80');
      setBackdropUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80');
      setDescription('A cafe owner in Himachal Pradesh becomes an overnight local hero after fighting off bandits, but attracts the attention of a drug cartel who claim he is a feared gangster.');
      setDirector('Lokesh Kanagaraj');
      setStarring('Thalapathy Vijay, Sanjay Dutt, Arjun Sarja, Trisha Krishnan');
      setDownloadLink('https://filmyzillaz1.com/download/leo-hindi-dubbed-1080p.mkv');
    } else if (presetType === 'jailer') {
      setTitle('Jailer');
      setCategory('South Hindi Dubbed');
      setYear('2024');
      setGenres('Action, Comedy, Crime');
      setQuality('1080p');
      setAudio('Hindi Dubbed 5.1');
      setPosterUrl('https://images.unsplash.com/photo-1563089145-599997674d42?w=800&q=80');
      setBackdropUrl('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&q=80');
      setDescription('A retired prison jailer goes on a manhunt to avenge his police officer son, revealing an unstoppable lethal past.');
      setDirector('Nelson Dilipkumar');
      setStarring('Rajinikanth, Mohanlal, Shiva Rajkumar, Vinayakan');
      setDownloadLink('https://filmyzillaz1.com/download/jailer-hindi-dubbed-1080p.mkv');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a movie title.');
      return;
    }

    const slug = `${generateSlug(title)}-${year}-hindi-filmyzilla`;
    const defaultPoster = posterUrl.trim() || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80';
    const defaultBackdrop = backdropUrl.trim() || defaultPoster;

    const newMovie: Movie = {
      id: slug,
      slug: slug,
      title: title.trim(),
      originalTitle: title.trim(),
      category: category,
      genres: genres.split(',').map((g) => g.trim()).filter(Boolean),
      year: parseInt(year) || 2024,
      rating: '8.5/10',
      matchScore: 95,
      ageRating: 'U/A 16+',
      duration: '2h 28m',
      quality: quality,
      audioLanguages: audio.split(',').map((a) => a.trim()).filter(Boolean),
      subtitles: ['English', 'Hindi'],
      poster: defaultPoster,
      backdrop: defaultBackdrop,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: description.trim() || `Uploaded on FilmyZilla from filmyzillaz1.com catalog. Stream in high clarity ${quality} with dual audio support.`,
      director: director.trim() || 'FilmyZilla Team',
      starring: starring ? starring.split(',').map((s) => s.trim()) : ['Leading Cast'],
      filmyzillaTag: `${category} Direct Download 1080p`,
      releaseDate: `${year}`,
      downloadServers: [
        {
          serverName: 'Cloud CDN Direct VIP 1',
          resolution: quality === '4K UHD' ? '4K UHD' : quality === '720p' ? '720p HD' : quality === 'HD' ? '300MB Mobile' : '1080p FHD',
          size: '2.4 GB',
          speed: '110 Mbps',
          directUrl: downloadLink.trim() || `https://filmyzillaz1.com/download/${slug}.mkv`,
          audioTrack: audio
        },
        {
          serverName: 'Google Drive Ultra Fast',
          resolution: '720p HD',
          size: '1.1 GB',
          speed: '75 Mbps',
          directUrl: `https://filmyzillaz1.com/download/${slug}-720p.mkv`,
          audioTrack: audio
        },
        {
          serverName: '300MB Mobile Compressed MP4',
          resolution: '300MB Mobile',
          size: '390 MB',
          speed: '45 Mbps',
          directUrl: `https://filmyzillaz1.com/download/${slug}-300mb.mp4`,
          audioTrack: 'Hindi 2.0'
        }
      ]
    };

    saveCustomMovie(newMovie);
    onMovieAdded(newMovie);
    onClose();
    // Navigate straight to the new movie's separate dedicated page and URL
    navigateTo({ type: 'movie', slug: newMovie.slug });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#181818] border border-zinc-800 rounded-xl max-w-2xl w-full my-8 p-5 sm:p-7 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E50914] flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-950">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">
                Upload & Add Movie to FilmyZilla
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Every uploaded movie automatically receives its own individual page and dedicated URL!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets from filmyzillaz1.com */}
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#E50914]" />
              Quick Import from filmyzillaz1.com:
            </span>
            <span className="text-zinc-500 text-[11px]">1-click fill</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('chhaava')}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 rounded border border-zinc-700 transition-colors"
            >
              + Chhaava (2025)
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('leo')}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 rounded border border-zinc-700 transition-colors"
            >
              + Leo Hindi Dubbed
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('jailer')}
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 rounded border border-zinc-700 transition-colors"
            >
              + Jailer Hindi Dubbed
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs text-red-200">
            {error}
          </div>
        )}

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Movie Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Movie Title <span className="text-[#E50914]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Pushpa 2: The Rule or Stree 2"
              required
              className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Category & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MovieCategory)}
                className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} className="bg-zinc-900">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Release Year
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2025"
                className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          {/* Quality & Audio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Resolution Quality
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value as any)}
                className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              >
                <option value="4K UHD" className="bg-zinc-900">4K UHD</option>
                <option value="1080p" className="bg-zinc-900">1080p FHD</option>
                <option value="720p" className="bg-zinc-900">720p HD</option>
                <option value="HD" className="bg-zinc-900">HD (300MB Mobile)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Audio Languages
              </label>
              <input
                type="text"
                value={audio}
                onChange={(e) => setAudio(e.target.value)}
                placeholder="e.g. Hindi Clean Audio Org, English"
                className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          {/* Genres & Director */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Genres (comma separated)
              </label>
              <input
                type="text"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="Action, Thriller, Drama"
                className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Director
              </label>
              <input
                type="text"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="e.g. Sukumar, Amar Kaushik"
                className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          {/* Starring */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Starring Cast
            </label>
            <input
              type="text"
              value={starring}
              onChange={(e) => setStarring(e.target.value)}
              placeholder="e.g. Allu Arjun, Rashmika Mandanna, Fahadh Faasil"
              className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Image URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Poster Image URL (optional)
              </label>
              <input
                type="url"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Backdrop Banner URL (optional)
              </label>
              <input
                type="url"
                value={backdropUrl}
                onChange={(e) => setBackdropUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          {/* Download Link */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Direct Download Server Link from filmyzillaz1.com
            </label>
            <input
              type="text"
              value={downloadLink}
              onChange={(e) => setDownloadLink(e.target.value)}
              placeholder="https://filmyzillaz1.com/download/..."
              className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Plot Synopsis / Storyline
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter engaging movie synopsis..."
              className="w-full bg-black/60 border border-zinc-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#E50914]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-xs sm:text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#E50914] hover:bg-[#b80710] text-white rounded-md text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-950/40 transition-transform active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Publish & View Dedicated Page</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
