import { useState } from 'react'
import { AuthProvider, useAuth } from '@/context/auth'
import type { Page } from '@/types'
import Sidebar from '@/component/sidebar'
import { IcoServer } from '@/component/icons'
import DashboardPage from '@/pages/dashboard'
import BackupsPage from '@/pages/backups'
import SchedulesPage from '@/pages/schedule'
import RestorePage from '@/pages/restore'
import LoginPage from '@/pages/login'
import RegisterPage from '@/pages/register'

const PAGE_TITLE: Record<Page, string> = {
  dashboard: 'Dashboard',
  backups:   'Sauvegardes',
  schedules: 'Planifications',
  restore:   'Restauration',
}

// ── Auth screens (no sidebar) ─────────────────────────────────────────────────

function AuthGate() {
  const [screen, setScreen] = useState<'login' | 'register'>('login')
  return screen === 'login'
    ? <LoginPage onGoRegister={() => setScreen('register')} />
    : <RegisterPage onGoLogin={() => setScreen('login')} />
}

// ── Main app shell ────────────────────────────────────────────────────────────

function AppShell() {
  const { user } = useAuth()
  const [page, setPage] = useState<Page>('dashboard')

  if (!user) return <AuthGate />

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans">
      <Sidebar page={page} onNavigate={setPage} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-slate-200 flex items-center px-6 gap-4 shrink-0 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-sm font-semibold text-slate-800 font-display">
            {PAGE_TITLE[page] ?? 'Dashboard'}
          </h1>
          <div className="ml-auto flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Aucun job en cours
            </span>
            <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors">
              <IcoServer s={15} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {page === 'dashboard' && <DashboardPage onNavigate={setPage} />}
          {page === 'backups'   && <BackupsPage />}
          {page === 'schedules' && <SchedulesPage />}
          {page === 'restore'   && <RestorePage />}
        </main>
      </div>
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
