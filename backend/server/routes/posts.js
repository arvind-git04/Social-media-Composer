import express from 'express'
import Post from '../models/Post.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = express.Router()
const allowedPlatforms = ['fb', 'ig', 'x', 'reddit', 'quora', 'pinterest']
const PLATFORM_ALIASES = {
  pentriest: 'pinterest',
}

const validateMedia = (media = []) => {
  const errors = []

  media.forEach((item) => {
    if (!item?.type) {
      return
    }

    if (item.type.startsWith('image/')) {
      if (item.size < 1024 * 1024 || item.size > 2 * 1024 * 1024) {
        errors.push('Images must be between 1MB and 2MB.')
      }
    }

    if (item.type.startsWith('video/')) {
      if (item.size < 4 * 1024 * 1024 || item.size > 5 * 1024 * 1024) {
        errors.push('Videos must be between 4MB and 5MB.')
      }
    }
  })

  return errors
}

const normalizePostPayload = (body) => {
  const platforms = Array.isArray(body.platforms) ? body.platforms : []
  const normalizedPlatforms = platforms.reduce((acc, platform) => {
    const normalizedPlatform = PLATFORM_ALIASES[platform] || platform
    if (allowedPlatforms.includes(normalizedPlatform) && !acc.includes(normalizedPlatform)) {
      acc.push(normalizedPlatform)
    }
    return acc
  }, [])
  const invalidPlatforms = platforms.filter((platform) => !allowedPlatforms.includes(PLATFORM_ALIASES[platform] || platform))
  const media = Array.isArray(body.media) ? body.media : []
  const errors = []

  if (!body.title || !body.title.trim()) {
    errors.push('Title is required.')
  }

  if (!normalizedPlatforms.length) {
    errors.push('Select at least one platform.')
  }

  if (invalidPlatforms.length) {
    errors.push('Unsupported platform selected.')
  }

  errors.push(...validateMedia(media))

  return {
    data: {
      title: body.title?.trim(),
      description: body.description?.trim() || '',
      platforms: normalizedPlatforms,
      media,
      schedule: body.schedule ? new Date(body.schedule) : null,
    },
    errors,
  }
}

router.get('/', authenticate, async (req, res) => {
  const posts = await Post.find({ author: req.user._id }).limit(50).lean()
  res.json({ posts })
})

router.post('/', authenticate, async (req, res) => {
  const { data, errors } = normalizePostPayload(req.body)

  if (errors.length) {
    return res.status(400).json({ message: errors[0] })
  }

  const post = await Post.create({ ...data, author: req.user._id })
  res.status(201).json({ post })
})

router.put('/:id', authenticate, async (req, res) => {
  const { data, errors } = normalizePostPayload(req.body)

  if (errors.length) {
    return res.status(400).json({ message: errors[0] })
  }

  const post = await Post.findOneAndUpdate(
    { _id: req.params.id, author: req.user._id },
    data,
    { new: true },
  )
  if (!post) {
    return res.status(404).json({ message: 'Post not found or unauthorized' })
  }
  res.json({ post })
})

router.delete('/:id', authenticate, async (req, res) => {
  const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id })
  if (!post) {
    return res.status(404).json({ message: 'Post not found or unauthorized' })
  }
  res.json({ ok: true })
})

// Admin-only endpoint to view all posts
router.get('/admin/all', authenticate, authorize(['admin']), async (req, res) => {
  const posts = await Post.find().lean()
  res.json({ posts })
})

export default router
