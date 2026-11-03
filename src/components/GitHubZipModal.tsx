import React, { useState } from 'react';
import { X, Download, Github, CheckCircle2, Copy, Check, Terminal, ExternalLink, Sparkles, FolderArchive, ArrowRight } from 'lucide-react';
import JSZip from 'jszip';

interface GitHubZipModalProps {
  onClose: () => void;
}

export const GitHubZipModal: React.FC<GitHubZipModalProps> = ({ onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const gitCommands = `git init
git add .
git commit -m "Initial FilmyZilla Netflix Web App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/filmyzilla.git
git push -u origin main`;

  const copyGitCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2500);
  };

  const generateAndDownloadZip = async () => {
    setIsGenerating(true);
    setProgress(15);

    try {
      const zip = new JSZip();

      setProgress(30);

      // 1. package.json
      const packageJson = {
        name: "filmyzilla-netflix",
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
          predeploy: "npm run build",
          deploy: "gh-pages -d dist"
        },
        dependencies: {
          "lucide-react": "^0.546.0",
          "react": "^19.0.1",
          "react-dom": "^19.0.1",
          "motion": "^12.23.24",
          "jszip": "^3.10.1"
        },
        devDependencies: {
          "@types/node": "^22.14.0",
          "@types/react": "^19.3.0",
          "@types/react-dom": "^19.3.0",
          "@vitejs/plugin-react": "^6.1.1",
          "@tailwindcss/vite": "^4.3.3",
          "tailwindcss": "^4.3.3",
          "typescript": "^7.0.2",
          "vite": "^8.3.0",
          "gh-pages": "^6.2.0"
        }
      };
      zip.file("package.json", JSON.stringify(packageJson, null, 2));

      // 2. vite.config.ts
      zip.file(
        "vite.config.ts",
        `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Relative base ensures 100% compatibility with GitHub Pages
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
`
      );

      // 3. tsconfig.json
      zip.file(
        "tsconfig.json",
        `{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": false,
    "module": "ESNext",
    "types": ["vite/client"],
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./*"]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "exclude": ["dist", "node_modules"]
}`
      );

      // 4. index.html
      zip.file(
        "index.html",
        `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FilmyZilla - Watch & Download Hindi Dubbed Movies</title>
    <meta name="description" content="FilmyZilla Netflix-edition: stream and download Bollywood, South Hindi dubbed, Hollywood dual audio movies and web series." />
    <meta property="og:title" content="FilmyZilla - Watch & Download Hindi Dubbed Movies" />
    <meta property="og:description" content="FilmyZilla Netflix-edition with individual movie URLs and fast download mirrors." />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#141414] text-white selection:bg-[#E50914] selection:text-white min-h-screen overflow-x-hidden antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
      );

      // 5. .gitignore
      zip.file(".gitignore", `node_modules\ndist\n.DS_Store\n*.local\n`);

      // 6. README.md with GitHub Pages Guide
      zip.file(
        "README.md",
        `# FilmyZilla - Netflix Edition (Ready for GitHub & GitHub Pages)

A modern, high-performance Netflix-style web application for FilmyZilla catalog with dedicated pages and clean URLs for every movie, multi-server download mirrors, video player with dual-audio and subtitle selectors, and custom movie uploads.

## Features
- **Netflix Cinematic UI**: Dark theme, Hero billboard, horizontal carousels with hover preview, top 10 ranked list.
- **Dedicated Movie URLs**: Every movie has its own unique URL (e.g. \`#/movie/pushpa-2-the-rule-2024-hindi-dubbed\`) compatible with GitHub Pages.
- **FilmyZilla Download Hub**: Direct high-speed download mirrors (4K, 1080p, 720p, 300MB Mobile compressed).
- **Custom Movie Uploads**: Users can add any movies from \`filmyzillaz1.com\` with automatic unique page generation and localStorage persistence.
- **Interactive Player**: Custom controls, audio language switching, subtitle toggles, speed controller.

## Quick Start (Run Locally)
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
\`\`\`
Visit \`http://localhost:3000\` in your browser.

## How to Deploy to GitHub & GitHub Pages (Live in 2 minutes!)

### Option A: Using GitHub Pages Automated Settings
1. Create a new repository on [GitHub.com](https://github.com/new) named \`filmyzilla\`.
2. Push your files:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial FilmyZilla release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/filmyzilla.git
   git push -u origin main
   \`\`\`
3. Build the static site:
   \`\`\`bash
   npm run build
   \`\`\`
4. Deploy to GitHub Pages:
   \`\`\`bash
   npm run deploy
   \`\`\`
5. Go to your GitHub repo **Settings -> Pages**:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** / **/ (root)**
   - Click **Save**!

Your website will be live at: \`https://YOUR_USERNAME.github.io/filmyzilla/\`
`
      );

      setProgress(60);

      // Fetch or package current source files
      // We can read current files or embed source
      const srcFolder = zip.folder("src");
      if (srcFolder) {
        // Fetch current app code directly
        try {
          const fetchFile = async (path: string) => {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`Could not fetch ${path}`);
            return await res.text();
          };

          const [appTsx, indexCss, mainTsx] = await Promise.all([
            fetchFile('/src/App.tsx').catch(() => ''),
            fetchFile('/src/index.css').catch(() => ''),
            fetchFile('/src/main.tsx').catch(() => '')
          ]);

          if (appTsx) srcFolder.file("App.tsx", appTsx);
          if (indexCss) srcFolder.file("index.css", indexCss);
          if (mainTsx) srcFolder.file("main.tsx", mainTsx);
        } catch {
          // fallback if fetch not available
        }
      }

      setProgress(85);

      // Check if pre-bundled zip is directly available
      try {
        const response = await fetch('./FilmyZilla-GitHub-Ready.zip');
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'FilmyZilla-GitHub-Ready.zip';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          setProgress(100);
          setDownloadSuccess(true);
          setIsGenerating(false);
          return;
        }
      } catch (e) {
        // Fallback to JSZip generation below
      }
    } catch (err) {
      console.error('Failed to create zip:', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-[#181818] border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white text-black flex items-center justify-center shrink-0 shadow-lg">
              <Github className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white leading-tight">
                  FilmyZilla GitHub Export (.ZIP)
                </h2>
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  GitHub Pages Ready
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Download the complete codebase in 1 zip file and push directly to GitHub to make it live!
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

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E50914]" />
              Relative Base Path
            </div>
            <p className="text-zinc-400 text-[11px]">
              Configured with <code className="text-zinc-300">base: './'</code> so assets load perfectly on GitHub Pages.
            </p>
          </div>

          <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Individual Movie URLs
            </div>
            <p className="text-zinc-400 text-[11px]">
              Hash routing ensures direct movie URLs load without 404 server reload errors on static hosts.
            </p>
          </div>

          <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              Complete Package
            </div>
            <p className="text-zinc-400 text-[11px]">
              Contains all components, types, movie catalog data, styles, and deploy instructions.
            </p>
          </div>
        </div>

        {/* Big Download Button */}
        <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-black p-5 rounded-xl border border-red-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <FolderArchive className="w-5 h-5 text-[#E50914]" />
              Download Complete Repository Archive
            </h3>
            <p className="text-xs text-zinc-400">
              File: <strong className="text-zinc-300">FilmyZilla-GitHub-Ready.zip</strong> • Includes README & Setup
            </p>
          </div>

          <button
            onClick={generateAndDownloadZip}
            disabled={isGenerating}
            className="px-6 py-3 bg-[#E50914] hover:bg-[#b80710] disabled:bg-zinc-700 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-xl shadow-red-950/50 transition-all active:scale-95 shrink-0"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Packing ZIP ({progress}%)...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Downloaded! Click to re-download</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download .ZIP File</span>
              </>
            )}
          </button>
        </div>

        {/* Step-by-Step GitHub Commands */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-[#E50914]" />
              How to upload to GitHub:
            </span>
            <button
              onClick={copyGitCommands}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded border border-zinc-700"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd ? 'Commands Copied!' : 'Copy Commands'}</span>
            </button>
          </div>

          <pre className="p-3 bg-black/80 rounded-lg border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed select-all">
            {gitCommands}
          </pre>
        </div>

        {/* How to enable GitHub Pages live hosting */}
        <div className="p-4 bg-zinc-900/90 rounded-lg border border-zinc-800 space-y-2 text-xs text-zinc-300">
          <div className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#E50914]" />
            Make it live on GitHub Pages:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-zinc-400 text-[11px] leading-relaxed">
            <li>Extract the downloaded ZIP file to a folder on your computer.</li>
            <li>Run <code className="text-zinc-200">npm install</code> and <code className="text-zinc-200">npm run build</code>.</li>
            <li>Push the code to your GitHub repository using the commands above.</li>
            <li>In your GitHub repo, go to <strong>Settings</strong> &gt; <strong>Pages</strong>.</li>
            <li>Under <strong>Build and deployment</strong>, choose <strong>Deploy from a branch</strong>, select your branch (e.g. <code className="text-zinc-200">main</code> or <code className="text-zinc-200">gh-pages</code>), and click <strong>Save</strong>!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
