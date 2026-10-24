const express = require('express')
const router = express.Router()
const mysqlPool = require('../db/mysql')

router.get('/', async (req, res) => {
  const [rows] = await mysqlPool.query(
    `SELECT l.id, l.action, l.level, l.message, l.created_at,
     b.file_path, d.name as database_name
     FROM log l
     JOIN backup b ON l.backup_id = b.id
     JOIN \`database\` d ON b.database_id = d.id
     ORDER BY l.created_at DESC`
  )
  res.json(rows)
})

module.exports = router
