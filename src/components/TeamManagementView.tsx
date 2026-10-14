import React, { useState } from 'react';
import { Team, Player, LaneRole, TeamMember } from '../types/tournament';
import { LANE_ROLES_INFO, RANK_TIERS_INFO, LOL_CHAMPIONS } from '../data/champions';
import { Users, Copy, Check, Shield, Trophy, UserPlus, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { hextechAudio } from '../utils/audio';

interface TeamManagementViewProps {
  player: Player;
  team: Team | null;
  onUpdateTeam: (updatedTeam: Team) => void;
  onCreateTeam: (name: string, tag: string) => void;
}

export const TeamManagementView: React.FC<TeamManagementViewProps> = ({
  player,
  team,
  onUpdateTeam,
  onCreateTeam
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamTag, setNewTeamTag] = useState('');
  const [selectedRoleToEdit, setSelectedRoleToEdit] = useState<LaneRole | 'SUB' | null>(null);

  const handleCopyInvite = () => {
    if (!team) return;
    navigator.clipboard.writeText(team.inviteCode);
    setCopiedCode(true);
    hextechAudio.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleToggleReady = (roleKey: 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT' | 'SUB') => {
    if (!team) return;
    const currentMember = team.roster[roleKey];
    if (!currentMember) return;

    hextechAudio.playClick();
    const updatedTeam: Team = {
      ...team,
      roster: {
        ...team.roster,
        [roleKey]: {
          ...currentMember,
          ready: !currentMember.ready
        }
      }
    };
    onUpdateTeam(updatedTeam);
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamTag.trim()) return;
    hextechAudio.playVictory();
    onCreateTeam(newTeamName.trim(), newTeamTag.trim().toUpperCase());
  };

  const rolesOrder: (keyof Team['roster'])[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT', 'SUB'];

  if (!team) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#c89b3c] to-[#091428] p-[1px] shadow-[0_0_25px_rgba(200,155,60,0.3)]">
          <div className="w-full h-full bg-[#060b13] rounded-2xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-[#c89b3c]" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-cinzel font-bold text-[#f0e6d2]">
            Funda tu Escuadra de Torneo
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Para competir en las copas con premios en metálico y divisiones escalonadas, necesitas crear un equipo de 5 invocadores.
          </p>
        </div>

        <form onSubmit={handleCreateTeamSubmit} className="p-6 rounded-2xl hextech-card space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Nombre de la Organización / Equipo
            </label>
            <input
              type="text"
              required
              placeholder="Ej. T1 Academy, Noxus Titans..."
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Etiqueta de Equipo (Tag 3-4 Caracteres)
            </label>
            <input
              type="text"
              required
              maxLength={4}
              placeholder="Ej. T1A, NOX, HPX"
              value={newTeamTag}
              onChange={(e) => setNewTeamTag(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none text-sm uppercase font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] text-black font-cinzel font-bold text-sm transition-all shadow-[0_0_20px_rgba(200,155,60,0.3)] cursor-pointer mt-4"
          >
            Fundar Equipo & Asignar Capitanía
          </button>
        </form>
      </div>
    );
  }

  const allReady = Object.values(team.roster).filter(Boolean).every((m) => m?.ready);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Team Header Banner */}
      <div className="p-6 rounded-2xl hextech-card border border-[#c89b3c]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-[#c89b3c] via-[#785a28] to-[#091428] p-[1px] shadow-[0_0_25px_rgba(200,155,60,0.3)] shrink-0">
            <div className="w-full h-full bg-[#060b13] rounded-xl flex items-center justify-center font-cinzel text-xl font-bold text-[#c89b3c]">
              {team.tag}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#f0e6d2]">
                {team.name}
              </h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#c89b3c]/20 border border-[#c89b3c]/40 text-[#f0e6d2]">
                [{team.tag}]
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-1">
              <span>{team.stats.wins} Victorias</span>
              <span aria-hidden="true">·</span>
              <span>{team.stats.losses} Derrotas</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#0ac8b9]">{team.stats.tournamentTitles} Trofeos Ganados</span>
            </div>
          </div>
        </div>

        {/* Team Invite Code & Ready State */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400 pl-2">Código de Invitación:</span>
            <span className="text-[#0ac8b9] font-bold">{team.inviteCode}</span>
            <button
              onClick={handleCopyInvite}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Copiar código para invitar compañeros"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div
            className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 ${
              allReady
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{allReady ? 'Roster Completo y Listo' : 'Invocadores Pendientes'}</span>
          </div>
        </div>
      </div>

      {/* 3D Pedestal Roster Slots */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <h2 className="text-lg font-cinzel font-bold text-[#f0e6d2]">
              Alineación Titular de la Grieta (Roster 5v5 + Suplente)
            </h2>
            <p className="text-xs text-slate-400">
              Cada invocador debe marcar su estado de listo para ingresar al lobby del torneo.
            </p>
          </div>
          <span className="text-xs font-mono text-[#c89b3c]">Reclutamiento de Torneo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesOrder.map((roleKey) => {
            const member = team.roster[roleKey];
            const roleInfo = roleKey === 'SUB' ? { name: 'Suplente', label: 'Suplente (Sub)', desc: 'Reserva para relevos' } : LANE_ROLES_INFO[roleKey];
            const rankBadge = member ? RANK_TIERS_INFO[member.rankTier] : null;

            return (
              <div
                key={roleKey}
                className="relative rounded-2xl hextech-card p-5 border border-[#c89b3c]/20 hover:border-[#c89b3c]/60 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Role Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#c89b3c] uppercase tracking-wider">
                      {roleInfo.label}
                    </span>
                  </div>
                  {member?.isCaptain && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Capitán
                    </span>
                  )}
                </div>

                {/* Member Details */}
                {member ? (
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-xl border border-[#c89b3c] overflow-hidden shrink-0 shadow-[0_0_15px_rgba(200,155,60,0.2)]">
                      <img
                        src={member.avatarUrl}
                        alt={member.summonerName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#f0e6d2] truncate">
                        {member.summonerName}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        #{member.tagLine}
                      </div>
                      {rankBadge && (
                        <div className="text-[11px] font-mono mt-0.5 flex items-center gap-1.5">
                          <span className={rankBadge.color}>
                            {rankBadge.name} {member.division}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-4 text-center border-2 border-dashed border-slate-800 rounded-xl">
                    <UserPlus className="w-6 h-6 mx-auto text-slate-600 mb-1" />
                    <span className="text-xs text-slate-500">Posición Vacante</span>
                  </div>
                )}

                {/* Ready Action */}
                {member ? (
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleReady(roleKey)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        member.ready
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{member.ready ? 'Invocador Listo' : 'Marcar como Listo'}</span>
                    </button>
                    <span className="text-[10px] font-mono text-slate-400">
                      {member.ready ? 'En Sala' : 'Pendiente'}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={handleCopyInvite}
                    className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono transition-colors cursor-pointer"
                  >
                    Invitar Jugador
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
