import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-backups',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Backups</h1>

    <table>
      <thead>
        <tr>
          <th>Database</th>
          <th>File</th>
          <th>Status</th>
          <th>Triggered by</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let backup of backups">
          <td>{{ backup.database_name }}</td>
          <td>{{ backup.file_path }}</td>
          <td>{{ backup.status }}</td>
          <td>{{ backup.triggered_by }}</td>
          <td>{{ backup.created_at | date:'short' }}</td>
          <td>
            <button (click)="restore(backup.id)">Restore</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p *ngIf="message">{{ message }}</p>
  `
})
export class BackupsComponent implements OnInit {
  backups: any[] = []
  message = ''

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getBackups().subscribe(data => this.backups = data)
  }

  restore(id: number) {
    this.api.restoreBackup(id).subscribe(() => {
      this.message = 'Restore successful'
    })
  }
}
