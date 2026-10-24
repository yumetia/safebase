const cron = require('node-cron')
const mysqlPool = require('./db/mysql')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const BACKUP_DIR = '/app/backups'
const activeTasks = {}

const runBackup = async (schedule) => {
  const [rows] = await mysqlPool.query(
    'SELECT * FROM `database` WHERE id = ?',
    [schedule.database_id]
  )
  if (rows.length === 0) return

  const db = rows[0]
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${db.name}_${timestamp}.sql`
  const filepath = path.join(BACKUP_DIR, filename)

  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true })

  try {
    if (db.type === 'mysql') {
      execSync(
        `docker exec safebase_mysql mysqldump -u ${db.username} -p${db.password} ${db.db_name} > ${filepath}`
      )
    } else if (db.type === 'postgres') {
      execSync(
        `PGPASSWORD=${db.password} pg_dump -h ${db.host} -p ${db.port} -U ${db.username} ${db.db_name} > ${filepath}`
      )
    }

    const [result] = await mysqlPool.query(
      'INSERT INTO backup (database_id, file_path, status, triggered_by) VALUES (?, ?, ?, ?)',
      [schedule.database_id, filepath, 'success', 'schedule']
    )

    await mysqlPool.query(
      'INSERT INTO log (backup_id, action, level, message) VALUES (?, ?, ?, ?)',
      [result.insertId, 'backup', 'info', `Scheduled backup created: ${filename}`]
    )

    await mysqlPool.query(
      'UPDATE schedule SET next_run_at = ? WHERE id = ?',
      [new Date(), schedule.id]
    )

    console.log(`Scheduled backup done: ${filename}`)

  } catch (err) {
    await mysqlPool.query(
      'INSERT INTO backup (database_id, file_path, status, triggered_by) VALUES (?, ?, ?, ?)',
      [schedule.database_id, filepath, 'failed', 'schedule']
    )
    console.error(`Scheduled backup failed: ${err.message}`)
  }
}

const loadSchedules = async () => {
  const [schedules] = await mysqlPool.query(
    'SELECT * FROM schedule WHERE is_active = true'
  )

  schedules.forEach(schedule => {
    if (activeTasks[schedule.id]) {
      activeTasks[schedule.id].stop()
    }

    activeTasks[schedule.id] = cron.schedule(schedule.cron_expression, () => {
      runBackup(schedule)
    })

    console.log(`Scheduled job registered: schedule #${schedule.id} → ${schedule.cron_expression}`)
  })
}

module.exports = { loadSchedules }
