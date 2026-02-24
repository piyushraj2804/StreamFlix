/* ══════════════════════════════════════════════
   StreamFlix v2 — app.js
   Features: TMDb API · URL Routing · Video Player
             LocalStorage · Skeleton Loaders · Dark/Light
             Keyboard Shortcuts · Debounced Search · PWA
   ══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */
const CONFIG = {
  TMDB_KEY: 'd785bded5e6745356995abc98e05b626',
  TMDB_BASE: 'https://api.themoviedb.org/3',
  TMDB_IMG: 'https://image.tmdb.org/t/p/original',
  TMDB_BDROP: 'https://image.tmdb.org/t/p/original',
  USE_TMDB: true
};

/* ─────────────────────────────────────────────
   FALLBACK LOCAL DATA (used when TMDb key not set)
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   REAL TMDB IMAGE CDN — no API key needed for images!
   Poster:   https://image.tmdb.org/t/p/w500{poster_path}
   Backdrop: https://image.tmdb.org/t/p/w1280{backdrop_path}
   All paths sourced directly from TMDb's public database.
───────────────────────────────────────────── */
const TMDB_IMG    = 'https://image.tmdb.org/t/p/w500';
const TMDB_BDROP  = 'https://image.tmdb.org/t/p/w1280';

const LOCAL_MOVIES = [
  {
    id: 1, title: 'Stranger Things', year: '2016', match: '97%', seasons: '4 Seasons',
    genre: ['Sci-Fi', 'Horror', 'Drama'], vote_average: 8.7,
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    poster_path:   TMDB_IMG   + '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop_path: TMDB_BDROP + '/rcA35Vs8ohONFkbRhpJpSKzJODj.jpg',
    trailerKey: 'b9EkMc79ZSU', tags: ['Chilling', 'Nostalgic', 'Suspenseful'], type: 'tv'
  },
  {
    id: 2, title: 'Breaking Bad', year: '2008', match: '99%', seasons: '5 Seasons',
    genre: ['Drama', 'Thriller'], vote_average: 9.5,
    overview: "A high school chemistry teacher diagnosed with cancer turns to a life of crime, producing and selling methamphetamine to secure his family's financial future.",
    poster_path:   TMDB_IMG   + '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdrop_path: TMDB_BDROP + '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    trailerKey: 'HhesaQXLuRY', tags: ['Dark', 'Gripping', 'Award-Winning'], type: 'tv'
  },
  {
    id: 3, title: 'Dark', year: '2017', match: '94%', seasons: '3 Seasons',
    genre: ['Sci-Fi', 'Thriller', 'Drama'], vote_average: 8.8,
    overview: "A family saga with a supernatural twist set in a German town where the disappearance of two young children exposes the double lives and fractured relationships among four families.",
    poster_path:   TMDB_IMG   + '/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
    backdrop_path: TMDB_BDROP + '/lP7VKiMFMCUJTDPMBPGKhbOMPiU.jpg',
    trailerKey: 'ESEUoa-mz2s', tags: ['Mind-Bending', 'Complex', 'Atmospheric'], type: 'tv'
  },
  {
    id: 4, title: 'The Crown', year: '2016', match: '91%', seasons: '6 Seasons',
    genre: ['Drama', 'Romance', 'History'], vote_average: 8.1,
    overview: "This drama follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    poster_path:   TMDB_IMG   + '/1M876KPjulVwppEpldhdc8V4o68.jpg',
    backdrop_path: TMDB_BDROP + '/oboBn4VYB79uDxnyIri4Kc3M5Df.jpg',
    trailerKey: 'JWtnJjn6ng0', tags: ['Regal', 'Emotional', 'Lavish'], type: 'tv'
  },
  {
    id: 5, title: 'Interstellar', year: '2014', match: '96%', seasons: '2h 49min',
    genre: ['Sci-Fi', 'Drama', 'Adventure'], vote_average: 8.6,
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. Directed by Christopher Nolan — a visual and emotional masterpiece.",
    poster_path:   TMDB_IMG   + '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: TMDB_BDROP + '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    trailerKey: 'zSWdZVtXT7E', tags: ['Epic', 'Emotional', 'Visionary'], type: 'movie'
  },
  {
    id: 6, title: 'Mindhunter', year: '2017', match: '93%', seasons: '2 Seasons',
    genre: ['Thriller', 'Drama', 'Crime'], vote_average: 8.6,
    overview: "Set in the late 1970s, two FBI agents broaden the tools used for modern criminal investigation by delving into the psychology of murder.",
    poster_path:   TMDB_IMG   + '/lOSdUkGQmbAl5JQ3QoHqBZUbZhC.jpg',
    backdrop_path: TMDB_BDROP + '/czGLa9tcZygFdGMx9yIZWFhDOyz.jpg',
    trailerKey: '_5PNBaP6VFk', tags: ['Disturbing', 'Psychological', 'Gripping'], type: 'tv'
  },
  {
    id: 7, title: 'Squid Game', year: '2021', match: '98%', seasons: '2 Seasons',
    genre: ['Thriller', 'Drama', 'Action'], vote_average: 7.8,
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits — with deadly high stakes.",
    poster_path:   TMDB_IMG   + '/dDlEmu3EZ0Pgg93X2Gu3K5BVA8X.jpg',
    backdrop_path: TMDB_BDROP + '/qw3J9cNeLioOLoR68WX7z79aCdK.jpg',
    trailerKey: 'oqxAJKy0ii4', tags: ['Intense', 'Shocking', 'Violent'], type: 'tv'
  },
  {
    id: 8, title: 'The Witcher', year: '2019', match: '89%', seasons: '3 Seasons',
    genre: ['Action', 'Fantasy', 'Drama'], vote_average: 8.1,
    overview: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    poster_path:   TMDB_IMG   + '/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
    backdrop_path: TMDB_BDROP + '/jBJWaqoSCiARWtfV0GlqHrcdidd.jpg',
    trailerKey: 'ndl1W4ltcmg', tags: ['Fantasy', 'Epic', 'Dark'], type: 'tv'
  },
  {
    id: 9, title: 'Ozark', year: '2017', match: '95%', seasons: '4 Seasons',
    genre: ['Thriller', 'Drama', 'Crime'], vote_average: 8.4,
    overview: "A financial advisor drags his family from Chicago to Missouri, where he launders money for a drug lord and becomes entangled with local criminals.",
    poster_path:   TMDB_IMG   + '/pCGyPVrI9Fzc6ULI8BrfmbFCBON.jpg',
    backdrop_path: TMDB_BDROP + '/5rlh6OC9QAzuFvUo1AQDYS7mJqz.jpg',
    trailerKey: '5hAXVqrljbs', tags: ['Tense', 'Family Drama', 'Crime'], type: 'tv'
  },
  {
    id: 10, title: 'Money Heist', year: '2017', match: '92%', seasons: '5 Seasons',
    genre: ['Thriller', 'Action', 'Crime'], vote_average: 8.2,
    overview: "An enigmatic genius known as 'The Professor' plans the most ambitious heist in history, taking hostages at the Royal Mint of Spain.",
    poster_path:   TMDB_IMG   + '/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg',
    backdrop_path: TMDB_BDROP + '/gFldUjOOFnJCdHxKr0Kbf2YJMHY.jpg',
    trailerKey: '_InqQJRqewW4', tags: ['Clever', 'Stylish', 'Twisty'], type: 'tv'
  },
  {
    id: 11, title: 'Narcos', year: '2015', match: '90%', seasons: '3 Seasons',
    genre: ['Drama', 'Action', 'Crime'], vote_average: 8.8,
    overview: "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar, as well as the many other drug kingpins who rose to replace him.",
    poster_path:   TMDB_IMG   + '/rTmal9fDbwh5F0waol2hq35U4ah.jpg',
    backdrop_path: TMDB_BDROP + '/1Identf3BpTIzHNkH2bPCC1TVIL.jpg',
    trailerKey: 'U7elNhHwX4g', tags: ['Gritty', 'True Story', 'Violent'], type: 'tv'
  },
  {
    id: 12, title: 'The Last of Us', year: '2023', match: '97%', seasons: '2 Seasons',
    genre: ['Sci-Fi', 'Drama', 'Action'], vote_average: 8.8,
    overview: "Joel and Ellie, connected through the harshness of the world, must survive a dangerous journey across post-pandemic America ruled by a fungal infection.",
    poster_path:   TMDB_IMG   + '/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    backdrop_path: TMDB_BDROP + '/8Our2bMQra6KMoFb3N7GQaIKVEC.jpg',
    trailerKey: 'uLtkt8BonwM', tags: ['Post-Apocalyptic', 'Emotional', 'Brutal'], type: 'tv'
  },
  {
    id: 13, title: 'Inception', year: '2010', match: '95%', seasons: '2h 28min',
    genre: ['Sci-Fi', 'Action', 'Thriller'], vote_average: 8.8,
    overview: "A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    poster_path:   TMDB_IMG   + '/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    backdrop_path: TMDB_BDROP + '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    trailerKey: 'YoHD9XEInc0', tags: ['Mind-Bending', 'Epic', 'Thriller'], type: 'movie'
  },
  {
    id: 14, title: 'The Dark Knight', year: '2008', match: '98%', seasons: '2h 32min',
    genre: ['Action', 'Drama', 'Crime'], vote_average: 9.0,
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and DA Harvey Dent, he sets out to dismantle the Joker's reign of terror.",
    poster_path:   TMDB_IMG   + '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: TMDB_BDROP + '/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    trailerKey: 'EXeTwQWrcwY', tags: ['Intense', 'Crime', 'Award-Winning'], type: 'movie'
  },
  {
    id: 15, title: 'Dune', year: '2021', match: '93%', seasons: '2h 35min',
    genre: ['Sci-Fi', 'Action', 'Drama'], vote_average: 8.0,
    overview: "Paul Atreides, a brilliant and gifted young man born into a great destiny, must travel to the most dangerous planet in the universe to ensure the future of his family.",
    poster_path:   TMDB_IMG   + '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
    backdrop_path: TMDB_BDROP + '/iopYFB1b6Bh7FWZh3onQhph1sih.jpg',
    trailerKey: 'n9xhJrPXop4', tags: ['Epic', 'Visionary', 'Sci-Fi'], type: 'movie'
  },
  {
    id: 16, title: 'Wednesday', year: '2022', match: '94%', seasons: '2 Seasons',
    genre: ['Horror', 'Comedy', 'Drama'], vote_average: 8.1,
    overview: "Wednesday Addams investigates a murder spree at Nevermore Academy while trying to master her supernatural abilities and new friendships.",
    poster_path:   TMDB_IMG   + '/jeGtaMwGxPmQN5xM4ClnwPQcDME.jpg',
    backdrop_path: TMDB_BDROP + '/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg',
    trailerKey: 'Di310Buh5Yg', tags: ['Dark Comedy', 'Supernatural', 'Teen'], type: 'tv'
  },
  {
    id: 17, title: 'Oppenheimer', year: '2023', match: '96%', seasons: '3h 0min',
    genre: ['Drama', 'History', 'Thriller'], vote_average: 8.2,
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during WWII. Directed by Christopher Nolan.",
    poster_path:   TMDB_IMG   + '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop_path: TMDB_BDROP + '/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    trailerKey: 'bK6ldnih4n0', tags: ['Biographical', 'Epic', 'Award-Winning'], type: 'movie'
  },
  {
    id: 18, title: 'The Bear', year: '2022', match: '95%', seasons: '3 Seasons',
    genre: ['Drama', 'Comedy'], vote_average: 8.8,
    overview: "A young chef from the fine dining world returns to Chicago to run his family's sandwich shop after a personal tragedy, and must transform it into something better.",
    poster_path:   TMDB_IMG   + '/sHFlbKS3WLqMnp9t2ghADIJFnuQ.jpg',
    backdrop_path: TMDB_BDROP + '/84PpCAlDCc76b02jIOdXJtMEAdX.jpg',
    trailerKey: 'O7zqpTDwdAM', tags: ['Intense', 'Raw', 'Award-Winning'], type: 'tv'
  },
  {
    id: 19, title: 'Peaky Blinders', year: '2013', match: '96%', seasons: '6 Seasons',
    genre: ['Drama', 'Crime', 'Thriller'], vote_average: 8.8,
    overview: "A gangster family epic set in 1900s England, centering on a gang who sew razor blades in the peaks of their caps, and their aspirations to move up in the world.",
    poster_path:   TMDB_IMG   + '/vUUqzWa2LnFILyKATIKhHqkEKAm.jpg',
    backdrop_path: TMDB_BDROP + '/wiE9doxiLwq3WgBelow88I0dRMS.jpg',
    trailerKey: 'oVzVoodCPvM', tags: ['Stylish', 'Crime', 'Period Drama'], type: 'tv'
  },
  {
    id: 20, title: 'The Mandalorian', year: '2019', match: '91%', seasons: '3 Seasons',
    genre: ['Sci-Fi', 'Action', 'Adventure'], vote_average: 8.5,
    overview: "After the fall of the Empire, a lone gunfighter makes his way through the outer reaches of the lawless galaxy with his unlikely companion.",
    poster_path:   TMDB_IMG   + '/eU1i6eHXlzMOlEq0ku1Rzq7Y4wA.jpg',
    backdrop_path: TMDB_BDROP + '/9ijMGlJKqcslswWUzTEwScm82Gs.jpg',
    trailerKey: 'aOC8E8z_ifw', tags: ['Space Western', 'Action', 'Fan Favorite'], type: 'tv'
  },
];

const CONTINUE_DATA = [
  { ...LOCAL_MOVIES[0], progress: 65 },
  { ...LOCAL_MOVIES[1], progress: 30 },
  { ...LOCAL_MOVIES[6], progress: 82 },
  { ...LOCAL_MOVIES[9], progress: 45 },
  { ...LOCAL_MOVIES[11], progress: 15 },
];

/* ─────────────────────────────────────────────
   STATE
───────────────────────────────────────────── */
const STATE = {
  movies:       [],
  tvShows:      [],
  allData:      [],
  myList:       new Set(),
  watchHistory: {},     // { id: progress% }
  activeRoute:  'home',
  currentModal: null,
  currentPlayer:null,
  theme:        'dark',
  searchTimer:  null,
  playerTimer:  null,
};

/* ─────────────────────────────────────────────
   DOM REFERENCES
───────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const DOM = {
  navbar:           $('navbar'),
  heroBg:           $('heroBg'),
  heroSkeleton:     $('heroSkeleton'),
  heroReal:         $('heroReal'),
  heroTitle:        $('heroTitle'),
  heroMatch:        $('heroMatch'),
  heroYear:         $('heroYear'),
  heroRating:       $('heroRating'),
  heroGenre:        $('heroGenre'),
  heroDesc:         $('heroDesc'),
  heroMaturity:     $('heroMaturity'),
  heroPlay:         $('heroPlay'),
  heroInfo:         $('heroInfo'),
  genreTabs:        $('genreTabs'),
  cwRow:            $('cwRow'),
  trendRow:         $('trendRow'),
  top10Row:         $('top10Row'),
  popularRow:       $('popularRow'),
  topratedRow:      $('topratedRow'),
  actionRow:        $('actionRow'),
  tvRow:            $('tvRow'),
  tvTopRow:         $('tvTopRow'),
  movNowRow:        $('movNowRow'),
  movUpRow:         $('movUpRow'),
  newRow:           $('newRow'),
  myListRow:        $('myListRow'),
  emptyMyList:      $('emptyMyList'),
  searchInput:      $('searchInput'),
  navSearch:        $('navSearch'),
  searchIcon:       $('searchIcon'),
  searchGrid:       $('searchGrid'),
  searchHeading:    $('searchHeading'),
  searchSubheading: $('searchSubheading'),
  featuredBanner:   $('featuredBanner'),
  themeToggle:      $('themeToggle'),
  pdToggleTheme:    $('pdToggleTheme'),
  notifBtn:         $('notifBtn'),
  avatarBtn:        $('avatarBtn'),
  pdName:           $('pdName'),
  pdEmail:          $('pdEmail'),
  hamburger:        $('hamburger'),
  mobileDrawer:     $('mobileDrawer'),
  signoutBtn:       $('signoutBtn'),
  modalBackdrop:    $('modalBackdrop'),
  modal:            $('modal'),
  modalImg:         $('modalImg'),
  modalClose:       $('modalClose'),
  modalTitle:       $('modalTitle'),
  modalMatch:       $('modalMatch'),
  modalYear:        $('modalYear'),
  modalSeasons:     $('modalSeasons'),
  modalRating:      $('modalRating'),
  modalDesc:        $('modalDesc'),
  modalGenres:      $('modalGenres'),
  modalVote:        $('modalVote'),
  modalTags:        $('modalTags'),
  modalCast:        $('modalCast'),
  modalMore:        $('modalMore'),
  modalPlayBtn:     $('modalPlayBtn'),
  modalListBtn:     $('modalListBtn'),
  modalLikeBtn:     $('modalLikeBtn'),
  modalShareBtn:    $('modalShareBtn'),
  listIcon:         $('listIcon'),
  playerBackdrop:   $('playerBackdrop'),
  playerWrap:       $('playerWrap'),
  playerScreen:     $('playerScreen'),
  playerTitle:      $('playerTitle'),
  playerLoading:    $('playerLoading'),
  playerClose:      $('playerClose'),
  playerProgress:   $('playerProgress'),
  playerPlayed:     $('playerPlayed'),
  playerTime:       $('playerTime'),
  playerDuration:   $('playerDuration'),
  plPlay:           $('plPlay'),
  plMute:           $('plMute'),
  plVolume:         $('plVolume'),
  plFullscreen:     $('plFullscreen'),
  plSkipBack:       $('plSkipBack'),
  plSkipFwd:        $('plSkipFwd'),
  shortcutsPanel:   $('shortcutsPanel'),
  closeShortcuts:   $('closeShortcuts'),
  backToTop:        $('backToTop'),
  toast:            $('toast'),
};

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

let toastTimer;
function showToast(msg, type = '') {
  DOM.toast.textContent = msg;
  DOM.toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => DOM.toast.classList.remove('show'), 2800);
}

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/* ─────────────────────────────────────────────
   TMDB API
───────────────────────────────────────────── */
async function tmdbFetch(endpoint) {
  if (!CONFIG.USE_TMDB || CONFIG.TMDB_KEY === 'YOUR_TMDB_API_KEY_HERE') return null;
  try {
    const res = await fetch(`${CONFIG.TMDB_BASE}${endpoint}?api_key=${CONFIG.TMDB_KEY}&language=en-US`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function normalizeTmdb(item, type = 'movie') {
  const isTV = type === 'tv' || item.first_air_date;
  return {
    id:           item.id,
    title:        item.title || item.name,
    year:         (item.release_date || item.first_air_date || '').slice(0, 4),
    match:        `${Math.floor(item.vote_average * 10)}%`,
    seasons:      isTV ? 'TV Series' : `${Math.floor((item.runtime || 100) / 60)}h ${(item.runtime || 100) % 60}min`,
    genre:        (item.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean),
    vote_average: item.vote_average,
    overview:     item.overview,
    poster_path:  item.poster_path ? CONFIG.TMDB_IMG + item.poster_path : '',
    backdrop_path:item.backdrop_path ? CONFIG.TMDB_BDROP + item.backdrop_path : '',
    trailerKey:   '',
    tags:         [],
    type:         isTV ? 'tv' : 'movie',
  };
}

const GENRE_MAP = {
  28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',
  99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
  27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Science Fiction',
  10770:'TV Movie',53:'Thriller',10752:'War',37:'Western',
  10759:'Action & Adventure',10762:'Kids',10763:'News',10764:'Reality',
  10765:'Sci-Fi & Fantasy',10766:'Soap',10767:'Talk',10768:'War & Politics',10765:'Fantasy',
};

/* ─────────────────────────────────────────────
   DATA LOADING
───────────────────────────────────────────── */
async function loadData() {
  let trending, popular, topRated, action, tvPopular, tvTop, nowPlaying, upcoming;

  if (CONFIG.USE_TMDB && CONFIG.TMDB_KEY !== 'YOUR_TMDB_API_KEY_HERE') {
    [trending, popular, topRated, action, tvPopular, tvTop, nowPlaying, upcoming] = await Promise.all([
      tmdbFetch('/trending/all/week'),
      tmdbFetch('/movie/popular'),
      tmdbFetch('/movie/top_rated'),
      tmdbFetch('/discover/movie?with_genres=28'),
      tmdbFetch('/tv/popular'),
      tmdbFetch('/tv/top_rated'),
      tmdbFetch('/movie/now_playing'),
      tmdbFetch('/movie/upcoming'),
    ]);
  }

  // Normalize or fallback
  const norm = (data, type) => data?.results?.map(i => normalizeTmdb(i, type)) || null;

  STATE.allData    = norm(trending, 'movie')   || LOCAL_MOVIES;
  STATE.movies     = norm(popular, 'movie')    || LOCAL_MOVIES.filter(m => m.type === 'movie');
  STATE.tvShows    = norm(tvPopular, 'tv')     || LOCAL_MOVIES.filter(m => m.type === 'tv');
  STATE.topRated   = norm(topRated, 'movie')   || shuffle(LOCAL_MOVIES);
  STATE.action     = norm(action, 'movie')     || LOCAL_MOVIES.filter(m => m.genre.includes('Action'));
  STATE.tvTop      = norm(tvTop, 'tv')         || shuffle(LOCAL_MOVIES.filter(m => m.type === 'tv'));
  STATE.nowPlaying = norm(nowPlaying, 'movie') || shuffle(LOCAL_MOVIES.filter(m => m.type === 'movie'));
  STATE.upcoming   = norm(upcoming, 'movie')   || shuffle(LOCAL_MOVIES.filter(m => m.type === 'movie'));
  STATE.newRel     = norm(upcoming, 'movie')   || shuffle(LOCAL_MOVIES);
}

/* ─────────────────────────────────────────────
   LOCAL STORAGE
───────────────────────────────────────────── */
function saveMyList() {
  localStorage.setItem('sf_mylist', JSON.stringify([...STATE.myList]));
}
function loadMyList() {
  const saved = localStorage.getItem('sf_mylist');
  if (saved) STATE.myList = new Set(JSON.parse(saved));
}
function saveWatchHistory() {
  localStorage.setItem('sf_history', JSON.stringify(STATE.watchHistory));
}
function loadWatchHistory() {
  const saved = localStorage.getItem('sf_history');
  if (saved) STATE.watchHistory = JSON.parse(saved);
}
function loadSession() {
  const sess = JSON.parse(localStorage.getItem('sf_session') || 'null');
  if (sess) {
    if (DOM.pdName)  DOM.pdName.textContent  = sess.name  || 'User';
    if (DOM.pdEmail) DOM.pdEmail.textContent = sess.email || '';
    if (DOM.avatarBtn) DOM.avatarBtn.textContent = (sess.name || 'U')[0].toUpperCase();
  }
}

/* ─────────────────────────────────────────────
   THEME
───────────────────────────────────────────── */
function initTheme() {
  const saved = localStorage.getItem('sf_theme') || 'dark';
  STATE.theme = saved;
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeUI(saved);
}
function toggleTheme() {
  STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', STATE.theme);
  localStorage.setItem('sf_theme', STATE.theme);
  updateThemeUI(STATE.theme);
  showToast(`${STATE.theme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode enabled`, 'info');
}
function updateThemeUI(theme) {
  const isDark = theme === 'dark';
  if (DOM.themeToggle)   DOM.themeToggle.textContent   = isDark ? '🌙' : '☀️';
  if (DOM.pdToggleTheme) DOM.pdToggleTheme.textContent = isDark ? '🌙 Dark Mode' : '☀️ Light Mode';
}

/* ─────────────────────────────────────────────
   URL ROUTING
───────────────────────────────────────────── */
const ROUTES = ['home','tv','movies','new','mylist','search'];

function navigate(route) {
  window.location.hash = route === 'home' ? '/' : `/${route}`;
}

function handleRoute() {
  const hash  = window.location.hash.slice(1) || '/';
  const route = hash === '/' ? 'home' : hash.slice(1).split('?')[0] || 'home';
  const valid = ROUTES.includes(route) ? route : 'home';
  STATE.activeRoute = valid;

  // Hide all views
  ROUTES.forEach(r => {
    const el = $(`view-${r}`);
    if (el) { el.classList.add('hidden'); el.classList.remove('page-view'); }
  });

  // Show current
  const el = $(`view-${valid}`);
  if (el) { el.classList.remove('hidden'); el.classList.add('page-view'); }

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.route === valid);
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Load route-specific data
  if (valid === 'tv')      renderTVView();
  if (valid === 'movies')  renderMoviesView();
  if (valid === 'new')     renderNewView();
  if (valid === 'mylist')  renderMyListView();
  if (valid === 'home')    renderHomeView();
}

/* ─────────────────────────────────────────────
   CARD FACTORY
───────────────────────────────────────────── */
const FALLBACK_IMG = 'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93X2Gu3K5BVA8X.jpg';

function getImg(m) {
  return m.poster_path || FALLBACK_IMG;
}
function getBdrop(m) {
  return m.backdrop_path || m.poster_path || FALLBACK_IMG;
}

function createCard(movie, type = 'normal') {
  const card = document.createElement('div');
  card.className = `card ${type !== 'normal' ? type : ''}`.trim();
  card.dataset.id = movie.id;

  const inList = STATE.myList.has(movie.id);
  const rankHTML = type === 'top10' ? `<div class="card-rank">${movie._rank}</div>` : '';
  const progress = STATE.watchHistory[movie.id] || movie.progress || 0;
  const progressHTML = type === 'wide'
    ? `<div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>`
    : '';

  card.innerHTML = `
    ${rankHTML}
    <div class="card-inner">
      <img class="card-img" src="${getImg(movie)}" alt="${movie.title}" loading="lazy" onerror="this.src=FALLBACK_IMG"/>
      ${progressHTML}
      <div class="card-overlay">
        <div class="card-actions">
          <button class="card-btn play" data-action="play" title="Play">&#9658;</button>
          <button class="card-btn ${inList ? 'in-list' : ''}" data-action="list" title="${inList ? 'Remove from' : 'Add to'} My List">${inList ? '✓' : '+'}</button>
          <button class="card-btn" data-action="like" title="Like">👍</button>
        </div>
        <div class="card-title">${movie.title}</div>
        <div class="card-info">
          <span class="card-match">${movie.match || `${Math.round((movie.vote_average||7)*10)}%`}</span>
          <span class="card-year">${movie.year}</span>
        </div>
        <div class="card-genres">${(movie.genre||[]).slice(0,2).join(' · ')}</div>
      </div>
    </div>
  `;

  card.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'play')  { e.stopPropagation(); openPlayer(movie); }
    else if (action === 'list') { e.stopPropagation(); toggleMyList(movie, card.querySelector('[data-action="list"]')); }
    else if (action === 'like') { e.stopPropagation(); showToast(`👍 Rated "${movie.title}"`, 'success'); }
    else openModal(movie);
  });

  return card;
}

function populateRow(el, movies, type = 'normal') {
  if (!el) return;
  el.innerHTML = '';
  if (!movies || !movies.length) {
    el.innerHTML = '<p style="color:var(--muted);padding:20px;font-size:0.88rem">No titles found.</p>';
    return;
  }
  movies.forEach((m, i) => el.appendChild(createCard({ ...m, _rank: i + 1 }, type)));
}

/* ─────────────────────────────────────────────
   RENDER VIEWS
───────────────────────────────────────────── */
function renderHero(movie) {
  if (!movie) return;
  DOM.heroBg.style.backgroundImage = `url('${getBdrop(movie)}')`;
  DOM.heroTitle.textContent   = movie.title;
  DOM.heroMatch.textContent   = movie.match || `${Math.round((movie.vote_average||8)*10)}%`;
  DOM.heroYear.textContent    = movie.year;
  DOM.heroRating.textContent  = 'PG-13';
  DOM.heroGenre.textContent   = (movie.genre||[]).slice(0,2).join(' · ');
  DOM.heroDesc.textContent    = movie.overview;
  DOM.heroMaturity.textContent = 'PG-13';

  DOM.heroSkeleton.classList.add('hidden');
  DOM.heroReal.classList.remove('hidden');

  // Trigger zoom
  setTimeout(() => DOM.heroBg.classList.add('zoomed'), 100);
}

function renderHomeView() {
  const all = STATE.allData.length ? STATE.allData : LOCAL_MOVIES;

  renderHero(all[0]);

  // Skeletons already shown; replace with real data
  populateContinueWatching();
  populateRow(DOM.trendRow, all);
  populateRow(DOM.top10Row, all.slice(0, 10), 'top10');
  populateRow(DOM.popularRow, STATE.movies.length ? STATE.movies : shuffle(all));
  populateRow(DOM.topratedRow, STATE.topRated?.length ? STATE.topRated : shuffle(all));
  populateRow(DOM.actionRow, STATE.action?.length ? STATE.action : all.filter(m => (m.genre||[]).includes('Action')));

  renderFeaturedBanner(all[4] || all[0]);
}

function renderTVView() {
  const tv = STATE.tvShows.length ? STATE.tvShows : LOCAL_MOVIES.filter(m => m.type === 'tv');
  populateRow(DOM.tvRow, tv);
  populateRow(DOM.tvTopRow, STATE.tvTop?.length ? STATE.tvTop : shuffle(tv));
}

function renderMoviesView() {
  const mov = STATE.movies.length ? STATE.movies : LOCAL_MOVIES.filter(m => m.type === 'movie');
  populateRow(DOM.movNowRow, STATE.nowPlaying?.length ? STATE.nowPlaying : mov);
  populateRow(DOM.movUpRow, STATE.upcoming?.length ? STATE.upcoming : shuffle(mov));
}

function renderNewView() {
  const n = STATE.newRel?.length ? STATE.newRel : shuffle(LOCAL_MOVIES);
  populateRow(DOM.newRow, n);
}

function renderMyListView() {
  const listed = LOCAL_MOVIES.filter(m => STATE.myList.has(m.id));
  DOM.emptyMyList.style.display = listed.length ? 'none' : 'flex';
  populateRow(DOM.myListRow, listed);
}

function populateContinueWatching() {
  DOM.cwRow.innerHTML = '';
  CONTINUE_DATA.forEach(m => {
    const prog = STATE.watchHistory[m.id] || m.progress;
    DOM.cwRow.appendChild(createCard({ ...m, progress: prog }, 'wide'));
  });
}

function renderFeaturedBanner(movie) {
  if (!movie || !DOM.featuredBanner) return;
  DOM.featuredBanner.innerHTML = `
    <img src="${getBdrop(movie)}" alt="${movie.title}" loading="lazy" onerror="this.style.display='none'"/>
    <div class="featured-overlay">
      <div class="featured-content">
        <div class="fb-tag">🎬 Now Streaming</div>
        <div class="fb-title">${movie.title}</div>
        <div class="fb-desc">${(movie.overview||'').slice(0,140)}…</div>
        <button class="btn fb-btn" id="featuredPlay">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
          Watch Now
        </button>
      </div>
    </div>
  `;
  DOM.featuredBanner.addEventListener('click', () => openModal(movie));
  $('featuredPlay')?.addEventListener('click', (e) => { e.stopPropagation(); openPlayer(movie); });
}

/* ─────────────────────────────────────────────
   MY LIST
───────────────────────────────────────────── */
function toggleMyList(movie, btn) {
  if (STATE.myList.has(movie.id)) {
    STATE.myList.delete(movie.id);
    if (btn) { btn.textContent = '+'; btn.classList.remove('in-list'); }
    showToast(`Removed "${movie.title}" from My List`);
  } else {
    STATE.myList.add(movie.id);
    if (btn) { btn.textContent = '✓'; btn.classList.add('in-list'); }
    showToast(`Added "${movie.title}" to My List ✓`, 'success');
  }
  saveMyList();
  if (STATE.activeRoute === 'mylist') renderMyListView();
}

function updateModalListBtn(inList) {
  DOM.modalListBtn?.classList.toggle('liked', inList);
  if (DOM.listIcon) {
    DOM.listIcon.innerHTML = inList
      ? '<polyline points="20 6 9 17 4 12" stroke-width="2.5"/>'
      : '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>';
  }
  if (DOM.modalListBtn) DOM.modalListBtn.title = inList ? 'Remove from My List' : 'Add to My List';
}

/* ─────────────────────────────────────────────
   MODAL
───────────────────────────────────────────── */
function openModal(movie) {
  STATE.currentModal = movie;
  DOM.modalImg.src           = getBdrop(movie);
  DOM.modalTitle.textContent = movie.title;
  DOM.modalMatch.textContent = movie.match || `${Math.round((movie.vote_average||8)*10)}% Match`;
  DOM.modalYear.textContent  = movie.year;
  DOM.modalSeasons.textContent = movie.seasons || '';
  DOM.modalRating.textContent  = 'PG-13';
  DOM.modalDesc.textContent    = movie.overview || '';
  DOM.modalGenres.textContent  = (movie.genre||[]).join(', ');
  DOM.modalVote.textContent    = movie.vote_average ? `⭐ ${movie.vote_average}/10` : '';
  DOM.modalTags.innerHTML      = (movie.tags||[]).map(t => `<span class="tag">${t}</span>`).join('');
  updateModalListBtn(STATE.myList.has(movie.id));

  // More like this
  const similar = LOCAL_MOVIES.filter(m => m.id !== movie.id && (m.genre||[]).some(g => (movie.genre||[]).includes(g))).slice(0, 6);
  DOM.modalMore.innerHTML = similar.length ? `
    <div class="more-title">More Like This</div>
    <div class="more-grid">
      ${similar.map(m => `
        <div class="more-card" onclick="openModal(LOCAL_MOVIES.find(x=>x.id===${m.id}))">
          <img src="${getImg(m)}" alt="${m.title}" loading="lazy"/>
          <div class="more-card-title">${m.title}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  DOM.modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  DOM.modal.scrollTop = 0;
}

function closeModal() {
  DOM.modalBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  STATE.currentModal = null;
}

/* ─────────────────────────────────────────────
   VIDEO PLAYER
───────────────────────────────────────────── */
let playerInterval = null;
let playerProgress = 0;
let playerDuration = 150; // seconds (simulated)
let playerPlaying  = true;
let playerMuted    = false;
let playerVolume   = 80;

function openPlayer(movie) {
  STATE.currentPlayer = movie;
  DOM.playerTitle.textContent = movie.title;
  DOM.playerLoading.style.display = 'flex';
  DOM.playerBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Inject YouTube iframe
  const key = movie.trailerKey;
  if (key) {
    setTimeout(() => {
      DOM.playerLoading.style.display = 'none';
      const existing = DOM.playerScreen.querySelector('iframe');
      if (existing) existing.remove();
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${key}?autoplay=1&controls=0&modestbranding=1&rel=0`;
      iframe.allow = 'autoplay; fullscreen';
      iframe.allowFullscreen = true;
      DOM.playerScreen.appendChild(iframe);
    }, 800);
  } else {
    // Simulated player
    setTimeout(() => {
      DOM.playerLoading.innerHTML = `
        <img src="${getBdrop(movie)}" style="width:100%;height:100%;object-fit:cover;opacity:0.4;position:absolute;inset:0;"/>
        <div style="position:relative;text-align:center;color:#fff">
          <div style="font-size:4rem;margin-bottom:8px">▶</div>
          <p style="font-size:0.9rem;color:#aaa">Trailer unavailable — add your TMDb API key</p>
        </div>
      `;
    }, 1000);
  }

  // Simulated progress bar
  playerProgress = STATE.watchHistory[movie.id] ? (STATE.watchHistory[movie.id] / 100) * playerDuration : 0;
  startPlayerTimer();
}

function closePlayer() {
  DOM.playerBackdrop.classList.remove('open');
  document.body.style.overflow = '';
  clearInterval(playerInterval);

  // Save watch progress
  if (STATE.currentPlayer) {
    const pct = Math.round((playerProgress / playerDuration) * 100);
    STATE.watchHistory[STATE.currentPlayer.id] = pct;
    saveWatchHistory();
    showToast(`Progress saved at ${pct}%`, 'success');
  }

  // Remove iframe
  const iframe = DOM.playerScreen.querySelector('iframe');
  if (iframe) iframe.remove();
  DOM.playerLoading.style.display = 'flex';
  DOM.playerLoading.innerHTML = '<div class="spinner"></div><p>Loading trailer…</p>';
  STATE.currentPlayer = null;
}

function startPlayerTimer() {
  clearInterval(playerInterval);
  playerInterval = setInterval(() => {
    if (!playerPlaying) return;
    playerProgress = Math.min(playerProgress + 1, playerDuration);
    updatePlayerUI();
    if (playerProgress >= playerDuration) clearInterval(playerInterval);
  }, 1000);
}

function updatePlayerUI() {
  const pct = (playerProgress / playerDuration) * 100;
  if (DOM.playerPlayed) DOM.playerPlayed.style.width = `${pct}%`;
  if ($('playerThumb'))  $('playerThumb').style.left  = `${pct}%`;
  if (DOM.playerTime)    DOM.playerTime.textContent   = fmtTime(playerProgress);
  if (DOM.playerDuration) DOM.playerDuration.textContent = fmtTime(playerDuration);
}

/* ─────────────────────────────────────────────
   SEARCH (debounced)
───────────────────────────────────────────── */
const doSearch = debounce((query) => {
  const q = query.trim().toLowerCase();
  if (!q) { if (STATE.activeRoute === 'search') navigate('home'); return; }

  // Show search view
  ROUTES.forEach(r => { const el = $(`view-${r}`); if (el) el.classList.add('hidden'); });
  const sv = $('view-search');
  if (sv) { sv.classList.remove('hidden'); sv.classList.add('page-view'); }

  const results = LOCAL_MOVIES.filter(m =>
    m.title.toLowerCase().includes(q) ||
    (m.genre||[]).some(g => g.toLowerCase().includes(q)) ||
    (m.overview||'').toLowerCase().includes(q)
  );

  if (DOM.searchHeading)    DOM.searchHeading.textContent    = `Results for "${query}"`;
  if (DOM.searchSubheading) DOM.searchSubheading.textContent = `${results.length} title${results.length !== 1 ? 's' : ''} found`;

  if (DOM.searchGrid) {
    DOM.searchGrid.innerHTML = '';
    if (!results.length) {
      DOM.searchGrid.innerHTML = `<div style="color:var(--muted);grid-column:1/-1;padding:40px;text-align:center">
        <div style="font-size:2rem;margin-bottom:8px">🔍</div>
        <p>No results for "${query}". Try a different search.</p>
      </div>`;
    } else {
      results.forEach(m => DOM.searchGrid.appendChild(createCard(m)));
    }
  }

  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
}, 350);

/* ─────────────────────────────────────────────
   GENRE FILTER
───────────────────────────────────────────── */
function filterGenre(genre) {
  const all = LOCAL_MOVIES;
  const filtered = genre === 'All' ? all : all.filter(m => (m.genre||[]).includes(genre));
  populateRow(DOM.trendRow,  filtered);
  populateRow(DOM.top10Row,  filtered.slice(0, 10), 'top10');
  populateRow(DOM.popularRow, shuffle(filtered));
  populateRow(DOM.topratedRow, shuffle(filtered));
  populateRow(DOM.actionRow, shuffle(filtered));
  if (genre !== 'All') showToast(`Showing: ${genre}`, 'info');
}

/* ─────────────────────────────────────────────
   KEYBOARD SHORTCUTS
───────────────────────────────────────────── */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA';

    // Always available
    if (e.key === 'Escape') {
      if (DOM.shortcutsPanel?.classList.contains('open')) DOM.shortcutsPanel.classList.remove('open');
      else if (DOM.playerBackdrop?.classList.contains('open')) closePlayer();
      else closeModal();
      return;
    }
    if (e.key === '?') { DOM.shortcutsPanel?.classList.toggle('open'); return; }

    if (inInput) return; // don't trigger below if user is typing

    switch (e.key) {
      case ' ':
        e.preventDefault();
        playerPlaying = !playerPlaying;
        showToast(playerPlaying ? '▶ Playing' : '⏸ Paused', 'info');
        break;
      case 'F': case 'f':
        if (DOM.playerBackdrop?.classList.contains('open')) {
          DOM.playerWrap?.requestFullscreen?.();
        }
        break;
      case 'M': case 'm':
        playerMuted = !playerMuted;
        showToast(playerMuted ? '🔇 Muted' : '🔊 Unmuted', 'info');
        break;
      case 'ArrowLeft':
        playerProgress = Math.max(0, playerProgress - 10);
        updatePlayerUI();
        showToast('⏪ -10s', 'info');
        break;
      case 'ArrowRight':
        playerProgress = Math.min(playerDuration, playerProgress + 10);
        updatePlayerUI();
        showToast('⏩ +10s', 'info');
        break;
      case 'ArrowUp':
        playerVolume = Math.min(100, playerVolume + 10);
        if (DOM.plVolume) DOM.plVolume.value = playerVolume;
        showToast(`🔊 Volume ${playerVolume}%`, 'info');
        break;
      case 'ArrowDown':
        playerVolume = Math.max(0, playerVolume - 10);
        if (DOM.plVolume) DOM.plVolume.value = playerVolume;
        showToast(`🔉 Volume ${playerVolume}%`, 'info');
        break;
      case 'S': case 's':
        DOM.navSearch?.classList.add('open');
        DOM.searchInput?.focus();
        break;
      case 'T': case 't':
        toggleTheme();
        break;
      case '1': navigate('home');    break;
      case '2': navigate('tv');      break;
      case '3': navigate('movies'); break;
      case '4': navigate('new');     break;
      case '5': navigate('mylist'); break;
    }
  });
}

/* ─────────────────────────────────────────────
   SCROLL OBSERVER
───────────────────────────────────────────── */
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.row-section').forEach(s => observer.observe(s));
}

/* ─────────────────────────────────────────────
   PWA – SERVICE WORKER
───────────────────────────────────────────── */
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('✅ Service Worker registered'))
      .catch(e => console.warn('SW failed:', e));
  }
}

/* ─────────────────────────────────────────────
   EVENT BINDINGS
───────────────────────────────────────────── */
function bindEvents() {

  /* Nav */
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(a.dataset.route);
    });
  });
  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(el.dataset.route);
      DOM.hamburger?.classList.remove('open');
      DOM.mobileDrawer?.classList.remove('open');
    });
  });

  /* Hamburger */
  DOM.hamburger?.addEventListener('click', () => {
    DOM.hamburger.classList.toggle('open');
    DOM.mobileDrawer?.classList.toggle('open');
  });

  /* Search */
  DOM.searchIcon?.addEventListener('click', () => {
    DOM.navSearch?.classList.toggle('open');
    if (DOM.navSearch?.classList.contains('open')) DOM.searchInput?.focus();
  });
  DOM.searchInput?.addEventListener('input', e => doSearch(e.target.value));
  DOM.searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Escape') { DOM.navSearch?.classList.remove('open'); DOM.searchInput.value = ''; navigate('home'); }
  });

  /* Genre tabs */
  DOM.genreTabs?.addEventListener('click', e => {
    const tab = e.target.closest('.genre-tab');
    if (!tab) return;
    document.querySelectorAll('.genre-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filterGenre(tab.dataset.genre);
  });

  /* Hero */
  DOM.heroPlay?.addEventListener('click', () => STATE.currentModal ? openPlayer(STATE.currentModal) : openPlayer(LOCAL_MOVIES[0]));
  DOM.heroInfo?.addEventListener('click', () => openModal(LOCAL_MOVIES[0]));

  /* Row buttons */
  document.querySelectorAll('.row-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = $(btn.dataset.target);
      if (row) row.scrollBy({ left: (btn.classList.contains('row-btn-right') ? 1 : -1) * 640, behavior: 'smooth' });
    });
  });

  /* Modal */
  DOM.modalClose?.addEventListener('click', closeModal);
  DOM.modalBackdrop?.addEventListener('click', e => { if (e.target === DOM.modalBackdrop) closeModal(); });
  DOM.modalPlayBtn?.addEventListener('click', () => { if (STATE.currentModal) openPlayer(STATE.currentModal); closeModal(); });
  DOM.modalListBtn?.addEventListener('click', () => {
    if (!STATE.currentModal) return;
    toggleMyList(STATE.currentModal, null);
    updateModalListBtn(STATE.myList.has(STATE.currentModal.id));
  });
  DOM.modalLikeBtn?.addEventListener('click', () => { if (STATE.currentModal) showToast(`👍 Liked "${STATE.currentModal.title}"`, 'success'); });
  DOM.modalShareBtn?.addEventListener('click', () => {
    if (navigator.share && STATE.currentModal) {
      navigator.share({ title: STATE.currentModal.title, text: STATE.currentModal.overview, url: window.location.href });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('🔗 Link copied!', 'success');
    }
  });

  /* Player */
  DOM.playerClose?.addEventListener('click', closePlayer);
  DOM.playerBackdrop?.addEventListener('click', e => { if (e.target === DOM.playerBackdrop) closePlayer(); });
  DOM.plPlay?.addEventListener('click', () => { playerPlaying = !playerPlaying; showToast(playerPlaying ? '▶ Playing' : '⏸ Paused', 'info'); });
  DOM.plMute?.addEventListener('click', () => { playerMuted = !playerMuted; showToast(playerMuted ? '🔇 Muted' : '🔊 Unmuted', 'info'); });
  DOM.plVolume?.addEventListener('input', e => { playerVolume = e.target.value; });
  DOM.plSkipBack?.addEventListener('click', () => { playerProgress = Math.max(0, playerProgress - 10); updatePlayerUI(); showToast('⏪ -10s', 'info'); });
  DOM.plSkipFwd?.addEventListener('click',  () => { playerProgress = Math.min(playerDuration, playerProgress + 10); updatePlayerUI(); showToast('⏩ +10s', 'info'); });
  DOM.plFullscreen?.addEventListener('click', () => DOM.playerWrap?.requestFullscreen?.());
  DOM.playerProgress?.addEventListener('click', e => {
    const rect = DOM.playerProgress.getBoundingClientRect();
    playerProgress = ((e.clientX - rect.left) / rect.width) * playerDuration;
    updatePlayerUI();
  });

  /* Theme */
  DOM.themeToggle?.addEventListener('click', toggleTheme);
  DOM.pdToggleTheme?.addEventListener('click', e => { e.preventDefault(); toggleTheme(); });

  /* Notifications */
  DOM.notifBtn?.addEventListener('click', () => showToast('🔔 3 new titles added this week!', 'info'));

  /* Sign out */
  DOM.signoutBtn?.addEventListener('click', e => { e.preventDefault(); localStorage.removeItem('sf_session'); window.location.href = 'login.html'; });

  /* Shortcuts panel */
  DOM.closeShortcuts?.addEventListener('click', () => DOM.shortcutsPanel?.classList.remove('open'));

  /* Back to top */
  DOM.backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Scroll effects */
  window.addEventListener('scroll', () => {
    DOM.navbar?.classList.toggle('scrolled', window.scrollY > 60);
    DOM.backToTop?.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  /* Hash routing */
  window.addEventListener('hashchange', handleRoute);
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
async function init() {
  initTheme();
  loadSession();
  loadMyList();
  loadWatchHistory();

  bindEvents();
  initKeyboardShortcuts();
  registerSW();

  // Show skeletons, load data, then render
  await loadData();
  handleRoute();
  initScrollObserver();

  console.log('%c🎬 StreamFlix v2 — fully loaded!', 'color:#E50914;font-size:1.2rem;font-weight:bold;');
  console.log('%c💡 Set CONFIG.USE_TMDB = true and add your TMDb API key for live movie data!', 'color:#46d369;font-size:0.9rem;');
}

document.addEventListener('DOMContentLoaded', init);