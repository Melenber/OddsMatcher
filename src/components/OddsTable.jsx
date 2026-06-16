import React, { useState } from 'react'
import { calcRating, calcQualifyingLoss, fmtOdds, ratingTier } from '../utils/calc'
import { BOOKMAKERS, BETFAIR_PROXY_URL } from '../config'

// ─── Colour map for rating tiers ─────────────────────────────────────────────
const TIER_COLOR = {
  arb:       '#00e676',
  excellent: '#69f0ae',
  good:      '#b9f6ca',
  ok:        '#ffb300',
  poor:      '#5a6278',
  none:      '#5a6278',
}

const BOOKMAKER_LABEL = {
  bet365:      'bet365',
  williamhill: 'WillHill',
  betfair_sb:  'BF SB',
  paddypower:  'Paddy',
  skybet:      'SkyBet',
  ladbrokes:   'Ladbrokes',
  coral:       'Coral',
  unibet:      'Unibet',
}

const s = {
  wrap: {
    overflowX: 'auto',
    padding: '0 0 80px',
  },
  table: {
    width: '100%',
    minWidth: 900,
    borderCollapse: 'collapse',
  },
  th: {
    fontFamily:    'var(--mono)',
    fontSize:      10,
    fontWeight:    600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color:         'var(--text-dim)',
    padding:       '8px 12px',
    textAlign:     'left',
    borderBottom:  '1px solid var(--border)',
    whiteSpace:    'nowrap',
    position:      'sticky',
    top:           0,
    background:    'var(--surface)',
    zIndex:        1,
  },
  tr: (i) => ({
    background:    i % 2 === 0 ? 'var(--bg)' : 'var(--surface)',
    borderBottom:  '1px solid var(--border)',
    transition:    'background 0.1s',
  }),
  td: {
    padding:    '10px 12px',
    fontSize:   13,
    whiteSpace: 'nowrap',
  },
  event: {
    fontWeight: 500,
    color:      'var(--text-bright)',
    fontSize:   13,
  },
  time: {
    fontFamily: 'var(--mono)',
    fontSize:   11,
    color:      'var(--text-dim)',
    marginTop:  2,
  },
  odds: {
    fontFamily: 'var(--mono)',
    fontSize:   13,
  },
  bestOdds: {
    fontFamily: 'var(--mono)',
    fontSize:   13,
    color:      'var(--green)',
    fontWeight: 600,
  },
  layOdds: {
    fontFamily: 'var(--mono)',
    fontSize:   13,
    color:      '#90caf9',
  },
  ratingBadge: (tier) => ({
    display:       'inline-block',
    padding:       '2px 8px',
    borderRadius:  3,
    fontFamily:    'var(--mono)',
    fontSize:      12,
    fontWeight:    600,
    color:         tier === 'arb' || tier === 'excellent' ? '#0d0f14' : TIER_COLOR[tier],
    background:    tier === 'arb' || tier === 'excellent' ? TIER_COLOR[tier] : 'transparent',
    border:        `1px solid ${TIER_COLOR[tier]}`,
  }),
  qualLoss: {
    fontFamily: 'var(--mono)',
    fontSize:   12,
    color:      'var(--text-dim)',
  },
  empty: {
    padding:   60,
    textAlign: 'center',
    color:     'var(--text-dim)',
    fontFamily:'var(--mono)',
    fontSize:  13,
  },
  noProxy: {
    padding:    '8px 24px',
    background: '#1a1500',
    border:     '1px solid #3d3000',
    borderRadius: 4,
    margin:     '12px 24px 0',
    fontFamily: 'var(--mono)',
    fontSize:   12,
    color:      'var(--amber)',
  },
}

export default function OddsTable({ rows, layMap = {} }) {
  const [sortBy, setSortBy] = useState('rating') // 'rating' | 'time'

  if (!rows.length) {
    return <div style={s.empty}>No events found — try a different league or market.</div>
  }

  // Flatten events × outcomes into sortable rows
  const flatRows = []
  for (const event of rows) {
    for (const outcome of event.outcomes) {
      const best    = event.bestBack[outcome]
      const layData = layMap[event.id]?.[outcome]
      const backOdds = best?.odds
      const layOdds  = layData?.odds

      const rating  = calcRating(backOdds, layOdds)
      const ql      = calcQualifyingLoss(backOdds, layOdds)

      flatRows.push({ event, outcome, best, backOdds, layOdds, rating, ql, allOdds: event.allOdds })
    }
  }

  // Sort
  flatRows.sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating ?? -999) - (a.rating ?? -999)
    }
    return a.event.commenceAt - b.event.commenceAt
  })

  return (
    <>
      {!BETFAIR_PROXY_URL && (
        <div style={s.noProxy}>
          ⚠ Betfair proxy not connected — lay odds column is empty. Deploy the proxy to see ratings.
        </div>
      )}
      <div style={s.wrap}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Event</th>
              <th style={s.th}>Selection</th>
              {BOOKMAKERS.map(bm => (
                <th key={bm} style={s.th}>{BOOKMAKER_LABEL[bm] ?? bm}</th>
              ))}
              <th style={s.th}>Best Back</th>
              <th style={s.th}>Betfair Lay</th>
              <th
                style={{ ...s.th, cursor: 'pointer', color: sortBy === 'rating' ? 'var(--green)' : 'var(--text-dim)' }}
                onClick={() => setSortBy(sortBy === 'rating' ? 'time' : 'rating')}
                title="Click to toggle sort"
              >
                Rating {sortBy === 'rating' ? '▼' : ''}
              </th>
              <th style={s.th}>QL (£10)</th>
            </tr>
          </thead>
          <tbody>
            {flatRows.map((row, i) => {
              const tier = ratingTier(row.rating)
              return (
                <tr key={`${row.event.id}-${row.outcome}`} style={s.tr(i)}>
                  <td style={s.td}>
                    <div style={s.event}>{row.event.home} v {row.event.away}</div>
                    <div style={s.time}>
                      {row.event.commenceAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      {' '}
                      {row.event.commenceAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td style={{ ...s.td, ...s.odds }}>{row.outcome}</td>

                  {BOOKMAKERS.map(bm => {
                    const o = row.allOdds[bm]?.[row.outcome]
                    const isBest = row.best?.bookmaker === bm
                    return (
                      <td key={bm} style={{ ...s.td, ...(isBest ? s.bestOdds : s.odds) }}>
                        {o ? fmtOdds(o) : <span style={{ color: 'var(--border-lit)' }}>—</span>}
                      </td>
                    )
                  })}

                  <td style={{ ...s.td, ...s.bestOdds }}>
                    {fmtOdds(row.backOdds)}
                    {row.best?.bookmaker && (
                      <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--mono)', marginTop: 2 }}>
                        {BOOKMAKER_LABEL[row.best.bookmaker] ?? row.best.bookmaker}
                      </div>
                    )}
                  </td>

                  <td style={{ ...s.td, ...s.layOdds }}>
                    {row.layOdds ? fmtOdds(row.layOdds) : <span style={{ color: 'var(--border-lit)' }}>—</span>}
                  </td>

                  <td style={s.td}>
                    {row.rating !== null ? (
                      <span style={s.ratingBadge(tier)}>{row.rating.toFixed(1)}%</span>
                    ) : (
                      <span style={{ color: 'var(--border-lit)', fontFamily: 'var(--mono)', fontSize: 12 }}>—</span>
                    )}
                  </td>

                  <td style={{ ...s.td, ...s.qualLoss }}>
                    {row.ql !== null
                      ? <span style={{ color: row.ql >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {row.ql >= 0 ? '+' : ''}{row.ql.toFixed(2)}
                        </span>
                      : <span style={{ color: 'var(--border-lit)' }}>—</span>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
