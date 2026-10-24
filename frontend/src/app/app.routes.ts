import { Routes } from '@angular/router'
import { DatabasesComponent } from './pages/databases/databases.component'
import { BackupsComponent } from './pages/backups/backups.component'
import { LogsComponent } from './pages/logs/logs.component'
import { SchedulesComponent } from './pages/schedules/schedules.component'


export const routes: Routes = [
  { path: '', redirectTo: 'databases', pathMatch: 'full' },
  { path: 'databases', component: DatabasesComponent },
  { path: 'backups', component: BackupsComponent },
  { path: 'logs', component: LogsComponent },
  { path: 'schedules', component: SchedulesComponent } 
]
