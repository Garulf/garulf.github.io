import { ProjectsMeta } from '@/lib/types'

interface ProjectsSectionProps {
  meta: ProjectsMeta
}

export default function ProjectsSection({ meta }: ProjectsSectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {meta.projects.map((project) => (
        <a
          key={project.name}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              flexWrap: 'wrap',
              fontSize: '19px',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--ctp-text)' }}>
              <span style={{ color: 'var(--ctp-mauve)' }}>▸ </span>
              {project.name}
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'var(--ctp-overlay1)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <span>★ {project.stars}</span>
              <span>⑂ {project.forks}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: project.color,
                    display: 'inline-block',
                  }}
                />
                {project.lang}
              </span>
            </span>
          </div>
          <div
            style={{
              fontSize: '15px',
              color: 'var(--ctp-overlay1)',
              paddingLeft: '20px',
              marginTop: '4px',
            }}
          >
            {project.desc}
          </div>
        </a>
      ))}
      {meta.allReposUrl && (
        <a
          href={meta.allReposUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--ctp-blue)',
            textDecoration: 'none',
            fontSize: '15px',
            marginTop: '4px',
          }}
        >
          ↳ see all {meta.allReposCount} repositories →
        </a>
      )}
    </div>
  )
}
