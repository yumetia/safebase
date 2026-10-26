const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mysqlPool = require('../db/mysql')

const SECRET = process.env.JWT_SECRET || 'safebase_secret'

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password } = req.body

  const [existing] = await mysqlPool.query(
    'SELECT id FROM user WHERE email = ?',
    [email]
  )
  if (existing.length > 0) return res.status(400).json({ message: 'Email already exists' })

  const hashed = await bcrypt.hash(password, 10)

  const [result] = await mysqlPool.query(
    'INSERT INTO user (email, password) VALUES (?, ?)',
    [email, hashed]
  )

  const token = jwt.sign({ id: result.insertId, email }, SECRET, { expiresIn: '90d' })

  res.json({ token, message: 'Account created' })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const [rows] = await mysqlPool.query(
    'SELECT * FROM user WHERE email = ?',
    [email]
  )
  if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' })

  const user = rows[0]
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '90d' })

  res.json({ token, message: 'Login successful' })
})

module.exports = router

