export type ServerRegion = 'LAS' | 'LAN' | 'NA' | 'EUW' | 'EUNE' | 'BR' | 'KR';

export type RankTier = 
  | 'IRON' 
  | 'BRONZE' 
  | 'SILVER' 
  | 'GOLD' 
  | 'PLATINUM' 
  | 'EMERALD' 
  | 'DIAMOND' 
  | 'MASTER' 
  | 'GRANDMASTER' 
  | 'CHALLENGER';

export type DivisionNumber = 'I' | 'II' | 'III' | 'IV';

export type LaneRole = 'TOP' | 'JUNGLE' | 'MID' | 'ADC' | 'SUPPORT' | 'FILL';

export interface Champion {
  id: string;
  name: string;
  title: string;
  role: LaneRole;
  avatar: string;
  difficulty: 'Fácil' | 'Media' | 'Alta';
  class: 'Asesino' | 'Luchador' | 'Mago' | 'Tirador' | 'Soporte' | 'Tanque';
}

export interface PlayerStats {
  kda: string;
  winRate: number;
  totalMatches: number;
  mvpCount: number;
}

export interface Player {
  id: string;
  summonerName: string;
  tagLine: string;
  server: ServerRegion;
  eloRating: number;
  seasonPeakElo: number;
  rankTier: RankTier;
  division: DivisionNumber;
  lp: number;
  primaryRole: LaneRole;
  secondaryRole: LaneRole;
  mainChampions: {
    championId: string;
    championName: string;
    masteryLevel: number;
    masteryPoints: number;
  }[];
  teamId?: string;
  avatarUrl: string;
  discordTag: string;
  stats: PlayerStats;
  isCaptain?: boolean;
  seasonHistory?: {
    season: number;
    rankName: string;
    finalElo: number;
    badge: string;
  }[];
}

export interface TeamMember {
  playerId: string;
  summonerName: string;
  tagLine: string;
  role: LaneRole;
  rankTier: RankTier;
  division: DivisionNumber;
  isCaptain: boolean;
  avatarUrl: string;
  ready: boolean;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  captainId: string;
  logoUrl: string;
  divisionTier: string;
  roster: {
    TOP?: TeamMember;
    JUNGLE?: TeamMember;
    MID?: TeamMember;
    ADC?: TeamMember;
    SUPPORT?: TeamMember;
    SUB?: TeamMember;
  };
  inviteCode: string;
  stats: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    tournamentTitles: number;
  };
}

export type TournamentTier = 
  | 'TIER_IV' // Hierro - Plata
  | 'TIER_III' // Oro - Platino
  | 'TIER_II' // Esmeralda - Diamante
  | 'TIER_I'  // Master - Challenger
  | 'TIER_OPEN'; // Abierto

export type TournamentStatus = 'REGISTRATION' | 'GROUPS' | 'PLAYOFFS' | 'COMPLETED';

export interface MatchPick {
  championName: string;
  role: LaneRole;
  player: string;
  kills: number;
  deaths: number;
  assists: number;
}

export interface MatchStats {
  duration: string;
  blueKills: number;
  redKills: number;
  blueGold: string;
  redGold: string;
  blueTowers: number;
  redTowers: number;
  dragons: { blue: string[]; red: string[] };
  barons: { blue: number; red: number };
  mvp: string;
  team1Picks: MatchPick[];
  team2Picks: MatchPick[];
}

export type MatchStatus = 
  | 'SCHEDULED' 
  | 'LOBBY_READY' 
  | 'IN_GAME' 
  | 'VERIFYING' 
  | 'COMPLETED' 
  | 'DISPUTED';

export interface Match {
  id: string;
  tournamentId: string;
  stage: 'GROUP_A' | 'GROUP_B' | 'QUARTERS' | 'SEMIS' | 'FINAL';
  matchNumber: number;
  team1?: { id: string; name: string; tag: string; logoUrl: string };
  team2?: { id: string; name: string; tag: string; logoUrl: string };
  team1Score: number;
  team2Score: number;
  winnerId?: string;
  status: MatchStatus;
  scheduledTime: string;
  riotTournamentCode: string;
  lobbyJoinUrl: string;
  isAutomatedResult: boolean;
  gameStats?: MatchStats;
}

export interface TournamentGroup {
  id: string;
  name: string;
  teams: { id: string; name: string; tag: string; logoUrl: string; wins: number; losses: number; points: number }[];
  matches: Match[];
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
  tier: TournamentTier;
  entryType: 'FREE' | 'PAID';
  entryFeeUSD: number;
  prizePoolUSD: number;
  prizeDistribution: {
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
    rpBonus: number;
  };
  server: ServerRegion;
  format: 'GRUPOS_Y_PLAYOFFS' | 'ELIMINACION_DIRECTA';
  maxTeams: number;
  registeredTeams: Team[];
  status: TournamentStatus;
  startDate: string;
  riotLobbyCodeTemplate: string;
  groups: TournamentGroup[];
  playoffMatches: Match[];
  rules: string[];
  autoVerifyEnabled: boolean;
  winnerTeam?: { id: string; name: string; tag: string; logoUrl: string };
  isAmateurLeague?: boolean;
  organizerSummonerName?: string;
  amateurFeeBreakdown?: AmateurLeagueFeeBreakdown;
  publicInviteLink?: string;
}

export interface RiotMatchHistoryEntry {
  matchId: string;
  gameDate: string;
  championName: string;
  role: LaneRole;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kdaRatio: number;
  cs: number;
  rollingWinRate: number;
}

export interface FriendlyScrim {
  id: string;
  challengingTeam: { id: string; name: string; tag: string };
  opponentTeam: { id: string; name: string; tag: string };
  format: 'BO1_RAPIDO' | 'BO3_SERIE' | 'DRAFT_TRAINING';
  status: 'CHALLENGE_PENDING' | 'ACCEPTED' | 'IN_LOBBY' | 'COMPLETED';
  scheduledTime: string;
  riotLobbyCode: string;
  winnerId?: string;
  scoreTeam1: number;
  scoreTeam2: number;
  notes?: string;
}

export interface AmateurLeagueFeeBreakdown {
  totalGrossPool: number;
  platformCommissionPercent: number;
  platformCommissionAmount: number;
  organizerEarningsPercent: number;
  organizerEarningsAmount: number;
  netPrizePoolAmount: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'MATCH_ALERT' | 'TEAM_INVITE' | 'RESULT_VERIFIED' | 'PRIZE_WON' | 'LOBBY_CODE';
  timestamp: string;
  read: boolean;
  matchId?: string;
  tournamentId?: string;
  actionLabel?: string;
}

