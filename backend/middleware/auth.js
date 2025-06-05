const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

module.exports = function (req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Нет токена' })
  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: 'Неверный токен' })
  }
} 