import React, { useState, useEffect } from 'react';
import { Player, ServerRegion, RankTier, DivisionNumber, LaneRole } from '../types/tournament';
import { LOL_CHAMPIONS, RANK_TIERS_INFO, LANE_ROLES_INFO } from '../data/champions';
import { X, Check, Shield, Flame, User, Search, Award, TrendingUp, Settings, BadgeCheck, Loader2 } from 'lucide-react';
import { hextechAudio } from '../utils/audio';
import { ELO_TIERS } from '../utils/elo';
import { riotApi } from '../services/riotApi';
import { RiotPerformanceChart } from './RiotPerformanceChart';

interface ParticipantProfileModalProps {
  player: Player;
  onClose: () => void;
  onUpdatePlayer: (updatedPlayer: Player) => void;
}

export const ParticipantProfileModal: React.FC<ParticipantProfileModalProps> = ({
  player,
  onClose,
  onUpdatePlayer
}) => {
  const [activeProfileTab, setActiveProfileTab] = useState<'settings' | 'performance'>('performance');
  const [summonerName, setSummonerName] = useState(player.summonerName);
  const [tagLine, setTagLine] = useState(player.tagLine);
  const [server, setServer] = useState<ServerRegion>(player.server);
  const [rankTier, setRankTier] = useState<RankTier>(player.rankTier);
  const [division, setDivision] = useState<DivisionNumber>(player.division);
  const [primaryRole, setPrimaryRole] = useState<LaneRole>(player.primaryRole);
  const [secondaryRole, setSecondaryRole] = useState<LaneRole>(player.secondaryRole);
  const [selectedChampSearch, setSelectedChampSearch] = useState('');
  const [selectedMainChamps, setSelectedMainChamps] = useState(player.mainChampions);
  const [verifyState, setVerifyState] = useState<'idle' | 'checking' | 'live' | 'sim'>('idle');
  const [verifyMsg, setVerifyMsg] = useState('');
  const [verifiedPuuid, setVerifiedPuuid] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hextechAudio.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const servers: ServerRegion[] = ['LAS', 'LAN', 'NA', 'EUW', 'EUNE', 'BR', 'KR'];
  const rankTiers: RankTier[] = [
    'IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 
    'EMERALD', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'
  ];
  const divisions: DivisionNumber[] = ['I', 'II', 'III', 'IV'];
  const roles: LaneRole[] = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT', 'FILL'];

  const filteredChamps = LOL_CHAMPIONS.filter((c) =>
    c.name.toLowerCase().includes(selectedChampSearch.toLowerCase())
  );

  const toggleSelectChampion = (champId: string, champName: string) => {
    hextechAudio.playClick();
    const exists = selectedMainChamps.some((c) => c.championId === champId);
    if (exists) {
      setSelectedMainChamps(selectedMainChamps.filter((c) => c.championId !== champId));
    } else {
      if (selectedMainChamps.length >= 3) {
        // Replace oldest
        setSelectedMainChamps([...selectedMainChamps.slice(1), {
          championId: champId,
          championName: champName,
          masteryLevel: 7,
          masteryPoints: 125000
        }]);
      } else {
        setSelectedMainChamps([
          ...selectedMainChamps,
          {
            championId: champId,
            championName: champName,
            masteryLevel: 7,
            masteryPoints: 125000
          }
        ]);
      }
    }
  };

  const handleVerifyRiot = async () => {
    if (!summonerName.trim() || !tagLine.trim()) {
      setVerifyState('sim');
      setVerifyMsg('Escribe tu Riot ID y tag primero.');
      return;
    }
    setVerifyState('checking');
    setVerifyMsg('Consultando Riot Games…');
    hextechAudio.playClick();
    try {
      const data = await riotApi.fetchSummonerData(summonerName.trim(), tagLine.trim(), server);
      if (riotApi.wasLastLookupLive()) {
        const entry = data.rankEntry;
        setVerifiedPuuid(data.account.puuid);
        if ((rankTiers as string[]).includes(entry.tier) && entry.tier !== 'UNRANKED') {
          setRankTier(entry.tier as RankTier);
          if ((divisions as string[]).includes(entry.rank)) {
            setDivision(entry.rank as DivisionNumber);
          }
        }
        setVerifyState('live');
        setVerifyMsg(
          entry.tier === 'UNRANKED'
            ? `Cuenta encontrada (nivel ${data.summoner.summonerLevel}) · sin rango en SoloQ esta temporada.`
            : `Verificado en vivo: ${entry.tier} ${entry.rank} · ${entry.leaguePoints} LP · ${entry.wins}V/${entry.losses}D.`
        );
        hextechAudio.playVictory();
      } else {
        setVerifyState('sim');
        setVerifyMsg('Proxy Riot no disponible (corre `npm run proxy`). Se usó el simulador.');
      }
    } catch {
      setVerifyState('sim');
      setVerifyMsg('No se pudo verificar. Revisa el Riot ID o el estado del proxy.');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    hextechAudio.playVictory();

    const selectedFirstChamp = selectedMainChamps[0];
    const champAvatar = selectedFirstChamp
      ? LOL_CHAMPIONS.find((c) => c.id === selectedFirstChamp.championId)?.avatar || player.avatarUrl
      : player.avatarUrl;

    // Rank and ELO stay consistent: manual rank picks snap ELO to that bracket.
    const bracket =
      ELO_TIERS.find((b) => b.tier === rankTier && b.division === division) ??
      ELO_TIERS.find((b) => b.tier === rankTier);
    const derivedElo = bracket ? Math.round((bracket.minElo + bracket.maxElo) / 2) : player.eloRating;

    const updated: Player = {
      ...player,
      summonerName: summonerName.trim() || player.summonerName,
      tagLine: tagLine.trim() || player.tagLine,
      server,
      rankTier,
      division,
      eloRating: derivedElo,
      seasonPeakElo: Math.max(player.seasonPeakElo, derivedElo),
      primaryRole,
      secondaryRole,
      mainChampions: selectedMainChamps,
      avatarUrl: champAvatar
    };

    onUpdatePlayer(updated);
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
        className="relative w-full max-w-4xl rounded-2xl bg-[#08101e] border-2 border-[#c89b3c]/50 shadow-[0_0_60px_rgba(0,0,0,0.95)] overflow-hidden my-auto max-h-[92vh] flex flex-col cursor-default"
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#060b13] border-b border-[#c89b3c]/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full border border-[#c89b3c] overflow-hidden shrink-0">
              <img
                src={player.avatarUrl}
                alt={player.summonerName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-lg font-cinzel font-bold text-[#f0e6d2]">
                {player.summonerName} <span className="font-mono text-xs text-slate-400">#{player.tagLine}</span>
              </h2>
              <span className="text-[11px] font-mono text-[#0ac8b9]">
                Servidor {player.server} · {player.eloRating} ELO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tab switchers */}
            <div className="flex items-center gap-1 p-1 bg-black/60 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  hextechAudio.playClick();
                  setActiveProfileTab('performance');
                }}
                className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeProfileTab === 'performance'
                    ? 'bg-[#0ac8b9] text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Desempeño Riot API</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  hextechAudio.playClick();
                  setActiveProfileTab('settings');
                }}
                className={`px-3 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeProfileTab === 'settings'
                    ? 'bg-[#c89b3c] text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Editar Invocador</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                hextechAudio.playClick();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono shrink-0"
              title="Cerrar panel de perfil (ESC)"
            >
              <X className="w-4 h-4 text-[#c89b3c]" />
              <span>Cerrar</span>
            </button>
          </div>
        </div>

        {/* Tab Content Viewport */}
        {activeProfileTab === 'performance' ? (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <RiotPerformanceChart
              summonerName={player.summonerName}
              tagLine={player.tagLine}
              puuid={verifiedPuuid ?? undefined}
              region={server}
            />
          </div>
        ) : (
          /* Scrollable Form Body */
          <form id="profile-form" onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Identity Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Nombre de Invocador (Riot ID)
              </label>
              <input
                type="text"
                required
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Línea / Tag (#)
              </label>
              <input
                type="text"
                required
                value={tagLine}
                onChange={(e) => setTagLine(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none text-sm font-mono"
              />
            </div>
          </div>

          {/* Riot live verification */}
          <div className="p-3 rounded-xl bg-black/50 border border-[#0ac8b9]/30 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={handleVerifyRiot}
              disabled={verifyState === 'checking'}
              className="px-4 py-2 rounded-lg bg-[#0ac8b9]/15 border border-[#0ac8b9]/50 hover:border-[#0ac8b9] text-[#0ac8b9] text-xs font-mono font-bold transition-colors cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-60"
            >
              {verifyState === 'checking'
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <BadgeCheck className="w-3.5 h-3.5" />}
              <span>{verifyState === 'checking' ? 'Verificando…' : 'Verificar con Riot'}</span>
            </button>
            <p className={`text-[11px] font-mono leading-relaxed ${
              verifyState === 'live' ? 'text-emerald-300' : verifyState === 'sim' ? 'text-amber-300' : 'text-slate-400'
            }`}>
              {verifyMsg || 'Conecta tu Riot ID real: autocompleta rango y división desde la API oficial (requiere `npm run proxy`).'}
            </p>
          </div>

          {/* Server & Rank */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Servidor Regional
              </label>
              <select
                value={server}
                onChange={(e) => setServer(e.target.value as ServerRegion)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none text-sm cursor-pointer"
              >
                {servers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                División Clasificatoria
              </label>
              <select
                value={rankTier}
                onChange={(e) => setRankTier(e.target.value as RankTier)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none text-sm cursor-pointer"
              >
                {rankTiers.map((r) => (
                  <option key={r} value={r}>
                    {RANK_TIERS_INFO[r].name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Nivel (I - IV)
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value as DivisionNumber)}
                className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-[#f0e6d2] focus:border-[#c89b3c] focus:outline-none text-sm cursor-pointer"
              >
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Primary & Secondary Roles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Rol Principal en la Grieta
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => {
                  const roleObj = LANE_ROLES_INFO[r];
                  const isSelected = primaryRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setPrimaryRole(r)}
                      className={`p-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#c89b3c] text-black shadow-[0_0_10px_rgba(200,155,60,0.4)]'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {roleObj.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                Rol Secundario
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => {
                  const roleObj = LANE_ROLES_INFO[r];
                  const isSelected = secondaryRole === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSecondaryRole(r)}
                      className={`p-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0ac8b9] text-black shadow-[0_0_10px_rgba(10,200,185,0.4)]'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {roleObj.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Champions Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider">
                  Tus 3 Campeones Principales (Pool de Torneo)
                </label>
                <p className="text-[11px] text-slate-400">
                  Seleccionados: {selectedMainChamps.map((c) => c.championName).join(', ') || 'Ninguno'}
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar campeón..."
                  value={selectedChampSearch}
                  onChange={(e) => setSelectedChampSearch(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-[#c89b3c]"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-48 overflow-y-auto p-2 bg-black/40 rounded-xl border border-slate-800">
              {filteredChamps.map((champ) => {
                const isSelected = selectedMainChamps.some((c) => c.championId === champ.id);
                return (
                  <button
                    key={champ.id}
                    type="button"
                    onClick={() => toggleSelectChampion(champ.id, champ.name)}
                    className={`relative rounded-xl overflow-hidden border p-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#c89b3c] bg-[#c89b3c]/20 shadow-[0_0_12px_rgba(200,155,60,0.4)]'
                        : 'border-slate-800 hover:border-slate-600 bg-slate-900/60'
                    }`}
                  >
                    <img
                      src={champ.avatar}
                      alt={champ.name}
                      className="w-full aspect-square object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-[10px] font-mono text-center truncate mt-1 text-slate-300">
                      {champ.name}
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#c89b3c] text-black flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
        )}

        {/* Sticky Action Footer */}
        <div className="px-6 py-4 bg-[#060b13] border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-slate-500">
            Presiona ESC o haz clic fuera para salir
          </span>
          <div className="flex items-center gap-3">
            {activeProfileTab === 'performance' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    hextechAudio.playClick();
                    setActiveProfileTab('settings');
                  }}
                  className="px-4 py-2 rounded-lg text-xs font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-700 transition-colors cursor-pointer"
                >
                  Editar Datos de Invocador
                </button>
                <button
                  type="button"
                  onClick={() => {
                    hextechAudio.playClick();
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-lg text-xs font-bold font-cinzel bg-[#0ac8b9] hover:bg-[#1fe5d5] text-black transition-all cursor-pointer"
                >
                  Entendido / Cerrar
                </button>
              </>
            ) : (
              <>
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
                  form="profile-form"
                  className="px-6 py-2.5 rounded-lg text-xs font-bold font-cinzel bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] text-black transition-all shadow-[0_0_15px_rgba(200,155,60,0.3)] cursor-pointer"
                >
                  Guardar Perfil de Invocador
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
