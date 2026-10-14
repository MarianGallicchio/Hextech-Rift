import { Player, Team, Tournament, AppNotification } from '../types/tournament';

export const INITIAL_PLAYER: Player = {
  id: 'usr_fakerin_01',
  summonerName: 'Kaelen Hex',
  tagLine: 'LAS',
  server: 'LAS',
  eloRating: 2950,
  seasonPeakElo: 2988,
  rankTier: 'DIAMOND',
  division: 'I',
  lp: 78,
  primaryRole: 'MID',
  secondaryRole: 'ADC',
  mainChampions: [
    { championId: 'Ahri', championName: 'Ahri', masteryLevel: 7, masteryPoints: 184500 },
    { championId: 'Yasuo', championName: 'Yasuo', masteryLevel: 7, masteryPoints: 215400 },
    { championId: 'Zed', championName: 'Zed', masteryLevel: 6, masteryPoints: 92300 }
  ],
  teamId: 'team_hextech_phoenix',
  avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png',
  discordTag: 'kaelen_hex#9921',
  stats: {
    kda: '4.8:1',
    winRate: 64,
    totalMatches: 88,
    mvpCount: 19
  },
  isCaptain: true,
  seasonHistory: [
    { season: 2025, rankName: 'Diamante I', finalElo: 2910, badge: 'DIAMOND' },
    { season: 2024, rankName: 'Esmeralda I', finalElo: 2680, badge: 'EMERALD' }
  ]
};

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team_hextech_phoenix',
    name: 'Hextech Phoenix',
    tag: 'HPX',
    captainId: 'usr_fakerin_01',
    logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&auto=format&fit=crop&q=80',
    divisionTier: 'TIER_II',
    inviteCode: 'HPX-RFT-772',
    stats: {
      matchesPlayed: 24,
      wins: 19,
      losses: 5,
      tournamentTitles: 3
    },
    roster: {
      TOP: {
        playerId: 'p_top_01',
        summonerName: 'VanguardGaren',
        tagLine: 'LAS',
        role: 'TOP',
        rankTier: 'DIAMOND',
        division: 'II',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png',
        ready: true
      },
      JUNGLE: {
        playerId: 'p_jng_01',
        summonerName: 'InsecKick',
        tagLine: 'LAS',
        role: 'JUNGLE',
        rankTier: 'DIAMOND',
        division: 'I',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/LeeSin.png',
        ready: true
      },
      MID: {
        playerId: 'usr_fakerin_01',
        summonerName: 'Kaelen Hex',
        tagLine: 'LAS',
        role: 'MID',
        rankTier: 'DIAMOND',
        division: 'I',
        isCaptain: true,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ahri.png',
        ready: true
      },
      ADC: {
        playerId: 'p_adc_01',
        summonerName: 'SilverBullet',
        tagLine: 'LAS',
        role: 'ADC',
        rankTier: 'EMERALD',
        division: 'I',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Kaisa.png',
        ready: true
      },
      SUPPORT: {
        playerId: 'p_sup_01',
        summonerName: 'DarkLantern',
        tagLine: 'LAS',
        role: 'SUPPORT',
        rankTier: 'DIAMOND',
        division: 'III',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Thresh.png',
        ready: true
      },
      SUB: {
        playerId: 'p_sub_01',
        summonerName: 'ShadowStep',
        tagLine: 'LAS',
        role: 'FILL',
        rankTier: 'EMERALD',
        division: 'II',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Zed.png',
        ready: false
      }
    }
  },
  {
    id: 'team_noxus_vanguard',
    name: 'Noxus Vanguard',
    tag: 'NVG',
    captainId: 'usr_darius_cap',
    logoUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&auto=format&fit=crop&q=80',
    divisionTier: 'TIER_II',
    inviteCode: 'NVG-AXE-401',
    stats: {
      matchesPlayed: 20,
      wins: 14,
      losses: 6,
      tournamentTitles: 1
    },
    roster: {
      TOP: {
        playerId: 'p_nvg_top',
        summonerName: 'NoxianGuillotine',
        tagLine: 'LAS',
        role: 'TOP',
        rankTier: 'DIAMOND',
        division: 'I',
        isCaptain: true,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Darius.png',
        ready: true
      },
      JUNGLE: {
        playerId: 'p_nvg_jng',
        summonerName: 'RuinedKingV',
        tagLine: 'LAS',
        role: 'JUNGLE',
        rankTier: 'DIAMOND',
        division: 'II',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Viego.png',
        ready: true
      },
      MID: {
        playerId: 'p_nvg_mid',
        summonerName: 'ShadowReaper',
        tagLine: 'LAS',
        role: 'MID',
        rankTier: 'DIAMOND',
        division: 'III',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Zed.png',
        ready: true
      },
      ADC: {
        playerId: 'p_nvg_adc',
        summonerName: 'FishbonesZap',
        tagLine: 'LAS',
        role: 'ADC',
        rankTier: 'DIAMOND',
        division: 'IV',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jinx.png',
        ready: true
      },
      SUPPORT: {
        playerId: 'p_nvg_sup',
        summonerName: 'AnchorAnchor',
        tagLine: 'LAS',
        role: 'SUPPORT',
        rankTier: 'EMERALD',
        division: 'I',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Nautilus.png',
        ready: true
      }
    }
  },
  {
    id: 'team_zaun_chemtech',
    name: 'Zaun Overdrive',
    tag: 'ZOD',
    captainId: 'usr_zod_cap',
    logoUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=200&auto=format&fit=crop&q=80',
    divisionTier: 'TIER_II',
    inviteCode: 'ZOD-TOX-102',
    stats: {
      matchesPlayed: 18,
      wins: 11,
      losses: 7,
      tournamentTitles: 0
    },
    roster: {
      TOP: {
        playerId: 'p_zod_top',
        summonerName: 'ChemBaron',
        tagLine: 'LAS',
        role: 'TOP',
        rankTier: 'EMERALD',
        division: 'I',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jax.png',
        ready: true
      },
      JUNGLE: {
        playerId: 'p_zod_jng',
        summonerName: 'BristleRider',
        tagLine: 'LAS',
        role: 'JUNGLE',
        rankTier: 'EMERALD',
        division: 'II',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Sejuani.png',
        ready: true
      },
      MID: {
        playerId: 'p_zod_mid',
        summonerName: 'KpopStar',
        tagLine: 'LAS',
        role: 'MID',
        rankTier: 'DIAMOND',
        division: 'II',
        isCaptain: true,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Akali.png',
        ready: true
      },
      ADC: {
        playerId: 'p_zod_adc',
        summonerName: 'HeadshotQueen',
        tagLine: 'LAS',
        role: 'ADC',
        rankTier: 'DIAMOND',
        division: 'III',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Caitlyn.png',
        ready: true
      },
      SUPPORT: {
        playerId: 'p_zod_sup',
        summonerName: 'LaserLight',
        tagLine: 'LAS',
        role: 'SUPPORT',
        rankTier: 'EMERALD',
        division: 'I',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Lux.png',
        ready: true
      }
    }
  },
  {
    id: 'team_targon_celestial',
    name: 'Targon Celestial',
    tag: 'TGC',
    captainId: 'usr_tgc_cap',
    logoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=200&auto=format&fit=crop&q=80',
    divisionTier: 'TIER_II',
    inviteCode: 'TGC-STR-889',
    stats: {
      matchesPlayed: 16,
      wins: 10,
      losses: 6,
      tournamentTitles: 1
    },
    roster: {
      TOP: {
        playerId: 'p_tgc_top',
        summonerName: 'NazumahShield',
        tagLine: 'LAS',
        role: 'TOP',
        rankTier: 'DIAMOND',
        division: 'II',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Ksante.png',
        ready: true
      },
      JUNGLE: {
        playerId: 'p_tgc_jng',
        summonerName: 'DemacianStandard',
        tagLine: 'LAS',
        role: 'JUNGLE',
        rankTier: 'DIAMOND',
        division: 'III',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/JarvanIV.png',
        ready: true
      },
      MID: {
        playerId: 'p_tgc_mid',
        summonerName: 'SoulUnbound',
        tagLine: 'LAS',
        role: 'MID',
        rankTier: 'DIAMOND',
        division: 'I',
        isCaptain: true,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Yone.png',
        ready: true
      },
      ADC: {
        playerId: 'p_tgc_adc',
        summonerName: 'VoidSeeker',
        tagLine: 'LAS',
        role: 'ADC',
        rankTier: 'DIAMOND',
        division: 'II',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Kaisa.png',
        ready: true
      },
      SUPPORT: {
        playerId: 'p_tgc_sup',
        summonerName: 'FeatherDance',
        tagLine: 'LAS',
        role: 'SUPPORT',
        rankTier: 'DIAMOND',
        division: 'IV',
        isCaptain: false,
        avatarUrl: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Rakan.png',
        ready: true
      }
    }
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'trn_esmeralda_diamante_2026',
    title: 'Torneo Ascenso Esmeralda & Diamante',
    description: 'Competición oficial por divisiones escalonadas para jugadores de elo Esmeralda y Diamante. Formato de 2 grupos con semifinales y Gran Final transmitida con códigos de torneo automatizados.',
    bannerImage: 'images/lol_hextech_banner_1791934069499.jpg',
    tier: 'TIER_II',
    entryType: 'PAID',
    entryFeeUSD: 5,
    prizePoolUSD: 350,
    prizeDistribution: {
      firstPlace: 220,
      secondPlace: 90,
      thirdPlace: 40,
      rpBonus: 15000
    },
    server: 'LAS',
    format: 'GRUPOS_Y_PLAYOFFS',
    maxTeams: 8,
    registeredTeams: INITIAL_TEAMS,
    status: 'GROUPS',
    startDate: 'Mañana · 20:00 GMT-3',
    riotLobbyCodeTemplate: 'pvpnet://tournament/TRN-LAS-EMD-492048',
    autoVerifyEnabled: true,
    rules: [
      'Torneo exclusivo para cuentas en rango Esmeralda IV a Diamante I en la temporada actual.',
      'Inscripción reducida de lanzamiento: $5 USD por escuadra completa (5 titulares + suplente).',
      'Partidas en la Grieta del Invocador en modo Reclutamiento de Torneo (Tournament Draft).',
      'El código de torneo oficial de Riot debe usarse para ingresar a la sala personalizada.',
      'Resultados sincronizados automáticamente mediante la API de Riot Games o validados por árbitro.',
      'Premios en metálico transferidos mediante pasarela segura en un plazo de 24 horas.'
    ],
    groups: [
      {
        id: 'group_a',
        name: 'Grupo A - Grieta Elemental',
        teams: [
          { id: 'team_hextech_phoenix', name: 'Hextech Phoenix', tag: 'HPX', logoUrl: '', wins: 2, losses: 0, points: 6 },
          { id: 'team_zaun_chemtech', name: 'Zaun Overdrive', tag: 'ZOD', logoUrl: '', wins: 1, losses: 1, points: 3 },
          { id: 'team_noxus_vanguard', name: 'Noxus Vanguard', tag: 'NVG', logoUrl: '', wins: 0, losses: 2, points: 0 }
        ],
        matches: [
          {
            id: 'm_grp_01',
            tournamentId: 'trn_esmeralda_diamante_2026',
            stage: 'GROUP_A',
            matchNumber: 1,
            team1: { id: 'team_hextech_phoenix', name: 'Hextech Phoenix', tag: 'HPX', logoUrl: '' },
            team2: { id: 'team_noxus_vanguard', name: 'Noxus Vanguard', tag: 'NVG', logoUrl: '' },
            team1Score: 1,
            team2Score: 0,
            winnerId: 'team_hextech_phoenix',
            status: 'COMPLETED',
            scheduledTime: '18:00 GMT-3',
            riotTournamentCode: 'pvpnet://tournament/TRN-LAS-EMD-GRP1',
            lobbyJoinUrl: 'https://lol.riotgames.com/tournament/lobby/TRN-LAS-EMD-GRP1',
            isAutomatedResult: true,
            gameStats: {
              duration: '31:42',
              blueKills: 26,
              redKills: 14,
              blueGold: '64.2k',
              redGold: '53.1k',
              blueTowers: 9,
              redTowers: 2,
              dragons: { blue: ['Infernal', 'Hextech', 'Alma Hextech'], red: ['Montaña'] },
              barons: { blue: 1, red: 0 },
              mvp: 'Kaelen Hex (Ahri) 11/2/9',
              team1Picks: [
                { championName: 'Aatrox', role: 'TOP', player: 'VanguardGaren', kills: 4, deaths: 3, assists: 7 },
                { championName: 'LeeSin', role: 'JUNGLE', player: 'InsecKick', kills: 6, deaths: 2, assists: 12 },
                { championName: 'Ahri', role: 'MID', player: 'Kaelen Hex', kills: 11, deaths: 2, assists: 9 },
                { championName: 'Kaisa', role: 'ADC', player: 'SilverBullet', kills: 4, deaths: 4, assists: 8 },
                { championName: 'Thresh', role: 'SUPPORT', player: 'DarkLantern', kills: 1, deaths: 3, assists: 16 }
              ],
              team2Picks: [
                { championName: 'Darius', role: 'TOP', player: 'NoxianGuillotine', kills: 3, deaths: 6, assists: 4 },
                { championName: 'Viego', role: 'JUNGLE', player: 'RuinedKingV', kills: 4, deaths: 5, assists: 5 },
                { championName: 'Zed', role: 'MID', player: 'ShadowReaper', kills: 5, deaths: 5, assists: 2 },
                { championName: 'Jinx', role: 'ADC', player: 'FishbonesZap', kills: 2, deaths: 4, assists: 6 },
                { championName: 'Nautilus', role: 'SUPPORT', player: 'AnchorAnchor', kills: 0, deaths: 6, assists: 8 }
              ]
            }
          },
          {
            id: 'm_grp_02',
            tournamentId: 'trn_esmeralda_diamante_2026',
            stage: 'GROUP_A',
            matchNumber: 2,
            team1: { id: 'team_hextech_phoenix', name: 'Hextech Phoenix', tag: 'HPX', logoUrl: '' },
            team2: { id: 'team_zaun_chemtech', name: 'Zaun Overdrive', tag: 'ZOD', logoUrl: '' },
            team1Score: 0,
            team2Score: 0,
            status: 'LOBBY_READY',
            scheduledTime: '20:30 GMT-3 (En Curso)',
            riotTournamentCode: 'pvpnet://tournament/TRN-LAS-EMD-GRP2',
            lobbyJoinUrl: 'https://lol.riotgames.com/tournament/lobby/TRN-LAS-EMD-GRP2',
            isAutomatedResult: true
          }
        ]
      }
    ],
    playoffMatches: [
      {
        id: 'm_ply_semi_1',
        tournamentId: 'trn_esmeralda_diamante_2026',
        stage: 'SEMIS',
        matchNumber: 1,
        team1: { id: 'team_hextech_phoenix', name: 'Hextech Phoenix', tag: 'HPX', logoUrl: '' },
        team2: { id: 'team_targon_celestial', name: 'Targon Celestial', tag: 'TGC', logoUrl: '' },
        team1Score: 0,
        team2Score: 0,
        status: 'SCHEDULED',
        scheduledTime: 'Mañana 19:00 GMT-3',
        riotTournamentCode: 'pvpnet://tournament/TRN-LAS-EMD-SEM1',
        lobbyJoinUrl: 'https://lol.riotgames.com/tournament/lobby/TRN-LAS-EMD-SEM1',
        isAutomatedResult: true
      },
      {
        id: 'm_ply_semi_2',
        tournamentId: 'trn_esmeralda_diamante_2026',
        stage: 'SEMIS',
        matchNumber: 2,
        team1: { id: 'team_zaun_chemtech', name: 'Zaun Overdrive', tag: 'ZOD', logoUrl: '' },
        team2: { id: 'team_noxus_vanguard', name: 'Noxus Vanguard', tag: 'NVG', logoUrl: '' },
        team1Score: 0,
        team2Score: 0,
        status: 'SCHEDULED',
        scheduledTime: 'Mañana 20:30 GMT-3',
        riotTournamentCode: 'pvpnet://tournament/TRN-LAS-EMD-SEM2',
        lobbyJoinUrl: 'https://lol.riotgames.com/tournament/lobby/TRN-LAS-EMD-SEM2',
        isAutomatedResult: true
      },
      {
        id: 'm_ply_final',
        tournamentId: 'trn_esmeralda_diamante_2026',
        stage: 'FINAL',
        matchNumber: 3,
        team1Score: 0,
        team2Score: 0,
        status: 'SCHEDULED',
        scheduledTime: 'Domingo 21:00 GMT-3',
        riotTournamentCode: 'pvpnet://tournament/TRN-LAS-EMD-FIN',
        lobbyJoinUrl: 'https://lol.riotgames.com/tournament/lobby/TRN-LAS-EMD-FIN',
        isAutomatedResult: true
      }
    ]
  },
  {
    id: 'trn_open_championship_cash',
    title: 'Gran Copa Hextech Open Cash Prize',
    description: 'El mayor torneo abierto con premio en metálico de la temporada. Inscripción con pozo acumulado para los mejores equipos de cualquier división. Verificación automatizada de API y transmisión.',
    bannerImage: 'images/lol_champion_arena_1791934070563.jpg',
    tier: 'TIER_OPEN',
    entryType: 'PAID',
    entryFeeUSD: 8,
    prizePoolUSD: 600,
    prizeDistribution: {
      firstPlace: 380,
      secondPlace: 150,
      thirdPlace: 70,
      rpBonus: 25000
    },
    server: 'LAS',
    format: 'GRUPOS_Y_PLAYOFFS',
    maxTeams: 16,
    registeredTeams: INITIAL_TEAMS,
    status: 'REGISTRATION',
    startDate: 'En 3 días · 19:00 GMT-3',
    riotLobbyCodeTemplate: 'pvpnet://tournament/TRN-LAS-OPEN-99120',
    autoVerifyEnabled: true,
    rules: [
      'Inscripción accesible de $8 USD por escuadra completa.',
      'Partidas al mejor de 1 en grupos y al mejor de 3 (BO3) en la final.',
      'Sincronización directa con el cliente de League of Legends mediante Tournament Code.',
      'Premios pagados en dólares estadounidenses mediante pasarela segura.'
    ],
    groups: [],
    playoffMatches: []
  },
  {
    id: 'amateur_liga_universitaria_2026',
    title: 'Liga Amateur Universitaria del Cono Sur',
    description: 'Liga comunitaria creada y gestionada por invocadores locales. Tarifa ultra accesible de $3 USD por equipo, con cobro de comisión de organizador y pozo asegurado.',
    bannerImage: 'images/lol_hextech_banner_1791934069499.jpg',
    tier: 'TIER_III',
    entryType: 'PAID',
    entryFeeUSD: 3,
    prizePoolUSD: 180,
    prizeDistribution: {
      firstPlace: 110,
      secondPlace: 50,
      thirdPlace: 20,
      rpBonus: 12000
    },
    server: 'LAS',
    format: 'GRUPOS_Y_PLAYOFFS',
    maxTeams: 12,
    registeredTeams: [INITIAL_TEAMS[0], INITIAL_TEAMS[2]],
    status: 'REGISTRATION',
    startDate: 'En 4 días · 18:30 GMT-3',
    riotLobbyCodeTemplate: 'pvpnet://tournament/TRN-LAS-AMATEUR-UNI26',
    autoVerifyEnabled: true,
    rules: [
      'Liga comunitaria amateur para divisiones Oro y Platino.',
      'Inscripción: $3 USD por equipo (75% Pozo, 17.5% Organizador, 7.5% Hextech Platform).',
      'Partidas sincronizadas con Tournament Draft oficial.'
    ],
    isAmateurLeague: true,
    organizerSummonerName: 'ProfeFaker#LAS',
    amateurFeeBreakdown: {
      totalGrossPool: 240,
      platformCommissionPercent: 7.5,
      platformCommissionAmount: 18,
      organizerEarningsPercent: 17.5,
      organizerEarningsAmount: 42,
      netPrizePoolAmount: 180
    },
    publicInviteLink: 'https://hextourneys.gg/amateur/LGA-LAS-UNI26',
    groups: [],
    playoffMatches: []
  },
  {
    id: 'trn_comunitaria_gratuita',
    title: 'Torneo Comunitario Grieta Hextech (Gratis)',
    description: 'Inscripción 100% gratuita para equipos en divisiones Oro y Platino. Demuestra la química de tu equipo y gana premios en Riot Points y pases de evento exclusivos.',
    bannerImage: 'images/lol_team_trophy_1791934070381.jpg',
    tier: 'TIER_III',
    entryType: 'FREE',
    entryFeeUSD: 0,
    prizePoolUSD: 0,
    prizeDistribution: {
      firstPlace: 0,
      secondPlace: 0,
      thirdPlace: 0,
      rpBonus: 15000
    },
    server: 'LAS',
    format: 'GRUPOS_Y_PLAYOFFS',
    maxTeams: 8,
    registeredTeams: [INITIAL_TEAMS[0], INITIAL_TEAMS[1]],
    status: 'REGISTRATION',
    startDate: 'Este Sábado · 19:00 GMT-3',
    riotLobbyCodeTemplate: 'pvpnet://tournament/TRN-LAS-FREE-44129',
    autoVerifyEnabled: true,
    rules: [
      'Sin costo de inscripción.',
      'Límite de elo: Oro IV a Platino I.',
      'Premios en códigos oficiales de Riot Points (RP).'
    ],
    groups: [],
    playoffMatches: []
  },
  {
    id: 'trn_hierro_plata_rookie',
    title: 'Copa Novatos: Hierro a Plata (Gratis)',
    description: 'Torneo escalonado diseñado para el aprendizaje y competencia justa entre jugadores de las divisiones de Hierro, Bronce y Plata. Con arbitraje y premios de skins.',
    bannerImage: 'images/lol_hextech_banner_1791934069499.jpg',
    tier: 'TIER_IV',
    entryType: 'FREE',
    entryFeeUSD: 0,
    prizePoolUSD: 0,
    prizeDistribution: {
      firstPlace: 0,
      secondPlace: 0,
      thirdPlace: 0,
      rpBonus: 7500
    },
    server: 'LAS',
    format: 'ELIMINACION_DIRECTA',
    maxTeams: 8,
    registeredTeams: [INITIAL_TEAMS[1]],
    status: 'REGISTRATION',
    startDate: 'Este Domingo · 17:00 GMT-3',
    riotLobbyCodeTemplate: 'pvpnet://tournament/TRN-LAS-ROOK-11029',
    autoVerifyEnabled: true,
    rules: [
      'Máximo rango permitido: Plata I.',
      'Partidas en eliminación simple al mejor de 1.',
      'Códigos de torneo generados al confirmar asistencia (Check-in).'
    ],
    groups: [],
    playoffMatches: []
  },
  {
    id: 'trn_sandbox_prueba_las',
    title: '🧪 Sala de Pruebas · Código Real (LAS)',
    description: 'Torneo sandbox para probar el flujo completo: inscripción → código de torneo Riot → sala en el cliente de LoL → verificación. El código real se genera con UNA key de producción vía el proxy (`POST /api/riot/setup`) y reemplaza al marcador de abajo.',
    bannerImage: 'images/lol_champion_arena_1791934070563.jpg',
    tier: 'TIER_OPEN',
    entryType: 'FREE',
    entryFeeUSD: 0,
    prizePoolUSD: 0,
    prizeDistribution: {
      firstPlace: 0,
      secondPlace: 0,
      thirdPlace: 0,
      rpBonus: 1000
    },
    server: 'LAS',
    format: 'ELIMINACION_DIRECTA',
    maxTeams: 4,
    registeredTeams: [],
    status: 'REGISTRATION',
    startDate: 'Cuando quieras · sala siempre abierta',
    riotLobbyCodeTemplate: 'PENDIENTE-KEY-PRODUCCION (ver reglas)',
    autoVerifyEnabled: true,
    rules: [
      '1) Conseguí una production key en developer.riotgames.com (la dev key actual devuelve 403 en torneos).',
      '2) Ponela en .env como RIOT_API_KEY y corre `npm run proxy`.',
      '3) Generá el código: POST localhost:4000/api/riot/setup { region: "LAS", name: "Sala de Pruebas", count: 1 }.',
      '4) Pegá el código devuelto en este torneo y canjealo en el cliente: Jugar → Personalizada → Código de torneo.',
      'Mientras tanto podés probar todo el flujo (inscripción, bracket, notificaciones) con el simulador integrado.'
    ],
    groups: [],
    playoffMatches: []
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    title: '¡Tu sala de partida está lista!',
    message: 'Hextech Phoenix vs Zaun Overdrive. Código de torneo de Riot generado: haz clic para unirte al lobby en el cliente.',
    type: 'LOBBY_CODE',
    timestamp: 'Hace 5 minutos',
    read: false,
    matchId: 'm_grp_02',
    actionLabel: 'Ver Sala de Partida'
  },
  {
    id: 'notif_02',
    title: 'Resultado Verificado por Riot API',
    message: 'Partida finalizada: Hextech Phoenix 1 - 0 Noxus Vanguard. La victoria ha sido acreditada a tu equipo.',
    type: 'RESULT_VERIFIED',
    timestamp: 'Hace 45 minutos',
    read: true,
    matchId: 'm_grp_01',
    actionLabel: 'Ver Estadísticas'
  },
  {
    id: 'notif_03',
    title: 'Próximo Encuentro Programado',
    message: 'Semifinales fijadas para mañana a las 19:00 GMT-3 contra Targon Celestial.',
    type: 'MATCH_ALERT',
    timestamp: 'Hace 2 horas',
    read: true,
    matchId: 'm_ply_semi_1',
    actionLabel: 'Ver Bracket'
  }
];
