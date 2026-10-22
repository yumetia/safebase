import type { Page } from '@/types'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/auth'
import { IcoClock, IcoDashboard, IcoDatabase, IcoRestore } from './icons'

const NAV: { id: Page; label: string; icon: ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <IcoDashboard s={17} /> },
    { id: 'backups', label: 'Sauvegardes', icon: <IcoDatabase s={17} /> },
    { id: 'schedules', label: 'Planifications', icon: <IcoClock s={17} /> },
    { id: 'restore', label: 'Restauration', icon: <IcoRestore s={17} /> },
]

interface SidebarProps {
    page: Page
    onNavigate: (page: Page) => void
}

export default function Sidebar({ page, onNavigate }: SidebarProps) {
    const { user, logout } = useAuth()

    return (
        <aside className="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4">
            <div className="mb-8 px-3 text-lg font-semibold text-slate-900">SafeBase</div>
            <nav className="flex-1 space-y-1" aria-label="Navigation principale">
                {NAV.map(item => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => onNavigate(item.id)}
                        aria-current={page === item.id ? 'page' : undefined}
                        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                            page === item.id
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="border-t border-slate-200 pt-3">
                {user && <p className="truncate px-3 pb-2 text-xs text-slate-500">{user.email}</p>}
                <button
                    type="button"
                    onClick={logout}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                    Se déconnecter
                </button>
            </div>
        </aside>
    )
}



