# How to deploy FilmyZilla to GitHub Pages

1. Push this folder to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial FilmyZilla commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/filmyzilla.git
   git push -u origin main
   ```

2. Build and publish:
   ```bash
   npm install
   npm run build
   ```

3. Enable GitHub Pages:
   - Go to your repository on GitHub.
   - Click "Settings" -> "Pages".
   - Under "Build and deployment", set source to "GitHub Actions" (Vite) or "Deploy from a branch" (main/dist).
   - Done! Your FilmyZilla website is live!
