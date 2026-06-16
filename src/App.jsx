import React, { useState } from 'react'
import Header from './components/Header'
import Controls from './components/Controls'
import OddsTable from './components/OddsTable'
import { useOdds } from './hooks/useOdds'
import { useBetfair } from './hooks/useBetfair'
import { SPORTS, MARKETS } from './config'

export default function App() {
  const [sport,  setSport]  = useState(SPORTS[0].id)
  const [market, setMarket] = useState(MARKETS[0].oddsApiKey)

  const { rows, loading, error, lastUpdated, quota, refresh } = useOdds(sport, market)

  // Pass event IDs to Betfair hook for lay odds
  const eventIds = rows.map(r => r.id)
  const { layMap } = useBetfair(eventIds)

  // Merge lay odds into rows
  const enrichedRows = rows.map(row => ({
    ...row,
    layOdds: layMap[row.id] ?? {},
  }))

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header lastUpdated={lastUpdated} quota={quota} />
      <Controls
        sport={sport}   setSport={setSport}
        market={market} setMarket={setMarket}
        onRefresh={refresh}
        loading={loading}
      />

      <main style={{ flex: 1 }}>
        {error ? (
          <div style={{
            padding: '40px 24px',
            fontFamily: 'var(--mono)',
            fontSize: 13,
            color: 'var(--red)',
          }}>
            Error: {error}
            {error.includes('401') && ' — check your ODDS_API_KEY in .env'}
          </div>
        ) : (
          <OddsTable rows={enrichedRows} layMap={layMap} />
        )}
      </main>
    </div>
  )
}
