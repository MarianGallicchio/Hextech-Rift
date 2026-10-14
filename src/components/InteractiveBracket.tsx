import React from 'react';
import { Tournament, Match } from '../types/tournament';
import { Swords, CheckCircle2, Clock, Trophy, ExternalLink } from 'lucide-react';
import { hextechAudio } from '../utils/audio';

interface InteractiveBracketProps {
  tournament: Tournament;
  onSelectMatch: (match: Match) => void;
}

export const InteractiveBracket: React.FC<InteractiveBracketProps> = ({
  tournament,
  onSelectMatch
}) => {
  const semis = tournament.playoffMatches.filter((m) => m.stage === 'SEMIS');
  const finalMatch = tournament.playoffMatches.find((m) => m.stage === 'FINAL');

  const handleMatchClick = (match: Match) => {
    hextechAudio.playClick();
    onSelectMatch(match);
  };

  const getStatusBadge = (status: Match['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> Finalizada
          </span>
        );
      case 'IN_GAME':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-400 animate-pulse font-semibold">
            <Swords className="w-3 h-3" /> En Vivo
          </span>
        );
      case 'LOBBY_READY':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 font-semibold">
            <ExternalLink className="w-3 h-3" /> Sala Lista
          </span>
        );
      case 'VERIFYING':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#0ac8b9] font-semibold">
            <Clock className="w-3 h-3 animate-spin" /> Verificando Riot API
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Clock className="w-3 h-3" /> Programada
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Group Stage (Fase de Grupos) */}
      {tournament.groups.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div>
              <h3 className="text-base font-cinzel font-bold text-[#f0e6d2]">Fase de Grupos</h3>
              <p className="text-xs text-slate-400">
                Los dos mejores equipos de cada grupo avanzan automáticamente al Playoff Bracket.
              </p>
            </div>
            <span className="text-xs font-mono text-[#c89b3c]">Formato: Round Robin Bo1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tournament.groups.map((group) => (
              <div key={group.id} className="hextech-card rounded-xl p-4 border border-[#c89b3c]/20">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-[#f0e6d2]">{group.name}</h4>
                  <span className="text-[11px] font-mono text-slate-400">3 Equipos</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono">
                        <th className="pb-2 font-medium">Equipo</th>
                        <th className="pb-2 font-medium text-center">V</th>
                        <th className="pb-2 font-medium text-center">D</th>
                        <th className="pb-2 font-medium text-right">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
                      {group.teams.map((t, idx) => (
                        <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 font-sans font-medium text-slate-200 flex items-center gap-2">
                            <span className="text-slate-500 font-mono text-[10px] w-3">{idx + 1}</span>
                            <span className="text-[#c89b3c] font-bold">[{t.tag}]</span>
                            <span className="truncate max-w-[130px]">{t.name}</span>
                          </td>
                          <td className="py-2.5 text-center text-emerald-400 font-semibold">{t.wins}</td>
                          <td className="py-2.5 text-center text-rose-400">{t.losses}</td>
                          <td className="py-2.5 text-right font-bold text-[#f0e6d2]">{t.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Group Matches */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    Partidas del Grupo
                  </div>
                  {group.matches.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleMatchClick(m)}
                      className="w-full text-left p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-[#c89b3c]/50 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-200 group-hover:text-[#f0e6d2]">
                          {m.team1?.tag || 'TBD'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">vs</span>
                        <span className="font-semibold text-slate-200 group-hover:text-[#f0e6d2]">
                          {m.team2?.tag || 'TBD'}
                        </span>
                        {m.winnerId && (
                          <span className="text-[10px] font-mono text-emerald-400">
                            ({m.team1Score} - {m.team2Score})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(m.status)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Playoff 3D Bracket */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h3 className="text-base font-cinzel font-bold text-[#f0e6d2]">Playoffs & Gran Final</h3>
            <p className="text-xs text-slate-400">
              Eliminación directa por el título y los premios en metálico.
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400">Fase Final</span>
        </div>

        {/* Visual Bracket Grid */}
        <div className="relative overflow-x-auto pb-4">
          <div className="min-w-[700px] grid grid-cols-2 gap-8 items-center">
            {/* Round 1: Semifinales */}
            <div className="space-y-6">
              <div className="text-xs font-cinzel font-semibold tracking-wider text-slate-400 uppercase text-center pb-1 border-b border-slate-800">
                Semifinales (Bo3)
              </div>
              <div className="space-y-4">
                {semis.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => handleMatchClick(match)}
                    className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-[#c89b3c]/60 hover:shadow-[0_0_15px_rgba(200,155,60,0.15)] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                      <span>Partida #{match.matchNumber}</span>
                      {getStatusBadge(match.status)}
                    </div>

                    {/* Team 1 */}
                    <div
                      className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                        match.winnerId === match.team1?.id
                          ? 'bg-[#0ac8b9]/10 text-[#0ac8b9] font-bold border border-[#0ac8b9]/30'
                          : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="text-xs font-semibold">{match.team1?.name || 'TBD (Por clasificar)'}</span>
                      </div>
                      <span className="font-mono text-xs tabular-nums">{match.team1Score}</span>
                    </div>

                    {/* Team 2 */}
                    <div
                      className={`flex items-center justify-between p-2 rounded-lg mt-1 transition-colors ${
                        match.winnerId === match.team2?.id
                          ? 'bg-[#0ac8b9]/10 text-[#0ac8b9] font-bold border border-[#0ac8b9]/30'
                          : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span className="text-xs font-semibold">{match.team2?.name || 'TBD (Por clasificar)'}</span>
                      </div>
                      <span className="font-mono text-xs tabular-nums">{match.team2Score}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Round 2: Gran Final */}
            <div className="space-y-6">
              <div className="text-xs font-cinzel font-bold tracking-wider text-[#c89b3c] uppercase text-center pb-1 border-b border-[#c89b3c]/30 flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#c89b3c]" />
                Gran Final Hextech (Bo5)
              </div>

              {finalMatch && (
                <button
                  onClick={() => handleMatchClick(finalMatch)}
                  className="w-full text-left p-4 rounded-xl bg-gradient-to-br from-[#121c2e] to-[#091428] border-2 border-[#c89b3c]/60 hover:border-[#c89b3c] hover:shadow-[0_0_25px_rgba(200,155,60,0.25)] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#c89b3c] mb-3">
                    <span className="font-bold">Por el Trofeo y $900 USD</span>
                    {getStatusBadge(finalMatch.status)}
                  </div>

                  {/* Final Team 1 */}
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-lg transition-colors ${
                      finalMatch.winnerId === finalMatch.team1?.id
                        ? 'bg-[#c89b3c]/20 text-[#f0e6d2] font-bold border border-[#c89b3c]'
                        : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#c89b3c]" />
                      <span className="text-sm font-semibold">{finalMatch.team1?.name || 'Ganador Semifinal 1'}</span>
                    </div>
                    <span className="font-mono text-sm tabular-nums font-bold">{finalMatch.team1Score}</span>
                  </div>

                  {/* Final Team 2 */}
                  <div
                    className={`flex items-center justify-between p-2.5 rounded-lg mt-2 transition-colors ${
                      finalMatch.winnerId === finalMatch.team2?.id
                        ? 'bg-[#c89b3c]/20 text-[#f0e6d2] font-bold border border-[#c89b3c]'
                        : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-semibold">{finalMatch.team2?.name || 'Ganador Semifinal 2'}</span>
                    </div>
                    <span className="font-mono text-sm tabular-nums font-bold">{finalMatch.team2Score}</span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{finalMatch.scheduledTime}</span>
                    <span className="text-[#0ac8b9] group-hover:underline">Abrir Sala & Código</span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
