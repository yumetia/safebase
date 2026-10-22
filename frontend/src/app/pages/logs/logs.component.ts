import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Logs</h1>

    <table>
      <thead>
        <tr>
          <th>Action</th>
          <th>Level</th>
          <th>Message</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let log of logs">
          <td>{{ log.action }}</td>
          <td>{{ log.level }}</td>
          <td>{{ log.message }}</td>
          <td>{{ log.created_at | date:'short' }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class LogsComponent implements OnInit {
  logs: any[] = []

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getLogs().subscribe(data => this.logs = data)
  }
}
