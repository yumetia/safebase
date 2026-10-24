import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-backups',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h1>Backups</h1>

    <div class="card">
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
            <td>
              <span class="badge" [ngClass]="{
                'badge-success': backup.status === 'success',
                'badge-error': backup.status === 'failed'
              }">{{ backup.status }}</span>
            </td>
            <td>
              <span class="badge badge-info">{{ backup.triggered_by }}</span>
            </td>
            <td>{{ backup.created_at | date:'short' }}</td>
            <td>
              <div class="actions">
                <button class="btn-primary" (click)="restore(backup.id)">Restore</button>
                <button class="btn-ghost" (click)="download(backup.id)">Download</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="message" class="message">{{ message }}</p>
    </div>
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
    this.api.restoreBackup(id).subscribe({
      next: () => this.message = 'Restore successful',
      error: () => this.message = 'Restore failed'
    })
  }

  download(id: number) {
    this.api.downloadBackup(id).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup_${id}.sql`
      a.click()
      window.URL.revokeObjectURL(url)
    })
  }
}
