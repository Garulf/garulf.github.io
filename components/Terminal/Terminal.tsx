'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { WhoamiMeta, ProjectsMeta, Post } from '@/lib/types'
import { useTypewriter } from './useTypewriter'
import TerminalBlock from './TerminalBlock'
import TerminalChrome from './TerminalChrome'
import WhoamiSection from '@/components/sections/WhoamiSection'
import LsSection from '@/components/sections/LsSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import WritingSection from '@/components/sections/WritingSection'
import PostSection from '@/components/sections/PostSection'
import ContactSection from '@/components/sections/ContactSection'
import styles from './Terminal.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type BootPhase = 'whoami-typing' | 'whoami-done'

interface InjectedSection {
  id: number
  type: string
  command: string
  typing: boolean
  instant: boolean // skip typewriter, show full command immediately
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface TerminalProps {
  whoami: { meta: WhoamiMeta; contentHtml: string }
  projects: { meta: ProjectsMeta; contentHtml: string }
  contact: { meta: WhoamiMeta; contentHtml: string }
  posts: Post[]
  initialPost?: Post
}

// ─── Command map ───────────────────────────────────────────────────────────────

function getCommand(type: string): string {
  if (type === 'ls') return 'ls -la ~/garulf'
  if (type === 'projects') return 'cat ./projects/*'
  if (type === 'writing') return 'ls ~/blog/posts | head -n 4'
  if (type === 'contact') return 'whoami'
  if (type.startsWith('post/')) {
    const slug = type.slice(5)
    return `cat ./writing/${slug}.md`
  }
  return type
}

// ─── Terminal Component ────────────────────────────────────────────────────────

export default function Terminal({ whoami, projects, contact, posts, initialPost }: TerminalProps) {
  const shellRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)

  const nextId = useRef(1)
  const lsInjected = useRef(false)
  const initialPostInjected = useRef(false)

  const [bootPhase, setBootPhase] = useState<BootPhase>('whoami-typing')
  const [injected, setInjected] = useState<InjectedSection[]>([])

  // ─── Typewriter: whoami ───────────────────────────────────────────────────

  const whoamiTyped = useTypewriter('whoami', bootPhase === 'whoami-typing', () => {
    setBootPhase((prev) => (prev === 'whoami-typing' ? 'whoami-done' : prev))
  })

  const lastInjected = injected[injected.length - 1] ?? null
  const isActivelyTyping = lastInjected?.typing === true

  // ─── Scroll helpers ───────────────────────────────────────────────────────

  const scrollToBottom = useCallback(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [])

  const scrollToSection = useCallback((id: number) => {
    const body = bodyRef.current
    if (!body) return
    const el = body.querySelector(`[data-section-id="${id}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // ─── Auto-inject ls after whoami ──────────────────────────────────────────

  useEffect(() => {
    if (bootPhase !== 'whoami-done') return
    if (lsInjected.current) return

    const timer = setTimeout(() => {
      if (lsInjected.current) return
      lsInjected.current = true
      const id = nextId.current++
      setInjected((prev) => [
        ...prev,
        { id, type: 'ls', command: getCommand('ls'), typing: true, instant: false },
      ])
    }, 600)

    return () => clearTimeout(timer)
  }, [bootPhase])

  // ─── Section typing completion ─────────────────────────────────────────────

  const markSectionDone = useCallback(
    (id: number, type: string) => {
      setInjected((prev) =>
        prev.map((s) => (s.id === id ? { ...s, typing: false } : s))
      )
      setTimeout(() => {
        if (type.startsWith('post/')) {
          // Scroll to the top of the post so the reader starts from the beginning
          scrollToSection(id)
        } else {
          scrollToBottom()
        }

        // After ls finishes, auto-inject the blog post if one was requested
        if (type === 'ls' && initialPost && !initialPostInjected.current) {
          initialPostInjected.current = true
          const postType = `post/${initialPost.slug}`
          const postId = nextId.current++
          setInjected((prev) => [
            ...prev,
            { id: postId, type: postType, command: getCommand(postType), typing: true, instant: false },
          ])
          history.replaceState({ injLen: 2 }, '')
        }
      }, 80)
    },
    [scrollToBottom, scrollToSection, initialPost]
  )

  // Typewriter for the last injected section — disabled for instant sections
  const injectedTyped = useTypewriter(
    lastInjected?.command ?? '',
    lastInjected?.typing === true && !lastInjected?.instant,
    lastInjected ? () => markSectionDone(lastInjected.id, lastInjected.type) : undefined
  )

  // Auto-complete instant sections after a brief pause (cursor visible at end)
  useEffect(() => {
    const instantSection = injected.find((s) => s.instant && s.typing)
    if (!instantSection) return
    const timer = setTimeout(() => {
      markSectionDone(instantSection.id, instantSection.type)
    }, 200)
    return () => clearTimeout(timer)
  }, [injected, markSectionDone])

  // ─── Inject handler ───────────────────────────────────────────────────────

  const handleInject = useCallback(
    (type: string, instant = false) => {
      const id = nextId.current++
      const command = getCommand(type)
      const newSections = [...injected, { id, type, command, typing: true, instant }]
      setInjected(newSections)
      history.pushState({ injLen: newSections.length }, '')
      setTimeout(scrollToBottom, 50)
    },
    [nextId, injected, scrollToBottom]
  )

  const handleInjectPost = useCallback(
    (slug: string) => handleInject(`post/${slug}`),
    [handleInject]
  )

  // ─── Browser history / popstate ───────────────────────────────────────────

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const injLen: number = e.state?.injLen ?? 0
      setInjected((prev) => prev.slice(0, injLen))
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // ─── Helper: render injected section content ──────────────────────────────

  const renderSectionContent = (section: InjectedSection) => {
    const { type, typing } = section
    if (typing) return null

    if (type === 'ls') return <LsSection onInject={handleInject} />
    if (type === 'projects') return <ProjectsSection meta={projects.meta} />
    if (type === 'writing') return <WritingSection posts={posts} onInjectPost={handleInjectPost} />
    if (type === 'contact') return <ContactSection meta={contact.meta} />
    if (type.startsWith('post/')) {
      const slug = type.slice(5)
      const post = posts.find((p) => p.slug === slug) ?? initialPost
      if (post && post.slug === slug) return <PostSection post={post} />
    }
    return null
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        background: 'var(--ctp-mantle)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'JetBrains Mono', monospace",
      }}
      className={styles.outer}
    >
      <div
        ref={shellRef}
        style={{
          width: '90vw',
          maxWidth: '1300px',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--ctp-base)',
          borderRadius: '16px',
          border: '1px solid var(--ctp-surface0)',
          boxShadow: '0 40px 120px rgba(0,0,0,.65), 0 0 0 1px rgba(69,71,90,.4)',
          overflow: 'hidden',
        }}
        className={styles.shell}
      >
        <TerminalChrome
          onScrollToTop={() =>
            bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
          }
        />

        <div
          ref={bodyRef}
          className={`${styles.termBody} term-body`}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '36px 44px 64px',
            color: 'var(--ctp-text)',
            fontSize: '18px',
            lineHeight: 1.75,
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          {/* ── whoami block ──────────────────────────────────────── */}
          <TerminalBlock
            command={bootPhase === 'whoami-typing' ? whoamiTyped.displayed : 'whoami'}
            showCursor={bootPhase === 'whoami-typing'}
          >
            {bootPhase !== 'whoami-typing' && (
              <WhoamiSection meta={whoami.meta} contentHtml={whoami.contentHtml} />
            )}
          </TerminalBlock>

          {/* ── Injected sections ─────────────────────────────────── */}
          {injected.map((section, idx) => {
            const isLast = idx === injected.length - 1
            const displayedCommand = !section.typing
              ? section.command                          // done: full command
              : section.instant
                ? section.command                        // instant: full command immediately
                : isLast
                  ? injectedTyped.displayed              // animated: partial text
                  : ''                                   // non-last typing: hide

            return (
              <TerminalBlock
                key={section.id}
                data-section-id={section.id}
                command={displayedCommand}
                showCursor={isLast && section.typing}
              >
                {renderSectionContent(section)}
              </TerminalBlock>
            )
          })}

          {/* ── Bottom prompt: cursor before suggestion ───────────── */}
          {bootPhase === 'whoami-done' && !isActivelyTyping && (
            <div
              className={styles.suggestionPrompt}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                fontSize: '20px',
                marginBottom: '8px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => handleInject('ls', true)}
              role="button"
              tabIndex={0}
              aria-label="Run ls -la ~/garulf"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleInject('ls', true)
              }}
            >
              <span style={{ color: 'var(--ctp-green)' }}>garulf</span>
              <span style={{ color: 'var(--ctp-overlay0)' }}>@</span>
              <span style={{ color: 'var(--ctp-teal)' }}>github</span>
              <span>&nbsp;</span>
              <span style={{ color: 'var(--ctp-blue)' }}>~</span>
              <span style={{ color: 'var(--ctp-mauve)' }}>&nbsp;$&nbsp;</span>
              <span className="cursor" />
              <span className={styles.suggestion}>ls -la ~/garulf</span>
            </div>
          )}

          {/* ── Footer ───────────────────────────────────────────── */}
          <div
            style={{
              fontSize: '12px',
              color: 'var(--ctp-surface2)',
              marginTop: '28px',
            }}
          >
            © 2026 Garulf · Catppuccin Mocha · JetBrains Mono
          </div>
        </div>
      </div>
    </div>
  )
}
