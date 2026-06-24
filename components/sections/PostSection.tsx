import { Post } from '@/lib/types'

interface PostSectionProps {
  post: Post
}

export default function PostSection({ post }: PostSectionProps) {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .post-title { font-size: 20px !important; }
        }
      `}</style>
      <div style={{ marginBottom: '32px' }}>
        <div
          className="post-title"
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: 'var(--ctp-text)',
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          {post.title}
        </div>
        <div
          style={{
            fontSize: '14px',
            color: 'var(--ctp-overlay1)',
            marginBottom: '20px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <span>{post.date}</span>
          {post.tags.map((t) => (
            <span key={t} style={{ color: 'var(--ctp-mauve)' }}>
              #{t}
            </span>
          ))}
          <span>· {post.readTime}</span>
        </div>
        <div
          style={{
            borderTop: '1px solid var(--ctp-surface0)',
            marginBottom: '24px',
          }}
        />
        <div
          style={{
            fontSize: '16px',
            lineHeight: 1.85,
            color: 'var(--ctp-subtext1)',
          }}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </div>
    </>
  )
}
