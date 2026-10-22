const express = require('express')
const router = express.Router()
const mysqlPool = require('../db/mysql')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const BACKUP_DIR = '/app/backups'

router.post('/', async (req, res) => {
  const { database_id } = req.body

  const [rows] = await mysqlPool.query(
    'SELECT * FROM `database` WHERE id = ?',
    [database_id]
  )
  if (rows.length === 0) return res.status(404).json({ message: 'Database not found' })

  const db = rows[0]
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${db.name}_${timestamp}.sql`
  const filepath = path.join(BACKUP_DIR, filename)

    if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true })

    try {
    // save log BEFORE running restore
    await mysqlPool.query(
        'INSERT INTO log (backup_id, action, level, message) VALUES (?, ?, ?, ?)',
        [backup.id, 'restore', 'info', `Restore started from: ${backup.file_path}`]
    )

    // then run restore
    if (db.type === 'mysql') {
        execSync(
        `docker exec -i safebase_mysql mysql -u ${db.username} -p${db.password} ${db.db_name}`,
        { input: fs.readFileSync(backup.file_path) }
        )
    } else if (db.type === 'postgres') {
        execSync(
        `PGPASSWORD=${db.password} psql -h ${db.host} -p ${db.port} -U ${db.username} ${db.db_name}`,
        { input: fs.readFileSync(backup.file_path) }
        )
    }

    res.json({ message: 'Restore successful' })

    } catch (err) {
        res.status(500).json({ message: 'Restore failed', error: err.message })
    }
})

router.get('/', async (req, res) => {
  const [rows] = await mysqlPool.query(
    'SELECT b.id, b.file_path, b.status, b.triggered_by, b.created_at, d.name as database_name FROM backup b JOIN `database` d ON b.database_id = d.id'
  )
  res.json(rows)
})

router.post('/restore/:id', async (req, res) => {
  const [backups] = await mysqlPool.query(
    'SELECT * FROM backup WHERE id = ?',
    [req.params.id]
  )
  if (backups.length === 0) return res.status(404).json({ message: 'Backup not found' })

  const backup = backups[0]

  const [databases] = await mysqlPool.query(
    'SELECT * FROM `database` WHERE id = ?',
    [backup.database_id]
  )
  if (databases.length === 0) return res.status(404).json({ message: 'Database not found' })

  const db = databases[0]

  try {
    if (db.type === 'mysql') {
      execSync(
        `docker exec -i safebase_mysql mysql -u ${db.username} -p${db.password} ${db.db_name}`,
        { input: fs.readFileSync(backup.file_path) }
      )
    } else if (db.type === 'postgres') {
      execSync(
        `PGPASSWORD=${db.password} psql -h ${db.host} -p ${db.port} -U ${db.username} ${db.db_name}`,
        { input: fs.readFileSync(backup.file_path) }
      )
    }

    const backupId = backup.id
    const dbRecord = databases[0]

    // then after restore:
    await mysqlPool.query(
    'INSERT INTO log (backup_id, action, level, message) VALUES (?, ?, ?, ?)',
    [backupId, 'restore', 'info', `Restore completed from: ${backup.file_path}`]
    )

    res.json({ message: 'Restore successful' })

  } catch (err) {
    await mysqlPool.query(
      'INSERT INTO log (backup_id, action, level, message) VALUES (?, ?, ?, ?)',
      [backup.id, 'restore', 'error', `Restore failed: ${err.message}`]
    )
    res.status(500).json({ message: 'Restore failed', error: err.message })
  }
})

module.exports = router
