const express = require('express')
const router = express.Router()
const mysqlPool = require('../db/mysql')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const BACKUP_DIR = '/app/backups'

// POST /api/backups — trigger a backup
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
      [database_id, filepath, 'success', 'manual']
    )

    await mysqlPool.query(
      'INSERT INTO log (backup_id, action, level, message) VALUES (?, ?, ?, ?)',
      [result.insertId, 'backup', 'info', `Backup created: ${filename}`]
    )

    res.json({ message: 'Backup successful', file: filename })

  } catch (err) {
    await mysqlPool.query(
      'INSERT INTO backup (database_id, file_path, status, triggered_by) VALUES (?, ?, ?, ?)',
      [database_id, filepath, 'failed', 'manual']
    )
    res.status(500).json({ message: 'Backup failed', error: err.message })
  }
})

// GET /api/backups — list all backups
router.get('/', async (req, res) => {
  const [rows] = await mysqlPool.query(
    'SELECT b.id, b.file_path, b.status, b.triggered_by, b.created_at, d.name as database_name FROM backup b JOIN `database` d ON b.database_id = d.id'
  )
  res.json(rows)
})

// POST /api/backups/restore/:id — restore a backup
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
    // save log BEFORE restore so it survives if safebase itself is restored
    await mysqlPool.query(
      'INSERT INTO log (backup_id, action, level, message) VALUES (?, ?, ?, ?)',
      [backup.id, 'restore', 'info', `Restore started from: ${backup.file_path}`]
    )

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

module.exports = router
