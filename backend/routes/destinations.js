const express = require('express')
const router = express.Router()
const mysqlPool = require('../db/mysql')

// GET /api/destinations
router.get('/', async (req, res) => {
  const [rows] = await mysqlPool.query(
    'SELECT id, name, type, host, port, username, remote_path, created_at FROM destination WHERE user_id = ?',
    [req.user.id]
  )
  res.json(rows)
})

// POST /api/destinations
router.post('/', async (req, res) => {
  const { name, type, host, port, username, key_path, remote_path } = req.body
  const [result] = await mysqlPool.query(
    'INSERT INTO destination (user_id, name, type, host, port, username, key_path, remote_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, name, type || 'ssh', host, port || 22, username, key_path, remote_path || '/tmp/safebase-backups']
  )
  res.json({ id: result.insertId, message: 'Destination created' })
})

// DELETE /api/destinations/:id
router.delete('/:id', async (req, res) => {
  const [rows] = await mysqlPool.query(
    'SELECT id FROM destination WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]
  )
  if (rows.length === 0) return res.status(403).json({ message: 'Not allowed' })
  await mysqlPool.query('DELETE FROM destination WHERE id = ?', [req.params.id])
  res.json({ message: 'Destination deleted' })
})

module.exports = router
