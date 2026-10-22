import { STORAGE_SEGMENTS, TOTAL_STORAGE_GB } from '@/data/mockData'

export default function StorageDonut() {
  const totalUsed = STORAGE_SEGMENTS.reduce((a, s) => a + s.used, 0)
  const usagePercent = TOTAL_STORAGE_GB > 0 ? (totalUsed / TOTAL_STORAGE_GB) * 100 : 0
  const r = 52
  const circ = 2 * Math.PI * r
  const gap = 3
  let offset = 0

  const segs = STORAGE_SEGMENTS.map(s => {
    const dash = TOTAL_STORAGE_GB > 0 ? (s.used / TOTAL_STORAGE_GB) * circ - gap : 0
    const seg = { ...s, dash, offset }
    offset += dash + gap
    return seg
  })

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-28 h-28 shrink-0">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
          {segs.map((s, i) => (
            <circle key={i} cx="60" cy="60" r={r} fill="none"
              stroke={s.color} strokeWidth="10"
              strokeDasharray={`${Math.max(0, s.dash)} ${circ - s.dash}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-slate-100 font-display">
            {usagePercent.toFixed(0)}%
          </span>
          <span className="text-[9px] text-slate-500 font-mono tracking-wider">USED</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 min-w-0">
        {STORAGE_SEGMENTS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: s.color }} />
            <span className="text-slate-400 truncate w-24">{s.name}</span>
            <span className="text-slate-300 font-mono ml-auto pl-2">
              {s.used >= 1000 ? `${(s.used / 1000).toFixed(1)} TB` : `${s.used} GB`}
            </span>
          </div>
        ))}
        {STORAGE_SEGMENTS.length === 0 && (
          <p className="text-[11px] text-slate-600">Aucun stockage configuré</p>
        )}
        <div className="mt-1 pt-1.5 border-t border-slate-800 flex justify-between text-[11px]">
          <span className="text-slate-600">Capacité</span>
          <span className="text-slate-400 font-mono">0 GB</span>
        </div>
      </div>
    </div>
  )
}