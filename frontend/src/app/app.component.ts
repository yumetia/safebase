import { Component } from '@angular/core'
import { RouterOutlet, RouterLink } from '@angular/router'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/databases">Databases</a>
      <a routerLink="/backups">Backups</a>
      <a routerLink="/logs">Logs</a>
    </nav>
    <router-outlet />
  `
})
export class AppComponent {}
