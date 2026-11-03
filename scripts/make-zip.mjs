import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

const zip = new JSZip();

function addFilesRecursively(dir, rootDir, zipFolder) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file.endsWith('.zip')) {
      continue;
    }
    const fullPath = path.join(dir, file);
    const relPath = path.relative(rootDir, fullPath);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subZip = zipFolder.folder(file);
      addFilesRecursively(fullPath, rootDir, subZip);
    } else {
      const content = fs.readFileSync(fullPath);
      zipFolder.file(file, content);
    }
  }
}

async function buildZip() {
  const projectRoot = process.cwd();
  console.log('Generating zip from:', projectRoot);
  addFilesRecursively(projectRoot, projectRoot, zip);

  // Add gh-pages deploy README
  zip.file(
    'GITHUB-PAGES-SETUP.md',
    `# How to deploy FilmyZilla to GitHub Pages

1. Push this folder to your GitHub repository:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial FilmyZilla commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/filmyzilla.git
   git push -u origin main
   \`\`\`

2. Build and publish:
   \`\`\`bash
   npm install
   npm run build
   \`\`\`

3. Enable GitHub Pages:
   - Go to your repository on GitHub.
   - Click "Settings" -> "Pages".
   - Under "Build and deployment", set source to "GitHub Actions" (Vite) or "Deploy from a branch" (main/dist).
   - Done! Your FilmyZilla website is live!
`
  );

  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const outPath = path.join(publicDir, 'FilmyZilla-GitHub-Ready.zip');
  fs.writeFileSync(outPath, outBuffer);
  console.log('Successfully created:', outPath, 'Size:', (outBuffer.length / 1024).toFixed(1), 'KB');

  // Also write to project root
  fs.writeFileSync(path.join(projectRoot, 'FilmyZilla-GitHub-Ready.zip'), outBuffer);
}

buildZip().catch(console.error);
