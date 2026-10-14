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
app.use(express.json({ limit: '64kb' }));

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

// ---- Tournament API (tournament-v4, platform-routed) ----
// All three steps needed for a REAL, client-redeemable tournament code:
// provider -> tournament -> codes. Bodies mirror Riot's contracts.

async function tournamentPost(platform, path, body, query = '') {
  const res = await fetch(`https://${platform}.api.riotgames.com${path}${query}`, {
    method: 'POST',
    headers: { 'X-Riot-Token': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  const text = await res.text();
  let parsed = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
  if (!res.ok) {
    const e = new Error(
      (parsed && (parsed.status?.message || parsed.message)) || `Tournament API error ${res.status}`
    );
    e.status = res.status;
    e.payload = parsed;
    throw e;
  }
  return parsed;
}

// ---- Tournament STUB API (works with development keys) ----
// Same flow as tournament-v4 but against /lol/tournament-stub/v4/*.
// Stub codes open REAL lobbies in the LoL client for testing.

async function stubPost(platform, path, body, query = '') {
  return tournamentPost(platform, `/lol/tournament-stub${path}`, body, query);
}

// POST /api/riot/stub-setup { region?, name?, count? } — full flow in one call.
app.post('/api/riot/stub-setup', async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: 'Proxy has no RIOT_API_KEY configured.' });
    const region = String(req.body.region || 'LAS').toUpperCase();
    const platform = PLATFORM_FOR[region] || 'la2';
    const name = String(req.body.name || 'Hextech Rift Test').slice(0, 80);
    const count = Math.min(Math.max(Number(req.body.count || 1), 1), 100);

    const providerId = await stubPost(platform, '/v4/providers', {
      region,
      url: 'https://mariangallicchio.github.io/Hextech-Rift/api/tournament-callback'
    });
    const tournamentId = await stubPost(platform, '/v4/tournaments', { providerId, name });
    const codes = await stubPost(
      platform,
      '/v4/codes',
      {
        mapType: 'SUMMONERS_RIFT',
        metadata: `Hextech Rift test — ${name}`,
        pickType: 'TOURNAMENT_DRAFT',
        spectatorType: 'ALL',
        teamSize: 5
      },
      `?tournamentId=${tournamentId}&count=${count}`
    );
    res.json({ providerId, tournamentId, codes, region, platform, stub: true });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, payload: err.payload || null });
  }
});
app.post('/api/riot/provider', async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: 'Proxy has no RIOT_API_KEY configured.' });
    const region = String(req.body.region || 'LAS').toUpperCase();
    const platform = PLATFORM_FOR[region] || 'la2';
    const callbackUrl = String(
      req.body.callbackUrl || 'https://mariangallicchio.github.io/Hextech-Rift/api/tournament-callback'
    );
    const providerId = await tournamentPost(platform, '/lol/tournament/v4/providers', {
      region,
      url: callbackUrl
    });
    res.json({ providerId, region, platform });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, payload: err.payload || null });
  }
});

// POST /api/riot/tournament { providerId, name }
app.post('/api/riot/tournament', async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: 'Proxy has no RIOT_API_KEY configured.' });
    const providerId = Number(req.body.providerId);
    const name = String(req.body.name || 'Hextech Rift Test').slice(0, 80);
    if (!providerId) return res.status(400).json({ error: 'providerId is required.' });
    const region = String(req.body.region || 'LAS').toUpperCase();
    const platform = PLATFORM_FOR[region] || 'la2';
    const tournamentId = await tournamentPost(platform, '/lol/tournament/v4/tournaments', {
      providerId,
      name
    });
    res.json({ tournamentId, providerId, name });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, payload: err.payload || null });
  }
});

// POST /api/riot/codes { tournamentId, count?, mapType?, pickType?, spectatorType?, teamSize?, region? }
app.post('/api/riot/codes', async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: 'Proxy has no RIOT_API_KEY configured.' });
    const tournamentId = Number(req.body.tournamentId);
    if (!tournamentId) return res.status(400).json({ error: 'tournamentId is required.' });
    const count = Math.min(Math.max(Number(req.body.count || 1), 1), 1000);
    const region = String(req.body.region || 'LAS').toUpperCase();
    const platform = PLATFORM_FOR[region] || 'la2';
    const codes = await tournamentPost(
      platform,
      '/lol/tournament/v4/codes',
      {
        mapType: req.body.mapType || 'SUMMONERS_RIFT',
        metadata: String(req.body.metadata || 'Hextech Rift test match'),
        pickType: req.body.pickType || 'TOURNAMENT_DRAFT',
        spectatorType: req.body.spectatorType || 'ALL',
        teamSize: Number(req.body.teamSize || 5)
      },
      `?tournamentId=${tournamentId}&count=${count}`
    );
    res.json({ codes, tournamentId });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, payload: err.payload || null });
  }
});

app.listen(PORT, () => {
  console.log(`[riot-proxy] listening on http://localhost:${PORT} (live=${API_KEY.length > 5})`);
});

// POST /api/riot/setup { region?, name?, count? } — REAL one-shot flow.
// Requires a PRODUCTION key (dev keys get 403 on tournament endpoints).
// provider -> tournament -> codes, for a client-redeemable code.
app.post('/api/riot/setup', async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: 'Proxy has no RIOT_API_KEY configured.' });
    const region = String(req.body.region || 'LAS').toUpperCase();
    const platform = PLATFORM_FOR[region] || 'la2';
    const name = String(req.body.name || 'Hextech Rift').slice(0, 80);
    const count = Math.min(Math.max(Number(req.body.count || 1), 1), 100);

    const providerId = await tournamentPost(platform, '/lol/tournament/v4/providers', {
      region,
      url: 'https://mariangallicchio.github.io/Hextech-Rift/api/tournament-callback'
    });
    const tournamentId = await tournamentPost(platform, '/lol/tournament/v4/tournaments', {
      providerId,
      name
    });
    const codes = await tournamentPost(
      platform,
      '/lol/tournament/v4/codes',
      {
        mapType: 'SUMMONERS_RIFT',
        metadata: `Hextech Rift — ${name}`,
        pickType: 'TOURNAMENT_DRAFT',
        spectatorType: 'ALL',
        teamSize: 5
      },
      `?tournamentId=${tournamentId}&count=${count}`
    );
    res.json({ providerId, tournamentId, codes, region, platform, stub: false });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message, payload: err.payload || null });
  }
});

// ---- Live game data APIs (work with development keys) ----
// NOTE: match-v5 is CLUSTER-routed (americas/europe/asia); mastery,
// spectator and status are PLATFORM-routed (la2, na1, ...).

// Data Dragon champion id (numeric key) -> name, cached server-side.
let ddragonChamps = null;
async function championName(championId) {
  try {
    if (!ddragonChamps) {
      const res = await fetch('https://ddragon.leagueoflegends.com/cdn/14.10.1/data/en_US/champion.json');
      const json = await res.json();
      ddragonChamps = {};
      for (const c of Object.values(json.data)) ddragonChamps[c.key] = c.name;
    }
    return ddragonChamps[String(championId)] || `Champ ${championId}`;
  } catch {
    return `Champ ${championId}`;
  }
}

const LANE_MAP = { TOP: 'TOP', JUNGLE: 'JUNGLE', MIDDLE: 'MID', BOTTOM: 'ADC', UTILITY: 'SUPPORT' };

// GET /api/riot/matches?puuid=&region=LAS&count=8
app.get('/api/riot/matches', async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: 'Proxy has no RIOT_API_KEY configured.' });
    const puuid = String(req.query.puuid || '').trim();
    if (!puuid) return res.status(400).json({ error: 'puuid is required.' });
    const region = String(req.query.region || 'LAS').toUpperCase();
    const cluster = CLUSTER_FOR[region] || 'americas';
    const count = Math.min(Math.max(Number(req.query.count || 8), 1), 20);

    const matches = await cached(`matches:${cluster}:${puuid}:${count}`, async () => {
      const ids = await riotFetch(
        `https://${cluster}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`
      );
      const out = [];
      // Sequential + cached: gentle on dev-key rate limits.
      for (const id of ids || []) {
        const m = await riotFetch(`https://${cluster}.api.riotgames.com/lol/match/v5/matches/${id}`);
        if (!m || !m.info) continue;
        const p = (m.info.participants || []).find((x) => x.puuid === puuid);
        if (!p) continue;
        const kda = (p.kills + p.assists) / Math.max(1, p.deaths);
        out.push({
          matchId: m.metadata.matchId,
          gameDate: new Date(m.info.gameCreation).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
          championName: p.championName,
          role: LANE_MAP[p.individualPosition] || p.individualPosition || p.lane || 'FILL',
          win: !!p.win,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          kdaRatio: Math.round(kda * 10) / 10,
          cs: (p.totalMinionsKilled || 0) + (p.neutralMinionsKilled || 0),
          rollingWinRate: 0
        });
      }
      let w = 0;
      // Chronological order (oldest first) to match chart semantics.
      return out.reverse().map((e, i) => {
        if (e.win) w += 1;
        return { ...e, rollingWinRate: Math.round((w / (i + 1)) * 100) };
      });
    });
    res.json({ matches, source: 'RIOT_MATCH_V5_LIVE' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Proxy error.' });
  }
});

// GET /api/riot/mastery?puuid=&region=LAS&count=3
app.get('/api/riot/mastery', async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: 'Proxy has no RIOT_API_KEY configured.' });
    const puuid = String(req.query.puuid || '').trim();
    if (!puuid) return res.status(400).json({ error: 'puuid is required.' });
    const region = String(req.query.region || 'LAS').toUpperCase();
    const platform = PLATFORM_FOR[region] || 'la2';
    const count = Math.min(Math.max(Number(req.query.count || 3), 1), 10);

    const mastery = await cached(`mastery:${platform}:${puuid}:${count}`, async () => {
      const list = await riotFetch(
        `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`
      );
      const out = [];
      for (const m of list || []) {
        out.push({
          championId: m.championId,
          championName: await championName(m.championId),
          championLevel: m.championLevel,
          championPoints: m.championPoints,
          lastPlayTime: m.lastPlayTime
        });
      }
      return out;
    });
    res.json({ mastery, source: 'RIOT_MASTERY_V4_LIVE' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Proxy error.' });
  }
});

// GET /api/riot/live?puuid=&region=LAS — spectator-v5 (404 = not in game).
app.get('/api/riot/live', async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: 'Proxy has no RIOT_API_KEY configured.' });
    const puuid = String(req.query.puuid || '').trim();
    if (!puuid) return res.status(400).json({ error: 'puuid is required.' });
    const region = String(req.query.region || 'LAS').toUpperCase();
    const platform = PLATFORM_FOR[region] || 'la2';
    const game = await riotFetch(
      `https://${platform}.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`
    );
    if (!game) return res.json({ inGame: false });
    res.json({
      inGame: true,
      gameMode: game.gameMode,
      gameType: game.gameType,
      mapId: game.mapId,
      gameLengthSec: game.gameLength,
      queueId: game.gameQueueConfigId
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Proxy error.' });
  }
});

// GET /api/riot/status?region=LAS — lol-status-v4 platform health.
app.get('/api/riot/status', async (req, res) => {
  try {
    if (!API_KEY) return res.status(503).json({ error: 'Proxy has no RIOT_API_KEY configured.' });
    const region = String(req.query.region || 'LAS').toUpperCase();
    const platform = PLATFORM_FOR[region] || 'la2';
    const st = await cached(`status:${platform}`, async () =>
      riotFetch(`https://${platform}.api.riotgames.com/lol/status/v4/platform-data`)
    );
    const openIssues = [...(st.maintenances || []), ...(st.incidents || [])].filter(
      (i) => i.incident_severity !== 'info' && (i.status === 'in_progress' || i.status === 'scheduled')
    );
    res.json({
      name: st.name,
      locales: st.locales,
      openIssues: openIssues.map((i) => ({
        id: i.id,
        severity: i.incident_severity,
        status: i.status,
        titles: (i.titles || []).map((t) => t.content),
        updates: (i.updates || []).slice(0, 1).map((u) => ({
          severity: u.severity,
          created: u.created_at,
          body: (u.translations || [])[0]?.content || ''
        }))
      }))
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Proxy error.' });
  }
});
