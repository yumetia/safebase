import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-schedules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Schedules</h1>

    <div class="card">
      <h2>Create a schedule</h2>
      <div class="form-grid">
        <select [(ngModel)]="form.database_id">
          <option *ngFor="let db of databases" [value]="db.id">{{ db.name }}</option>
        </select>
        <input [(ngModel)]="form.cron_expression" placeholder="Cron expression (e.g. 0 2 * * *)" />
      </div>
      <button class="btn-primary" (click)="create()">Create schedule</button>
      <p *ngIf="message" class="message">{{ message }}</p>
    </div>

    <div class="card">
      <h2>Active schedules</h2>
      <table>
        <thead>
          <tr>
            <th>Database</th>
            <th>Cron expression</th>
            <th>Status</th>
            <th>Next run</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let schedule of schedules">
            <td>{{ schedule.database_name }}</td>
            <td><code>{{ schedule.cron_expression }}</code></td>
            <td>
              <span class="badge" [ngClass]="{
                'badge-success': schedule.is_active,
                'badge-error': !schedule.is_active
              }">{{ schedule.is_active ? 'active' : 'inactive' }}</span>
            </td>
            <td>{{ schedule.next_run_at | date:'short' }}</td>
            <td>{{ schedule.created_at | date:'short' }}</td>
            <td>
              <button class="btn-danger" (click)="delete(schedule.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class SchedulesComponent implements OnInit {
  schedules: any[] = []
  databases: any[] = []
  message = ''

  form = {
    database_id: 0,
    cron_expression: ''
  }

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load()
    this.api.getDatabases().subscribe(data => {
      this.databases = data
      if (data.length > 0) this.form.database_id = data[0].id
    })
  }

  load() {
    this.api.getSchedules().subscribe(data => this.schedules = data)
  }

  create() {
    this.api.createSchedule(this.form).subscribe({
      next: () => {
        this.message = 'Schedule created'
        this.load()
      },
      error: () => this.message = 'Failed to create schedule'
    })
  }

  delete(id: number) {
    this.api.deleteSchedule(id).subscribe(() => {
      this.message = 'Schedule deleted'
      this.load()
    })
  }
}
