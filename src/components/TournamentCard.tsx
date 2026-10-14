import React from 'react';
import { Tournament, TournamentTier } from '../types/tournament';
import { Trophy, Users, Shield, DollarSign, Calendar, Cpu } from 'lucide-react';
import { hextechAudio } from '../utils/audio';

interface TournamentCardProps {
  tournament: Tournament;
  onSelect: (tournament: Tournament) => void;
  isRegistered?: boolean;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  onSelect,
  isRegistered
}) => {
  const getTierLabel = (tier: TournamentTier) => {
    switch (tier) {
      case 'TIER_I':
        return { label: 'Tier I · Master & Challenger', color: 'text-purple-400 border-purple-500/40 bg-purple-950/30' };
      case 'TIER_II':
        return { label: 'Tier II · Esmeralda & Diamante', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30' };
      case 'TIER_III':
        return { label: 'Tier III · Oro & Platino', color: 'text-yellow-400 border-yellow-500/40 bg-yellow-950/30' };
      case 'TIER_IV':
        return { label: 'Tier IV · Hierro & Plata', color: 'text-slate-300 border-slate-500/40 bg-slate-900/40' };
      case 'TIER_OPEN':
        return { label: 'Open · Todas las Divisiones', color: 'text-amber-400 border-amber-500/40 bg-amber-950/30' };
    }
  };

  const tierInfo = getTierLabel(tournament.tier);

  return (
    <div
      onClick={() => {
        hextechAudio.playClick();
        onSelect(tournament);
      }}
      className="group relative rounded-2xl hextech-card overflow-hidden border border-[#c89b3c]/25 hover:border-[#c89b3c]/80 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Banner Image with gradient scrim */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={tournament.bannerImage}
          alt={tournament.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091428] via-[#091428]/60 to-transparent" />

        {/* Division Badge & Type (clean unboxed inline layout) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md border backdrop-blur-md ${tierInfo.color}`}>
              {tierInfo.label}
            </span>
            {tournament.isAmateurLeague && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-500/50 backdrop-blur-md">
                LIGA AMATEUR
              </span>
            )}
          </div>

          <span
            className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-md backdrop-blur-md border ${
              tournament.entryType === 'PAID'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {tournament.entryType === 'PAID' ? `Inscripción: $${tournament.entryFeeUSD} USD` : 'Inscripción Gratuita'}
          </span>
        </div>

        {/* Server & Status metadata */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#0ac8b9]" />
            <span>Servidor {tournament.server}</span>
            {tournament.organizerSummonerName && (
              <span className="text-slate-400 text-[10px] hidden sm:inline">
                · Org: {tournament.organizerSummonerName}
              </span>
            )}
          </div>
          {tournament.autoVerifyEnabled && (
            <div className="flex items-center gap-1 text-[#0ac8b9] text-[10px]" title="Validación automática con Riot API">
              <Cpu className="w-3 h-3" />
              <span>Riot API Auto</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-cinzel font-bold text-[#f0e6d2] group-hover:text-[#c89b3c] transition-colors line-clamp-1">
            {tournament.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {tournament.description}
          </p>
        </div>

        {/* Prize Pool Highlights */}
        <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-[#c89b3c]" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Pozo en Metálico
              </div>
              <div className="text-sm font-bold text-[#f0e6d2] font-mono tabular-nums">
                {tournament.prizePoolUSD > 0 ? `$${tournament.prizePoolUSD.toLocaleString()} USD` : 'Skins & Riot Points'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              1º Lugar
            </div>
            <div className="text-xs font-bold text-amber-400 font-mono tabular-nums">
              {tournament.prizeDistribution.firstPlace > 0 ? `$${tournament.prizeDistribution.firstPlace} USD` : `${tournament.prizeDistribution.rpBonus} RP`}
            </div>
          </div>
        </div>

        {/* Registered Teams & Schedule */}
        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Equipos inscritos
            </span>
            <span className="text-slate-200 tabular-nums">
              {tournament.registeredTeams.length} / {tournament.maxTeams}
            </span>
          </div>

          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0ac8b9] to-[#c89b3c] h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (tournament.registeredTeams.length / tournament.maxTeams) * 100)}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-slate-400 pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Inicio
            </span>
            <span className="text-slate-300">{tournament.startDate}</span>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
          {isRegistered ? (
            <span className="text-xs font-mono font-semibold text-[#0ac8b9] flex items-center gap-1">
              ✓ Tu Equipo está Inscrito
            </span>
          ) : (
            <span className="text-xs text-slate-400">Inscripción habilitada</span>
          )}

          <button className="px-4 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] hover:to-[#8c6930] text-black font-semibold transition-all shadow-[0_0_12px_rgba(200,155,60,0.3)] whitespace-nowrap shrink-0 cursor-pointer">
            Ver Torneo & Bracket
          </button>
        </div>
      </div>
    </div>
  );
};
