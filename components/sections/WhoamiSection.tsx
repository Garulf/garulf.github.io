import React from 'react'
import { WhoamiMeta, WhoamiLink, WhoamiField } from '@/lib/types'

interface WhoamiSectionProps {
  meta: WhoamiMeta
  contentHtml: string
}

const SKIP = new Set(['name', 'avatar'])
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
  whiteSpace: 'nowrap',
}

const linkBase: React.CSSProperties = {
  textDecoration: 'none',
  wordBreak: 'break-all',
}

function isLink(val: WhoamiField): val is WhoamiLink {
  return typeof val === 'object' && !Array.isArray(val) && val !== null
}

export default function WhoamiSection({ meta, contentHtml }: WhoamiSectionProps) {
  const entries = Object.entries(meta).filter(([key]) => !SKIP.has(key))
  let linkIdx = 0
  const rows = entries.map(([key, value]) => {
    if (Array.isArray(value)) {
      return { key, content: <span style={{ wordBreak: 'break-word' }}>{value.join(' · ')}</span> }
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
    return { key, content: <span style={{ wordBreak: 'break-word' }}>{String(value)}</span> }
  })

  return (
    <>
      <style>{`
        @media (max-width: 900px) {
          .whoami-flex { flex-direction: column !important; }
          .whoami-avatar { order: -1 !important; width: 100px !important; height: 100px !important; }
          .whoami-name { font-size: 22px !important; }
          .whoami-bio { font-size: 14px !important; }
          .whoami-grid { grid-template-columns: auto 1fr !important; font-size: 13px !important; }
        }
      `}</style>
      <div
        className="whoami-flex"
        style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="whoami-name"
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: 'var(--ctp-text)',
              marginBottom: '10px',
              letterSpacing: '-0.02em',
            }}
          >
            {meta.name}
          </div>
          <div
            className="whoami-bio"
            style={{
              fontSize: '18px',
              color: 'var(--ctp-subtext1)',
              lineHeight: 1.6,
              marginBottom: '22px',
              maxWidth: '58ch',
            }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
          <div
            className="whoami-grid"
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
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="whoami-avatar"
          src={String(meta.avatar)}
          alt={String(meta.name)}
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '14px',
            objectFit: 'cover',
            flexShrink: 0,
            maxWidth: '100%',
          }}
        />
      </div>
    </>
  )
}
