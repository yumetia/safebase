const express = require('express')
const router = express.Router()
const mysql = require('../db/mysql')

router.get('/', async (req, res) => {
  const [rows] = await mysql.query(
    'SELECT id, name, type, host, port, db_name, username, created_at FROM `database`'
  )
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const [rows] = await mysql.query(
    'SELECT id, name, type, host, port, db_name, username, password, created_at FROM `database` WHERE id = ?',
    [req.params.id]
  )
  if (rows.length === 0) return res.status(404).json({ message: 'Database not found' })
  res.json(rows[0])
})

router.post('/', async (req, res) => {
  const { name, type, host, port, db_name, username, password } = req.body
  const [result] = await mysql.query(
    'INSERT INTO `database` (name, type, host, port, db_name, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, type, host, port, db_name, username, password]
  )
  res.json({ id: result.insertId, message: 'Database registered' })
})

router.delete('/:id', async (req, res) => {
  await mysql.query('DELETE FROM `database` WHERE id = ?', [req.params.id])
  res.json({ message: 'Database deleted' })
})

module.exports = router