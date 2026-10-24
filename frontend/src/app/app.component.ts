import { Component } from '@angular/core'
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app">
      <nav class="sidebar">
        <div class="logo">⚡ Safebase</div>
        <a routerLink="/databases" routerLinkActive="active">Databases</a>
        <a routerLink="/backups" routerLinkActive="active">Backups</a>
        <a routerLink="/schedules" routerLinkActive="active">Schedules</a>
        <a routerLink="/logs" routerLinkActive="active">Logs</a>
      </nav>
      <main class="main">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {}