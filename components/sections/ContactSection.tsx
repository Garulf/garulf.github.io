import React from 'react'
import { WhoamiMeta, WhoamiLink, WhoamiField } from '@/lib/types'

interface ContactSectionProps {
  meta: WhoamiMeta
}

const SKIP = new Set(['avatar'])
const LINK_COLORS = [
  'var(--ctp-mauve)',
  'var(--ctp-teal)',
  'var(--ctp-peach)',
  'var(--ctp-blue)',
  'var(--ctp-green)',
  'var(--ctp-flamingo)',
  'var(--ctp-sky)',
]

const labelStyle: React.CSSProperties = {
  color: 'var(--ctp-overlay0)',
}

const linkBase: React.CSSProperties = {
  textDecoration: 'none',
}

function isLink(val: WhoamiField): val is WhoamiLink {
  return typeof val === 'object' && !Array.isArray(val) && val !== null
}

export default function ContactSection({ meta }: ContactSectionProps) {
  const entries = Object.entries(meta).filter(([key]) => !SKIP.has(key))
  let linkIdx = 0
  const rows = entries.map(([key, value]) => {
    if (Array.isArray(value)) {
      return { key, content: <span>{value.join(' · ')}</span> }
    }
    if (isLink(value)) {
      const color = LINK_COLORS[linkIdx++ % LINK_COLORS.length]
      return {
        key,
        content: (
          <a href={value.url} target="_blank" rel="noopener noreferrer" style={{ ...linkBase, color }}>
            {value.label ?? value.url}
          </a>
        ),
      }
    }
    return { key, content: <span>{String(value)}</span> }
  })

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        rowGap: '10px',
        columnGap: '18px',
        fontSize: '16px',
      }}
    >
      {rows.map(({ key, content }) => (
        <React.Fragment key={key}>
          <span style={labelStyle}>{key.toUpperCase()}</span>
          <span>{content}</span>
        </React.Fragment>
      ))}
    </div>
  )
}
