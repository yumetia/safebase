import { useState, FormEvent } from 'react'
import { useAuth } from '@/context/auth'
import { IcoCheck } from '@/component/icons'

interface Props {
  onGoLogin: () => void
}

const FIELD = 'w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors'

const RULES = [
  { label: '8 caractères minimum', test: (p: string) => p.length >= 8 },
  { label: 'Une lettre majuscule',  test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Un chiffre',           test: (p: string) => /\d/.test(p) },
]

export default function RegisterPage({ onGoLogin }: Props) {
  const { register } = useAuth()
  const [name, setName]           = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [showRules, setShowRules] = useState(false)

  const passwordOk = RULES.every(r => r.test(password))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirm) { setError('Veuillez remplir tous les champs.'); return }
    if (!passwordOk) { setError('Le mot de passe ne respecte pas les règles de sécurité.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setError(null)
    setLoading(true)
    const res = await register(name, email, password)
    setLoading(false)
    if (!res.ok) setError(res.error ?? 'Erreur inconnue.')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(15,23,42,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo.png" alt="Safebase" className="w-12 h-14 object-contain mb-3" />
          <h1 className="text-xl font-bold text-slate-900 font-display">Bienvenue dans Safebase</h1>
          <p className="text-xs text-slate-500 mt-0.5 tracking-wider uppercase">Backup Manager</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xl shadow-slate-900/5">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Créer un compte</h2>
          <p className="text-xs text-slate-600 mb-5">Rejoignez votre espace Safabase</p>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/8 border border-red-500/20 rounded-lg mb-4 text-xs text-red-300">
              <span className="shrink-0">✕</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Nom complet</label>
              <input
                type="text" placeholder="Jean Dupont" value={name}
                onChange={e => setName(e.target.value)} autoComplete="name"
                className={FIELD}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Adresse email</label>
              <input
                type="email" placeholder="vous@exemple.com" value={email}
                onChange={e => setEmail(e.target.value)} autoComplete="email"
                className={FIELD}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Mot de passe</label>
              <input
                type="password" placeholder="••••••••" value={password}
                onChange={e => { setPassword(e.target.value); setShowRules(true) }}
                autoComplete="new-password"
                className={FIELD}
              />
              {showRules && password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {RULES.map((r, i) => (
                    <div key={i} className={`flex items-center gap-1.5 text-[10px] transition-colors ${r.test(password) ? 'text-emerald-400' : 'text-slate-600'}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 ${r.test(password) ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                        {r.test(password) && <IcoCheck s={8} />}
                      </span>
                      {r.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password" placeholder="••••••••" value={confirm}
                onChange={e => setConfirm(e.target.value)} autoComplete="new-password"
                className={`${FIELD} ${confirm && confirm !== password ? 'border-red-500/50 focus:border-red-500/60' : ''}`}
              />
              {confirm && confirm !== password && (
                <p className="text-[10px] text-red-400 mt-1">Les mots de passe ne correspondent pas.</p>
              )}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> Création…</>
                : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              Déjà un compte ?{' '}
              <button onClick={onGoLogin} className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Se connecter
              </button>
            </p>
          </div>
        </div>

        {/* Role info */}
        <div className="mt-4 p-3 bg-white/80 border border-slate-200 rounded-lg">
          <p className="text-[10px] text-slate-600 text-center font-mono">
            Les nouveaux comptes reçoivent le rôle <span className="text-slate-700">Viewer</span> par défaut.
          </p>
        </div>
      </div>
    </div>
  )
}