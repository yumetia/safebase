const express = require('express')
const router = express.Router()
const mysqlPool = require('../db/mysql')

router.get('/', async (req, res) => {
  const [rows] = await mysqlPool.query(
    `SELECT s.id, s.cron_expression, s.is_active, s.next_run_at, s.created_at,
     d.name as database_name, d.id as database_id
     FROM schedule s
     JOIN \`database\` d ON s.database_id = d.id
     ORDER BY s.created_at DESC`
  )
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { database_id, cron_expression } = req.body

  const [db] = await mysqlPool.query(
    'SELECT * FROM `database` WHERE id = ?',
    [database_id]
  )
  if (db.length === 0) return res.status(404).json({ message: 'Database not found' })

  const [result] = await mysqlPool.query(
    'INSERT INTO schedule (database_id, cron_expression, is_active) VALUES (?, ?, ?)',
    [database_id, cron_expression, true]
  )

  res.json({ id: result.insertId, message: 'Schedule created' })
})

router.delete('/:id', async (req, res) => {
  await mysqlPool.query(
    'DELETE FROM schedule WHERE id = ?',
    [req.params.id]
  )
  res.json({ message: 'Schedule deleted' })
})

module.exports = router
