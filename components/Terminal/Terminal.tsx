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
import NavSection from '@/components/sections/NavSection'
import styles from './Terminal.module.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type BootPhase = 'whoami-typing' | 'whoami-done' | 'ls-typing' | 'ls-done'

interface InjectedSection {
  id: number
  type: string // 'projects' | 'writing' | 'contact' | 'post/{slug}' | 'nav'
  command: string
  typing: boolean // still typing the command?
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface TerminalProps {
  whoami: { meta: WhoamiMeta; contentHtml: string }
  projects: { meta: ProjectsMeta; contentHtml: string }
  contact: { meta: WhoamiMeta; contentHtml: string }
  posts: Post[]
  initialPost?: Post // if provided, auto-inject after boot sequence
}

// ─── Command map ───────────────────────────────────────────────────────────────

function getCommand(type: string): string {
  if (type === 'projects') return 'cat ./projects/*'
  if (type === 'writing') return 'ls ~/blog/posts | head -n 4'
  if (type === 'contact') return 'whoami'
  if (type === 'nav') return 'ls -la ~/garulf'
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

  // ─── Counter for unique IDs (ref to avoid module-level mutable state) ────────
  const nextId = useRef(1)

  // Nav scroll listener cleanup refs
  const navListeners = useRef<Array<() => void>>([])

  // Boot phase state
  const [bootPhase, setBootPhase] = useState<BootPhase>('whoami-typing')

  // Injected sections
  const [injected, setInjected] = useState<InjectedSection[]>([])

  // Track if we've already injected the initialPost (prevent double-inject)
  const initialPostInjected = useRef(false)

  // ─── Typewriter hooks ─────────────────────────────────────────────────────

  // Phase 1: whoami command (always starts immediately)
  const whoamiTyped = useTypewriter('whoami', bootPhase === 'whoami-typing', () => {
    setBootPhase((prev) => (prev === 'whoami-typing' ? 'whoami-done' : prev))
  })

  // Phase 2: ls command
  const lsTyped = useTypewriter('ls -la ~/garulf', bootPhase === 'ls-typing', () => {
    setBootPhase((prev) => (prev === 'ls-typing' ? 'ls-done' : prev))
  })

  // Last injected section (only the last one types)
  const lastInjected = injected[injected.length - 1] ?? null

  // ─── Scroll helpers ───────────────────────────────────────────────────────

  const isScrollable = useCallback(() => {
    const body = bodyRef.current
    if (!body) return false
    return body.scrollHeight > body.clientHeight
  }, [])

  const nearBottom = useCallback(() => {
    const body = bodyRef.current
    if (!body) return true
    return body.scrollTop + body.clientHeight >= body.scrollHeight - 160
  }, [])

  const scrollToBottom = useCallback(() => {
    const body = bodyRef.current
    if (!body) return
    body.scrollTo({ top: body.scrollHeight, behavior: 'smooth' })
  }, [])

  // ─── Phase 1 → Phase 2 transition ────────────────────────────────────────

  // When in whoami-done: check if scrollable; if not, auto-advance to ls after 1.1s
  useEffect(() => {
    if (bootPhase !== 'whoami-done') return

    const timer = setTimeout(() => {
      if (!isScrollable()) {
        setBootPhase('ls-typing')
      }
      // If scrollable, wait for scroll event (set up below)
    }, 1100)

    return () => clearTimeout(timer)
  }, [bootPhase, isScrollable])

  // Scroll listener for advancing to ls-typing when user scrolls down
  useEffect(() => {
    if (bootPhase !== 'whoami-done') return

    const body = bodyRef.current
    if (!body) return

    const handleScroll = () => {
      // Any scroll down while in whoami-done starts ls
      setBootPhase((prev) => {
        if (prev === 'whoami-done') return 'ls-typing'
        return prev
      })
    }

    const handleKey = (e: KeyboardEvent) => {
      const triggers = ['ArrowDown', 'Space', 'PageDown', 'End']
      if (triggers.includes(e.code)) {
        setBootPhase((prev) => {
          if (prev === 'whoami-done') return 'ls-typing'
          return prev
        })
      }
    }

    body.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleKey)

    return () => {
      body.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKey)
    }
  }, [bootPhase])

  // ─── initialPost auto-inject after ls-done ────────────────────────────────

  useEffect(() => {
    if (bootPhase !== 'ls-done') return
    if (!initialPost) return
    if (initialPostInjected.current) return

    initialPostInjected.current = true
    const type = `post/${initialPost.slug}`
    const id = nextId.current++
    setInjected((prev) => [
      ...prev,
      { id, type, command: getCommand(type), typing: true },
    ])
    history.replaceState({ injLen: 1 }, '')
  }, [bootPhase, initialPost])

  // ─── Nav section injection helpers ───────────────────────────────────────

  const injectNav = useCallback(() => {
    setInjected((prev) => {
      // Don't double-inject nav if last section is already nav
      if (prev.length > 0 && prev[prev.length - 1].type === 'nav') return prev
      const id = nextId.current++
      return [...prev, { id, type: 'nav', command: getCommand('nav'), typing: true }]
    })
  }, [nextId])

  const scheduleNavIfNeeded = useCallback(
    (type: string) => {
      if (type === 'nav') return // don't inject nav after nav

      // Clean up existing nav listeners
      navListeners.current.forEach((cleanup) => cleanup())
      navListeners.current = []

      const body = bodyRef.current

      if (nearBottom()) {
        // Already near bottom: inject after 500ms
        const timer = setTimeout(() => {
          injectNav()
        }, 500)
        const cleanup = () => clearTimeout(timer)
        navListeners.current.push(cleanup)
      } else {
        // Not near bottom: wait for scroll near bottom
        if (!body) return

        const handleScroll = () => {
          if (nearBottom()) {
            injectNav()
            // Remove listener after triggering
            body.removeEventListener('scroll', handleScroll)
            navListeners.current = navListeners.current.filter(
              (c) => c !== removeListener
            )
          }
        }
        const removeListener = () => body.removeEventListener('scroll', handleScroll)
        body.addEventListener('scroll', handleScroll)
        navListeners.current.push(removeListener)
      }
    },
    [nearBottom, injectNav]
  )

  // ─── Injected section typing completion ───────────────────────────────────

  const markSectionDone = useCallback(
    (id: number, type: string) => {
      setInjected((prev) =>
        prev.map((s) => (s.id === id ? { ...s, typing: false } : s))
      )
      // Scroll to bottom after section content appears
      setTimeout(() => {
        scrollToBottom()
        scheduleNavIfNeeded(type)
      }, 80)
    },
    [scrollToBottom, scheduleNavIfNeeded]
  )

  // Typewriter for the last injected section (only the last one types)
  const injectedTyped = useTypewriter(
    lastInjected?.command ?? '',
    lastInjected?.typing === true,
    lastInjected
      ? () => markSectionDone(lastInjected.id, lastInjected.type)
      : undefined
  )

  // ─── Inject handler (for section clicks) ─────────────────────────────────

  const handleInject = useCallback(
    (type: string) => {
      const id = nextId.current++
      const command = getCommand(type)
      const newSections = [...injected, { id, type, command, typing: true }]
      setInjected(newSections)
      history.pushState({ injLen: newSections.length }, '')

      // Scroll to bottom so new prompt is visible
      setTimeout(scrollToBottom, 50)
    },
    [nextId, injected, scrollToBottom]
  )

  const handleInjectPost = useCallback(
    (slug: string) => {
      handleInject(`post/${slug}`)
    },
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

  // ─── Cleanup nav listeners on unmount ─────────────────────────────────────

  useEffect(() => {
    return () => {
      navListeners.current.forEach((cleanup) => cleanup())
    }
  }, [])

  // ─── Helper: render injected section content ──────────────────────────────

  const renderSectionContent = (section: InjectedSection) => {
    const { type, typing } = section
    if (typing) return null // still typing, no output yet

    if (type === 'projects') {
      return <ProjectsSection meta={projects.meta} />
    }
    if (type === 'writing') {
      return (
        <WritingSection posts={posts} onInjectPost={handleInjectPost} />
      )
    }
    if (type === 'contact') {
      return <ContactSection meta={contact.meta} />
    }
    if (type === 'nav') {
      return <NavSection onInject={handleInject} />
    }
    if (type.startsWith('post/')) {
      const slug = type.slice(5)
      // Look up full post (with contentHtml) from the posts array
      const post = posts.find((p) => p.slug === slug) ?? initialPost
      if (post && post.slug === slug) {
        return <PostSection post={post} />
      }
      return null
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
          boxShadow:
            '0 40px 120px rgba(0,0,0,.65), 0 0 0 1px rgba(69,71,90,.4)',
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
          {/* ── Phase 1: whoami block ─────────────────────────────── */}
          <TerminalBlock
            command={bootPhase === 'whoami-typing' ? whoamiTyped.displayed : 'whoami'}
            showCursor={bootPhase === 'whoami-typing'}
          >
            {bootPhase !== 'whoami-typing' && (
              <WhoamiSection
                meta={whoami.meta}
                contentHtml={whoami.contentHtml}
              />
            )}
          </TerminalBlock>

          {/* ── Phase 2: ls block (shown after whoami done) ──────── */}
          {bootPhase !== 'whoami-typing' && (
            <TerminalBlock
              command={bootPhase === 'ls-typing' ? lsTyped.displayed : 'ls -la ~/garulf'}
              showCursor={bootPhase === 'ls-typing'}
            >
              {bootPhase === 'ls-done' && (
                <LsSection onInject={handleInject} />
              )}
            </TerminalBlock>
          )}

          {/* ── Phase 3: Injected sections ────────────────────────── */}
          {injected.map((section, idx) => {
            const isLast = idx === injected.length - 1
            // Use live typewriter display for the last typing section
            const displayedCommand =
              isLast && section.typing
                ? injectedTyped.displayed
                : section.typing
                  ? '' // not last, so shouldn't be typing — show nothing
                  : section.command

            return (
              <TerminalBlock
                key={section.id}
                command={displayedCommand}
                showCursor={isLast && section.typing}
              >
                {renderSectionContent(section)}
              </TerminalBlock>
            )
          })}

          {/* ── Closing prompt (blinking cursor, no command text) ─── */}
          {bootPhase === 'ls-done' && injected.every((s) => !s.typing) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '20px',
                marginBottom: '8px',
              }}
            >
              <span style={{ color: 'var(--ctp-green)' }}>garulf</span>
              <span style={{ color: 'var(--ctp-overlay0)' }}>@</span>
              <span style={{ color: 'var(--ctp-teal)' }}>github</span>
              <span>&nbsp;</span>
              <span style={{ color: 'var(--ctp-blue)' }}>~</span>
              <span style={{ color: 'var(--ctp-mauve)' }}>&nbsp;$&nbsp;</span>
              <span className="cursor" />
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
