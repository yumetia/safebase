import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-databases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Databases</h1>

    <div class="card">
      <h2>Register a database</h2>
      <form (ngSubmit)="addDatabase()">
        <div class="form-grid">
          <input [(ngModel)]="form.name" name="name" placeholder="Display name" required />
          <select [(ngModel)]="form.type" name="type">
            <option value="mysql">MySQL</option>
            <option value="postgres">PostgreSQL</option>
          </select>
          <input [(ngModel)]="form.host" name="host" placeholder="Host" required />
          <input [(ngModel)]="form.port" name="port" placeholder="Port" type="number" required />
          <input [(ngModel)]="form.db_name" name="db_name" placeholder="Database name" required />
          <input [(ngModel)]="form.username" name="username" placeholder="Username" required />
          <input [(ngModel)]="form.password" name="password" placeholder="Password" type="password" required />
        </div>
        <button type="submit" class="btn-primary">Add database</button>
      </form>
      <p *ngIf="message" class="message">{{ message }}</p>
    </div>

    <div class="card">
      <h2>Registered databases</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Host</th>
            <th>Database</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let db of databases">
            <td>{{ db.name }}</td>
            <td>{{ db.type }}</td>
            <td>{{ db.host }}:{{ db.port }}</td>
            <td>{{ db.db_name }}</td>
            <td>{{ db.created_at | date:'short' }}</td>
            <td>
              <div class="actions">
                <button class="btn-blue" (click)="backup(db.id)">Backup</button>
                <button class="btn-danger" (click)="delete(db.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DatabasesComponent implements OnInit {
  databases: any[] = []
  message = ''

  form = {
    name: '', type: 'mysql', host: '', port: 3306,
    db_name: '', username: '', password: ''
  }

  constructor(private api: ApiService) {}

  ngOnInit() { this.load() }

  load() {
    this.api.getDatabases().subscribe(data => this.databases = data)
  }

  addDatabase() {
    this.api.addDatabase(this.form).subscribe(() => {
      this.message = 'Database added successfully'
      this.load()
    })
  }

  backup(id: number) {
    this.api.triggerBackup(id).subscribe({
      next: () => this.message = 'Backup triggered successfully',
      error: () => this.message = 'Backup failed'
    })
  }

  delete(id: number) {
    this.api.deleteDatabase(id).subscribe(() => {
      this.message = 'Database deleted'
      this.load()
    })
  }
}