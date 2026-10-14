export interface TournamentImpactDataPoint {
  date: string;
  label: string;
  registeredTeams: number;
  matchesCompleted: number;
  activePlayers: number;
  viewerPeak: number;
}

export interface RankDistributionDataPoint {
  tier: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
  accentColor: string;
  avgElo: number;
  tournamentsEligible: number;
}

export interface CashFlowDataPoint {
  period: string;
  label: string;
  grossEntryPoolUSD: number;
  prizesPaidUSD: number;
  organizerCommissionsUSD: number;
  platformReserveUSD: number;
  cumulativePrizePoolUSD: number;
  rpBonusValueUSD: number;
}

export const TOURNAMENT_IMPACT_HISTORY: TournamentImpactDataPoint[] = [
  { date: '2026-08-01', label: 'Sem 1', registeredTeams: 16, matchesCompleted: 28, activePlayers: 96, viewerPeak: 1240 },
  { date: '2026-08-15', label: 'Sem 2', registeredTeams: 24, matchesCompleted: 44, activePlayers: 144, viewerPeak: 1890 },
  { date: '2026-09-01', label: 'Sem 3', registeredTeams: 32, matchesCompleted: 60, activePlayers: 192, viewerPeak: 2750 },
  { date: '2026-09-15', label: 'Sem 4', registeredTeams: 48, matchesCompleted: 92, activePlayers: 288, viewerPeak: 3820 },
  { date: '2026-10-01', label: 'Sem 5', registeredTeams: 64, matchesCompleted: 124, activePlayers: 384, viewerPeak: 5400 },
  { date: '2026-10-15', label: 'Sem 6', registeredTeams: 88, matchesCompleted: 172, activePlayers: 528, viewerPeak: 7650 },
  { date: '2026-11-01', label: 'Sem 7', registeredTeams: 112, matchesCompleted: 218, activePlayers: 672, viewerPeak: 9800 },
  { date: '2026-11-15', label: 'Sem 8 (Actual)', registeredTeams: 140, matchesCompleted: 276, activePlayers: 840, viewerPeak: 12450 }
];

export const RANK_DISTRIBUTION_DATA: RankDistributionDataPoint[] = [
  { tier: 'IRON', name: 'Hierro', count: 142, percentage: 8.5, color: '#57534e', accentColor: '#78716c', avgElo: 980, tournamentsEligible: 2 },
  { tier: 'BRONZE', name: 'Bronce', count: 286, percentage: 17.2, color: '#b45309', accentColor: '#d97706', avgElo: 1320, tournamentsEligible: 3 },
  { tier: 'SILVER', name: 'Plata', count: 394, percentage: 23.6, color: '#94a3b8', accentColor: '#cbd5e1', avgElo: 1670, tournamentsEligible: 4 },
  { tier: 'GOLD', name: 'Oro', count: 348, percentage: 20.9, color: '#eab308', accentColor: '#facc15', avgElo: 2010, tournamentsEligible: 5 },
  { tier: 'PLATINUM', name: 'Platino', count: 224, percentage: 13.4, color: '#10b981', accentColor: '#34d399', avgElo: 2340, tournamentsEligible: 5 },
  { tier: 'EMERALD', name: 'Esmeralda', count: 148, percentage: 8.9, color: '#14b8a6', accentColor: '#2dd4bf', avgElo: 2650, tournamentsEligible: 6 },
  { tier: 'DIAMOND', name: 'Diamante', count: 86, percentage: 5.2, color: '#06b6d4', accentColor: '#22d3ee', avgElo: 2950, tournamentsEligible: 6 },
  { tier: 'MASTER', name: 'Master', count: 26, percentage: 1.6, color: '#a855f7', accentColor: '#c084fc', avgElo: 3240, tournamentsEligible: 4 },
  { tier: 'GRANDMASTER', name: 'Gran Master', count: 10, percentage: 0.6, color: '#f43f5e', accentColor: '#fb7185', avgElo: 3380, tournamentsEligible: 3 },
  { tier: 'CHALLENGER', name: 'Challenger', count: 4, percentage: 0.2, color: '#fbbf24', accentColor: '#fef08a', avgElo: 3510, tournamentsEligible: 3 }
];

export const CASH_FLOW_HISTORY: CashFlowDataPoint[] = [
  { period: '2026-05', label: 'Mayo', grossEntryPoolUSD: 420, prizesPaidUSD: 310, organizerCommissionsUSD: 75, platformReserveUSD: 35, cumulativePrizePoolUSD: 310, rpBonusValueUSD: 120 },
  { period: '2026-06', label: 'Junio', grossEntryPoolUSD: 890, prizesPaidUSD: 660, organizerCommissionsUSD: 155, platformReserveUSD: 75, cumulativePrizePoolUSD: 970, rpBonusValueUSD: 280 },
  { period: '2026-07', label: 'Julio', grossEntryPoolUSD: 1450, prizesPaidUSD: 1080, organizerCommissionsUSD: 255, platformReserveUSD: 115, cumulativePrizePoolUSD: 2050, rpBonusValueUSD: 460 },
  { period: '2026-08', label: 'Agosto', grossEntryPoolUSD: 2100, prizesPaidUSD: 1560, organizerCommissionsUSD: 370, platformReserveUSD: 170, cumulativePrizePoolUSD: 3610, rpBonusValueUSD: 720 },
  { period: '2026-09', label: 'Septiembre', grossEntryPoolUSD: 3250, prizesPaidUSD: 2420, organizerCommissionsUSD: 570, platformReserveUSD: 260, cumulativePrizePoolUSD: 6030, rpBonusValueUSD: 1100 },
  { period: '2026-10', label: 'Octubre (En curso)', grossEntryPoolUSD: 4680, prizesPaidUSD: 3490, organizerCommissionsUSD: 820, platformReserveUSD: 370, cumulativePrizePoolUSD: 9520, rpBonusValueUSD: 1580 }
];

export const ANALYTICS_METRICS_SUMMARY = {
  totalPrizeDistributedUSD: 9520,
  activeTournaments: 6,
  totalTeamsRegistered: 140,
  totalUniquePlayers: 1668,
  averageMatchDurationMinutes: '31.4 min',
  matchAutomationSuccessRate: '99.4%',
  totalRPValueDistributed: 78500,
  averagePrizePerWinnerUSD: 220
};
