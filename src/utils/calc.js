/**
 * Matched betting / arb rating calculations
 */

/**
 * Rating % — how close to a qualifying matched bet (100% = breakeven lay)
 * Higher is better. OddsMonkey-style: (1 / backOdds + 1 / layOdds) * 100 ish
 * Actually we want: layOdds as close to backOdds as possible.
 *
 * Rating = (1 / layOdds) / (1 / backOdds) * 100
 *        = backOdds / layOdds * 100
 *
 * 100% = perfect match (back == lay, ignoring commission)
 * >100% = arb (back > lay)
 * Lower = worse match, higher qualifying loss
 */
export function calcRating(backOdds, layOdds) {
  if (!backOdds || !layOdds || layOdds <= 1) return null
  return (backOdds / layOdds) * 100
}

/**
 * Qualifying loss estimate for a £10 back stake
 * Assumes Betfair commission of 2% on winnings
 */
export function calcQualifyingLoss(backOdds, layOdds, stake = 10, commission = 0.02) {
  if (!backOdds || !layOdds || layOdds <= 1) return null

  const layStake    = (backOdds * stake) / layOdds
  const backProfit  = stake * (backOdds - 1)
  const layLiab     = layStake * (layOdds - 1)
  const layWin      = layStake * (1 - commission)

  // Back wins scenario
  const backWins = backProfit - layLiab
  // Lay wins scenario
  const layWins  = layWin - stake

  // Qualifying loss = average loss across both outcomes
  // (for a properly matched bet both should be ≈ equal)
  return Math.min(backWins, layWins)
}

/**
 * Lay stake for a given back stake, odds, and commission
 */
export function calcLayStake(backStake, backOdds, layOdds, commission = 0.02) {
  if (!backOdds || !layOdds || layOdds <= 1) return null
  return (backStake * backOdds) / (layOdds - commission)
}

/**
 * Format decimal odds nicely
 */
export function fmtOdds(odds) {
  if (!odds) return '—'
  return odds.toFixed(2)
}

/**
 * Format rating as colour-coded tier
 */
export function ratingTier(rating) {
  if (rating === null) return 'none'
  if (rating >= 100)   return 'arb'
  if (rating >= 95)    return 'excellent'
  if (rating >= 90)    return 'good'
  if (rating >= 80)    return 'ok'
  return 'poor'
}
