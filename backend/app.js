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

// Routes (we'll add them here later)
// app.use('/api/databases', require('./routes/databases'))
// app.use('/api/backups', require('./routes/backups'))
// app.use('/api/schedules', require('./routes/schedules'))
// app.use('/api/logs', require('./routes/logs'))

app.listen(PORT, () => {
  console.log(`Safebase API running on http://localhost:${PORT}`)
})
