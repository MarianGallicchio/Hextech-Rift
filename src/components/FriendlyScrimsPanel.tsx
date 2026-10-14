import React, { useState } from 'react';
import { FriendlyScrim, Team } from '../types/tournament';
import { INITIAL_SCRIMS } from '../data/riotHistoryData';
import { Swords, Plus, Shield, Copy, Check, ExternalLink, Play, CheckCircle2, Clock, Users } from 'lucide-react';
import { hextechAudio } from '../utils/audio';

interface FriendlyScrimsPanelProps {
  userTeam: Team | null;
  availableTeams: Team[];
  onOpenLiveLobby?: (lobbyCode: string) => void;
}

export const FriendlyScrimsPanel: React.FC<FriendlyScrimsPanelProps> = ({
  userTeam,
  availableTeams
}) => {
  const [scrims, setScrims] = useState<FriendlyScrim[]>(INITIAL_SCRIMS);
  const [isNewScrimModalOpen, setIsNewScrimModalOpen] = useState(false);
  const [selectedOpponentId, setSelectedOpponentId] = useState<string>(
    availableTeams.find((t) => t.id !== userTeam?.id)?.id || ''
  );
  const [scrimFormat, setScrimFormat] = useState<'BO1_RAPIDO' | 'BO3_SERIE' | 'DRAFT_TRAINING'>('BO1_RAPIDO');
  const [scrimNotes, setScrimNotes] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    hextechAudio.playClick();
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCreateScrim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userTeam) return;

    const opponent = availableTeams.find((t) => t.id === selectedOpponentId);
    if (!opponent) return;

    hextechAudio.playVictory();
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const newScrim: FriendlyScrim = {
      id: `scrim_${Date.now()}`,
      challengingTeam: { id: userTeam.id, name: userTeam.name, tag: userTeam.tag },
      opponentTeam: { id: opponent.id, name: opponent.name, tag: opponent.tag },
      format: scrimFormat,
      status: 'ACCEPTED',
      scheduledTime: 'Inmediata · Sala Abierta',
      riotLobbyCode: `pvpnet://tournament/SCRIM-LAS-${userTeam.tag}-${opponent.tag}-${randomHex}`,
      scoreTeam1: 0,
      scoreTeam2: 0,
      notes: scrimNotes.trim() || 'Partida amistosa de entrenamiento sin impacto en ELO oficial.'
    };

    setScrims([newScrim, ...scrims]);
    setIsNewScrimModalOpen(false);
    setScrimNotes('');
  };

  const handleReportScrimResult = (scrimId: string, team1Won: boolean) => {
    hextechAudio.playVictory();
    setScrims((prev) =>
      prev.map((s) => {
        if (s.id !== scrimId) return s;
        return {
          ...s,
          status: 'COMPLETED',
          scoreTeam1: team1Won ? (s.format === 'BO3_SERIE' ? 2 : 1) : 0,
          scoreTeam2: team1Won ? 0 : (s.format === 'BO3_SERIE' ? 2 : 1),
          winnerId: team1Won ? s.challengingTeam.id : s.opponentTeam.id
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="p-6 rounded-2xl hextech-card border border-[#c89b3c]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#0ac8b9]/20 border border-[#0ac8b9]/40 text-[#0ac8b9]">
              MODO PRÁCTICA & SCRIMS
            </span>
            <span className="text-xs font-mono text-slate-400">Sin penalización de ELO</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
            <Swords className="w-5 h-5 text-[#c89b3c]" />
            Panel de Torneos Amistosos & Scrims 5v5
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Reta a escuadras rivales a partidas amistosas con códigos de torneo instantáneos de Riot para probar composiciones, tácticas de dragones y rotaciones antes del torneo oficial.
          </p>
        </div>

        <button
          onClick={() => {
            hextechAudio.playClick();
            setIsNewScrimModalOpen(true);
          }}
          disabled={!userTeam}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0ac8b9] to-[#039788] hover:from-[#1fe5d5] text-black font-cinzel font-bold text-xs transition-all shadow-[0_0_15px_rgba(10,200,185,0.3)] cursor-pointer disabled:opacity-40 flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Lanzar Desafío Amistoso</span>
        </button>
      </div>

      {/* Scrims List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scrims.map((scrim) => {
          const isCopied = copiedCodeId === scrim.id;
          const isCompleted = scrim.status === 'COMPLETED';

          return (
            <div
              key={scrim.id}
              className="p-5 rounded-2xl hextech-card border border-slate-800 hover:border-[#0ac8b9]/50 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#c89b3c]">
                  {scrim.format === 'BO1_RAPIDO'
                    ? 'Bo1 Rápido Amistoso'
                    : scrim.format === 'BO3_SERIE'
                    ? 'Serie Bo3 de Entrenamiento'
                    : 'Práctica de Draft Pick/Ban'}
                </span>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isCompleted
                      ? 'bg-slate-800 text-slate-300 border-slate-700'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse font-bold'
                  }`}
                >
                  {isCompleted ? 'Finalizada' : 'Sala Lista en Cliente'}
                </span>
              </div>

              {/* Faceoff */}
              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 flex items-center justify-between">
                <div className="text-left space-y-0.5">
                  <div className="text-xs font-bold text-[#f0e6d2] font-cinzel">
                    {scrim.challengingTeam.name}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-400">
                    [{scrim.challengingTeam.tag}]
                  </div>
                </div>

                <div className="text-center font-mono font-bold text-base text-[#c89b3c]">
                  {scrim.scoreTeam1} : {scrim.scoreTeam2}
                </div>

                <div className="text-right space-y-0.5">
                  <div className="text-xs font-bold text-[#f0e6d2] font-cinzel">
                    {scrim.opponentTeam.name}
                  </div>
                  <div className="text-[10px] font-mono text-rose-400">
                    [{scrim.opponentTeam.tag}]
                  </div>
                </div>
              </div>

              {scrim.notes && (
                <p className="text-xs text-slate-400 italic">
                  "{scrim.notes}"
                </p>
              )}

              {/* Tournament Code */}
              <div className="p-2.5 rounded-lg bg-black/70 border border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-[#0ac8b9] truncate max-w-[240px]">
                  {scrim.riotLobbyCode}
                </span>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyCode(scrim.riotLobbyCode, scrim.id)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                    title="Copiar código de torneo Riot"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <a
                    href={scrim.riotLobbyCode}
                    onClick={() => hextechAudio.playClick()}
                    title="Abrir código en el cliente de League of Legends"
                    className="px-2.5 py-1 rounded bg-[#0ac8b9] hover:bg-[#0fd9c9] text-black font-semibold text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Abrir</span>
                  </a>
                </div>
              </div>

              {/* Reporting actions if not completed */}
              {!isCompleted && (
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Registrar Ganador:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReportScrimResult(scrim.id, true)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] cursor-pointer"
                    >
                      Ganó {scrim.challengingTeam.tag}
                    </button>
                    <button
                      onClick={() => handleReportScrimResult(scrim.id, false)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-rose-300 text-[11px] cursor-pointer"
                    >
                      Ganó {scrim.opponentTeam.tag}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Scrim Creation Modal */}
      {isNewScrimModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsNewScrimModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl bg-[#08101e] border-2 border-[#0ac8b9]/40 shadow-[0_0_50px_rgba(0,0,0,0.9)] p-6 space-y-4 cursor-default text-xs font-mono"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
                <Swords className="w-4 h-4 text-[#0ac8b9]" />
                Lanzar Desafío Amistoso 5v5
              </h3>
              <button
                onClick={() => setIsNewScrimModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateScrim} className="space-y-4">
              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1.5">
                  Equipo Rival a Retar
                </label>
                <select
                  value={selectedOpponentId}
                  onChange={(e) => setSelectedOpponentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#0ac8b9] focus:outline-none cursor-pointer"
                >
                  {availableTeams
                    .filter((t) => t.id !== userTeam?.id)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        [{t.tag}] {t.name} ({t.divisionTier})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1.5">
                  Formato de Scrim
                </label>
                <select
                  value={scrimFormat}
                  onChange={(e) => setScrimFormat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#0ac8b9] focus:outline-none cursor-pointer"
                >
                  <option value="BO1_RAPIDO">Partida Rápida Única (Bo1)</option>
                  <option value="BO3_SERIE">Serie al Mejor de 3 (Bo3)</option>
                  <option value="DRAFT_TRAINING">Sesión de Práctica de Draft Pick/Ban</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1.5">
                  Objetivo del Entrenamiento (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Probar draft de hiper-escalado, peleas en dragón..."
                  value={scrimNotes}
                  onChange={(e) => setScrimNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#0ac8b9] focus:outline-none font-sans text-xs"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#0ac8b9]/10 border border-[#0ac8b9]/30 text-slate-300 text-[11px] leading-relaxed">
                Generará inmediatamente una sala oficial en el cliente de Riot Games con el código de torneo sin alterar tu elo competitivo.
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewScrimModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#0ac8b9] to-[#039788] hover:from-[#1fe5d5] text-black font-cinzel font-bold text-xs transition-all cursor-pointer"
                >
                  Crear Sala & Enviar Desafío
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
