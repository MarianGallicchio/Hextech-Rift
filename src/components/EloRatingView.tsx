import React, { useState } from 'react';
import { Player } from '../types/tournament';
import { ELO_TIERS, calculateEloDelta, calculateSeasonResetElo, CURRENT_SEASON_INFO, getRankFromElo } from '../utils/elo';
import { RANK_TIERS_INFO, LOL_CHAMPIONS } from '../data/champions';
import {
  Award,
  TrendingUp,
  Calendar,
  Zap,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Trophy,
  Crown,
  Users,
  Percent,
  Sparkles,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { hextechAudio } from '../utils/audio';

interface EloRatingViewProps {
  player: Player;
  onUpdatePlayerElo: (newElo: number) => void;
}

interface LeaderboardEntry {
  rank: number;
  summonerName: string;
  tagLine: string;
  server: string;
  elo: number;
  tier: string;
  division: string;
  winRate: number;
  mainChamp: string;
  streak: number;
}

export const EloRatingView: React.FC<EloRatingViewProps> = ({
  player,
  onUpdatePlayerElo
}) => {
  const [opponentEloInput, setOpponentEloInput] = useState<number>(2980);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [seasonResetResult, setSeasonResetResult] = useState<ReturnType<typeof calculateSeasonResetElo> | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'tiers' | 'ladder' | 'rewards'>('tiers');

  const currentRank = getRankFromElo(player.eloRating);
  const rankStyle = RANK_TIERS_INFO[currentRank.tier];

  // Find next tier threshold
  const currentTierIndex = ELO_TIERS.findIndex(
    (t) => t.tier === currentRank.tier && t.division === currentRank.division
  );
  const nextTier = currentTierIndex < ELO_TIERS.length - 1 ? ELO_TIERS[currentTierIndex + 1] : null;
  const currentBracket = ELO_TIERS[currentTierIndex] || ELO_TIERS[0];

  const progressPercentage = nextTier
    ? Math.min(
        100,
        Math.max(
          0,
          ((player.eloRating - currentBracket.minElo) / (currentBracket.maxElo - currentBracket.minElo)) * 100
        )
      )
    : 100;

  // Win Probability calculation (Logistic ELO curve)
  const eloDiff = opponentEloInput - player.eloRating;
  const winProbability = Math.round((1 / (1 + Math.pow(10, eloDiff / 400))) * 100);

  const handleSimulateMatch = (won: boolean) => {
    hextechAudio.playClick();
    const result = calculateEloDelta(player.eloRating, opponentEloInput, won ? 1 : 0);
    onUpdatePlayerElo(result.playerEloAfter);

    if (won) {
      hextechAudio.playVictory();
      setSimulationResult(
        `¡Victoria! Ganaste +${result.playerDelta} ELO (Oponente: ${opponentEloInput} ELO). Nuevo rating: ${result.playerEloAfter}`
      );
    } else {
      setSimulationResult(
        `Derrota. Perdiste ${result.playerDelta} ELO (Oponente: ${opponentEloInput} ELO). Nuevo rating: ${result.playerEloAfter}`
      );
    }
  };

  const handleSimulateSeasonEnd = () => {
    hextechAudio.playVictory();
    const reset = calculateSeasonResetElo(player.eloRating);
    setSeasonResetResult(reset);
    onUpdatePlayerElo(reset.newElo);
  };

  // Mock regional ELO ladder
  const LEADERBOARD_DATA: LeaderboardEntry[] = [
    { rank: 1, summonerName: 'Hide on bush', tagLine: 'KR1', server: 'KR', elo: 3450, tier: 'CHALLENGER', division: 'I', winRate: 72, mainChamp: 'Ahri', streak: 6 },
    { rank: 2, summonerName: 'Josedeodo', tagLine: 'LAS', server: 'LAS', elo: 3390, tier: 'CHALLENGER', division: 'I', winRate: 69, mainChamp: 'LeeSin', streak: 4 },
    { rank: 3, summonerName: 'Kaelen Hex (Tú)', tagLine: player.tagLine, server: player.server, elo: player.eloRating, tier: player.rankTier, division: player.division, winRate: 64, mainChamp: 'Ahri', streak: 3 },
    { rank: 4, summonerName: 'Viper Strike', tagLine: 'LAS', server: 'LAS', elo: 2940, tier: 'DIAMOND', division: 'I', winRate: 61, mainChamp: 'Kaisa', streak: 2 },
    { rank: 5, summonerName: 'ShadowReaper', tagLine: 'LAS', server: 'LAS', elo: 2890, tier: 'DIAMOND', division: 'II', winRate: 58, mainChamp: 'Zed', streak: -1 },
    { rank: 6, summonerName: 'Zaun Chemist', tagLine: 'LAS', server: 'LAS', elo: 2820, tier: 'DIAMOND', division: 'III', winRate: 56, mainChamp: 'Singed', streak: 1 },
    { rank: 7, summonerName: 'Solar Flare', tagLine: 'LAN', server: 'LAN', elo: 2750, tier: 'EMERALD', division: 'I', winRate: 55, mainChamp: 'Leona', streak: -2 }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl hextech-card border border-[#c89b3c]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#c89b3c]/20 border border-[#c89b3c]/40 text-[#f0e6d2]">
              {CURRENT_SEASON_INFO.seasonName}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Quedan {CURRENT_SEASON_INFO.daysRemaining} días de competencia
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f0e6d2]">
            Sistema de Rating ELO & Divisiones Escalonadas
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Tu clasificación en torneos se actualiza matemáticamente tras cada partida según la fuerza de los rivales. Al final de la temporada, se efectúa un soft-reset y se otorgan las recompensas de división.
          </p>
        </div>

        {/* Quick Season Reset Simulator Action */}
        <button
          onClick={handleSimulateSeasonEnd}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-[#c89b3c]/40 hover:border-[#c89b3c] text-xs font-mono text-[#f0e6d2] transition-colors cursor-pointer flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#0ac8b9]" />
          <span>Simular Soft-Reset de Fin de Temporada</span>
        </button>
      </div>

      {seasonResetResult && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#0ac8b9]/20 to-[#c89b3c]/20 border border-[#0ac8b9]/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-amber-300" />
            <div className="text-xs">
              <span className="font-bold text-[#f0e6d2]">¡Cierre de Temporada Completado!</span>
              <p className="text-slate-300 mt-0.5">
                Cerraste en <strong>{seasonResetResult.previousTier}</strong>. Soft-reset aplicado: nuevo rating de inicio <strong>{seasonResetResult.newElo} ELO</strong> ({seasonResetResult.newRank.name}).
              </p>
            </div>
          </div>
          <button
            onClick={() => setSeasonResetResult(null)}
            className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Main ELO Hub Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Player Current Rank & Division Progression */}
        <div className="lg:col-span-1 rounded-2xl hextech-card p-6 border border-[#c89b3c]/30 flex flex-col justify-between space-y-6">
          <div className="text-center space-y-3">
            <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#c89b3c] via-[#091428] to-[#0ac8b9] p-1.5 shadow-[0_0_35px_rgba(200,155,60,0.35)]">
              <div className="w-full h-full rounded-full bg-[#060b13] flex flex-col items-center justify-center p-2 relative overflow-hidden">
                <Crown className={`w-6 h-6 mb-1 ${rankStyle.color}`} />
                <span className={`text-xl font-cinzel font-bold ${rankStyle.color}`}>
                  {currentRank.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  Temporada 2026
                </span>
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold font-mono text-[#f0e6d2] tabular-nums">
                {player.eloRating} <span className="text-sm font-normal text-[#0ac8b9]">ELO</span>
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">
                Pico de Temporada: <strong className="text-amber-400">{player.seasonPeakElo} ELO</strong>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                Win Rate: {player.stats.winRate}% ({player.stats.totalMatches} partidas)
              </div>
            </div>
          </div>

          {/* Next Promotion Gauge */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Progreso a siguiente rango</span>
              <span className="text-[#0ac8b9] font-bold">{Math.round(progressPercentage)}%</span>
            </div>

            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-[#0ac8b9] to-[#c89b3c] h-2.5 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(10,200,185,0.5)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>{currentBracket.minElo} ELO</span>
              <span>{nextTier ? `${nextTier.name} (${nextTier.minElo} ELO)` : 'Pico Máximo'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Interactive Match ELO Calculator & Win Probability Simulator */}
        <div className="lg:col-span-2 rounded-2xl hextech-card p-6 border border-[#c89b3c]/30 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Simulador Dinámico de Encuentros & Probabilidad de Victoria
              </h3>
              <p className="text-xs text-slate-400">
                Calcula la expectativa matemática oficial (curva logística K=32) frente a cualquier rival.
              </p>
            </div>
            <span className="text-xs font-mono text-[#c89b3c]">Fórmula Oficial K=32</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <label className="block text-xs font-mono text-slate-300">
                Rating ELO del Rival o Equipo Oponente
              </label>
              <input
                type="number"
                step="25"
                value={opponentEloInput}
                onChange={(e) => setOpponentEloInput(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] font-mono text-sm focus:border-[#c89b3c] focus:outline-none"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Rango rival: {getRankFromElo(opponentEloInput).name}</span>
                <span>Diferencia: {opponentEloInput - player.eloRating > 0 ? `+${opponentEloInput - player.eloRating}` : opponentEloInput - player.eloRating} ELO</span>
              </div>
            </div>

            {/* Win Probability Gauge */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-amber-400" />
                  Probabilidad Esperada:
                </span>
                <span className={`font-bold ${winProbability >= 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {winProbability}%
                </span>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    winProbability >= 50 ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                  style={{ width: `${winProbability}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleSimulateMatch(true)}
                  className="py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Victoria (+ELO)</span>
                </button>
                <button
                  onClick={() => handleSimulateMatch(false)}
                  className="py-1.5 px-3 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-mono font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Derrota (-ELO)</span>
                </button>
              </div>
            </div>
          </div>

          {simulationResult && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-[#0ac8b9]/30 text-xs font-mono text-[#0ac8b9]">
              {simulationResult}
            </div>
          )}

          {/* Historical Seasons */}
          <div className="pt-2">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
              Historial de Temporadas Pasadas
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {player.seasonHistory?.map((hist, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
                  <span className="text-slate-400 block text-[10px]">Temporada {hist.season}</span>
                  <span className="text-[#f0e6d2] font-semibold">{hist.rankName}</span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">{hist.finalElo} ELO Final</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs for Divisions, Leaderboard and Rewards */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs font-mono">
        <button
          onClick={() => {
            hextechAudio.playClick();
            setActiveSubTab('tiers');
          }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'tiers'
              ? 'bg-[#c89b3c] text-black font-bold shadow-[0_0_15px_rgba(200,155,60,0.3)]'
              : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          Escalafón de 10 Divisiones Oficiales
        </button>

        <button
          onClick={() => {
            hextechAudio.playClick();
            setActiveSubTab('ladder');
          }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'ladder'
              ? 'bg-[#0ac8b9] text-black font-bold shadow-[0_0_15px_rgba(10,200,185,0.3)]'
              : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          Tabla Clasificatoria Regional (Top Invocadores)
        </button>

        <button
          onClick={() => {
            hextechAudio.playClick();
            setActiveSubTab('rewards');
          }}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'rewards'
              ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
              : 'bg-slate-900/60 text-slate-400 hover:text-white'
          }`}
        >
          Recompensas de Fin de Temporada 2026
        </button>
      </div>

      {/* SUB-VIEW 1: DIVISION LADDER */}
      {activeSubTab === 'tiers' && (
        <div className="rounded-2xl hextech-card p-6 border border-[#c89b3c]/20 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-cinzel font-bold text-[#f0e6d2]">
                Escalafón de Divisiones & Requisitos de ELO
              </h3>
              <p className="text-xs text-slate-400">
                Cada división desbloquea acceso a diferentes categorías de torneos pagos y gratuitos.
              </p>
            </div>
            <span className="text-xs font-mono text-[#0ac8b9]">Actualización en Tiempo Real</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {Object.entries(RANK_TIERS_INFO).map(([tierKey, info]) => {
              const isCurrent = currentRank.tier === tierKey;
              return (
                <div
                  key={tierKey}
                  className={`p-4 rounded-xl border text-center transition-all relative overflow-hidden group ${
                    isCurrent
                      ? 'border-[#c89b3c] bg-[#c89b3c]/15 shadow-[0_0_25px_rgba(200,155,60,0.3)] ring-1 ring-[#c89b3c]'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-0 right-0 left-0 bg-[#c89b3c] text-black font-bold text-[9px] uppercase tracking-wider py-0.5">
                      Tu Rango Actual
                    </div>
                  )}

                  <div className={`mt-2 text-sm font-bold block ${info.color}`}>
                    {info.name}
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 mt-1 block font-semibold">
                    {info.eloBadge}
                  </span>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 leading-tight">
                    {tierKey === 'CHALLENGER' || tierKey === 'GRANDMASTER' || tierKey === 'MASTER'
                      ? 'Elegible: Tier I Masters'
                      : tierKey === 'DIAMOND' || tierKey === 'EMERALD'
                      ? 'Elegible: Tier II Esmeralda-Diamante'
                      : tierKey === 'PLATINUM' || tierKey === 'GOLD'
                      ? 'Elegible: Tier III Oro-Platino'
                      : 'Elegible: Tier IV Hierro-Plata'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: REGIONAL LADDER */}
      {activeSubTab === 'ladder' && (
        <div className="rounded-2xl hextech-card p-6 border border-[#0ac8b9]/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Tabla Clasificatoria Regional de Invocadores (Cono Sur)
              </h3>
              <p className="text-xs text-slate-400">
                Puntos de clasificación ELO acumulados en torneos oficiales Hextech Rift.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">Temporada 2026</span>
          </div>

          <div className="space-y-2">
            {LEADERBOARD_DATA.map((entry) => {
              const isUser = entry.summonerName.includes('(Tú)');
              return (
                <div
                  key={entry.rank}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 font-mono text-xs transition-all ${
                    isUser
                      ? 'bg-[#c89b3c]/15 border-[#c89b3c] shadow-[0_0_20px_rgba(200,155,60,0.2)]'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold font-cinzel text-sm ${
                        entry.rank === 1
                          ? 'bg-amber-400 text-black'
                          : entry.rank === 2
                          ? 'bg-slate-300 text-black'
                          : entry.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      #{entry.rank}
                    </span>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${isUser ? 'text-amber-300' : 'text-[#f0e6d2]'}`}>
                          {entry.summonerName}
                        </span>
                        <span className="text-slate-500 text-[10px]">#{entry.tagLine}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {entry.server}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Main: {entry.mainChamp} · Racha: {entry.streak > 0 ? `+${entry.streak}W 🔥` : `${entry.streak}L`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block">
                      <span className="text-[10px] text-slate-400 block">Win Rate</span>
                      <span className="font-bold text-emerald-400">{entry.winRate}%</span>
                    </div>

                    <div>
                      <span className="text-amber-400 font-bold block text-sm tabular-nums">
                        {entry.elo} ELO
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {entry.tier} {entry.division}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SEASON REWARDS */}
      {activeSubTab === 'rewards' && (
        <div className="rounded-2xl hextech-card p-6 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Matriz de Recompensas de Fin de Temporada 2026
              </h3>
              <p className="text-xs text-slate-400">
                Se otorgan al alcanzar y mantener el rango antes de la fecha de soft-reset.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-300">Entrega Automática</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900/70 border border-yellow-500/40 space-y-2">
              <span className="text-xs font-bold text-yellow-400 uppercase block">Oro a Esmeralda</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>✓ Aspecto Victorioso 2026 (Exclusivo)</li>
                <li>✓ Icono de Invocador de Rango</li>
                <li>✓ Marco de Carga de Perfil</li>
                <li>✓ 2,500 RP de Bono de Temporada</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-cyan-400/50 space-y-2 shadow-[0_0_15px_rgba(10,200,185,0.15)]">
              <span className="text-xs font-bold text-cyan-300 uppercase block">Diamante a Master</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>✓ Aspecto Victorioso + 2 Chromas de División</li>
                <li>✓ Marco Hextech Brillante en Sala de Torneo</li>
                <li>✓ Pase Automático para Gran Final Anual</li>
                <li>✓ 7,500 RP + Invitación Circuito Pro</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-400/60 space-y-2 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
              <span className="text-xs font-bold text-amber-300 uppercase block">Gran Master & Challenger</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>✓ Todos los premios anteriores + Corona 3D</li>
                <li>✓ Recompensa Física Oficial (Chaqueta / Medalla)</li>
                <li>✓ Acceso a Clasificatorios Riot Open Regional</li>
                <li>✓ 15,000 RP + Cuota de Torneos Exenta de Pago</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
