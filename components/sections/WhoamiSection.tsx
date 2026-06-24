import { WhoamiMeta } from '@/lib/types'

interface WhoamiSectionProps {
  meta: WhoamiMeta
  contentHtml: string
}

const labelStyle: React.CSSProperties = {
  color: 'var(--ctp-overlay0)',
}

const linkBase: React.CSSProperties = {
  textDecoration: 'none',
}

export default function WhoamiSection({ meta, contentHtml }: WhoamiSectionProps) {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .whoami-flex { flex-direction: column !important; }
          .whoami-avatar { width: 140px !important; height: 140px !important; }
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
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div
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
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr',
              rowGap: '10px',
              columnGap: '18px',
              fontSize: '16px',
            }}
          >
            <span style={labelStyle}>ROLE</span>
            <span>{meta.role}</span>
            <span style={labelStyle}>LOCATION</span>
            <span>{meta.location}</span>
            <span style={labelStyle}>LANGUAGES</span>
            <span>{meta.languages.join(' · ')}</span>
            <span style={labelStyle}>GITHUB</span>
            <a
              href={meta.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...linkBase, color: 'var(--ctp-mauve)' }}
            >
              @Garulf
            </a>
            <span style={labelStyle}>MASTODON</span>
            <a
              href={meta.mastodon}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...linkBase, color: 'var(--ctp-teal)' }}
            >
              @Garulf@mastodon.social
            </a>
            <span style={labelStyle}>COFFEE</span>
            <a
              href={meta.coffee}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...linkBase, color: 'var(--ctp-peach)' }}
            >
              buymeacoffee.com/garulf
            </a>
            <span style={labelStyle}>ORG</span>
            <a
              href={meta.org}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...linkBase, color: 'var(--ctp-blue)' }}
            >
              Flow-Launcher
            </a>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="whoami-avatar"
          src={meta.avatar}
          alt={meta.name}
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '14px',
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
      </div>
    </>
  )
}
