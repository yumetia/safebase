const path = require('path')
const express = require('express')
const router = express.Router()
const mysqlPool = require('../db/mysql')
const { execSync } = require('child_process')
const fs = require('fs')
const multer = require('multer')

const BACKUP_DIR = '/app/backups'

const storage = multer.diskStorage({
  destination: BACKUP_DIR,
  filename: (req, file, cb) => cb(null, file.originalname)
})
const upload = multer({ storage })

// GET /api/backups
router.get('/', async (req, res) => {
  const [rows] = await mysqlPool.query(
    `SELECT b.id, b.file_path, b.status, b.triggered_by, b.created_at,
            d.name as database_name, dest.name as destination_name
     FROM backup b
     JOIN \`database\` d ON b.database_id = d.id
     LEFT JOIN destination dest ON b.destination_id = dest.id
     WHERE d.user_id = ?`,
    [req.user.id]
  )
  res.json(rows)
})

// GET /api/backups/download/:id
router.get('/download/:id', async (req, res) => {
  const [backups] = await mysqlPool.query(
    `SELECT b.* FROM backup b
     JOIN \`database\` d ON b.database_id = d.id
     WHERE b.id = ? AND d.user_id = ?`,
    [req.params.id, req.user.id]
  )
  if (backups.length === 0) return res.status(404).json({ message: 'Backup not found' })

  const backup = backups[0]
  if (!fs.existsSync(backup.file_path)) return res.status(404).json({ message: 'File not found on disk' })

  res.download(backup.file_path, path.basename(backup.file_path))
})

// POST /api/backups/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

  const { database_id } = req.body
  const filepath = path.join(BACKUP_DIR, req.file.originalname)

  const [result] = await mysqlPool.query(
    'INSERT INTO backup (database_id, file_path, status, triggered_by) VALUES (?, ?, ?, ?)',
    [database_id, filepath, 'success', 'manual']
  )

  await mysqlPool.query(
    'INSERT INTO log (backup_id, action, level, message) VALUES (?, ?, ?, ?)',
    [result.insertId, 'backup', 'info', `Uploaded backup: ${req.file.originalname}`]
  )

  res.json({ message: 'File uploaded', file: req.file.originalname })
})

// POST /api/backups — trigger backup
router.post('/', async (req, res) => {
  const { database_id, destination_id } = req.body

  const [rows] = await mysqlPool.query(
    'SELECT * FROM `database` WHERE id = ? AND user_id = ?',
    [database_id, req.user.id]
  )
  if (rows.length === 0) return res.status(404).json({ message: 'Database not found' })

  const db = rows[0]
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `${db.name}_${timestamp}.sql`
  const filepath = path.join(BACKUP_DIR, filename)

  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true })

  // Load destination if provided
  let dest = null
  if (destination_id) {
    const [destRows] = await mysqlPool.query(
      'SELECT * FROM destination WHERE id = ? AND user_id = ?',
      [destination_id, req.user.id]
    )
    if (destRows.length > 0) dest = destRows[0]
  }

  try {
    // 1. Dump locally
    if (db.type === 'mysql') {
      execSync(`docker exec safebase_mysql mysqldump -u ${db.username} -p${db.password} ${db.db_name} > ${filepath}`)
    } else if (db.type === 'postgres') {
      execSync(`PGPASSWORD=${db.password} pg_dump -h ${db.host} -p ${db.port} -U ${db.username} ${db.db_name} > ${filepath}`)
    }

    // 2. SCP to SSH destination if selected
    if (dest && dest.type === 'ssh') {
      const scpCmd = `scp -i ${dest.key_path} -P ${dest.port} -o StrictHostKeyChecking=no ${filepath} ${dest.username}@${dest.host}:${dest.remote_path}/${filename}`
      execSync(scpCmd)
    }

    const [result] = await mysqlPool.query(
      'INSERT INTO backup (database_id, destination_id, file_path, status, triggered_by) VALUES (?, ?, ?, ?, ?)',
      [database_id, destination_id || null, filepath, 'success', 'manual']
    )

    const logMsg = dest && dest.type === 'ssh'
      ? `Backup created and sent to ${dest.host}:${dest.remote_path}/${filename}`
      : `Backup created: ${filename}`

    await mysqlPool.query(
      'INSERT INTO log (backup_id, action, level, message) VALUES (?, ?, ?, ?)',
      [result.insertId, 'backup', 'info', logMsg]
    )

    res.json({ message: 'Backup successful', file: filename, destination: dest ? dest.name : 'local' })

  } catch (err) {
    await mysqlPool.query(
      'INSERT INTO backup (database_id, destination_id, file_path, status, triggered_by) VALUES (?, ?, ?, ?, ?)',
      [database_id, destination_id || null, filepath, 'failed', 'manual']
    )
    res.status(500).json({ message: 'Backup failed', error: err.message })
  }
})

// POST /api/backups/restore/:id
router.post('/restore/:id', async (req, res) => {
  const [backups] = await mysqlPool.query(
    `SELECT b.* FROM backup b
     JOIN \`database\` d ON b.database_id = d.id
     WHERE b.id = ? AND d.user_id = ?`,
    [req.params.id, req.user.id]
  )
  if (backups.length === 0) return res.status(404).json({ message: 'Backup not found' })

  const backup = backups[0]

  const [databases] = await mysqlPool.query(
    'SELECT * FROM `database` WHERE id = ?',
    [backup.database_id]
  )
  if (databases.length === 0) return res.status(404).json({ message: 'Database not found' })

  const db = databases[0]

  if (!fs.existsSync(backup.file_path)) return res.status(404).json({ message: 'File not found on disk' })

  try {
    await mysqlPool.query(
      'INSERT INTO log (backup_id, action, level, message) VALUES (?, ?, ?, ?)',
      [backup.id, 'restore', 'info', `Restore started from: ${backup.file_path}`]
    )

    if (db.type === 'mysql') {
      execSync(`docker exec -i safebase_mysql mysql -u ${db.username} -p${db.password} ${db.db_name}`, {
        input: fs.readFileSync(backup.file_path)
      })
    } else if (db.type === 'postgres') {
      execSync(`PGPASSWORD=${db.password} psql -h ${db.host} -p ${db.port} -U ${db.username} ${db.db_name}`, {
        input: fs.readFileSync(backup.file_path)
      })
    }

    res.json({ message: 'Restore successful' })

  } catch (err) {
    res.status(500).json({ message: 'Restore failed', error: err.message })
  }
})

module.exports = router