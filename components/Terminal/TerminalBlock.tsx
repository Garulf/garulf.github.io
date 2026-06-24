import React from 'react'
import styles from './TerminalBlock.module.css'

interface TerminalBlockProps {
  command: string
  showCursor?: boolean
  children?: React.ReactNode
}

export default function TerminalBlock({
  command,
  showCursor = false,
  children,
}: TerminalBlockProps) {
  return (
    <div className={styles.block}>
      <div className={styles.prompt}>
        <span className={styles.user}>garulf</span>
        <span className={styles.at}>@</span>
        <span className={styles.host}>github</span>
        <span className={styles.at}>&nbsp;</span>
        <span className={styles.path}>~</span>
        <span className={styles.dollar}>&nbsp;$&nbsp;</span>
        {showCursor && <span className="cursor" />}
        <span className={styles.cmd}>{command}</span>
      </div>
      {children && <div className={styles.output}>{children}</div>}
    </div>
  )
}
