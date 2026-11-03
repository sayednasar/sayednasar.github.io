import { Movie, ViewRoute } from '../types/movie';
import { INITIAL_MOVIES } from '../data/movies';

const LOCAL_STORAGE_MOVIES_KEY = 'filmyzilla_custom_movies';
const LOCAL_STORAGE_MY_LIST_KEY = 'filmyzilla_my_list';
const LOCAL_STORAGE_LIKES_KEY = 'filmyzilla_liked_movies';

export function getCustomMovies(): Movie[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MOVIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomMovie(movie: Movie): Movie[] {
  try {
    const current = getCustomMovies();
    const updated = [movie, ...current.filter((m) => m.id !== movie.id && m.slug !== movie.slug)];
    localStorage.setItem(LOCAL_STORAGE_MOVIES_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save movie to localStorage', e);
    return [];
  }
}

export function getAllMovies(): Movie[] {
  const custom = getCustomMovies();
  // Filter out any duplicates if custom movie shares id with initial
  const customSlugs = new Set(custom.map(m => m.slug));
  const filteredInitials = INITIAL_MOVIES.filter(m => !customSlugs.has(m.slug));
  return [...custom, ...filteredInitials];
}

export function getMyList(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_MY_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleMyList(movieId: string): string[] {
  try {
    const current = getMyList();
    let updated: string[];
    if (current.includes(movieId)) {
      updated = current.filter(id => id !== movieId);
    } else {
      updated = [...current, movieId];
    }
    localStorage.setItem(LOCAL_STORAGE_MY_LIST_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function getLikedMovies(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LIKES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleLikeMovie(movieId: string): string[] {
  try {
    const current = getLikedMovies();
    let updated: string[];
    if (current.includes(movieId)) {
      updated = current.filter(id => id !== movieId);
    } else {
      updated = [...current, movieId];
    }
    localStorage.setItem(LOCAL_STORAGE_LIKES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

// Route parser from window.location.hash
export function parseCurrentRoute(): ViewRoute {
  if (typeof window === 'undefined') return { type: 'home' };

  const hash = window.location.hash.replace(/^#\/?/, '');
  
  if (!hash) {
    // Also check query param ?movie=slug or ?category=cat as fallback
    const params = new URLSearchParams(window.location.search);
    const movieSlug = params.get('movie') || params.get('m');
    if (movieSlug) return { type: 'movie', slug: movieSlug };
    const cat = params.get('category');
    if (cat) return { type: 'category', category: decodeURIComponent(cat) as any };
    return { type: 'home' };
  }

  const parts = hash.split('/').filter(Boolean);
  if (parts[0] === 'movie' && parts[1]) {
    return { type: 'movie', slug: decodeURIComponent(parts[1]) };
  }
  if (parts[0] === 'category' && parts[1]) {
    return { type: 'category', category: decodeURIComponent(parts[1]) as any };
  }
  if (parts[0] === 'my-list') {
    return { type: 'my-list' };
  }
  if (parts[0] === 'top10') {
    return { type: 'top10' };
  }
  if (parts[0] === 'upload') {
    return { type: 'upload' };
  }
  if (parts[0] === 'github-export') {
    return { type: 'github-export' };
  }

  return { type: 'home' };
}

export function navigateTo(route: ViewRoute) {
  let hash = '';
  switch (route.type) {
    case 'home':
      hash = '#/';
      break;
    case 'movie':
      hash = `#/movie/${encodeURIComponent(route.slug)}`;
      break;
    case 'category':
      hash = `#/category/${encodeURIComponent(route.category)}`;
      break;
    case 'my-list':
      hash = '#/my-list';
      break;
    case 'top10':
      hash = '#/top10';
      break;
    case 'upload':
      hash = '#/upload';
      break;
    case 'github-export':
      hash = '#/github-export';
      break;
  }
  window.location.hash = hash;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
