import React from 'react'

const styles = {
  header: {
    borderBottom: '1px solid var(--border)',
    padding: '0 24px',
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'var(--surface)',
  },
  logo: {
    fontFamily: 'var(--mono)',
    fontWeight: 600,
    fontSize: 15,
    color: 'var(--green)',
    letterSpacing: '-0.02em',
  },
  dot: {
    display: 'inline-block',
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--green)',
    marginRight: 8,
    boxShadow: '0 0 8px var(--green)',
    animation: 'pulse 2s infinite',
  },
  meta: {
    fontFamily: 'var(--mono)',
    fontSize: 11,
    color: 'var(--text-dim)',
    display: 'flex',
    gap: 16,
  },
  quota: {
    color: 'var(--amber)',
  },
}

// Inject pulse animation once
const styleTag = document.createElement('style')
styleTag.textContent = `@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`
document.head.appendChild(styleTag)

export default function Header({ lastUpdated, quota }) {
  const time = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <span style={styles.dot} />
        ODDS MATCHER
      </div>
      <div style={styles.meta}>
        {time && <span>updated {time}</span>}
        {quota && (
          <span style={styles.quota}>
            {quota.remaining} API calls left
          </span>
        )}
      </div>
    </header>
  )
}
