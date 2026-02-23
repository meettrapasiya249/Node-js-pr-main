const crypto = require('crypto')

const store = new Map()

function createToken(adminId, ttlSeconds = 60) {
  const token = crypto.randomBytes(24).toString('hex')
  const expires = Date.now() + ttlSeconds * 1000
  store.set(token, { adminId, expires })
  return token
}

function consumeToken(token) {
  const data = store.get(token)
  if (!data) return null
  if (data.expires < Date.now()) {
    store.delete(token)
    return null
  }
  store.delete(token)
  return data.adminId
}

module.exports = { createToken, consumeToken }
