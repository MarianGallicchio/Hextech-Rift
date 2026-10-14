import React, { useState, useEffect } from 'react';
import { Tournament, TournamentTier, ServerRegion } from '../types/tournament';
import { X, Trophy, DollarSign, Percent, Sparkles, Shield, Share2, Check, ExternalLink, Calculator } from 'lucide-react';
import { hextechAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AmateurLeagueCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizerName: string;
  onCreateLeague: (newLeague: Tournament) => void;
}

export const AmateurLeagueCreatorModal: React.FC<AmateurLeagueCreatorModalProps> = ({
  isOpen,
  onClose,
  organizerName,
  onCreateLeague
}) => {
  const [leagueName, setLeagueName] = useState('');
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState<TournamentTier>('TIER_III');
  const [server, setServer] = useState<ServerRegion>('LAS');
  const [teamCount, setTeamCount] = useState<number>(8);
  const [entryFeePerTeam, setEntryFeePerTeam] = useState<number>(20);
  
  // Commission settings
  const platformCommissionPercent = 7.5; // 7.5% fixed platform fee for API and automated codes
  const [organizerCommissionPercent, setOrganizerCommissionPercent] = useState<number>(17.5); // Organizer profit margin

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hextechAudio.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Real-time calculations
  const grossPool = teamCount * entryFeePerTeam;
  const platformFeeAmount = Math.round((grossPool * platformCommissionPercent) / 100);
  const organizerProfitAmount = Math.round((grossPool * organizerCommissionPercent) / 100);
  const netPrizePoolAmount = grossPool - platformFeeAmount - organizerProfitAmount;
  const prizePoolPercent = Math.max(0, 100 - platformCommissionPercent - organizerCommissionPercent);

  // Prize distribution
  const firstPlace = Math.round(netPrizePoolAmount * 0.6);
  const secondPlace = Math.round(netPrizePoolAmount * 0.3);
  const thirdPlace = Math.max(0, netPrizePoolAmount - firstPlace - secondPlace);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leagueName.trim()) return;

    hextechAudio.playVictory();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.5 }
    });

    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const publicLink = `https://hextourneys.gg/amateur/LGA-${server}-${randomCode}`;

    const newLeague: Tournament = {
      id: `amateur_lga_${Date.now()}`,
      title: leagueName.trim(),
      description: description.trim() || `Liga amateur organizada por ${organizerName}. Premios en metálico con recaudación comunitaria.`,
      bannerImage: 'images/lol_champion_arena_1791934070563.jpg',
      tier,
      entryType: 'PAID',
      entryFeeUSD: entryFeePerTeam,
      prizePoolUSD: netPrizePoolAmount,
      prizeDistribution: {
        firstPlace,
        secondPlace,
        thirdPlace,
        rpBonus: 15000
      },
      server,
      format: 'GRUPOS_Y_PLAYOFFS',
      maxTeams: teamCount,
      registeredTeams: [],
      status: 'REGISTRATION',
      startDate: 'Comienza en 5 días · Horario Comunitario',
      riotLobbyCodeTemplate: `pvpnet://tournament/TRN-${server}-AMATEUR-${randomCode}`,
      autoVerifyEnabled: true,
      rules: [
        `Liga amateur comunitaria gestionada por ${organizerName}.`,
        `Costo de inscripción: $${entryFeePerTeam} USD por equipo.`,
        `Desglose de pozo: 75% Premios en metálico, 17.5% Ganancia del organizador, 7.5% Comisión plataforma Hextech.`,
        'Partidas en Summoner\'s Rift con Tournament Draft y verificación automatizada de Riot Games API.'
      ],
      isAmateurLeague: true,
      organizerSummonerName: organizerName,
      amateurFeeBreakdown: {
        totalGrossPool: grossPool,
        platformCommissionPercent,
        platformCommissionAmount: platformFeeAmount,
        organizerEarningsPercent: organizerCommissionPercent,
        organizerEarningsAmount: organizerProfitAmount,
        netPrizePoolAmount
      },
      publicInviteLink: publicLink,
      groups: [],
      playoffMatches: []
    };

    onCreateLeague(newLeague);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          hextechAudio.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-2xl bg-[#08101e] border-2 border-[#c89b3c]/50 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col cursor-default"
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#060b13] border-b border-[#c89b3c]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#c89b3c]/20 border border-[#c89b3c]/40">
              <Calculator className="w-5 h-5 text-[#c89b3c]" />
            </div>
            <div>
              <h2 className="text-lg font-cinzel font-bold text-[#f0e6d2]">
                Creador de Ligas Amateur & Monetización
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Crea tu propia liga de League of Legends y genera ingresos por comisión
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              hextechAudio.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="amateur-league-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs font-mono">
          {/* League Basics */}
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1">
                Nombre de tu Liga Amateur o Torneo Comunitario
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Liga Universitaria Cono Sur, Copa Streamer Masters..."
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none font-cinzel text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1">
                Descripción / Reglamento Breve
              </label>
              <textarea
                rows={2}
                placeholder="Detalles de la comunidad, premios adicionales, transmisiones en Twitch..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none font-sans text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1">
                  División / Nivel Permitido
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as TournamentTier)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none cursor-pointer"
                >
                  <option value="TIER_IV">Tier IV: Hierro a Plata</option>
                  <option value="TIER_III">Tier III: Oro a Platino</option>
                  <option value="TIER_II">Tier II: Esmeralda a Diamante</option>
                  <option value="TIER_I">Tier I: Master a Challenger</option>
                  <option value="TIER_OPEN">Open: Todas las divisiones</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1">
                  Servidor
                </label>
                <select
                  value={server}
                  onChange={(e) => setServer(e.target.value as ServerRegion)}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none cursor-pointer"
                >
                  <option value="LAS">LAS</option>
                  <option value="LAN">LAN</option>
                  <option value="NA">NA</option>
                  <option value="EUW">EUW</option>
                  <option value="BR">BR</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1">
                  Cupo de Equipos
                </label>
                <select
                  value={teamCount}
                  onChange={(e) => setTeamCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none cursor-pointer"
                >
                  <option value={4}>4 Equipos (Cuadrangular)</option>
                  <option value={8}>8 Equipos (2 Grupos + Finales)</option>
                  <option value={12}>12 Equipos</option>
                  <option value={16}>16 Equipos (Gran Torneo)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Commission Breakdown Simulator */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c192e] to-[#07101e] border-2 border-[#c89b3c]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-sm font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                Desglose Financiero & Comisión del Torneo
              </h4>
              <span className="text-[11px] font-mono text-[#0ac8b9]">Calculado en tiempo real</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1">
                  Inscripción por Equipo ($ USD)
                </label>
                <input
                  type="number"
                  min={5}
                  max={200}
                  value={entryFeePerTeam}
                  onChange={(e) => setEntryFeePerTeam(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-amber-300 font-bold focus:border-[#c89b3c] focus:outline-none text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 uppercase tracking-wider">
                    Tu Ganancia de Organizador
                  </label>
                  <span className="text-amber-400 font-bold">{organizerCommissionPercent}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={25}
                  step={0.5}
                  value={organizerCommissionPercent}
                  onChange={(e) => setOrganizerCommissionPercent(Number(e.target.value))}
                  className="w-full accent-[#c89b3c] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>5% (Mínimo)</span>
                  <span>25% (Máximo)</span>
                </div>
              </div>
            </div>

            {/* Financial 4-Stat Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">POZO BRUTO RECAUDADO</span>
                <span className="text-base font-bold text-white tabular-nums">${grossPool} USD</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{teamCount} equipos × ${entryFeePerTeam}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                <span className="text-emerald-400 text-[10px] block">POZO PARA PREMIOS</span>
                <span className="text-base font-bold text-emerald-300 tabular-nums">${netPrizePoolAmount} USD</span>
                <span className="text-[10px] text-emerald-500 block mt-0.5">{prizePoolPercent.toFixed(1)}% a los equipos</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center">
                <span className="text-amber-300 text-[10px] block font-bold">TU GANANCIA NETA</span>
                <span className="text-base font-bold text-amber-400 tabular-nums">+${organizerProfitAmount} USD</span>
                <span className="text-[10px] text-amber-500 block mt-0.5">{organizerCommissionPercent}% comisión tuya</span>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-slate-800 text-center">
                <span className="text-slate-400 text-[10px] block">TASA PLATAFORMA</span>
                <span className="text-base font-bold text-cyan-300 tabular-nums">${platformFeeAmount} USD</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{platformCommissionPercent}% API & Servidores</span>
              </div>
            </div>

            {/* Payout Distribution Preview */}
            <div className="p-3 rounded-xl bg-black/40 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
              <span className="text-slate-400">Distribución de Premios a Equipos:</span>
              <div className="flex items-center gap-3">
                <span className="text-amber-300">1º: ${firstPlace} USD (60%)</span>
                <span className="text-slate-300">2º: ${secondPlace} USD (30%)</span>
                <span className="text-amber-700">3º: ${thirdPlace} USD (10%)</span>
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Action Footer */}
        <div className="px-6 py-4 bg-[#060b13] border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-slate-500">
            Organizador asignado: <strong className="text-slate-300">{organizerName}</strong>
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                hextechAudio.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="amateur-league-form"
              className="px-6 py-2.5 rounded-lg text-xs font-bold font-cinzel bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] text-black transition-all shadow-[0_0_15px_rgba(200,155,60,0.3)] cursor-pointer"
            >
              Publicar Liga Amateur & Activar Enlace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
