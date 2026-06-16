// ─── The Odds API ────────────────────────────────────────────────────────────
// Get your free key at https://the-odds-api.com
export const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY || 'YOUR_KEY_HERE'
export const ODDS_API_BASE = 'https://api.the-odds-api.com/v4'

// ─── Betfair Proxy ───────────────────────────────────────────────────────────
// Once your Render proxy is deployed, paste the URL here
export const BETFAIR_PROXY_URL = import.meta.env.VITE_BETFAIR_PROXY_URL || null

// ─── Polling interval (ms) ───────────────────────────────────────────────────
export const POLL_INTERVAL = 30_000

// ─── Markets ─────────────────────────────────────────────────────────────────
export const MARKETS = [
  { id: 'h2h',      label: '1X2',       oddsApiKey: 'h2h' },
  { id: 'btts',     label: 'BTTS',      oddsApiKey: 'btts' },
  { id: 'totals',   label: 'Over/Under', oddsApiKey: 'totals' },
]

// ─── Sports ──────────────────────────────────────────────────────────────────
// Note: European club leagues (EPL, La Liga etc) are off June–July.
// World Cup 2026 is live now. Domestic leagues return August 2026.
export const SPORTS = [
  { id: 'soccer_fifa_world_cup',     label: 'World Cup 2026' },
  { id: 'soccer_conmebol_copa_america', label: 'Copa América' },
  { id: 'soccer_usa_mls',            label: 'MLS' },
  // European leagues — re-enable from August 2026
  // { id: 'soccer_epl',             label: 'Premier League' },
  // { id: 'soccer_spain_la_liga',   label: 'La Liga' },
  // { id: 'soccer_germany_bundesliga', label: 'Bundesliga' },
  // { id: 'soccer_italy_serie_a',   label: 'Serie A' },
  // { id: 'soccer_france_ligue_one',label: 'Ligue 1' },
  // { id: 'soccer_uefa_champs_league', label: 'Champions League' },
]

// ─── Bookmakers to show ───────────────────────────────────────────────────────
// Keys match The Odds API bookmaker IDs
export const BOOKMAKERS = [
  'bet365',
  'williamhill',
  'betfair_sb',
  'paddypower',
  'skybet',
  'ladbrokes',
  'coral',
  'unibet',
]
