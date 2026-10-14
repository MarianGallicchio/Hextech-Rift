import { RankTier, DivisionNumber } from '../types/tournament';

export interface EloCalculationResult {
  playerEloBefore: number;
  opponentEloBefore: number;
  playerEloAfter: number;
  opponentEloAfter: number;
  playerDelta: number;
  opponentDelta: number;
  expectedScore: number;
}

export interface SeasonInfo {
  currentSeason: number;
  seasonName: string;
  daysRemaining: number;
  splitNumber: number;
}

export const CURRENT_SEASON_INFO: SeasonInfo = {
  currentSeason: 2026,
  seasonName: 'Temporada 2026 - Split 1: Hextech Reckoning',
  daysRemaining: 42,
  splitNumber: 1
};

// ELO threshold brackets for divisions
export const ELO_TIERS: {
  tier: RankTier;
  division: DivisionNumber;
  minElo: number;
  maxElo: number;
  name: string;
}[] = [
  // IRON
  { tier: 'IRON', division: 'IV', minElo: 0, maxElo: 899, name: 'Hierro IV' },
  { tier: 'IRON', division: 'III', minElo: 900, maxElo: 999, name: 'Hierro III' },
  { tier: 'IRON', division: 'II', minElo: 1000, maxElo: 1099, name: 'Hierro II' },
  { tier: 'IRON', division: 'I', minElo: 1100, maxElo: 1199, name: 'Hierro I' },
  // BRONZE
  { tier: 'BRONZE', division: 'IV', minElo: 1200, maxElo: 1274, name: 'Bronce IV' },
  { tier: 'BRONZE', division: 'III', minElo: 1275, maxElo: 1349, name: 'Bronce III' },
  { tier: 'BRONZE', division: 'II', minElo: 1350, maxElo: 1424, name: 'Bronce II' },
  { tier: 'BRONZE', division: 'I', minElo: 1425, maxElo: 1499, name: 'Bronce I' },
  // SILVER
  { tier: 'SILVER', division: 'IV', minElo: 1500, maxElo: 1574, name: 'Plata IV' },
  { tier: 'SILVER', division: 'III', minElo: 1575, maxElo: 1649, name: 'Plata III' },
  { tier: 'SILVER', division: 'II', minElo: 1650, maxElo: 1724, name: 'Plata II' },
  { tier: 'SILVER', division: 'I', minElo: 1725, maxElo: 1799, name: 'Plata I' },
  // GOLD
  { tier: 'GOLD', division: 'IV', minElo: 1800, maxElo: 1874, name: 'Oro IV' },
  { tier: 'GOLD', division: 'III', minElo: 1875, maxElo: 1949, name: 'Oro III' },
  { tier: 'GOLD', division: 'II', minElo: 1950, maxElo: 2024, name: 'Oro II' },
  { tier: 'GOLD', division: 'I', minElo: 2025, maxElo: 2099, name: 'Oro I' },
  // PLATINUM
  { tier: 'PLATINUM', division: 'IV', minElo: 2100, maxElo: 2174, name: 'Platino IV' },
  { tier: 'PLATINUM', division: 'III', minElo: 2175, maxElo: 2249, name: 'Platino III' },
  { tier: 'PLATINUM', division: 'II', minElo: 2250, maxElo: 2324, name: 'Platino II' },
  { tier: 'PLATINUM', division: 'I', minElo: 2325, maxElo: 2399, name: 'Platino I' },
  // EMERALD
  { tier: 'EMERALD', division: 'IV', minElo: 2400, maxElo: 2474, name: 'Esmeralda IV' },
  { tier: 'EMERALD', division: 'III', minElo: 2475, maxElo: 2549, name: 'Esmeralda III' },
  { tier: 'EMERALD', division: 'II', minElo: 2550, maxElo: 2624, name: 'Esmeralda II' },
  { tier: 'EMERALD', division: 'I', minElo: 2625, maxElo: 2699, name: 'Esmeralda I' },
  // DIAMOND
  { tier: 'DIAMOND', division: 'IV', minElo: 2700, maxElo: 2774, name: 'Diamante IV' },
  { tier: 'DIAMOND', division: 'III', minElo: 2775, maxElo: 2849, name: 'Diamante III' },
  { tier: 'DIAMOND', division: 'II', minElo: 2850, maxElo: 2924, name: 'Diamante II' },
  { tier: 'DIAMOND', division: 'I', minElo: 2925, maxElo: 2999, name: 'Diamante I' },
  // APEX TIERS
  { tier: 'MASTER', division: 'I', minElo: 3000, maxElo: 3299, name: 'Master' },
  { tier: 'GRANDMASTER', division: 'I', minElo: 3300, maxElo: 3599, name: 'Gran Master' },
  { tier: 'CHALLENGER', division: 'I', minElo: 3600, maxElo: 9999, name: 'Challenger' }
];

export function getRankFromElo(elo: number): { tier: RankTier; division: DivisionNumber; name: string } {
  for (const bracket of ELO_TIERS) {
    if (elo >= bracket.minElo && elo <= bracket.maxElo) {
      return { tier: bracket.tier, division: bracket.division, name: bracket.name };
    }
  }
  return { tier: 'CHALLENGER', division: 'I', name: 'Challenger' };
}

/**
 * Standard Elo Calculation with League of Legends K-factor calibration
 * @param playerElo Rating of Player 1
 * @param opponentElo Rating of Opponent/Enemy Team Average
 * @param actualScore 1 if Player won, 0 if Player lost
 * @param kFactor Base K factor (standard 32 for tournament matches, 48 for placement)
 */
export function calculateEloDelta(
  playerElo: number,
  opponentElo: number,
  actualScore: 1 | 0,
  kFactor: number = 32
): EloCalculationResult {
  // Expected probability of player winning
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
  
  // Calculate delta
  const playerDelta = Math.round(kFactor * (actualScore - expectedScore));
  const opponentDelta = -playerDelta;

  const playerEloAfter = Math.max(500, playerElo + playerDelta);
  const opponentEloAfter = Math.max(500, opponentElo + opponentDelta);

  return {
    playerEloBefore: playerElo,
    opponentEloBefore: opponentElo,
    playerEloAfter,
    opponentEloAfter,
    playerDelta,
    opponentDelta,
    expectedScore
  };
}

/**
 * Season Soft-Reset Formula (Calculates new starting ELO for the new season)
 * soft-reset: 0.5 * oldElo + 0.5 * 1500 (uncompressed toward the center)
 */
export function calculateSeasonResetElo(currentElo: number): { newElo: number; previousTier: string; newRank: ReturnType<typeof getRankFromElo> } {
  const previousTier = getRankFromElo(currentElo).name;
  const newElo = Math.round(0.55 * currentElo + 0.45 * 1500);
  const newRank = getRankFromElo(newElo);
  return {
    newElo,
    previousTier,
    newRank
  };
}
