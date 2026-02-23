# 🎬 StreamFlix v2 — Netflix Clone

A production-grade Netflix clone built with **pure HTML, CSS & JavaScript** — no frameworks, no dependencies.

---

## 📁 File Structure

```
streamflix/
├── index.html      ← Main app (home, TV, movies, routing)
├── login.html      ← Auth page (sign in / sign up)
├── style.css       ← All styles (dark/light theme, animations)
├── app.js          ← Main app logic
├── auth.js         ← Login/signup validation
├── sw.js           ← Service Worker (PWA / offline)
├── manifest.json   ← PWA manifest (installable app)
└── README.md       ← This file
```

---

## ✨ Features

### 🔐 Authentication
- Sign In / Sign Up forms with full validation
- Password strength meter
- Show/hide password toggle
- Remember me & guest mode
- Session stored in localStorage

### 🌐 TMDb API Integration
- Real movie/TV data from The Movie Database
- Falls back to local data if no API key
- Async/await with Promise.all for parallel fetching
- To enable: set `CONFIG.USE_TMDB = true` in app.js and add your free key from https://www.themoviedb.org/settings/api

### 🎬 Video Player
- YouTube trailer embed via TMDb trailer endpoint
- Simulated progress bar with play/pause
- Skip ±10 seconds, volume control, fullscreen
- Watch progress saved to localStorage
- Progress shown on "Continue Watching" cards

### 🗺️ URL Routing (SPA)
- `#/` Home
- `#/tv` TV Shows
- `#/movies` Movies
- `#/new` New & Popular
- `#/mylist` My List
- Browser back/forward works correctly

### 🌙 Dark / Light Mode
- Toggled via button or `T` key
- Persisted in localStorage
- Smooth CSS variable transitions

### 💀 Skeleton Loaders
- Hero section skeleton while data loads
- Row placeholders with shimmer animation
- Replaced with real content after fetch

### 🔍 Debounced Search
- 350ms debounce — won't fire on every keystroke
- Searches titles, genres, and descriptions
- Live results grid with count

### ❤️ My List
- Add/remove from any card or modal
- Persisted in localStorage (survives refresh)
- Dedicated My List page via routing

### ⌨️ Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `F` | Fullscreen |
| `M` | Mute |
| `←` `→` | Skip ±10s |
| `↑` `↓` | Volume |
| `S` | Focus search |
| `T` | Toggle theme |
| `1-5` | Navigate routes |
| `Esc` | Close modal/player |
| `?` | Show shortcuts |

### 📱 PWA (Progressive Web App)
- Service Worker with cache-first strategy
- Works offline after first load
- Installable on mobile/desktop
- manifest.json with app metadata

### 📊 Watch History
- Watch progress saved per title
- Shown on Continue Watching cards
- Restored on next visit

### 🎨 Other UI Features
- Smooth hover card animations
- Animated hero with zoom effect
- Genre filter tabs
- Intersection Observer scroll animations
- Back to top button
- Toast notifications
- Profile dropdown
- Mobile hamburger menu + drawer
- Featured banner
- Top 10 with rank numbers
- More Like This in modal

---

## 🚀 How to Run

### Locally
Just open `index.html` in any browser — no server needed!

### Enable Live Movie Data (TMDb)
1. Go to https://www.themoviedb.org/settings/api
2. Create a free account and get your API key
3. Open `app.js` and:
   - Set `CONFIG.TMDB_KEY = 'your_key_here'`
   - Set `CONFIG.USE_TMDB = true`

### Deploy (Free)
- **Netlify**: Drag & drop the folder at app.netlify.com
- **GitHub Pages**: Push to GitHub, enable Pages in Settings
- **Vercel**: `vercel deploy` or drag folder at vercel.com

---

## 🛠️ Technologies

- **HTML5** — Semantic structure, PWA meta tags
- **CSS3** — Variables, animations, grid, flexbox, media queries
- **JavaScript (ES6+)** — Modules, async/await, fetch, IntersectionObserver, localStorage, Service Worker
- **TMDb API** — Free movie/TV data
- **YouTube iFrame API** — Trailer playback
- **PWA** — Service Worker, Web App Manifest

---

## 📝 Resume Description

> **StreamFlix** — A full-featured Netflix-inspired streaming UI built with vanilla HTML, CSS & JavaScript. Features include: TMDb REST API integration with async/await, hash-based SPA routing, dark/light theme with localStorage persistence, PWA with Service Worker offline caching, YouTube trailer player with custom controls, debounced live search, skeleton loading states, intersection observer scroll animations, and full keyboard shortcut support.

---

*Built for portfolio purposes. Not affiliated with Netflix.*