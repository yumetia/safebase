import type { BackupType } from '@/types'

const CONFIG: Record<BackupType, { label: string; cls: string }> = {
  full:         { label: 'FULL', cls: 'text-blue-400 bg-blue-400/10' },
  incremental:  { label: 'INCR', cls: 'text-purple-400 bg-purple-400/10' },
  differential: { label: 'DIFF', cls: 'text-cyan-400 bg-cyan-400/10' },
}

export default function TypeBadge({ type }: { type: BackupType }) {
  const { label, cls } = CONFIG[type]
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider ${cls}`}>
      {label}
    </span>
  )
}
