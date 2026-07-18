import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const secret = process.env.JWT_SECRET || 'dev_secret'

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Missing auth token' })
  }

  try {
    const payload = jwt.verify(token, secret)
    const user = await User.findById(payload.id).select('-passwordHash').lean()
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const authorize = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (allowedRoles.includes(req.user.role) || (req.user.roles && req.user.roles.some((role) => allowedRoles.includes(role)))) {
    return next()
  }

  return res.status(403).json({ message: 'Forbidden: insufficient permissions' })
}
