import { Routes } from '@angular/router'
import { AuthGuard } from './guards/auth.guard'
import { AuthComponent } from './pages/auth/auth.component'
import { DatabasesComponent } from './pages/databases/databases.component'
import { BackupsComponent } from './pages/backups/backups.component'
import { SchedulesComponent } from './pages/schedules/schedules.component'
import { LogsComponent } from './pages/logs/logs.component'

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'databases', component: DatabasesComponent, canActivate: [AuthGuard] },
  { path: 'backups', component: BackupsComponent, canActivate: [AuthGuard] },
  { path: 'schedules', component: SchedulesComponent, canActivate: [AuthGuard] },
  { path: 'logs', component: LogsComponent, canActivate: [AuthGuard] },
]