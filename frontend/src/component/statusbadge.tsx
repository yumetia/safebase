import type { BackupStatus } from '@/types'
import { IcoCheck, IcoX } from './icons'

const CONFIG: Record<BackupStatus, { label: string; cls: string }> = {
  success: { label: 'Success', cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  running: { label: 'Running', cls: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  failed:  { label: 'Failed',  cls: 'text-red-400 bg-red-400/10 border-red-400/20' },
  pending: { label: 'Pending', cls: 'text-slate-400 bg-slate-700/40 border-slate-600/30' },
  warning: { label: 'Warning', cls: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
}

export default function StatusBadge({ status }: { status: BackupStatus }) {
  const { label, cls } = CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${cls}`}>
      {status === 'running' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
      {status === 'success' && <IcoCheck s={9} />}
      {status === 'failed'  && <IcoX s={9} />}
      {label}
    </span>
  )
}
