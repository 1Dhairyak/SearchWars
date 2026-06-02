// ─── Mock Items ───────────────────────────────────────────────────────────────
// Phase 4: Replace with gameService.startSession() / gameService.submitGuess()

export const MOCK_ITEMS = [
  {
    id: 1,
    name: 'Budweiser',
    category: 'Brands',
    searchVolume: 301000,
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Corn Flakes',
    category: 'Food',
    searchVolume: 246000,
    imageUrl: 'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Grand Theft Auto',
    category: 'Gaming',
    searchVolume: 8100000,
    imageUrl: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Minecraft',
    category: 'Gaming',
    searchVolume: 11000000,
    imageUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Avengers',
    category: 'Movies',
    searchVolume: 5400000,
    imageUrl: 'https://images.unsplash.com/photo-1624213111452-35e8d3d5cc18?w=800&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Taylor Swift',
    category: 'Celebrities',
    searchVolume: 22200000,
    imageUrl: 'https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?w=800&auto=format&fit=crop',
  },
  {
    id: 7,
    name: 'Apple iPhone',
    category: 'Technology',
    searchVolume: 33100000,
    imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop',
  },
  {
    id: 8,
    name: 'Pizza',
    category: 'Food',
    searchVolume: 18100000,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop',
  },
  {
    id: 9,
    name: 'Elon Musk',
    category: 'Celebrities',
    searchVolume: 12400000,
    imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&auto=format&fit=crop',
  },
  {
    id: 10,
    name: 'Naruto',
    category: 'Anime',
    searchVolume: 9900000,
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop',
  },
  {
    id: 11,
    name: 'Netflix',
    category: 'Technology',
    searchVolume: 45000000,
    imageUrl: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop',
  },
  {
    id: 12,
    name: 'Fortnite',
    category: 'Gaming',
    searchVolume: 16600000,
    imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=800&auto=format&fit=crop',
  },
]

// ─── Mock Leaderboard ─────────────────────────────────────────────────────────
// Phase 4: Replace with leaderboardService.getTop()

export const MOCK_LEADERBOARD = [
  { rank: 1,  playerName: 'GigaBrain99',  score: 47, category: 'Gaming',      date: '2025-01-15' },
  { rank: 2,  playerName: 'SearchKing',   score: 42, category: 'Movies',      date: '2025-01-14' },
  { rank: 3,  playerName: 'TrendHunter', score: 38, category: 'Celebrities',  date: '2025-01-14' },
  { rank: 4,  playerName: 'QuizMaster',  score: 35, category: 'All',          date: '2025-01-13' },
  { rank: 5,  playerName: 'Anon_7734',   score: 31, category: 'Food',         date: '2025-01-13' },
  { rank: 6,  playerName: 'PixelRacer',  score: 28, category: 'Gaming',       date: '2025-01-12' },
  { rank: 7,  playerName: 'DataWizard',  score: 25, category: 'Technology',   date: '2025-01-12' },
  { rank: 8,  playerName: 'MemeL0rd',    score: 22, category: 'Internet',     date: '2025-01-11' },
  { rank: 9,  playerName: 'SportsFan_X', score: 19, category: 'Sports',       date: '2025-01-11' },
  { rank: 10, playerName: 'NightOwl22',  score: 16, category: 'Anime',        date: '2025-01-10' },
]
