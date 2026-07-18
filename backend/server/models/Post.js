import mongoose from 'mongoose'

const mediaSchema = new mongoose.Schema({
  url: String,
  type: String,
  size: Number,
})

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  media: { type: [mediaSchema], default: [] },
  platforms: { type: [String], default: [] },
  schedule: Date,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'draft' },
}, { timestamps: true })

postSchema.index({ title: 'text', description: 'text' })

export default mongoose.model('Post', postSchema)
