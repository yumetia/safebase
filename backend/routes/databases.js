const express = require('express')
const router = express.Router()
const mysql = require('../db/mysql')

// GET 
router.get('/', async (req, res) => {
  const [rows] = await mysql.query('SELECT id, name, type, host, port, db_name, username, created_at FROM `database`')
  res.json(rows)
})

// POST 
router.post('/', async (req, res) => {
  const { name, type, host, port, db_name, username, password } = req.body
  const [result] = await mysql.query(
    'INSERT INTO `database` (name, type, host, port, db_name, username, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, type, host, port, db_name, username, password]
  )
  res.json({ id: result.insertId, message: 'Database registered' })
})

// DELETE 
router.delete('/:id', async (req, res) => {
  await mysql.query('DELETE FROM `database` WHERE id = ?', [req.params.id])
  res.json({ message: 'Database deleted' })
})

module.exports = router