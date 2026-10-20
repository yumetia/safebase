const express = require('express')
const router = express.Router()
const mysql = require('../db/mysql')
const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const BACKUP_DIR = '/app/backups'

router.post('/', async (req, res) => {
  const { database_id } = req.body

  // 1. fetch connection info
  const [rows] = await mysql.query(
    'SELECT * FROM `database` WHERE id = ?',
    [database_id]
  )
  if (rows.length === 0) return res.status(404).json({ message: 'Database not found' })

  const db = rows[0]
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${db.name}_${timestamp}.sql`
  const filepath = path.join(BACKUP_DIR, filename)

  // 2. make sure backup folder exists
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true })

  try {
   if (db.type === 'mysql') {
        execSync(
            `docker exec safebase_mysql mysqldump -u ${db.username} -p${db.password} ${db.db_name} > ${filepath}`
        )
    }
    else if (db.type === 'postgres') {
      execSync(
        `PGPASSWORD=${db.password} pg_dump -h ${db.host} -p ${db.port} -U ${db.username} ${db.db_name} > ${filepath}`
      )
    }


    // 5. save record in backup table
    const [result] = await mysql.query(
      'INSERT INTO backup (database_id, file_path, status, triggered_by) VALUES (?, ?, ?, ?)',
      [database_id, filepath, 'success', 'manual']
    )

    // 6. save log
    await mysql.query(
      'INSERT INTO log (backup_id, action, level, message) VALUES (?, ?, ?, ?)',
      [result.insertId, 'backup', 'info', `Backup created: ${filename}`]
    )

    res.json({ message: 'Backup successful', file: filename })

  } catch (err) {
    // save failed log
    await mysql.query(
      'INSERT INTO backup (database_id, file_path, status, triggered_by) VALUES (?,  ?, ?, ?)',
      [database_id, filepath, 'failed', 'manual']
    )
    res.status(500).json({ message: 'Backup failed', error: err.message })
  }
})

router.get('/', async (req, res) => {
  const [rows] = await mysql.query(
    'SELECT b.id, b.file_path, b.status, b.triggered_by, b.created_at, d.name as database_name FROM backup b JOIN `database` d ON b.database_id = d.id'
  )
  res.json(rows)
})

module.exports = router
