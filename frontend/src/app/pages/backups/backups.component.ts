import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ApiService } from '../../services/api.service'
import { FormsModule } from '@angular/forms'
@Component({
  
  selector: 'app-backups',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Backups</h1>

    <div class="card">
      <div style="margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem;">
        <select [(ngModel)]="selectedDatabaseId" style="width: 200px;">
          <option *ngFor="let db of databases" [value]="db.id">{{ db.name }}</option>
        </select>
        <input type="file" (change)="onFileSelected($event)" accept=".sql" />
        <button class="btn-ghost" (click)="upload()">Upload backup</button>
      </div>
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

  // inject databases in ngOnInit
  ngOnInit() {
    this.api.getBackups().subscribe(data => this.backups = data)
    this.api.getDatabases().subscribe(data => {
      this.databases = data
      if (data.length > 0) this.selectedDatabaseId = data[0].id
    })
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
  selectedDatabaseId: number = 0
  selectedFile: File | null = null
  databases: any[] = []



  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]
  }

  upload() {
    if (!this.selectedFile || !this.selectedDatabaseId) return
    this.api.uploadBackup(this.selectedDatabaseId, this.selectedFile).subscribe({
      next: () => {
        this.message = 'File uploaded successfully'
        this.api.getBackups().subscribe(data => this.backups = data)
      },
      error: () => this.message = 'Upload failed'
    })
  }
}
