const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Test routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Safebase API is running' })
})
// app.get('/hello', (req, res) => {
//   res.json({ status: 'ok', message: 'hello' })
// })

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


app.use('/api/databases', require('./routes/databases'))
app.use('/api/backups', require('./routes/backups'))
app.use('/api/logs', require('./routes/logs'))
app.use('/api/schedules', require('./routes/schedules'))
const { loadSchedules } = require('./scheduler')
const migrate = require('./db/migrate')

app.listen(PORT, async() => {
    
  console.log(`Safebase API running on http://localhost:${PORT}`)
  // after your middleware setup
  await migrate().catch(console.error)
  await loadSchedules().catch(console.error)
})

