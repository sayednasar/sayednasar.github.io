import React, { useState } from 'react';
import { X, Download, Server, HardDrive, CheckCircle2, ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';
import { Movie, DownloadServer } from '../types/movie';

interface DownloadModalProps {
  movie: Movie;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({ movie, onClose }) => {
  const [downloadingServer, setDownloadingServer] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const startDownload = (server: DownloadServer) => {
    setDownloadingServer(server.serverName);
    setProgress(15);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadingServer(null), 1500);

          const link = document.createElement('a');
          link.href = server.directUrl;
          link.download = `${movie.slug}-${server.resolution.toLowerCase().replace(/\s+/g, '-')}.mkv`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#181818] border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#E50914] flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-950">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                Download {movie.title}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                FilmyZilla High Speed Verified Mirrors (Direct & Resume Supported)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Clean files, verified 0 virus, original dual audio streams</span>
          </div>
          <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
            Active Mirrors
          </span>
        </div>

        {/* Server Mirrors List */}
        <div className="space-y-3">
          {movie.downloadServers.map((server, idx) => (
            <div
              key={idx}
              className="bg-black/60 border border-zinc-800 hover:border-zinc-700 rounded-lg p-3.5 sm:p-4 space-y-3 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#E50914]" />
                    <h4 className="text-sm font-bold text-white">{server.serverName}</h4>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{server.audioTrack}</p>
                </div>
                <span className="bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] font-black text-xs px-2 py-0.5 rounded shrink-0">
                  {server.resolution}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-zinc-500" />
                  Size: <strong className="text-zinc-200">{server.size}</strong>
                </span>
                <span className="text-emerald-400 font-semibold">Speed: {server.speed}</span>
              </div>

              {/* Download Action */}
              {downloadingServer === server.serverName ? (
                <div className="space-y-1.5 pt-1">
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#E50914] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Initiating direct high-speed transfer...</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => startDownload(server)}
                    className="flex-1 py-2 bg-[#E50914] hover:bg-[#b80710] text-white text-xs sm:text-sm font-bold rounded-md flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-md shadow-red-950/40"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {server.resolution}</span>
                  </button>

                  <button
                    onClick={() => copyUrl(server.directUrl)}
                    className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-md border border-zinc-700 transition-colors"
                    title="Copy direct mirror URL"
                  >
                    {copiedLink === server.directUrl ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="text-[11px] text-zinc-500 text-center">
          Powered by FilmyZilla High-Bandwidth Cloud Edge. Resume supported via IDM / ADM / Chrome.
        </div>
      </div>
    </div>
  );
};
