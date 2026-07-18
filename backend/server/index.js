import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const app = express();

// ===============================
// Middleware
// ===============================
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

// ===============================
// Health Check
// ===============================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running'
  });
});

// ===============================
// API Routes
// ===============================
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);

// ===============================
// Serve Frontend (Production)
// ===============================
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.resolve(__dirname, '../../frontend/dist');

  // Serve static frontend files
  app.use(express.static(frontendDist));

  // React/Vite SPA fallback
  app.use((req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// ===============================
// MongoDB Connection
// ===============================
const PORT = process.env.PORT || 4000;

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
      console.error('❌ MongoDB Connection Error:', err);
    });
} else {
  console.warn('⚠️ MONGODB_URI is not set.');
}

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
  } else {
    console.error('❌ Server Error:', err);
  }
  process.exit(1);
});