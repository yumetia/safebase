export type Page = 'dashboard' | 'backups' | 'schedules' | 'restore' 
export type BackupStatus = 'success' | 'running' | 'failed' | 'pending' | 'warning'
export type BackupType = 'full' | 'incremental' | 'differential'

export interface BackupJob {
  id: string
  database: string
  type: BackupType
  size: string
  duration: string
  status: BackupStatus
  timestamp: string
  retention: string
  location: string
}

export interface Schedule {
  id: string
  name: string
  database: string
  type: BackupType
  frequency: string
  cronExpr: string
  retention: string
  lastRun: string
  nextRun: string
  enabled: boolean
  successRate: number
}
