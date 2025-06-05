const users = []
const urls = []
let userId = 1
let urlId = 1

function getUserByEmail(email) {
  return users.find(u => u.email === email)
}
function getUserById(id) {
  return users.find(u => u.id === id)
}
function addUser({ email, password, name }) {
  const user = { id: userId++, email, password, name }
  users.push(user)
  return user
}
function updateUser(id, { name, password }) {
  const user = getUserById(id)
  if (!user) return null
  if (name) user.name = name
  if (password) user.password = password
  return user
}
function addUrl({ userId, fullUrl, shortUrl }) {
  const url = { id: String(urlId++), userId, fullUrl, shortUrl }
  urls.push(url)
  return url
}
function getUrlsByUser(userId) {
  return urls.filter(u => u.userId === userId)
}
function deleteUrlById(userId, id) {
  const idx = urls.findIndex(u => u.id === id && u.userId === userId)
  if (idx === -1) return false
  urls.splice(idx, 1)
  return true
}

module.exports = {
  users,
  urls,
  getUserByEmail,
  getUserById,
  addUser,
  updateUser,
  addUrl,
  getUrlsByUser,
  deleteUrlById
} 