import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
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
        <select [(ngModel)]="selectedDestinationId" style="width: 200px;">
          <option [ngValue]="null">Local (default)</option>
          <option *ngFor="let d of destinations" [ngValue]="d.id">{{ d.name }} ({{ d.host }})</option>
        </select>
        <button class="btn-primary" (click)="triggerBackup()">Trigger Backup</button>
        <label style="
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          border: 1px solid #d0d7de;
          background: #f6f8fa;
          color: #1f2328;
          font-size: 0.825rem;
          font-weight: 500;
          cursor: pointer;
        ">
          {{ selectedFile ? selectedFile.name : 'Choose file' }}
          <input
            type="file"
            accept=".sql"
            style="display:none"
            (change)="onFileSelected($event)"
          />
        </label>
        <button class="btn-blue" (click)="upload()" [disabled]="!selectedFile">
          Upload
        </button>
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
  @ViewChild('fileInput') fileInput!: ElementRef

  backups: any[] = []
  databases: any[] = []
  selectedDatabaseId: number = 0
  selectedFile: File | null = null
  message = ''
  destinations: any[] = []
  selectedDestinationId: number | null = null

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDestinations().subscribe(data => this.destinations = data)
    this.api.getBackups().subscribe(data => this.backups = data)
    this.api.getDatabases().subscribe(data => {
      this.databases = data
      if (data.length > 0) this.selectedDatabaseId = data[0].id
    })
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]
  }

  upload() {
    if (!this.selectedFile || !this.selectedDatabaseId) return
    this.api.uploadBackup(this.selectedDatabaseId, this.selectedFile).subscribe({
      next: () => {
        this.message = 'File uploaded successfully'
        this.selectedFile = null
        this.api.getBackups().subscribe(data => this.backups = data)
      },
      error: () => this.message = 'Upload failed'
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

  triggerBackup() {
    this.api.triggerBackup(this.selectedDatabaseId, this.selectedDestinationId).subscribe({
      next: (res: any) => {
        this.message = `Backup successful — ${res.destination ?? 'local'}`
        this.api.getBackups().subscribe(data => this.backups = data)
      },
      error: () => this.message = 'Backup failed'
    })
  }
}
