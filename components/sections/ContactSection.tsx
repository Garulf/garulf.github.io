import { WhoamiMeta } from '@/lib/types'

interface ContactSectionProps {
  meta: WhoamiMeta
}

const labelStyle: React.CSSProperties = {
  color: 'var(--ctp-overlay0)',
}

const linkBase: React.CSSProperties = {
  textDecoration: 'none',
}

export default function ContactSection({ meta }: ContactSectionProps) {
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
      <span style={labelStyle}>NAME</span>
      <span>{meta.name}</span>
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
  )
}
