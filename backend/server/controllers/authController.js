import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const secret = process.env.JWT_SECRET || 'dev_secret'

export const signup = async (req, res) => {
  const { name, email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }
  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash, roles: ['user'] })
  const token = jwt.sign({ id: user._id, email: user.email, roles: user.roles }, secret, { expiresIn: '7d' })

  res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, roles: user.roles } })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign({ id: user._id, email: user.email, roles: user.roles }, secret, { expiresIn: '7d' })
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, roles: user.roles } })
}
