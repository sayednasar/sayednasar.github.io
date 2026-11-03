export type MovieCategory = 
  | 'Bollywood'
  | 'Hollywood Dubbed'
  | 'South Hindi Dubbed'
  | 'Web Series'
  | 'Punjabi'
  | '300MB Movies';

export interface DownloadServer {
  serverName: string;
  resolution: '4K UHD' | '1080p FHD' | '720p HD' | '480p SD' | '300MB Mobile';
  size: string;
  speed: string;
  directUrl: string;
  magnetUrl?: string;
  audioTrack: string;
}

export interface Episode {
  season: number;
  episode: number;
  title: string;
  duration: string;
  thumbnail: string;
  synopsis: string;
  downloadUrl?: string;
}

export interface Movie {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  category: MovieCategory;
  genres: string[];
  year: number;
  rating: string;
  matchScore: number;
  ageRating: string;
  duration: string;
  quality: '4K UHD' | '1080p' | '720p' | 'HD';
  audioLanguages: string[];
  subtitles: string[];
  poster: string;
  backdrop: string;
  videoUrl: string; // Preview or full player stream URL
  description: string;
  director: string;
  starring: string[];
  filmyzillaTag: string;
  releaseDate: string;
  boxOffice?: string;
  isTrending?: boolean;
  isFeaturedHero?: boolean;
  top10Rank?: number;
  viewsCount?: string;
  downloadServers: DownloadServer[];
  episodes?: Episode[];
}

export type ViewRoute = 
  | { type: 'home' }
  | { type: 'movie'; slug: string }
  | { type: 'category'; category: MovieCategory }
  | { type: 'my-list' }
  | { type: 'top10' }
  | { type: 'upload' }
  | { type: 'github-export' };
