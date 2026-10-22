import { createContext, useContext, useState, type ReactNode } from 'react'

export interface User {
  name: string
  email: string
  role: 'Admin' | 'Operator' | 'Viewer'
  initials: string
  joinedAt: string
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const INITIAL_ACCOUNTS: Array<User & { password: string }> = []

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS)

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 800))
    const found = accounts.find(a => a.email === email && a.password === password)
    if (!found) return { ok: false, error: 'Email ou mot de passe incorrect.' }
    const { password: _, ...userData } = found
    setUser(userData)
    return { ok: true }
  }

  const register = async (name: string, email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 900))
    if (accounts.find(a => a.email === email)) return { ok: false, error: 'Cet email est déjà utilisé.' }
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const newUser: User & { password: string } = {
      name, email, password, role: 'Viewer', initials,
      joinedAt: new Date().toISOString().split('T')[0],
    }
    setAccounts(a => [...a, newUser])
    const { password: _, ...userData } = newUser
    setUser(userData)
    return { ok: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
