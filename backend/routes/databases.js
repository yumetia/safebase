const express = require('express')
const router = express.Router()
const mysqlPool = require('../db/mysql')

router.get('/', async (req, res) => {
  const [rows] = await mysqlPool.query(
    'SELECT id, name, type, host, port, db_name, username, created_at FROM `database` WHERE user_id = ?',
    [req.user.id]
  )
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const [rows] = await mysqlPool.query(
    'SELECT * FROM `database` WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  )
  if (rows.length === 0) return res.status(404).json({ message: 'Database not found' })
  res.json(rows[0])
})

router.post('/', async (req, res) => {
  const { name, type, host, port, db_name, username, password } = req.body
  const [result] = await mysqlPool.query(
    'INSERT INTO `database` (user_id, name, type, host, port, db_name, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, name, type, host, port, db_name, username, password]
  )
  res.json({ id: result.insertId, message: 'Database registered' })
})

router.delete('/:id', async (req, res) => {
  const [rows] = await mysqlPool.query(
    'SELECT * FROM `database` WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  )
  if (rows.length === 0) return res.status(403).json({ message: 'Not allowed' })

  // get all backups for this database
  const [backups] = await mysqlPool.query(
    'SELECT id FROM backup WHERE database_id = ?',
    [req.params.id]
  )

  // delete logs for each backup
  for (const backup of backups) {
    await mysqlPool.query('DELETE FROM log WHERE backup_id = ?', [backup.id])
  }

  // delete schedules
  await mysqlPool.query('DELETE FROM schedule WHERE database_id = ?', [req.params.id])

  // delete backups
  await mysqlPool.query('DELETE FROM backup WHERE database_id = ?', [req.params.id])

  // delete database
  await mysqlPool.query('DELETE FROM `database` WHERE id = ?', [req.params.id])

  res.json({ message: 'Database deleted' })
})

module.exports = router