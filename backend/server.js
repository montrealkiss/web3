require('dotenv').config()
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { users, urls, getUserByEmail, getUserById, addUser, addUrl, getUrlsByUser, deleteUrlById, updateUser } = require('./db')
const auth = require('./middleware/auth')

const app = express()
app.use(cors())
app.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password || !name) return res.status(400).json({ error: 'Все поля обязательны' })
  if (getUserByEmail(email)) return res.status(409).json({ error: 'Email уже используется' })
  const hash = await bcrypt.hash(password, 10)
  const user = addUser({ email, password: hash, name })
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const user = getUserByEmail(email)
  if (!user) return res.status(401).json({ error: 'Неверный email или пароль' })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Неверный email или пароль' })
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

app.get('/api/user', auth, (req, res) => {
  const user = getUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' })
  res.json({ id: user.id, email: user.email, name: user.name })
})

app.put('/api/user', auth, async (req, res) => {
  const { name, password } = req.body
  const user = getUserById(req.user.id)
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' })
  let hash = undefined
  if (password) hash = await bcrypt.hash(password, 10)
  const updated = updateUser(user.id, { name, password: hash })
  res.json({ id: updated.id, email: updated.email, name: updated.name })
})

app.get('/api/urls', auth, (req, res) => {
  res.json(getUrlsByUser(req.user.id))
})

app.post('/api/urls', auth, (req, res) => {
  const { fullUrl } = req.body
  if (!fullUrl) return res.status(400).json({ error: 'URL обязателен' })
  const shortUrl = 'https://cutt.ly/' + Math.random().toString(36).substring(2, 8)
  const url = addUrl({ userId: req.user.id, fullUrl, shortUrl })
  res.json(url)
})

app.delete('/api/urls/:id', auth, (req, res) => {
  const ok = deleteUrlById(req.user.id, req.params.id)
  if (!ok) return res.status(404).json({ error: 'Ссылка не найдена' })
  res.json({ success: true })
})

app.put('/api/urls/:id', auth, (req, res) => {
  const { fullUrl } = req.body
  if (!fullUrl) return res.status(400).json({ error: 'URL обязателен' })
  const ok = updateUrl(req.user.id, req.params.id, { fullUrl })
  if (!ok) return res.status(404).json({ error: 'Ссылка не найдена' })
  res.json({ success: true })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('Server started on port', PORT)) 