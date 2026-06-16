import { useState, useEffect, useCallback } from 'react'
import { BETFAIR_PROXY_URL, POLL_INTERVAL } from '../config'

/**
 * Fetches Betfair lay odds via the proxy for a set of event IDs.
 * Returns a map: { eventId: { outcomeName: { layOdds, available } } }
 *
 * While BETFAIR_PROXY_URL is null (not yet deployed), returns empty map
 * so the rest of the UI still works.
 */
export function useBetfair(eventIds = []) {
  const [layMap, setLayMap]   = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchLay = useCallback(async () => {
    if (!BETFAIR_PROXY_URL || eventIds.length === 0) return
    setLoading(true)
    try {
      const res = await fetch(`${BETFAIR_PROXY_URL}/lay`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ eventIds }),
      })
      if (!res.ok) throw new Error(`Proxy error ${res.status}`)
      const data = await res.json()
      setLayMap(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [eventIds.join(',')])

  useEffect(() => {
    fetchLay()
    const t = setInterval(fetchLay, POLL_INTERVAL)
    return () => clearInterval(t)
  }, [fetchLay])

  return { layMap, loading, error }
}
