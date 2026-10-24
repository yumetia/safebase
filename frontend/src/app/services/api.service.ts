import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:3000/api'

  constructor(private http: HttpClient) {}

  // databases
  getDatabases() {
    return this.http.get<any[]>(`${this.base}/databases`)
  }

  addDatabase(data: any) {
    return this.http.post(`${this.base}/databases`, data)
  }

  deleteDatabase(id: number) {
    return this.http.delete(`${this.base}/databases/${id}`)
  }

  // backups
  getBackups() {
    return this.http.get<any[]>(`${this.base}/backups`)
  }

  triggerBackup(database_id: number) {
    return this.http.post(`${this.base}/backups`, { database_id })
  }

  restoreBackup(id: number) {
    return this.http.post(`${this.base}/backups/restore/${id}`, {})
  }

  // logs
  getLogs() {
    return this.http.get<any[]>(`${this.base}/logs`)
  }
  downloadBackup(id: number) {
    return this.http.get(`${this.base}/backups/download/${id}`, {
      responseType: 'blob'
    })
  }

  uploadBackup(database_id: number, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('database_id', database_id.toString())
    return this.http.post(`${this.base}/backups/upload`, formData)
  }
}

