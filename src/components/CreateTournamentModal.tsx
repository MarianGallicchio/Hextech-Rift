import React, { useState, useEffect } from 'react';
import { Tournament, TournamentTier, ServerRegion } from '../types/tournament';
import { X, Trophy, DollarSign, Shield, Plus, Sparkles, Cpu } from 'lucide-react';
import { hextechAudio } from '../utils/audio';

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (tournament: Tournament) => void;
}

export const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tier, setTier] = useState<TournamentTier>('TIER_II');
  const [entryType, setEntryType] = useState<'FREE' | 'PAID'>('PAID');
  const [entryFeeUSD, setEntryFeeUSD] = useState<number>(20);
  const [prizePoolUSD, setPrizePoolUSD] = useState<number>(1800);
  const [server, setServer] = useState<ServerRegion>('LAS');
  const [maxTeams, setMaxTeams] = useState<number>(8);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    hextechAudio.playVictory();

    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const firstPlace = Math.round(prizePoolUSD * 0.6);
    const secondPlace = Math.round(prizePoolUSD * 0.3);
    const thirdPlace = Math.round(prizePoolUSD * 0.1);

    const newTournament: Tournament = {
      id: `trn_${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Torneo competitivo oficial con validación automatizada de resultados.',
      bannerImage: '/src/assets/images/lol_champion_arena_1791934070563.jpg',
      tier,
      entryType,
      entryFeeUSD: entryType === 'FREE' ? 0 : entryFeeUSD,
      prizePoolUSD: entryType === 'FREE' ? 0 : prizePoolUSD,
      prizeDistribution: {
        firstPlace,
        secondPlace,
        thirdPlace,
        rpBonus: entryType === 'FREE' ? 10000 : 25000
      },
      server,
      format: 'GRUPOS_Y_PLAYOFFS',
      maxTeams,
      registeredTeams: [],
      status: 'REGISTRATION',
      startDate: 'En 3 días · 20:00 GMT-3',
      riotLobbyCodeTemplate: `pvpnet://tournament/TRN-${server}-AUTO-${randomHex}`,
      autoVerifyEnabled: true,
      rules: [
        `Torneo restringido a invocadores en categoría ${tier}.`,
        'Partidas en Summoner\'s Rift en Reclutamiento de Torneo (Tournament Draft).',
        'Sincronización directa con Riot Games API v5 para validación de resultados.',
        'Pagos de premios en metálico asegurados dentro de las 24 horas posteriores a la final.'
      ],
      groups: [],
      playoffMatches: []
    };

    onCreate(newTournament);
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
        className="relative w-full max-w-2xl rounded-2xl bg-[#08101e] border-2 border-[#c89b3c]/50 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#060b13] border-b border-[#c89b3c]/30">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#c89b3c]" />
            <h2 className="text-lg font-cinzel font-bold text-[#f0e6d2]">
              Crear Nuevo Torneo de League of Legends
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="block text-slate-300 uppercase tracking-wider mb-1">
              Nombre Oficial del Torneo
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Copa Nexo Hextech Split 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none font-cinzel text-sm"
            />
          </div>

          <div>
            <label className="block text-slate-300 uppercase tracking-wider mb-1">
              Descripción Breve
            </label>
            <textarea
              rows={2}
              placeholder="Detalles sobre el formato, transmisiones y requisitos..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none font-sans text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1">
                División Escalonada ELO
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
                Modalidad de Inscripción
              </label>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value as 'FREE' | 'PAID')}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none cursor-pointer"
              >
                <option value="PAID">Inscripción Paga (Premios en Metálico)</option>
                <option value="FREE">Inscripción Gratuita (Premios en RP)</option>
              </select>
            </div>
          </div>

          {entryType === 'PAID' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div>
                <label className="block text-amber-300 uppercase tracking-wider mb-1">
                  Costo de Inscripción ($ USD por Equipo)
                </label>
                <input
                  type="number"
                  min={1}
                  value={entryFeeUSD}
                  onChange={(e) => setEntryFeeUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-amber-300 uppercase tracking-wider mb-1">
                  Pozo de Premios Garantizado ($ USD)
                </label>
                <input
                  type="number"
                  min={10}
                  value={prizePoolUSD}
                  onChange={(e) => setPrizePoolUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-slate-300 text-xs">
            <Cpu className="w-4 h-4 text-[#0ac8b9]" />
            <span>
              Generación de salas de torneo con protocolo de Riot Games y validación automática habilitadas por defecto.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] text-black font-cinzel font-bold text-xs transition-all shadow-[0_0_15px_rgba(200,155,60,0.3)] cursor-pointer"
            >
              Publicar Torneo en la Plataforma
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
