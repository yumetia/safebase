import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:3000/api'

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token')
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
  }

  // auth
  login(data: any) {
    return this.http.post(`${this.base}/auth/login`, data)
  }

  register(data: any) {
    return this.http.post(`${this.base}/auth/register`, data)
  }

  // databases
  getDatabases() {
    return this.http.get<any[]>(`${this.base}/databases`, this.getHeaders())
  }

  addDatabase(data: any) {
    return this.http.post(`${this.base}/databases`, data, this.getHeaders())
  }

  deleteDatabase(id: number) {
    return this.http.delete(`${this.base}/databases/${id}`, this.getHeaders())
  }

  // backups
  getBackups() {
    return this.http.get<any[]>(`${this.base}/backups`, this.getHeaders())
  }

  triggerBackup(database_id: number) {
    return this.http.post(`${this.base}/backups`, { database_id }, this.getHeaders())
  }

  restoreBackup(id: number) {
    return this.http.post(`${this.base}/backups/restore/${id}`, {}, this.getHeaders())
  }

  downloadBackup(id: number) {
    const token = localStorage.getItem('token')
    return this.http.get(`${this.base}/backups/download/${id}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
      responseType: 'blob'
    })
  }

  uploadBackup(database_id: number, file: File) {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('database_id', database_id.toString())
    return this.http.post(`${this.base}/backups/upload`, formData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    })
  }

  // schedules
  getSchedules() {
    return this.http.get<any[]>(`${this.base}/schedules`, this.getHeaders())
  }

  createSchedule(data: any) {
    return this.http.post(`${this.base}/schedules`, data, this.getHeaders())
  }

  deleteSchedule(id: number) {
    return this.http.delete(`${this.base}/schedules/${id}`, this.getHeaders())
  }

  // logs
  getLogs() {
    return this.http.get<any[]>(`${this.base}/logs`, this.getHeaders())
  }
}