import { PostMeta } from '@/lib/types'

interface WritingSectionProps {
  posts: PostMeta[]
  onInjectPost: (slug: string) => void
}

export default function WritingSection({ posts, onInjectPost }: WritingSectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {posts.map((post) => (
        <a
          key={post.slug}
          href={`/blog/${post.slug}`}
          onClick={(e) => {
            e.preventDefault()
            onInjectPost(post.slug)
          }}
          style={{
            display: 'flex',
            gap: '18px',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          <span style={{ color: 'var(--ctp-overlay0)', fontSize: '14px', whiteSpace: 'nowrap' }}>
            {post.date}
          </span>
          <span style={{ flex: 1, minWidth: '240px' }}>
            <span style={{ color: 'var(--ctp-text)', fontWeight: 600, fontSize: '18px' }}>
              {post.title}
            </span>
            <br />
            <span style={{ fontSize: '14px', color: 'var(--ctp-overlay1)' }}>
              {post.tags.map((t) => `#${t}`).join(' ')} · {post.readTime}
            </span>
          </span>
        </a>
      ))}
    </div>
  )
}
