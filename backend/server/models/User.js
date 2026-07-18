import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['user'] },
  resetToken: String,
  resetTokenExpiry: Date,
}, { timestamps: true })

export default mongoose.model('User', userSchema)
