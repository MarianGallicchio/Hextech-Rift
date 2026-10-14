import React, { useState, useEffect } from 'react';
import { Tournament, Match, Team } from '../types/tournament';
import { X, Trophy, DollarSign, Calendar, Shield, Users, CheckCircle, Info, ExternalLink, Cpu } from 'lucide-react';
import { InteractiveBracket } from './InteractiveBracket';
import { hextechAudio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface TournamentDetailModalProps {
  tournament: Tournament | null;
  onClose: () => void;
  userTeam: Team | null;
  onRegisterTeam: (tournamentId: string, team: Team) => void;
  onSelectMatch: (match: Match) => void;
}

export const TournamentDetailModal: React.FC<TournamentDetailModalProps> = ({
  tournament,
  onClose,
  userTeam,
  onRegisterTeam,
  onSelectMatch
}) => {
  const [activeTab, setActiveTab] = useState<'bracket' | 'prizes' | 'rules' | 'teams'>('bracket');

  useEffect(() => {
    if (!tournament) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hextechAudio.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tournament, onClose]);

  if (!tournament) return null;

  const isUserTeamRegistered = userTeam
    ? tournament.registeredTeams.some((t) => t.id === userTeam.id)
    : false;

  const handleRegister = () => {
    if (!userTeam) return;
    hextechAudio.playVictory();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    onRegisterTeam(tournament.id, userTeam);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detalle del torneo ${tournament.title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          hextechAudio.playClick();
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-2xl bg-[#08101e] border-2 border-[#c89b3c]/40 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col cursor-default"
      >
        {/* Banner Header */}
        <div className="relative h-48 sm:h-60 w-full shrink-0 overflow-hidden">
          <img
            src={tournament.bannerImage}
            alt={tournament.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08101e] via-[#08101e]/60 to-transparent" />

          {/* Close button */}
          <button
            onClick={() => {
              hextechAudio.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 text-slate-300 hover:text-white hover:bg-black/90 transition-all cursor-pointer z-10"
            aria-label="Cerrar detalle del torneo"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and Key Badges */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-[#c89b3c]/20 border border-[#c89b3c]/40 text-[#f0e6d2]">
                {tournament.tier}
              </span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-[#0ac8b9]/20 border border-[#0ac8b9]/40 text-[#0ac8b9]">
                Servidor {tournament.server}
              </span>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${
                  tournament.entryType === 'PAID'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {tournament.entryType === 'PAID' ? `Inscripción: $${tournament.entryFeeUSD} USD` : 'Inscripción Gratuita'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f0e6d2]">
              {tournament.title}
            </h1>
          </div>
        </div>

        {/* Action & Stats Strip */}
        <div className="px-6 py-3 bg-[#060b13] border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">POZO TOTAL</span>
              <span className="text-amber-400 font-bold text-sm tabular-nums">
                {tournament.prizePoolUSD > 0 ? `$${tournament.prizePoolUSD.toLocaleString()} USD` : 'Skins & RP'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">EQUIPOS</span>
              <span className="text-slate-200 font-bold text-sm tabular-nums">
                {tournament.registeredTeams.length} / {tournament.maxTeams}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">INICIO</span>
              <span className="text-slate-200 font-bold text-sm">{tournament.startDate}</span>
            </div>
          </div>

          <div>
            {isUserTeamRegistered ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0ac8b9]/20 border border-[#0ac8b9]/40 text-[#0ac8b9] text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Equipo Inscrito: {userTeam?.name}</span>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                disabled={!userTeam}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] hover:to-[#8c6930] text-black transition-all shadow-[0_0_15px_rgba(200,155,60,0.4)] cursor-pointer disabled:opacity-40"
              >
                {userTeam ? `Inscribir Equipo (${userTeam.tag})` : 'Crea un Equipo para Inscribirte'}
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div role="tablist" aria-label="Secciones del torneo" className="px-6 border-b border-slate-800 bg-[#070e1a] flex items-center gap-6 shrink-0 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => {
              hextechAudio.playClick();
              setActiveTab('bracket');
            }}
            className={`py-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'bracket'
                ? 'text-[#f0e6d2] border-b-2 border-[#c89b3c] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fase de Grupos & Brackets 3D
          </button>

          <button
            onClick={() => {
              hextechAudio.playClick();
              setActiveTab('prizes');
            }}
            className={`py-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'prizes'
                ? 'text-[#f0e6d2] border-b-2 border-[#c89b3c] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Premios en Metálico & Distribución
          </button>

          <button
            onClick={() => {
              hextechAudio.playClick();
              setActiveTab('teams');
            }}
            className={`py-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'teams'
                ? 'text-[#f0e6d2] border-b-2 border-[#c89b3c] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Equipos Participantes ({tournament.registeredTeams.length})
          </button>

          <button
            onClick={() => {
              hextechAudio.playClick();
              setActiveTab('rules');
            }}
            className={`py-3 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'rules'
                ? 'text-[#f0e6d2] border-b-2 border-[#c89b3c] font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reglamento & Automatización Riot
          </button>
        </div>

        {/* Tab Content Viewport */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'bracket' && (
            <InteractiveBracket tournament={tournament} onSelectMatch={onSelectMatch} />
          )}

          {activeTab === 'prizes' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1st Place */}
                <div className="relative rounded-2xl bg-gradient-to-b from-[#1a1c14] to-[#0c1018] border-2 border-amber-400/70 shadow-[0_0_25px_rgba(251,191,36,0.2)] overflow-hidden flex flex-col justify-between">
                  <div className="relative h-48 w-full bg-black/60 overflow-hidden">
                    <img
                      src="images/hextech_trophy_first_1791934697118.jpg"
                      alt="Trofeo 1º Puesto Hextech Grand Championship"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c1018] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-400/30 text-amber-300 border border-amber-400/50 backdrop-blur-md">
                      1º PUESTO · GRAN CAMPEÓN
                    </span>
                  </div>

                  <div className="p-4 text-center space-y-2">
                    <div className="text-2xl font-cinzel font-bold text-[#f0e6d2] tabular-nums">
                      {tournament.prizeDistribution.firstPlace > 0
                        ? `$${tournament.prizeDistribution.firstPlace.toLocaleString()} USD`
                        : `${tournament.prizeDistribution.rpBonus} Riot Points`}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Trofeo Hextech oficial en oro y cristal azul runico, acreditación monetaria inmediata y título de campeón regional.
                    </p>
                  </div>
                </div>

                {/* 2nd Place */}
                <div className="relative rounded-2xl bg-gradient-to-b from-[#0e1726] to-[#070e18] border border-cyan-400/40 hover:border-cyan-400 shadow-[0_0_20px_rgba(10,200,185,0.15)] overflow-hidden flex flex-col justify-between">
                  <div className="relative h-48 w-full bg-black/60 overflow-hidden">
                    <img
                      src="images/hextech_trophy_second_1791934697670.jpg"
                      alt="Trofeo 2º Puesto Hextech Runner-Up"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091428] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/50 backdrop-blur-md">
                      2º PUESTO · SUBCAMPEÓN
                    </span>
                  </div>

                  <div className="p-4 text-center space-y-2">
                    <div className="text-2xl font-cinzel font-bold text-[#f0e6d2] tabular-nums">
                      {tournament.prizeDistribution.secondPlace > 0
                        ? `$${tournament.prizeDistribution.secondPlace.toLocaleString()} USD`
                        : 'Skins Legendarias'}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Cáliz de platino con engranajes Hextech y cristales de neón, más puntos para la clasificación general.
                    </p>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="relative rounded-2xl bg-slate-900/90 border border-amber-900/50 shadow-[0_0_20px_rgba(217,119,6,0.15)] overflow-hidden flex flex-col justify-between">
                  <div className="relative h-48 w-full bg-black/60 overflow-hidden">
                    <img
                      src="images/hextech_trophy_third_1791934697357.jpg"
                      alt="Trofeo 3º Puesto Hextech Bronze"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#091428] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-700/30 text-amber-300 border border-amber-700/50 backdrop-blur-md">
                      3º PUESTO · TERCER LUGAR
                    </span>
                  </div>

                  <div className="p-4 text-center space-y-2">
                    <div className="text-2xl font-cinzel font-bold text-[#f0e6d2] tabular-nums">
                      {tournament.prizeDistribution.thirdPlace > 0
                        ? `$${tournament.prizeDistribution.thirdPlace.toLocaleString()} USD`
                        : 'Pases de Batalla'}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Copa de bronce forjada con conductos de energía Hextech verde azulada y retorno de tarifa de inscripción.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#0ac8b9] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed space-y-1">
                  <p className="font-semibold text-[#f0e6d2]">
                    Garantía de Pagos Seguros en Metálico
                  </p>
                  <p>
                    Los premios se liquidan automáticamente a los capitanes de equipo registrados tras la validación de la final por parte del panel administrativo o el sistema automatizado de Riot Games API.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tournament.registeredTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c89b3c] to-[#091428] p-[1px]">
                      <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center font-bold text-[#c89b3c] font-cinzel">
                        {team.tag}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#f0e6d2]">{team.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">
                        {team.stats.wins}V - {team.stats.losses}D · {team.divisionTier}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-[#0ac8b9] px-2 py-1 rounded bg-[#0ac8b9]/10 border border-[#0ac8b9]/30">
                    Confirmado
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
                <h4 className="text-sm font-cinzel font-bold text-[#f0e6d2] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#c89b3c]" />
                  Reglas de la Competición
                </h4>
                <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                  {tournament.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0a1525] border border-[#0ac8b9]/30 space-y-2">
                <h4 className="text-sm font-semibold text-[#0ac8b9] flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Generación Automatizada de Códigos de Torneo Riot
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Cada encuentro cuenta con una sala oficial parametrizada con el protocolo <code className="font-mono text-cyan-300">pvpnet://tournament/</code>. Al ingresar al cliente de LoL, los campeones disponibles, bans de 10 campeones y árbitros se configuran sin intervención manual. En caso de retraso, el capitán puede generar una sala manual alternativa desde el panel.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
