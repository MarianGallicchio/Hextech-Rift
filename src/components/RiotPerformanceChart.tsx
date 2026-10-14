import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { RiotMatchHistoryEntry, ServerRegion } from '../types/tournament';
import { RIOT_MATCH_HISTORY_SAMPLE } from '../data/riotHistoryData';
import { TrendingUp, Award, Swords, Flame, CheckCircle2, XCircle } from 'lucide-react';
import { riotApi } from '../services/riotApi';

interface RiotPerformanceChartProps {
  summonerName: string;
  tagLine: string;
  /** When present (after "Verificar con Riot"), match-v5 feeds REAL history. */
  puuid?: string;
  region?: ServerRegion;
}

export const RiotPerformanceChart: React.FC<RiotPerformanceChartProps> = ({
  summonerName,
  tagLine,
  puuid,
  region
}) => {
  const [metricView, setMetricView] = useState<'winrate' | 'kda'>('winrate');
  const [liveMatches, setLiveMatches] = useState<RiotMatchHistoryEntry[] | null>(null);
  const [liveGame, setLiveGame] = useState<{ inGame: boolean; gameMode?: string } | null>(null);
  const [mastery, setMastery] = useState<{ championName: string; championLevel: number; championPoints: number }[] | null>(null);

  useEffect(() => {
    if (!puuid || !region) return;
    let cancelled = false;
    riotApi.getRecentMatches(puuid, region, 10).then((m) => {
      if (!cancelled && m) setLiveMatches(m);
    });
    riotApi.getLiveGame(puuid, region).then((g) => {
      if (!cancelled && g) setLiveGame(g);
    });
    riotApi.getTopMastery(puuid, region).then((t) => {
      if (!cancelled && t) setMastery(t);
    });
    return () => { cancelled = true; };
  }, [puuid, region]);

  const data = liveMatches ?? RIOT_MATCH_HISTORY_SAMPLE;
  const isLive = liveMatches !== null;

  const totalWins = data.filter((m) => m.win).length;
  const winRatePercent = data.length > 0 ? Math.round((totalWins / data.length) * 100) : 0;
  const avgKDA = data.length > 0 ? (
    data.reduce((acc, m) => acc + (m.kills + m.assists) / Math.max(1, m.deaths), 0) / data.length
  ).toFixed(1) : '0.0';

  // Current streak from the most recent game backwards.
  let streakWins = 0;
  let streakLosses = 0;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].win && streakLosses === 0) streakWins += 1;
    else if (!data[i].win && streakWins === 0) streakLosses += 1;
    else break;
  }

  // Most-played champion in this sample + its win rate.
  const champAgg = new Map<string, { games: number; wins: number }>();
  data.forEach((m) => {
    const e = champAgg.get(m.championName) ?? { games: 0, wins: 0 };
    e.games += 1;
    if (m.win) e.wins += 1;
    champAgg.set(m.championName, e);
  });
  const mainChamp = [...champAgg.entries()].sort((a, b) => b[1].games - a[1].games)[0];

  // Custom Hextech Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const match = payload[0].payload as RiotMatchHistoryEntry;
      return (
        <div className="p-3 rounded-xl bg-[#060b13]/95 border border-[#c89b3c]/50 shadow-[0_0_20px_rgba(0,0,0,0.9)] text-xs font-mono space-y-1.5">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
            <span className="font-bold text-[#f0e6d2]">{match.gameDate}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                match.win ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {match.win ? 'VICTORIA' : 'DERROTA'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-[#0ac8b9] font-bold">{match.championName}</span>
            <span>({match.role})</span>
          </div>

          <div className="text-slate-400 text-[11px]">
            KDA: <strong className="text-white">{match.kills}/{match.deaths}/{match.assists}</strong>{' '}
            ({match.kdaRatio.toFixed(1)}:1)
          </div>

          <div className="text-slate-400 text-[11px]">
            CS: <strong className="text-slate-200">{match.cs}</strong>
          </div>

          <div className="text-[#c89b3c] font-bold pt-0.5">
            Win Rate acumulado: {match.rollingWinRate}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl hextech-card p-5 border border-[#c89b3c]/30 space-y-4">
      {/* Header & Metric Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
              isLive
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-[#0ac8b9]/20 border-[#0ac8b9]/40 text-[#0ac8b9]'
            }`}>
              {isLive ? 'MATCH-V5 EN VIVO' : 'RIOT GAMES API MATCH-V5'}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Últimas {data.length} Partidas {isLive ? 'reales' : '(simulador)'}
            </span>
          </div>
          <h3 className="text-base font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#c89b3c]" />
            Tendencia de Desempeño & Win Rate de Invocador
          </h3>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-black/60 rounded-lg border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setMetricView('winrate')}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              metricView === 'winrate'
                ? 'bg-[#c89b3c] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Win Rate (%)
          </button>
          <button
            type="button"
            onClick={() => setMetricView('kda')}
            className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
              metricView === 'kda'
                ? 'bg-[#0ac8b9] text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ratio KDA
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-black/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Win Rate Global</span>
          <span className="text-lg font-bold text-emerald-400 tabular-nums">
            {winRatePercent}%
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{totalWins}V - {data.length - totalWins}D</span>
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">KDA Promedio</span>
          <span className="text-lg font-bold text-[#0ac8b9] tabular-nums">
            {avgKDA}:1
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Participación en kills</span>
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Racha Reciente</span>
          <div className="flex items-center gap-1 mt-1">
            {data.slice(-5).map((m, idx) => (
              <span
                key={idx}
                className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                  m.win ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}
              >
                {m.win ? 'V' : 'D'}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-emerald-400 block mt-1">
            {streakWins > 0 ? `${streakWins} victoria${streakWins > 1 ? 's' : ''} seguida${streakWins > 1 ? 's' : ''}` : streakLosses > 0 ? `${streakLosses} derrota${streakLosses > 1 ? 's' : ''} seguida${streakLosses > 1 ? 's' : ''}` : 'Sin racha'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-black/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase">Campeón Principal</span>
          <span className="text-sm font-bold text-[#f0e6d2] block truncate">
            {mainChamp ? `${mainChamp[0]} (${mainChamp[1].games} partida${mainChamp[1].games > 1 ? 's' : ''})` : '—'}
          </span>
          <span className="text-[10px] text-amber-400 block mt-0.5">
            {mainChamp ? `${Math.round((mainChamp[1].wins / mainChamp[1].games) * 100)}% Win Rate` : ''}
          </span>
        </div>
      </div>

      {(liveGame?.inGame || (mastery && mastery.length > 0)) && (
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          {liveGame?.inGame && (
            <span className="px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              EN PARTIDA AHORA{liveGame.gameMode ? ` · ${liveGame.gameMode}` : ''}
            </span>
          )}
          {mastery && mastery.length > 0 && (
            <span className="px-2 py-1 rounded-lg bg-black/50 border border-slate-800 text-slate-300">
              Maestrías: {mastery.map((m) => `${m.championName} Nv.${m.championLevel}`).join(' · ')}
            </span>
          )}
        </div>
      )}

      {/* Recharts Canvas */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {metricView === 'winrate' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="winrateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ac8b9" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#0ac8b9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="gameDate" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis
                domain={[40, 80]}
                stroke="#64748b"
                tick={{ fontSize: 11 }}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="rollingWinRate"
                stroke="#0ac8b9"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#winrateGradient)"
                name="Win Rate (%)"
              />
            </AreaChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="gameDate" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="kdaRatio"
                fill="#c89b3c"
                radius={[4, 4, 0, 0]}
                name="Ratio KDA"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Match History Row list */}
      <div className="pt-2 border-t border-slate-800">
        <span className="text-xs font-mono text-slate-400 block mb-2">
          Historial Directo de Partidas Riot Games
        </span>
        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          {data.slice().reverse().map((match) => (
            <div
              key={match.matchId}
              className={`p-2 rounded-lg flex items-center justify-between text-xs font-mono border ${
                match.win
                  ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-200'
                  : 'bg-rose-950/20 border-rose-500/20 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    match.win ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {match.win ? 'VICTORIA' : 'DERROTA'}
                </span>
                <span className="font-bold text-white">{match.championName}</span>
                <span className="text-slate-400 text-[11px]">{match.role}</span>
              </div>

              <div className="flex items-center gap-4 text-[11px]">
                <span>
                  <strong className="text-white">{match.kills}/{match.deaths}/{match.assists}</strong> ({match.kdaRatio.toFixed(1)})
                </span>
                <span className="text-slate-400">{match.cs} CS</span>
                <span className="text-slate-500 hidden sm:inline">{match.gameDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
