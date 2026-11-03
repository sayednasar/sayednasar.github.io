import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, 
  X, Settings, MessageSquare, Check, Sparkles, AlertCircle 
} from 'lucide-react';
import { Movie } from '../types/movie';

interface VideoPlayerModalProps {
  movie: Movie;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ movie, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activeAudio, setActiveAudio] = useState(movie.audioLanguages[0] || 'Hindi (Original)');
  const [activeSubtitle, setActiveSubtitle] = useState<string>('English');
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState(movie.quality || '1080p');

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowRight') seek(10);
      if (e.key === 'ArrowLeft') seek(-10);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('netflix-player-container');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
    }
  };

  return (
    <div
      id="netflix-player-container"
      className="fixed inset-0 z-50 bg-black flex items-center justify-center select-none overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={movie.videoUrl}
        autoPlay
        playsInline
        onTimeUpdate={() => {
          if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) setDuration(videoRef.current.duration);
        }}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Top Header Overlay */}
      <div
        className={`absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            title="Back to FilmyZilla"
          >
            <X className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white drop-shadow">
              {movie.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="text-[#E50914] font-semibold">{quality}</span>
              <span>•</span>
              <span>{activeAudio}</span>
            </div>
          </div>
        </div>

        {/* Brand */}
        <div className="font-bebas text-2xl text-[#E50914] tracking-wider">
          FILMYZILLA
        </div>
      </div>

      {/* Center Big Play Indicator if Paused */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
        >
          <div className="w-20 h-20 rounded-full bg-[#E50914]/90 text-white flex items-center justify-center shadow-2xl pl-1 hover:scale-110 transition-transform">
            <Play className="w-10 h-10 fill-current" />
          </div>
        </div>
      )}

      {/* Bottom Controls Overlay */}
      <div
        className={`absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent space-y-3 transition-opacity duration-300 z-20 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress Scrubber */}
        <div className="space-y-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-1.5 bg-zinc-700 accent-[#E50914] rounded-lg cursor-pointer hover:h-2 transition-all"
          />
          <div className="flex justify-between text-xs text-zinc-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex items-center justify-between">
          {/* Left Controls: Play, Rewind 10s, Forward 10s, Volume */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={togglePlay}
              className="p-2 text-white hover:text-zinc-200 transition-transform active:scale-90"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>

            <button
              onClick={() => seek(-10)}
              className="p-2 text-white hover:text-zinc-200 transition-transform active:scale-90"
              title="Rewind 10s"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => seek(10)}
              className="p-2 text-white hover:text-zinc-200 transition-transform active:scale-90"
              title="Forward 10s"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                className="p-2 text-white hover:text-zinc-200"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  if (videoRef.current) {
                    videoRef.current.volume = val;
                    videoRef.current.muted = false;
                  }
                  setIsMuted(false);
                }}
                className="w-16 sm:w-24 h-1 bg-zinc-700 accent-white rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Right Controls: Audio/Subtitles, Speed, Quality, Fullscreen */}
          <div className="relative flex items-center gap-2 sm:gap-4">
            {/* Audio & Subtitles Menu */}
            <button
              onClick={() => setAudioMenuOpen(!audioMenuOpen)}
              className="flex items-center gap-1.5 p-2 text-zinc-300 hover:text-white transition-colors"
              title="Audio & Subtitles"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold">Audio & Subs</span>
            </button>

            {/* Audio & Subtitle Popup */}
            {audioMenuOpen && (
              <div className="absolute bottom-12 right-12 w-64 bg-[#181818] border border-zinc-700 rounded-lg shadow-2xl p-3 space-y-3 text-xs z-50">
                <div>
                  <h4 className="font-bold text-white mb-1.5 border-b border-zinc-800 pb-1">
                    Audio Languages
                  </h4>
                  <div className="space-y-1">
                    {movie.audioLanguages.map((audio, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveAudio(audio);
                        }}
                        className={`w-full text-left px-2 py-1 rounded flex items-center justify-between ${
                          activeAudio === audio
                            ? 'bg-[#E50914] text-white font-bold'
                            : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <span className="truncate">{audio}</span>
                        {activeAudio === audio && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1.5 border-b border-zinc-800 pb-1">
                    Subtitles
                  </h4>
                  <div className="space-y-1">
                    {['Off', 'English', 'Hindi'].map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveSubtitle(sub);
                        }}
                        className={`w-full text-left px-2 py-1 rounded flex items-center justify-between ${
                          activeSubtitle === sub
                            ? 'bg-[#E50914] text-white font-bold'
                            : 'text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        <span>{sub}</span>
                        {activeSubtitle === sub && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Speed toggle */}
            <button
              onClick={() => {
                const speeds = [1, 1.25, 1.5, 0.75];
                const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                setPlaybackSpeed(next);
                if (videoRef.current) videoRef.current.playbackRate = next;
              }}
              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200"
              title="Playback Speed"
            >
              {playbackSpeed}x
            </button>

            {/* Quality Switcher */}
            <button
              onClick={() => {
                const qualities = ['4K UHD', '1080p', '720p'];
                const next = qualities[(qualities.indexOf(quality) + 1) % qualities.length];
                setQuality(next as any);
              }}
              className="px-2 py-1 rounded border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-xs font-bold text-[#E50914]"
              title="Toggle Stream Resolution"
            >
              {quality}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-zinc-300 hover:text-white"
              title="Fullscreen"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
