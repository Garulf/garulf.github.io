import styles from './TerminalChrome.module.css'

interface TerminalChromeProps {
  onScrollToTop: () => void
}

export default function TerminalChrome({ onScrollToTop }: TerminalChromeProps) {
  return (
    <div
      className={styles.chrome}
      onClick={onScrollToTop}
      role="button"
      tabIndex={0}
      aria-label="Scroll to top"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.key === ' ') e.preventDefault()
          onScrollToTop()
        }
      }}
    >
      <div className={styles.dots}>
        <span className={`${styles.dot} ${styles.dotRed}`} />
        <span className={`${styles.dot} ${styles.dotYellow}`} />
        <span className={`${styles.dot} ${styles.dotGreen}`} />
      </div>
      <div className={styles.title}>garulf@github: ~ — bash</div>
      <div className={styles.version}>v3</div>
    </div>
  )
}
