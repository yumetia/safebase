const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Safebase API is running' })
})
app.get('/hello', (req, res) => {
  res.json({ status: 'ok', message: 'hello' })
})

const mysqlPool = require('./db/mysql')
const pgPool = require('./db/postgres')

// test mysql
mysqlPool.getConnection()
  .then(() => console.log('MySQL connected'))
  .catch(err => console.error('MySQL error:', err.message))

// test postgres
pgPool.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('PostgreSQL error:', err.message))

// Routes (we'll add them here later)
// app.use('/api/databases', require('./routes/databases'))
// app.use('/api/backups', require('./routes/backups'))
// app.use('/api/schedules', require('./routes/schedules'))
// app.use('/api/logs', require('./routes/logs'))

app.listen(PORT, () => {
  console.log(`Safebase API running on http://localhost:${PORT}`)
  const migrate = require('./db/migrate')
  
  // after your middleware setup
  migrate().catch(console.error)
})

