import React, { useState, useEffect } from 'react';
import { Player, Team, Tournament, Match, AppNotification, TournamentTier } from './types/tournament';
import { INITIAL_PLAYER, INITIAL_TEAMS, INITIAL_TOURNAMENTS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { HeaderNav } from './components/HeaderNav';
import { TournamentCard } from './components/TournamentCard';
import { TournamentDetailModal } from './components/TournamentDetailModal';
import { TeamManagementView } from './components/TeamManagementView';
import { EloRatingView } from './components/EloRatingView';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ParticipantProfileModal } from './components/ParticipantProfileModal';
import { LiveMatchModal } from './components/LiveMatchModal';
import { PushNotificationDrawer } from './components/PushNotificationDrawer';
import { CreateTournamentModal } from './components/CreateTournamentModal';
import { FriendlyScrimsPanel } from './components/FriendlyScrimsPanel';
import { AmateurLeagueCreatorModal } from './components/AmateurLeagueCreatorModal';
import { ReferralProgramModal } from './components/ReferralProgramModal';
import { AdvancedAnalyticsDashboard } from './components/AdvancedAnalyticsDashboard';
import { hextechAudio } from './utils/audio';
import { getRankFromElo } from './utils/elo';
import { Trophy, Shield, Plus, Sparkles, Filter, Search, DollarSign, Cpu, Calculator, Swords, Gift, BarChart3 } from 'lucide-react';

export default function App() {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [teams, setTeams] = useState<Team[]>(INITIAL_TEAMS);
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const [activeTab, setActiveTab] = useState<'tournaments' | 'team' | 'scrims' | 'elo' | 'analytics' | 'admin'>('tournaments');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateTournamentOpen, setIsCreateTournamentOpen] = useState(false);
  const [isAmateurLeagueCreatorOpen, setIsAmateurLeagueCreatorOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filters
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | 'PAID' | 'FREE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const userTeam = teams.find((t) => t.id === player.teamId) || null;

  // Handle Match Result Update from Admin or Live Lobby
  const handleUpdateMatch = (tournamentId: string, updatedMatch: Match) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id !== tournamentId) return t;

        // Update in group matches
        const updatedGroups = t.groups.map((g) => ({
          ...g,
          matches: g.matches.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)),
          teams: g.teams.map((teamEntry) => {
            if (updatedMatch.status === 'COMPLETED') {
              if (teamEntry.id === updatedMatch.winnerId) {
                return { ...teamEntry, wins: teamEntry.wins + 1, points: teamEntry.points + 3 };
              } else if (
                teamEntry.id === updatedMatch.team1?.id ||
                teamEntry.id === updatedMatch.team2?.id
              ) {
                return { ...teamEntry, losses: teamEntry.losses + 1 };
              }
            }
            return teamEntry;
          })
        }));

        // Update in playoffs
        const updatedPlayoffs = t.playoffMatches.map((m) =>
          m.id === updatedMatch.id ? updatedMatch : m
        );

        return {
          ...t,
          groups: updatedGroups,
          playoffMatches: updatedPlayoffs
        };
      })
    );

    // If active match was open, update it
    if (activeMatch && activeMatch.id === updatedMatch.id) {
      setActiveMatch(updatedMatch);
    }
  };

  // Register user team to tournament
  const handleRegisterTeam = (tournamentId: string, teamToRegister: Team) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id !== tournamentId) return t;
        if (t.registeredTeams.some((r) => r.id === teamToRegister.id)) return t;
        return {
          ...t,
          registeredTeams: [...t.registeredTeams, teamToRegister]
        };
      })
    );

    // Add push notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: '¡Equipo Inscrito con Éxito!',
      message: `Tu equipo [${teamToRegister.tag}] ${teamToRegister.name} ha sido registrado para el torneo. Recibirás el código de sala Riot cuando comience el check-in.`,
      type: 'MATCH_ALERT',
      timestamp: 'Ahora mismo',
      read: false
    };

    setNotifications((prev) => [newNotif, ...prev]);
    hextechAudio.playNotification();
  };

  // Create new team
  const handleCreateTeam = (name: string, tag: string) => {
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name,
      tag,
      captainId: player.id,
      logoUrl: '',
      divisionTier: 'TIER_II',
      inviteCode: `${tag}-RFT-${Math.floor(100 + Math.random() * 900)}`,
      stats: {
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        tournamentTitles: 0
      },
      roster: {
        [player.primaryRole]: {
          playerId: player.id,
          summonerName: player.summonerName,
          tagLine: player.tagLine,
          role: player.primaryRole,
          rankTier: player.rankTier,
          division: player.division,
          isCaptain: true,
          avatarUrl: player.avatarUrl,
          ready: true
        }
      }
    };

    setTeams((prev) => [newTeam, ...prev]);
    setPlayer((prev) => ({ ...prev, teamId: newTeam.id, isCaptain: true }));
  };

  // Update Player ELO
  const handleUpdatePlayerElo = (newElo: number) => {
    const rank = getRankFromElo(newElo);
    setPlayer((prev) => ({
      ...prev,
      eloRating: newElo,
      seasonPeakElo: Math.max(prev.seasonPeakElo, newElo),
      rankTier: rank.tier,
      division: rank.division
    }));
  };

  // Filtered Tournaments
  const filteredTournaments = tournaments.filter((t) => {
    if (selectedTierFilter !== 'ALL' && t.tier !== selectedTierFilter) return false;
    if (selectedTypeFilter === 'PAID' && t.entryType !== 'PAID') return false;
    if (selectedTypeFilter === 'FREE' && t.entryType !== 'FREE') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate total cash prize pool
  const totalPrizePoolUSD = tournaments.reduce((acc, t) => acc + t.prizePoolUSD, 0);

  // Send Test Push Notification
  const handleSendTestNotification = () => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: 'Aviso de Partida Inminente',
      message: 'Faltan 10 minutos para tu partida contra Zaun Overdrive. Código de torneo Riot generado: TRN-LAS-EMD-GRP2.',
      type: 'MATCH_ALERT',
      timestamp: 'Ahora mismo',
      read: false,
      matchId: 'm_grp_02',
      actionLabel: 'Abrir Sala de Partida'
    };

    setNotifications((prev) => [newNotif, ...prev]);
    hextechAudio.playNotification();

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Hextech Rift: ¡Tu partida comienza pronto!', {
        body: 'Prepara a tu equipo para ingresar con el código de torneo en el cliente.',
        icon: '/favicon.ico'
      });
    }
  };

  const handleNotificationAction = (notif: AppNotification) => {
    setIsNotificationsOpen(false);
    if (notif.matchId) {
      // Find the match
      for (const t of tournaments) {
        const found = [
          ...t.groups.flatMap((g) => g.matches),
          ...t.playoffMatches
        ].find((m) => m.id === notif.matchId);
        if (found) {
          setActiveMatch(found);
          break;
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#040810] text-slate-100 flex flex-col justify-between selection:bg-[#c89b3c]/30 selection:text-[#f0e6d2]">
      {/* Top Bar Contract Navigation */}
      <HeaderNav
        player={player}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenReferrals={() => setIsReferralOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* VIEW 1: TOURNAMENTS & LEAGUES */}
        {activeTab === 'tournaments' && (
          <div className="space-y-8">
            {/* Hero Stage Banner */}
            <div className="relative rounded-3xl overflow-hidden border border-[#c89b3c]/30 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <div className="relative h-72 sm:h-80 w-full overflow-hidden">
                <img
                  src="images/lol_hextech_banner_1791934069499.jpg"
                  alt="Hextech Arena League of Legends"
                  className="w-full h-full object-cover brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040810] via-[#040810]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#040810] via-[#040810]/50 to-transparent" />

                {/* Hero Captions */}
                <div className="absolute bottom-6 left-6 right-6 max-w-3xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-[#c89b3c]/20 border border-[#c89b3c]/40 text-[#f0e6d2]">
                      CIRCUITO COMPETITIVO HEXTECH 2026
                    </span>
                    <span className="text-xs font-mono text-[#0ac8b9] flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5" /> Códigos de Torneo Riot Automatizados
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-bold text-[#f0e6d2] tracking-wide leading-tight">
                    Compite por la Gloria y Premios en Metálico
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Torneos divididos en grupos y brackets escalonados por tu rating ELO. Códigos de sala autogenerados para el cliente de League of Legends con verificación de resultados por Riot API.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        hextechAudio.playClick();
                        setIsCreateTournamentOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c89b3c] to-[#785a28] hover:from-[#e0b04c] hover:to-[#8c6930] text-black font-cinzel font-bold text-xs transition-all shadow-[0_0_20px_rgba(200,155,60,0.3)] cursor-pointer flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear Nuevo Torneo</span>
                    </button>

                    <button
                      onClick={() => {
                        hextechAudio.playClick();
                        setIsAmateurLeagueCreatorOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-cinzel font-bold text-xs transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer flex items-center gap-2"
                    >
                      <Calculator className="w-4 h-4 text-purple-200" />
                      <span>Crear Liga Amateur (Comisión)</span>
                    </button>

                    <button
                      onClick={() => {
                        hextechAudio.playClick();
                        // Open live match from first tournament
                        const m = tournaments[0]?.groups[0]?.matches[1];
                        if (m) setActiveMatch(m);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-[#0ac8b9] text-xs font-mono text-[#0ac8b9] transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ver Partida en Curso & Lobby</span>
                    </button>

                    <button
                      onClick={() => {
                        hextechAudio.playClick();
                        setActiveTab('analytics');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white font-cinzel font-bold text-xs transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] cursor-pointer flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4 text-teal-200" />
                      <span>Ver Analíticas D3</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4-Stat Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-[#060b13] border-t border-slate-800/80 p-4 text-xs font-mono">
                <div className="p-2 sm:p-3">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Pozo en Metálico Activo
                  </span>
                  <span className="text-amber-400 font-bold text-base tabular-nums">
                    ${totalPrizePoolUSD.toLocaleString()} USD
                  </span>
                </div>
                <div className="p-2 sm:p-3">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Equipos Registrados
                  </span>
                  <span className="text-[#f0e6d2] font-bold text-base tabular-nums">
                    {teams.length} Escuadras
                  </span>
                </div>
                <div className="p-2 sm:p-3">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Tu Rating ELO
                  </span>
                  <span className="text-[#0ac8b9] font-bold text-base tabular-nums">
                    {player.eloRating} ({player.rankTier} {player.division})
                  </span>
                </div>
                <div className="p-2 sm:p-3">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Verificación de Partidas
                  </span>
                  <span className="text-emerald-400 font-bold text-base">
                    100% Automatizada
                  </span>
                </div>
              </div>
            </div>

            {/* Programa de Referidos Hextech Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0a1322] to-amber-950/30 border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.1)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      PROGRAMA DE REFERIDOS OFICIAL
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">+650 RP por amigo</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-cinzel font-bold text-[#f0e6d2] mt-0.5">
                    Invita a tus compañeros de equipo a competir en Hextech Rift
                  </h3>
                  <p className="text-xs text-slate-300 font-sans mt-0.5 max-w-2xl">
                    Comparte tu código personal. Cuando tus amigos completen su primera partida de torneo, ambos reciben Riot Points automáticos. ¡Desbloquea hasta 7,200 RP y cofres Hextech!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  hextechAudio.playClick();
                  setIsReferralOpen(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-cinzel font-bold text-xs font-mono transition-all shadow-[0_0_15px_rgba(251,191,36,0.25)] cursor-pointer flex items-center gap-2 shrink-0 whitespace-nowrap"
              >
                <Gift className="w-4 h-4" />
                <span>Abrir Centro de Referidos & RP</span>
              </button>
            </div>

            {/* Filter Toolbar (Segmented Controls) */}
            <div className="p-4 rounded-2xl hextech-card border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Division Tier Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <span className="text-xs font-mono text-slate-400 mr-2 shrink-0 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> División:
                </span>
                {[
                  { key: 'ALL', label: 'Todas' },
                  { key: 'TIER_I', label: 'Tier I (Master+)' },
                  { key: 'TIER_II', label: 'Tier II (Esmeralda-D)' },
                  { key: 'TIER_III', label: 'Tier III (Oro-Platino)' },
                  { key: 'TIER_IV', label: 'Tier IV (Hierro-Plata)' },
                  { key: 'TIER_OPEN', label: 'Open Cash' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      hextechAudio.playClick();
                      setSelectedTierFilter(item.key);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedTierFilter === item.key
                        ? 'bg-[#c89b3c] text-black font-semibold'
                        : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Type and Search */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 shrink-0">
                  <button
                    onClick={() => {
                      hextechAudio.playClick();
                      setSelectedTypeFilter('ALL');
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${
                      selectedTypeFilter === 'ALL'
                        ? 'bg-slate-700 text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => {
                      hextechAudio.playClick();
                      setSelectedTypeFilter('PAID');
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${
                      selectedTypeFilter === 'PAID'
                        ? 'bg-amber-500/20 text-amber-300 font-semibold'
                        : 'text-slate-400 hover:text-amber-300'
                    }`}
                  >
                    Pagos ($ Metálico)
                  </button>
                  <button
                    onClick={() => {
                      hextechAudio.playClick();
                      setSelectedTypeFilter('FREE');
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${
                      selectedTypeFilter === 'FREE'
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                        : 'text-slate-400 hover:text-emerald-300'
                    }`}
                  >
                    Gratuitos
                  </button>
                </div>

                <div className="relative flex-1 md:w-48">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar torneo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-[#c89b3c]"
                  />
                </div>
              </div>
            </div>

            {/* Tournaments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onSelect={(t) => setSelectedTournament(t)}
                  isRegistered={
                    userTeam ? tournament.registeredTeams.some((r) => r.id === userTeam.id) : false
                  }
                />
              ))}
            </div>

            {/* Salón de Trofeos 3D & Premios Hextech (Awards Showcase) */}
            <div className="p-6 rounded-3xl hextech-card border border-[#c89b3c]/35 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#c89b3c]/20 border border-[#c89b3c]/40 text-[#f0e6d2]">
                      PREMIOS OFICIALES DE TEMPORADA
                    </span>
                    <span className="text-xs font-mono text-[#0ac8b9]">Estética Oro & Azul Neón 3D</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0e6d2]">
                    Trofeos de Campeonato Hextech en Metálico
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono text-slate-400 block">Pozo Global Garantizado</span>
                  <span className="text-lg font-bold font-mono text-amber-400 tabular-nums">
                    ${totalPrizePoolUSD.toLocaleString()} USD + 77,500 RP
                  </span>
                </div>
              </div>

              {/* 3D Realistic Trophy Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1st Place Grand Championship Trophy */}
                <div className="group rounded-2xl bg-gradient-to-b from-[#1a1c14] to-[#070e18] border-2 border-amber-400/60 hover:border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.15)] hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] transition-all overflow-hidden flex flex-col justify-between">
                  <div className="relative h-64 w-full bg-black/60 overflow-hidden">
                    <img
                      src="images/hextech_trophy_first_1791934697118.jpg"
                      alt="Trofeo Hextech Gran Campeón"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070e18] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-400/30 text-amber-300 border border-amber-400/60 backdrop-blur-md">
                        1º LUGAR · CAMPEÓN ABSOLUTO
                      </span>
                      <span className="text-xs font-mono text-amber-300 font-bold tabular-nums px-2 py-0.5 rounded bg-black/70 border border-amber-400/40">
                        60% DEL POZO
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-cinzel font-bold text-[#f0e6d2] group-hover:text-amber-300 transition-colors">
                      Trofeo Hextech Grand Championship
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Esculpido en oro pulido con núcleo de cristal azul neón y runas flotantes de la Grieta. Acredita premios en metálico transferidos en 24 horas y pase para el torneo internacional.
                    </p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Premio Máximo:</span>
                      <span className="text-amber-400 font-bold text-sm tabular-nums">Hasta $2,000 USD</span>
                    </div>
                  </div>
                </div>

                {/* 2nd Place Platinum Trophy */}
                <div className="group rounded-2xl bg-gradient-to-b from-[#0e1726] to-[#070e18] border border-cyan-400/40 hover:border-cyan-400 shadow-[0_0_25px_rgba(10,200,185,0.15)] hover:shadow-[0_0_35px_rgba(10,200,185,0.3)] transition-all overflow-hidden flex flex-col justify-between">
                  <div className="relative h-64 w-full bg-black/60 overflow-hidden">
                    <img
                      src="images/hextech_trophy_second_1791934697670.jpg"
                      alt="Trofeo Hextech Subcampeón Plata Platino"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070e18] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-cyan-400/20 text-cyan-300 border border-cyan-400/60 backdrop-blur-md">
                        2º LUGAR · SUBCAMPEÓN
                      </span>
                      <span className="text-xs font-mono text-cyan-300 font-bold tabular-nums px-2 py-0.5 rounded bg-black/70 border border-cyan-400/40">
                        30% DEL POZO
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-cinzel font-bold text-[#f0e6d2] group-hover:text-cyan-300 transition-colors">
                      Cáliz de Platino Hextech Runner-Up
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Estructura mecánica en platino cromado con engranajes de Piltóver y gemas Hextech en azul cerúleo. Otorga retorno de inscripción y bonificación en metálico garantizada.
                    </p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Premio Subcampeón:</span>
                      <span className="text-cyan-300 font-bold text-sm tabular-nums">Hasta $800 USD</span>
                    </div>
                  </div>
                </div>

                {/* 3rd Place Bronze Trophy */}
                <div className="group rounded-2xl bg-gradient-to-b from-[#18110b] to-[#070e18] border border-amber-700/40 hover:border-amber-500 shadow-[0_0_25px_rgba(217,119,6,0.15)] hover:shadow-[0_0_35px_rgba(217,119,6,0.25)] transition-all overflow-hidden flex flex-col justify-between">
                  <div className="relative h-64 w-full bg-black/60 overflow-hidden">
                    <img
                      src="images/hextech_trophy_third_1791934697357.jpg"
                      alt="Trofeo Hextech Bronce Tercer Lugar"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070e18] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-amber-700/30 text-amber-300 border border-amber-700/60 backdrop-blur-md">
                        3º LUGAR · TERCER PUESTO
                      </span>
                      <span className="text-xs font-mono text-amber-300 font-bold tabular-nums px-2 py-0.5 rounded bg-black/70 border border-amber-700/40">
                        10% DEL POZO
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-cinzel font-bold text-[#f0e6d2] group-hover:text-amber-400 transition-colors">
                      Copa Rúnica de Bronce Hextech
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Forjada en bronce envejecido con conductos rúnicos iluminados en cian místico. Reconocimiento a los semifinalistas destacados con retorno de tarifa y Riot Points.
                    </p>
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Premio 3º Puesto:</span>
                      <span className="text-amber-400 font-bold text-sm tabular-nums">Hasta $400 USD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: FRIENDLY SCRIMS & PRACTICE */}
        {activeTab === 'scrims' && (
          <FriendlyScrimsPanel
            userTeam={userTeam}
            availableTeams={teams}
          />
        )}

        {/* VIEW 3: TEAM MANAGEMENT */}
        {activeTab === 'team' && (
          <TeamManagementView
            player={player}
            team={userTeam}
            onUpdateTeam={(updated) =>
              setTeams((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
            }
            onCreateTeam={handleCreateTeam}
          />
        )}

        {/* VIEW 4: ELO & DIVISIONS */}
        {activeTab === 'elo' && (
          <EloRatingView
            player={player}
            onUpdatePlayerElo={handleUpdatePlayerElo}
          />
        )}

        {/* VIEW 5: ADVANCED D3 ANALYTICS DASHBOARD */}
        {activeTab === 'analytics' && (
          <AdvancedAnalyticsDashboard />
        )}
      </main>

      {/* Global Modals & Drawers */}
      <TournamentDetailModal
        tournament={selectedTournament}
        onClose={() => setSelectedTournament(null)}
        userTeam={userTeam}
        onRegisterTeam={handleRegisterTeam}
        onSelectMatch={(m) => setActiveMatch(m)}
      />

      <LiveMatchModal
        match={activeMatch}
        onClose={() => setActiveMatch(null)}
        onMatchUpdated={(updated) => {
          if (selectedTournament) {
            handleUpdateMatch(selectedTournament.id, updated);
          } else {
            // Find tournament containing this match
            const parent = tournaments.find((t) =>
              [...t.groups.flatMap((g) => g.matches), ...t.playoffMatches].some(
                (m) => m.id === updated.id
              )
            );
            if (parent) handleUpdateMatch(parent.id, updated);
          }
        }}
      />

      {isProfileOpen && (
        <ParticipantProfileModal
          player={player}
          onClose={() => setIsProfileOpen(false)}
          onUpdatePlayer={(p) => {
            setPlayer(p);
            setTeams((prevTeams) =>
              prevTeams.map((t) => {
                if (t.id === p.teamId) {
                  const updatedRoster = { ...t.roster };
                  for (const key of Object.keys(updatedRoster) as (keyof typeof updatedRoster)[]) {
                    if (updatedRoster[key]?.playerId === p.id) {
                      updatedRoster[key] = {
                        ...updatedRoster[key]!,
                        summonerName: p.summonerName,
                        tagLine: p.tagLine,
                        role: p.primaryRole,
                        rankTier: p.rankTier,
                        division: p.division,
                        avatarUrl: p.avatarUrl
                      };
                    }
                  }
                  return { ...t, roster: updatedRoster };
                }
                return t;
              })
            );
          }}
        />
      )}

      {isAdminOpen && (
        <AdminPanelModal
          tournaments={tournaments}
          onClose={() => setIsAdminOpen(false)}
          onUpdateMatch={handleUpdateMatch}
        />
      )}

      <PushNotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onSendTestNotification={handleSendTestNotification}
        onSelectAction={handleNotificationAction}
      />

      <CreateTournamentModal
        isOpen={isCreateTournamentOpen}
        onClose={() => setIsCreateTournamentOpen(false)}
        onCreate={(newTrn) => setTournaments((prev) => [newTrn, ...prev])}
      />

      {isAmateurLeagueCreatorOpen && (
        <AmateurLeagueCreatorModal
          isOpen={isAmateurLeagueCreatorOpen}
          onClose={() => setIsAmateurLeagueCreatorOpen(false)}
          organizerName={player.summonerName}
          onCreateLeague={(newLeague) => {
            setTournaments((prev) => [newLeague, ...prev]);
            const newNotif: AppNotification = {
              id: `notif_${Date.now()}`,
              title: '¡Liga Amateur Publicada con Éxito!',
              message: `Tu liga "${newLeague.title}" está abierta para inscripciones. Comisión del organizador: $${newLeague.amateurFeeBreakdown?.organizerEarningsAmount} USD (${newLeague.amateurFeeBreakdown?.organizerEarningsPercent}%).`,
              type: 'PRIZE_WON',
              timestamp: 'Ahora mismo',
              read: false
            };
            setNotifications((prev) => [newNotif, ...prev]);
            hextechAudio.playVictory();
          }}
        />
      )}

      <ReferralProgramModal
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        summonerName={player.summonerName}
      />

      {/* Quiet Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-[#03060c] py-6 px-4 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>Hextech Rift © 2026 · League of Legends Tournament Engine</span>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Integración Oficial Riot Tournament Code</span>
            <span aria-hidden="true">·</span>
            <span>Premios en Metálico & RP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
