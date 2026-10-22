import type { Page } from '@/types'
import { BACKUPS } from '@/data/mockData'
import StatusBadge from '@/component/statusbadge'
import TypeBadge from '@/component/typebadge'
import StorageDonut from '@/component/storagedonut'
import { IcoDatabase, IcoHardDrive, IcoCheck, IcoClock, IcoChevron, IcoX, IcoRestore } from '@/component/icons'

interface Props {
  onNavigate: (p: Page) => void
}

const KPI_CONFIG = [
  { label: 'Total Backups', value: '0', sub: 'Aucune sauvegarde', icon: <IcoDatabase s={16} />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Stockage utilisé', value: '0 GB', sub: 'Aucun stockage configuré', icon: <IcoHardDrive s={16} />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Taux de succès', value: '—', sub: 'Aucune donnée disponible', icon: <IcoCheck s={14} />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Prochain backup', value: '—', sub: 'Aucune planification', icon: <IcoClock s={16} />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
]

export default function Dashboard({ onNavigate }: Props) {
  const running = BACKUPS.filter(b => b.status === 'running')

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CONFIG.map((k, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors">
            <span className={`inline-flex p-1.5 rounded ${k.bg} ${k.color} mb-3`}>{k.icon}</span>
            <p className="text-2xl font-bold text-slate-100 font-display">{k.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{k.label}</p>
            <p className="text-[10px] text-slate-700 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent backups + Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">Sauvegardes récentes</h3>
            <button
              onClick={() => onNavigate('backups')}
              className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
            >
              Voir tout <IcoChevron s={11} />
            </button>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800">
                {['ID', 'Base de données', 'Type', 'Taille', 'Statut', 'Heure'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BACKUPS.slice(0, 6).map(b => (
                <tr key={b.id} className="border-b border-slate-800/40 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-slate-400">{b.id}</td>
                  <td className="px-4 py-2.5 text-slate-300">{b.database}</td>
                  <td className="px-4 py-2.5"><TypeBadge type={b.type} /></td>
                  <td className="px-4 py-2.5 font-mono text-slate-300">{b.size}</td>
                  <td className="px-4 py-2.5"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-2.5 font-mono text-slate-500">{b.timestamp.split(' ')[1]}</td>
                </tr>
              ))}
              {BACKUPS.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-600 text-sm">
                    Aucune sauvegarde pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Utilisation stockage</h3>
          <StorageDonut />
        </div>
      </div>

      {/* Active jobs + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">Jobs actifs</h3>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          </div>
          <div className="p-4 space-y-3">
            {running.map(b => (
              <div key={b.id} className="flex items-center gap-3">
                <div className="w-0.5 self-stretch rounded-full bg-indigo-500/50" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-slate-300 truncate">{b.database}</span>
                    <span className="text-[10px] font-mono text-slate-500 ml-2">{b.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '63%' }} />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">63%</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-600 mt-1">{b.id} · {b.type} · {b.size}</p>
                </div>
              </div>
            ))}
            {running.length === 0 && (
              <p className="text-xs text-slate-600 py-3 text-center">Aucun job actif</p>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">Alertes</h3>
          </div>
          <div className="p-4">
            <p className="text-xs text-slate-600 py-3 text-center">Aucune alerte</p>
          </div>
        </div>
      </div>
    </div>
  )
}


