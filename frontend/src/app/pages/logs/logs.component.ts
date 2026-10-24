import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Logs</h1>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Database</th>
            <th>Action</th>
            <th>Level</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let log of logs">
            <td>{{ log.database_name }}</td>
            <td>{{ log.action }}</td>
            <td>
              <span class="badge" [ngClass]="{
                'badge-success': log.level === 'info',
                'badge-error': log.level === 'error',
                'badge-warning': log.level === 'warning'
              }">{{ log.level }}</span>
            </td>
            <td>{{ log.message }}</td>
            <td>{{ log.created_at | date:'short' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class LogsComponent implements OnInit {
  logs: any[] = []

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getLogs().subscribe(data => this.logs = data)
  }
}
