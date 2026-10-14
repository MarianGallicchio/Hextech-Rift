import React, { useState, useEffect } from 'react';
import { Match, MatchStats } from '../types/tournament';
import { X, Copy, Check, ExternalLink, Play, Swords, Cpu, Flame, Shield, Trophy } from 'lucide-react';
import { hextechAudio } from '../utils/audio';
import { riotApi } from '../services/riotApi';

interface LiveMatchModalProps {
  match: Match | null;
  onClose: () => void;
  onMatchUpdated: (updatedMatch: Match) => void;
}

export const LiveMatchModal: React.FC<LiveMatchModalProps> = ({
  match,
  onClose,
  onMatchUpdated
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!match) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hextechAudio.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [match, onClose]);

  if (!match) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(match.riotTournamentCode);
    setCopiedCode(true);
    hextechAudio.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleLaunchClient = () => {
    hextechAudio.playClick();
    window.location.href = match.riotTournamentCode;
  };

  const handleVerifyWithRiotApi = async () => {
    setIsVerifying(true);
    setVerificationFeedback('Consultando endpoints de Riot Games Tournament API v5...');
    hextechAudio.playClick();

    try {
      const response = await riotApi.verifyMatchAutomatically(match);
      setVerificationFeedback(`¡Partida verificada con éxito! Victoria otorgada a ${response.winningTeamName}`);
      hextechAudio.playVictory();

      const updated: Match = {
        ...match,
        status: 'COMPLETED',
        winnerId: response.winnerTeamId,
        team1Score: response.blueTeamWon ? 1 : 0,
        team2Score: response.blueTeamWon ? 0 : 1,
        isAutomatedResult: true,
        gameStats: response.stats
      };

      setTimeout(() => {
        setIsVerifying(false);
        onMatchUpdated(updated);
      }, 1200);
    } catch {
      setIsVerifying(false);
      setVerificationFeedback('Error al validar con Riot Games API.');
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          hextechAudio.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl bg-[#091428] border-2 border-[#c89b3c]/50 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[90vh] flex flex-col cursor-default"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#060b13] border-b border-[#c89b3c]/30">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-[#c89b3c]" />
            <h2 className="text-lg font-cinzel font-bold text-[#f0e6d2]">
              Sala de Encuentro Oficial · League of Legends
            </h2>
          </div>
          <button
            onClick={() => {
              hextechAudio.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Teams Header Faceoff */}
          <div className="grid grid-cols-3 items-center gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            {/* Blue Side Team */}
            <div className="text-left space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                Lado Azul (Blue Team)
              </span>
              <div className="text-base font-cinzel font-bold text-[#f0e6d2] truncate">
                {match.team1?.name || 'TBD'}
              </div>
              <div className="text-xs font-mono text-slate-400">Tag: [{match.team1?.tag || 'TBD'}]</div>
              {match.status === 'COMPLETED' && match.winnerId === match.team1?.id && (
                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 font-mono">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> GANADOR
                </div>
              )}
            </div>

            {/* Score / VS */}
            <div className="text-center">
              <div className="text-2xl font-bold font-mono tracking-widest text-[#f0e6d2]">
                {match.team1Score} : {match.team2Score}
              </div>
              <div className="text-[10px] font-mono text-[#c89b3c] uppercase mt-1">
                {match.status === 'COMPLETED' ? 'Finalizada' : match.status === 'LOBBY_READY' ? 'En Sala' : 'Programada'}
              </div>
            </div>

            {/* Red Side Team */}
            <div className="text-right space-y-1">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest">
                Lado Rojo (Red Team)
              </span>
              <div className="text-base font-cinzel font-bold text-[#f0e6d2] truncate">
                {match.team2?.name || 'TBD'}
              </div>
              <div className="text-xs font-mono text-slate-400">Tag: [{match.team2?.tag || 'TBD'}]</div>
              {match.status === 'COMPLETED' && match.winnerId === match.team2?.id && (
                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 font-mono">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> GANADOR
                </div>
              )}
            </div>
          </div>

          {/* Tournament Code Generator & Client Integration */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#0c192e] to-[#07101e] border border-[#0ac8b9]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#0ac8b9]" />
                <span className="text-xs font-semibold text-[#f0e6d2] font-mono">
                  Código de Torneo Oficial Riot Games (Tournament Code)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Automatizado</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pega este código en el cliente de League of Legends en <strong className="text-amber-300">Jugar &gt; Código de Torneo</strong> o haz clic en ingresar para unirte automáticamente a la sala con picks y bans configurados.
            </p>

            {/* Code Box */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={match.riotTournamentCode}
                className="flex-1 px-3 py-2 text-xs font-mono bg-black/60 border border-slate-700 rounded-lg text-[#0ac8b9] select-all focus:outline-none"
              />
              <button
                onClick={handleCopyCode}
                className="px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
              </button>

              <button
                onClick={handleLaunchClient}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0ac8b9] hover:bg-[#0fd9c9] text-black flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir en Cliente</span>
              </button>
            </div>
          </div>

          {/* Live Game Statistics (If available or completed) */}
          {match.gameStats && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-cinzel font-bold text-[#f0e6d2]">
                  Resumen de la Partida & Telemetría
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Duración: {match.gameStats.duration}
                </span>
              </div>

              {/* Objectives Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Asesinatos</span>
                  <span className="text-cyan-400 font-bold">{match.gameStats.blueKills}</span> vs{' '}
                  <span className="text-rose-400 font-bold">{match.gameStats.redKills}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Oro Total</span>
                  <span className="text-cyan-400 font-bold">{match.gameStats.blueGold}</span> vs{' '}
                  <span className="text-rose-400 font-bold">{match.gameStats.redGold}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Torretas</span>
                  <span className="text-cyan-400 font-bold">{match.gameStats.blueTowers}</span> vs{' '}
                  <span className="text-rose-400 font-bold">{match.gameStats.redTowers}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Barón Nashor</span>
                  <span className="text-cyan-400 font-bold">{match.gameStats.barons.blue}</span> vs{' '}
                  <span className="text-rose-400 font-bold">{match.gameStats.barons.red}</span>
                </div>
              </div>

              {/* MVP Banner */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Jugador Más Valioso (MVP de la Partida):
                </span>
                <span className="font-mono font-bold text-[#f0e6d2]">{match.gameStats.mvp}</span>
              </div>
            </div>
          )}

          {/* Automated Riot Verification Trigger */}
          {match.status !== 'COMPLETED' && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#f0e6d2]">
                    Validación Automática de Resultados
                  </h4>
                  <p className="text-xs text-slate-400">
                    Sincroniza directamente con los servidores de Riot Games para confirmar al ganador y avanzar el bracket.
                  </p>
                </div>
                <button
                  onClick={handleVerifyWithRiotApi}
                  disabled={isVerifying}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] text-black transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Cpu className="w-4 h-4" />
                  <span>{isVerifying ? 'Sincronizando...' : 'Verificar con Riot API'}</span>
                </button>
              </div>

              {verificationFeedback && (
                <div className="text-xs font-mono text-[#0ac8b9] p-2 bg-[#0ac8b9]/10 rounded border border-[#0ac8b9]/30">
                  {verificationFeedback}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
