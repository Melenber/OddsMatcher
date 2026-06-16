import { useState, useEffect, useCallback, useRef } from 'react'
import { ODDS_API_KEY, ODDS_API_BASE, POLL_INTERVAL, BOOKMAKERS } from '../config'

/**
 * Fetch odds for a given sport + market from The Odds API.
 * Returns normalised rows ready for the table.
 */
export function useOdds(sportId, marketId) {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [quota, setQuota]     = useState(null)
  const timerRef              = useRef(null)

  const fetchOdds = useCallback(async () => {
    if (!sportId || !marketId) return
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        apiKey: ODDS_API_KEY,
        regions: 'uk',
        markets: marketId,
        oddsFormat: 'decimal',
        bookmakers: BOOKMAKERS.join(','),
      })

      const res = await fetch(`${ODDS_API_BASE}/sports/${sportId}/odds?${params}`)

      // Capture quota headers
      setQuota({
        remaining: res.headers.get('x-requests-remaining'),
        used:      res.headers.get('x-requests-used'),
      })

      if (!res.ok) {
        if (res.status === 422) throw new Error('No events available for this sport/market combination — the league may be out of season')
        throw new Error(`API error ${res.status}`)
      }

      const data = await res.json()
      setRows(normalise(data, marketId))
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [sportId, marketId])

  // Initial fetch + polling
  useEffect(() => {
    fetchOdds()
    timerRef.current = setInterval(fetchOdds, POLL_INTERVAL)
    return () => clearInterval(timerRef.current)
  }, [fetchOdds])

  return { rows, loading, error, lastUpdated, quota, refresh: fetchOdds }
}

// ─── Normalise API response into flat table rows ─────────────────────────────

function normalise(events, marketId) {
  return events.map(event => {
    // Best back odds across all bookmakers, keyed by outcome name
    const bestBack  = {}   // { outcomeName: { odds, bookmaker } }
    const allOdds   = {}   // { bookmaker: { outcomeName: odds } }

    for (const bm of event.bookmakers) {
      const market = bm.markets?.find(m => m.key === marketId)
      if (!market) continue

      allOdds[bm.key] = {}
      for (const outcome of market.outcomes) {
        const name = outcomeLabel(outcome, marketId)
        allOdds[bm.key][name] = outcome.price

        if (!bestBack[name] || outcome.price > bestBack[name].odds) {
          bestBack[name] = { odds: outcome.price, bookmaker: bm.key }
        }
      }
    }

    const outcomes = Object.keys(bestBack)

    return {
      id:         event.id,
      home:       event.home_team,
      away:       event.away_team,
      commenceAt: new Date(event.commence_time),
      outcomes,
      bestBack,   // { label: { odds, bookmaker } }
      allOdds,    // { bookmaker: { label: odds } }
      // Betfair lay odds are merged in later by useBetfair hook
      layOdds:    {},
    }
  })
}

function outcomeLabel(outcome, marketId) {
  if (marketId === 'totals') {
    // "Over 2.5" / "Under 2.5"
    return `${outcome.name} ${outcome.point}`
  }
  return outcome.name
}
