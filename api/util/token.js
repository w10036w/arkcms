const jwt  = require('jsonwebtoken')
const { secret, expiresIn } = resolve('conf')

//refer to https://github.com/auth0/node-jsonwebtoken
//https://www.npmjs.com/package/jsonwebtoken

module.exports = {
  getToken: (ctx) => ctx.headers.authorization,
  encode (user) {
    return jwt.sign(user, secret, { expiresIn })
  },

  verify (token) {
    if (!token) return false
    try {
      return jwt.verify(token, secret);
    } catch (err) { return false }
  },

  decode (token, complete=true) {
    if (!token) return false
    try {
      return jwt.decode(token, { complete })
    } catch (err) { return false }
  },

  bPermitted (token, role='admin') {
    if (!token) return false
    try {
      return jwt.verify(token, secret)
        && jwt.decode(token).payload.role === role
    } catch (err) { return false }
  }
}
