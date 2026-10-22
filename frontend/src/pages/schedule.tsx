import { useState } from 'react'
import { SCHEDULES } from '@/data/mockData'
import TypeBadge from '@/component/typebadge'
import Toggle from '@/component/toggle'
import { IcoPlus } from '@/component/icons'

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState(SCHEDULES)

  const toggle = (id: string) =>
    setSchedules(s => s.map(sc => sc.id === id ? { ...sc, enabled: !sc.enabled } : sc))

  const activeCount = schedules.filter(s => s.enabled).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <span className="text-slate-200 font-medium">{activeCount}</span> / {schedules.length} planifications actives
        </p>
        <button className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-semibold rounded-lg transition-colors">
          <IcoPlus s={13} /> Nouvelle planification
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {schedules.map(s => (
          <div
            key={s.id}
            className={`bg-slate-900 border rounded-lg p-4 transition-all
              ${s.enabled ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-55'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-slate-200">{s.name}</h3>
                  <TypeBadge type={s.type} />
                </div>
                <p className="text-[10px] font-mono text-slate-500">{s.id} · {s.database}</p>
              </div>
              <Toggle on={s.enabled} onChange={() => toggle(s.id)} />
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs mb-3">
              <div>
                <p className="text-slate-600 text-[10px] mb-0.5">Fréquence</p>
                <p className="text-slate-300 font-medium">{s.frequency}</p>
              </div>
              <div>
                <p className="text-slate-600 text-[10px] mb-0.5">Rétention</p>
                <p className="text-slate-300 font-medium">{s.retention}</p>
              </div>
              <div>
                <p className="text-slate-600 text-[10px] mb-0.5">Dernière exécution</p>
                <p className="text-slate-400 font-mono">{s.lastRun}</p>
              </div>
              <div>
                <p className="text-slate-600 text-[10px] mb-0.5">Prochaine exécution</p>
                <p className="text-slate-400 font-mono">{s.nextRun}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.successRate >= 95 ? 'bg-emerald-500' :
                      s.successRate >= 80 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${s.successRate}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-slate-500">{s.successRate}%</span>
              </div>
              <span className="text-[10px] font-mono text-slate-700">{s.cronExpr}</span>
            </div>
          </div>
        ))}
        {schedules.length === 0 && (
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg px-4 py-12 text-center text-slate-600 text-sm">
            Aucune planification pour le moment.
          </div>
        )}
      </div>
    </div>
  )
}