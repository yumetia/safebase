import { useState } from 'react'
import { BACKUPS, DATABASES } from '@/data/mockData'
import TypeBadge from '@/component/typebadge'
import { IcoCheck } from '@/component/icons'

type Step = 1 | 2 | 3
type Mode = 'overwrite' | 'new'

const STEPS = [
  { n: 1, label: 'Sélectionner la sauvegarde' },
  { n: 2, label: 'Configurer la cible' },
  { n: 3, label: 'Confirmer' },
]

const INPUT_CLS = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500/60 transition-colors'

export default function RestorePage() {
  const [step, setStep]           = useState<Step>(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [targetDb, setTargetDb]   = useState('')
  const [mode, setMode]           = useState<Mode>('overwrite')
  const [confirmed, setConfirmed] = useState(false)
  const [started, setStarted]     = useState(false)

  const selected = BACKUPS.find(b => b.id === selectedId)
  const available = BACKUPS.filter(b => b.status === 'success')

  const reset = () => {
    setStarted(false)
    setStep(1)
    setSelectedId(null)
    setConfirmed(false)
  }

  return (
    <div className="max-w-2xl space-y-5">
      {/* Stepper */}
      <div className="flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s.n} className="flex items-center">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
              ${step === s.n ? 'bg-blue-500/15 text-blue-300' :
                step > s.n  ? 'text-emerald-400' : 'text-slate-600'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                ${step === s.n ? 'bg-blue-500 text-white' :
                  step > s.n  ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                {step > s.n ? '✓' : s.n}
              </span>
              {s.label}
            </div>
            {i < 2 && <span className="text-slate-700 mx-1">–</span>}
          </div>
        ))}
      </div>

      {/* Step 1 — Select backup */}
      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">Sélectionner un point de restauration</h3>
            <p className="text-xs text-slate-500 mt-0.5">Choisissez le snapshot à restaurer</p>
          </div>
          <div className="divide-y divide-slate-800/50 max-h-80 overflow-y-auto">
            {available.slice(0, 8).map(b => (
              <label
                key={b.id}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-800/40
                  ${selectedId === b.id ? 'bg-blue-500/8' : ''}`}
              >
                <input
                  type="radio" name="backup" value={b.id}
                  checked={selectedId === b.id}
                  onChange={() => setSelectedId(b.id)}
                  className="accent-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">{b.id}</span>
                    <TypeBadge type={b.type} />
                    <span className="text-xs text-slate-300 font-medium truncate">{b.database}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-[10px] font-mono text-slate-500">
                    <span>{b.timestamp}</span>
                    <span>·</span><span>{b.size}</span>
                    <span>·</span><span>{b.duration}</span>
                  </div>
                </div>
                {selectedId === b.id && <span className="text-blue-400 shrink-0"><IcoCheck s={13} /></span>}
              </label>
            ))}
            {available.length === 0 && (
              <p className="px-4 py-12 text-center text-slate-600 text-sm">
                Aucune sauvegarde disponible pour une restauration.
              </p>
            )}
          </div>
          <div className="px-4 py-3 border-t border-slate-800 flex justify-end">
            <button
              disabled={!selectedId}
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      {/* Step 2 — Configure */}
      {step === 2 && selected && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">Configurer la cible de restauration</h3>
          </div>
          <div className="p-4 space-y-4">
            {/* Source info */}
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-800 space-y-1.5 text-xs">
              {[
                ['Source', selected.id],
                ['Base de données', selected.database],
                ['Prise le', selected.timestamp],
                ['Taille', selected.size],
                ['Emplacement', selected.location],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">{k}</span>
                  <span className="font-mono text-slate-300 truncate">{v}</span>
                </div>
              ))}
            </div>

            {/* Target DB */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Base de données cible</label>
              <select value={targetDb} onChange={e => setTargetDb(e.target.value)} className={INPUT_CLS}>
                {DATABASES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              {targetDb === selected.database && (
                <p className="text-[10px] text-amber-400 mt-1.5">
                  ⚠ Restaurer sur la base source écrasera les données de production.
                </p>
              )}
            </div>

            {/* Mode */}
            <div>
              <label className="block text-xs text-slate-400 mb-1.5">Mode de restauration</label>
              <div className="space-y-2">
                {[
                  { val: 'overwrite' as Mode, label: 'Écraser l\'existant', desc: 'Remplace la base cible par les données du backup' },
                  { val: 'new' as Mode, label: 'Nouvelle instance', desc: 'Restaure en parallèle comme une nouvelle copie' },
                ].map(opt => (
                  <label
                    key={opt.val}
                    className={`flex items-start gap-2.5 p-2.5 border rounded-lg cursor-pointer transition-colors
                      ${mode === opt.val ? 'border-blue-500/40 bg-blue-500/5' : 'border-slate-800 hover:border-slate-700'}`}
                  >
                    <input
                      type="radio" name="mode" value={opt.val}
                      checked={mode === opt.val}
                      onChange={() => setMode(opt.val)}
                      className="accent-blue-500 mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-300">{opt.label}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="px-4 py-3 border-t border-slate-800 flex justify-between">
            <button onClick={() => setStep(1)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors">
              Retour
            </button>
            <button onClick={() => setStep(3)} className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded-lg transition-colors">
              Continuer
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Confirm */}
      {step === 3 && selected && !started && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200">Confirmer la restauration</h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs text-amber-300">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>
                Cette opération va {mode === 'overwrite' ? `écraser <strong>${targetDb}</strong> avec` : 'créer une nouvelle instance depuis'} les données du backup <strong>{selected.timestamp}</strong>. Cette action est irréversible.
              </span>
            </div>

            <div className="p-3 bg-slate-800/50 border border-slate-800 rounded-lg space-y-1.5 text-xs">
              {[
                ['ID backup',     selected.id],
                ['Source',        selected.database],
                ['Cible',         targetDb],
                ['Mode',          mode === 'overwrite' ? 'Écraser l\'existant' : 'Nouvelle instance'],
                ['Taille',        selected.size],
                ['Durée estimée', `~${selected.duration}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <span className="text-slate-500 shrink-0">{k}</span>
                  <span className="font-mono text-slate-300">{v}</span>
                </div>
              ))}
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="accent-blue-500 w-4 h-4"
              />
              <span className="text-xs text-slate-400">Je comprends que cette action modifiera la base de données cible</span>
            </label>
          </div>
          <div className="px-4 py-3 border-t border-slate-800 flex justify-between">
            <button onClick={() => setStep(2)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors">
              Retour
            </button>
            <button
              disabled={!confirmed}
              onClick={() => setStarted(true)}
              className="px-4 py-2 bg-red-500/80 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
            >
              Lancer la restauration
            </button>
          </div>
        </div>
      )}

      {/* Running state */}
      {started && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mx-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
          </div>
          <p className="text-sm font-semibold text-slate-200">Restauration en cours</p>
          <p className="text-xs text-slate-500">
            Restauration de <span className="font-mono text-slate-400">{selected?.id}</span> vers <span className="font-mono text-slate-400">{targetDb}</span>
          </p>
          <p className="text-xs text-slate-600 font-mono">Durée estimée : ~{selected?.duration}</p>
          <button
            onClick={reset}
            className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded-lg transition-colors"
          >
            Nouvelle restauration
          </button>
        </div>
      )}
    </div>
  )
}