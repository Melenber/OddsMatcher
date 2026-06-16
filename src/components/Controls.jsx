import React from 'react'
import { SPORTS, MARKETS } from '../config'

const s = {
  bar: {
    padding: '12px 24px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'var(--surface)',
    flexWrap: 'wrap',
  },
  label: {
    fontFamily: 'var(--mono)',
    fontSize: 11,
    color: 'var(--text-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  select: {
    background: 'var(--bg)',
    border: '1px solid var(--border-lit)',
    borderRadius: 4,
    color: 'var(--text-bright)',
    fontFamily: 'var(--sans)',
    fontSize: 13,
    padding: '5px 10px',
    outline: 'none',
    cursor: 'pointer',
  },
  pill: (active) => ({
    background:   active ? 'var(--green)' : 'transparent',
    border:       `1px solid ${active ? 'var(--green)' : 'var(--border-lit)'}`,
    borderRadius: 4,
    color:        active ? '#0d0f14' : 'var(--text)',
    fontFamily:   'var(--mono)',
    fontSize:     12,
    fontWeight:   active ? 600 : 400,
    padding:      '4px 12px',
    transition:   'all 0.15s',
  }),
  divider: {
    width: 1,
    height: 20,
    background: 'var(--border)',
  },
  refreshBtn: {
    marginLeft: 'auto',
    background: 'transparent',
    border: '1px solid var(--border-lit)',
    borderRadius: 4,
    color: 'var(--text-dim)',
    fontFamily: 'var(--mono)',
    fontSize: 11,
    padding: '4px 10px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
}

export default function Controls({ sport, setSport, market, setMarket, onRefresh, loading }) {
  return (
    <div style={s.bar}>
      <span style={s.label}>League</span>
      <select style={s.select} value={sport} onChange={e => setSport(e.target.value)}>
        {SPORTS.map(sp => (
          <option key={sp.id} value={sp.id}>{sp.label}</option>
        ))}
      </select>

      <div style={s.divider} />

      <span style={s.label}>Market</span>
      {MARKETS.map(m => (
        <button
          key={m.id}
          style={s.pill(market === m.oddsApiKey)}
          onClick={() => setMarket(m.oddsApiKey)}
        >
          {m.label}
        </button>
      ))}

      <button
        style={s.refreshBtn}
        onClick={onRefresh}
        disabled={loading}
      >
        {loading ? 'loading…' : '↻ refresh'}
      </button>
    </div>
  )
}
