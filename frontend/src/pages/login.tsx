import { useState, FormEvent } from 'react'
import { useAuth } from '@/context/auth'
import { IcoCheck } from '@/component/icons'

interface Props {
  onGoRegister: () => void
}

const FIELD = 'w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors'

export default function LoginPage({ onGoRegister }: Props) {
  const { login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return }
    setError(null)
    setLoading(true)
    const res = await login(email, password)
    setLoading(false)
    if (!res.ok) setError(res.error ?? 'Erreur inconnue.')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
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
          <h1 className="text-xl font-bold text-slate-900 font-display">Safebase</h1>
          <p className="text-xs text-slate-500 mt-0.5 tracking-wider uppercase">Backup Manager</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xl shadow-slate-900/5">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Connexion</h2>
          <p className="text-xs text-slate-600 mb-5">Accédez à votre espace de gestion</p>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/8 border border-red-500/20 rounded-lg mb-4 text-xs text-red-300">
              <span className="shrink-0">✕</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1.5">Adresse email</label>
              <input
                type="email" placeholder="vous@exemple.com" value={email}
                onChange={e => setEmail(e.target.value)} autoComplete="email"
                className={FIELD}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs text-slate-600">Mot de passe</label>
                <button type="button" className="text-[10px] text-blue-600 hover:text-blue-700 transition-colors">
                  Mot de passe oublié ?
                </button>
              </div>
              <input
                type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} autoComplete="current-password"
                className={FIELD}
              />
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => setRemember(r => !r)}
                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                  ${remember ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}
              >
                {remember && <IcoCheck s={9} />}
              </button>
              <span className="text-xs text-slate-600">Se souvenir de moi</span>
            </label>

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" /> Connexion…</>
                : 'Se connecter'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              Pas encore de compte ?{' '}
              <button onClick={onGoRegister} className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Créer un compte
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
