import { useState, useMemo } from 'react'
import { BACKUPS, DATABASES } from '@/data/mockData'
import StatusBadge from '@/component/statusbadge'
import TypeBadge from '@/component/typebadge'
import { IcoSearch, IcoPlus, IcoDownload, IcoRestore } from '@/component/icons'

const SELECT_CLS = 'bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-slate-600 cursor-pointer'
const STATUSES = ['success', 'running', 'failed', 'warning', 'pending']

export default function BackupsPage() {
  const [search, setSearch]           = useState('')
  const [filterDb, setFilterDb]       = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = useMemo(() =>
    BACKUPS.filter(b => {
      const q = search.toLowerCase()
      return (b.id.toLowerCase().includes(q) || b.database.toLowerCase().includes(q))
        && (filterDb     === 'all' || b.database === filterDb)
        && (filterStatus === 'all' || b.status   === filterStatus)
    }),
    [search, filterDb, filterStatus]
  )

  return (
    <div className="space-y-4">
      
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <IcoSearch s={14} />
          </span>
          <input
            type="text"
            placeholder="Rechercher par ID ou base…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-sm text-slate-300 placeholder-slate-700 focus:outline-none focus:border-slate-600"
          />
        </div>

        <select value={filterDb} onChange={e => setFilterDb(e.target.value)} className={SELECT_CLS}>
          <option value="all">Toutes les bases</option>
          {DATABASES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={SELECT_CLS}>
          <option value="all">Tous les statuts</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>

        <button className="flex items-center gap-2 px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-semibold rounded-lg transition-colors ml-auto">
          <IcoPlus s={13} /> Nouvelle sauvegarde
        </button>
      </div>

      
      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-800">
          <span className="text-xs text-slate-500 font-mono">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-800">
                {['ID', 'Base de données', 'Type', 'Taille', 'Durée', 'Rétention', 'Statut', 'Horodatage', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-slate-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-slate-800/40 hover:bg-slate-800/25 transition-colors group">
                  <td className="px-4 py-3 font-mono text-slate-400">{b.id}</td>
                  <td className="px-4 py-3 text-slate-300 font-medium">{b.database}</td>
                  <td className="px-4 py-3"><TypeBadge type={b.type} /></td>
                  <td className="px-4 py-3 font-mono text-slate-200">{b.size}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{b.duration}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{b.retention}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3 font-mono text-slate-500">{b.timestamp}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded hover:bg-slate-700 text-slate-500 hover:text-blue-400 transition-colors" title="Télécharger">
                        <IcoDownload s={13} />
                      </button>
                      <button className="p-1.5 rounded hover:bg-slate-700 text-slate-500 hover:text-emerald-400 transition-colors" title="Restaurer">
                        <IcoRestore s={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-600 text-sm">
                    Aucune sauvegarde ne correspond aux filtres.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}