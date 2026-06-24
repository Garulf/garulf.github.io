interface NavSectionProps {
  onInject: (type: string) => void
}

const permStyle: React.CSSProperties = {
  color: 'var(--ctp-overlay0)',
  fontSize: '14px',
  marginRight: '10px',
}

const nameStyle: React.CSSProperties = {
  color: 'var(--ctp-blue)',
  fontWeight: 600,
  marginRight: '8px',
}

const descStyle: React.CSSProperties = {
  color: 'var(--ctp-surface2)',
  fontSize: '14px',
}

const entryLinkStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
}

export default function NavSection({ onInject }: NavSectionProps) {
  const handleClick = (type: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    onInject(type)
  }

  return (
    <div>
      <div style={{ color: 'var(--ctp-overlay0)', fontSize: '14px', marginBottom: '8px' }}>
        total 3 — click to run
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', fontSize: '17px' }}>
        <a href="#" onClick={handleClick('projects')} style={entryLinkStyle}>
          <span style={permStyle}>drwxr-xr-x</span>
          <span style={nameStyle}>projects/</span>
          <span style={descStyle}>— 4 pinned repos</span>
        </a>
        <a href="#" onClick={handleClick('writing')} style={entryLinkStyle}>
          <span style={permStyle}>drwxr-xr-x</span>
          <span style={nameStyle}>blog/</span>
          <span style={descStyle}>— back to posts</span>
        </a>
        <a href="#" onClick={handleClick('contact')} style={entryLinkStyle}>
          <span style={permStyle}>drwxr-xr-x</span>
          <span style={nameStyle}>contact/</span>
          <span style={descStyle}>— get in touch</span>
        </a>
      </div>
    </div>
  )
}
