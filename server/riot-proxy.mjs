// Hextech Rift — Riot API proxy (Node + Express).
// Why a proxy? Browsers can't call api.riotgames.com (no CORS) and the
// RIOT_API_KEY must never ship to the client. Run: `npm run proxy`
// Env: RIOT_API_KEY (see .env), PORT (default 4000).
import 'dotenv/config';
import express from 'express';

const PORT = Number(process.env.PORT || 4000);
const API_KEY = (process.env.RIOT_API_KEY || '').trim();

if (!API_KEY) {
  console.warn('[riot-proxy] RIOT_API_KEY missing — live endpoints will return 503.');
}

// Riot ID lookups use REGIONAL clusters; summoner/league use PLATFORM hosts.
const CLUSTER_FOR = {
  LAS: 'americas', LAN: 'americas', NA: 'americas', BR: 'americas',
  EUW: 'europe', EUNE: 'europe',
  KR: 'asia'
};
const PLATFORM_FOR = {
  LAS: 'la2', LAN: 'la1', NA: 'na1', BR: 'br1',
  EUW: 'euw1', EUNE: 'eun1',
  KR: 'kr'
};

// Tiny in-memory cache (dev keys are rate-limited: 100 req / 2 min).
const cache = new Map();
const CACHE_TTL_MS = 60_000;
function cached(key, loader) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.data;
  return loader().then((data) => {
    cache.set(key, { at: Date.now(), data });
    return data;
  });
}

async function riotFetch(url) {
  const res = await fetch(url, { headers: { 'X-Riot-Token': API_KEY } });
  if (res.status === 404) return null;
  if (res.status === 429) {
    const e = new Error('Riot rate limit exceeded (429). Wait ~2 min.');
    e.status = 429;
    throw e;
  }
  if (res.status === 401 || res.status === 403) {
    const e = new Error('Invalid or expired Riot API key (401/403). Regenerate it.');
    e.status = res.status;
    throw e;
  }
  if (!res.ok) {
    const e = new Error(`Riot API error ${res.status}`);
    e.status = res.status;
    throw e;
  }
  return res.json();
}

const app = express();

// Minimal CORS (no extra dependency): allow the Vite dev server + Pages.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, live: API_KEY.length > 5, service: 'hextech-rift-riot-proxy' });
});

// GET /api/riot/summoner?gameName=Faker&tagLine=KR1&region=LAS
app.get('/api/riot/summoner', async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: 'Proxy has no RIOT_API_KEY configured.' });
    const gameName = String(req.query.gameName || '').trim();
    const tagLine = String(req.query.tagLine || '').trim();
    const region = String(req.query.region || 'LAS').toUpperCase();
    if (!gameName || !tagLine) {
      return res.status(400).json({ error: 'gameName and tagLine are required.' });
    }
    const cluster = CLUSTER_FOR[region] || 'americas';
    const platform = PLATFORM_FOR[region] || 'la2';

    const data = await cached(`${cluster}:${platform}:${gameName}#${tagLine}`.toLowerCase(), async () => {
      const account = await riotFetch(
        `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
      );
      if (!account) return null;
      const [summoner, entries] = await Promise.all([
        riotFetch(`https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`),
        riotFetch(`https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${account.puuid}`)
      ]);
      const solo = (entries || []).find((e) => e.queueType === 'RANKED_SOLO_5x5')
        || (entries || []).find((e) => e.queueType === 'RANKED_FLEX_SR')
        || null;
      return {
        gameName: account.gameName,
        tagLine: account.tagLine,
        puuid: account.puuid,
        summonerLevel: summoner ? summoner.summonerLevel : 0,
        profileIconId: summoner ? summoner.profileIconId : 29,
        rank: solo
          ? {
              queueType: solo.queueType,
              tier: solo.tier,
              rank: solo.rank,
              leaguePoints: solo.leaguePoints,
              wins: solo.wins,
              losses: solo.losses
            }
          : null,
        source: 'RIOT_GAMES_API_LIVE'
      };
    });

    if (!data) return res.status(404).json({ error: 'Riot ID not found.' });
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Proxy error.' });
  }
});

app.listen(PORT, () => {
  console.log(`[riot-proxy] listening on http://localhost:${PORT} (live=${API_KEY.length > 5})`);
});
