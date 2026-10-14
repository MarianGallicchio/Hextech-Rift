import { RiotMatchHistoryEntry } from '../types/tournament';

export const RIOT_MATCH_HISTORY_SAMPLE: RiotMatchHistoryEntry[] = [
  {
    matchId: 'LAS_91024810',
    gameDate: '01 Oct',
    championName: 'Ahri',
    role: 'MID',
    win: true,
    kills: 9,
    deaths: 2,
    assists: 11,
    kdaRatio: 10.0,
    cs: 215,
    rollingWinRate: 50.0
  },
  {
    matchId: 'LAS_91024811',
    gameDate: '03 Oct',
    championName: 'Yasuo',
    role: 'MID',
    win: true,
    kills: 12,
    deaths: 4,
    assists: 6,
    kdaRatio: 4.5,
    cs: 242,
    rollingWinRate: 54.5
  },
  {
    matchId: 'LAS_91024812',
    gameDate: '04 Oct',
    championName: 'Zed',
    role: 'MID',
    win: false,
    kills: 6,
    deaths: 5,
    assists: 3,
    kdaRatio: 1.8,
    cs: 188,
    rollingWinRate: 52.0
  },
  {
    matchId: 'LAS_91024813',
    gameDate: '06 Oct',
    championName: 'Ahri',
    role: 'MID',
    win: true,
    kills: 8,
    deaths: 1,
    assists: 14,
    kdaRatio: 22.0,
    cs: 230,
    rollingWinRate: 56.0
  },
  {
    matchId: 'LAS_91024814',
    gameDate: '07 Oct',
    championName: 'Kaisa',
    role: 'ADC',
    win: true,
    kills: 14,
    deaths: 3,
    assists: 8,
    kdaRatio: 7.3,
    cs: 278,
    rollingWinRate: 59.2
  },
  {
    matchId: 'LAS_91024815',
    gameDate: '09 Oct',
    championName: 'Ahri',
    role: 'MID',
    win: true,
    kills: 11,
    deaths: 2,
    assists: 9,
    kdaRatio: 10.0,
    cs: 224,
    rollingWinRate: 61.5
  },
  {
    matchId: 'LAS_91024816',
    gameDate: '10 Oct',
    championName: 'Yasuo',
    role: 'MID',
    win: false,
    kills: 4,
    deaths: 6,
    assists: 5,
    kdaRatio: 1.5,
    cs: 195,
    rollingWinRate: 59.8
  },
  {
    matchId: 'LAS_91024817',
    gameDate: '11 Oct',
    championName: 'Akali',
    role: 'MID',
    win: true,
    kills: 10,
    deaths: 3,
    assists: 7,
    kdaRatio: 5.7,
    cs: 210,
    rollingWinRate: 62.4
  },
  {
    matchId: 'LAS_91024818',
    gameDate: '12 Oct',
    championName: 'Ahri',
    role: 'MID',
    win: true,
    kills: 13,
    deaths: 1,
    assists: 12,
    kdaRatio: 25.0,
    cs: 245,
    rollingWinRate: 64.0
  },
  {
    matchId: 'LAS_91024819',
    gameDate: '13 Oct',
    championName: 'Zed',
    role: 'MID',
    win: true,
    kills: 11,
    deaths: 2,
    assists: 7,
    kdaRatio: 9.0,
    cs: 220,
    rollingWinRate: 65.5
  }
];

export const INITIAL_SCRIMS: import('../types/tournament').FriendlyScrim[] = [
  {
    id: 'scrim_01',
    challengingTeam: { id: 'team_hextech_phoenix', name: 'Hextech Phoenix', tag: 'HPX' },
    opponentTeam: { id: 'team_noxus_vanguard', name: 'Noxus Vanguard', tag: 'NVG' },
    format: 'BO3_SERIE',
    status: 'IN_LOBBY',
    scheduledTime: 'Hoy 21:00 GMT-3',
    riotLobbyCode: 'pvpnet://tournament/SCRIM-LAS-HPX-NVG-881',
    scoreTeam1: 1,
    scoreTeam2: 0,
    notes: 'Scrim de entrenamiento táctico de visión y dragones.'
  },
  {
    id: 'scrim_02',
    challengingTeam: { id: 'team_zaun_chemtech', name: 'Zaun Overdrive', tag: 'ZOD' },
    opponentTeam: { id: 'team_hextech_phoenix', name: 'Hextech Phoenix', tag: 'HPX' },
    format: 'BO1_RAPIDO',
    status: 'CHALLENGE_PENDING',
    scheduledTime: 'Mañana 18:30 GMT-3',
    riotLobbyCode: 'pvpnet://tournament/SCRIM-LAS-ZOD-HPX-402',
    scoreTeam1: 0,
    scoreTeam2: 0,
    notes: 'Prueba de composición con tiradores de hiper-escalado.'
  }
];
