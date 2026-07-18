import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import postsRoutes from './routes/posts.js'
import mongoose from 'mongoose'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('tiny'))

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/auth', authRoutes)
app.use('/posts', postsRoutes)

if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist')
  app.use(express.static(frontendDist))
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

const PORT = process.env.PORT || 4000

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((err) => console.error('Mongo connection error', err))
} else {
  console.warn('Warning: MONGODB_URI is not set. MongoDB connection is disabled.')
}

app.listen(PORT, () => {
  console.log('Server running on port', PORT)
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Change PORT in .env or stop the existing process.`)
  } else {
    console.error('Server error:', err)
  }
  process.exit(1)
})
