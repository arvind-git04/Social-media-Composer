export const platforms = {
  fb: {
    name: 'Facebook',
    maxChars: 63206,
    hint: 'Best for longer updates and community engagement.',
    maxHashtags: 10,
  },
  ig: {
    name: 'Instagram',
    maxChars: 2200,
    hint: 'Visual-first posts with media recommended and up to 30 hashtags.',
    maxHashtags: 30,
  },
  x: {
    name: 'X',
    maxChars: 280,
    hint: 'Short and timely updates with a maximum of 4 hashtags.',
    maxHashtags: 4,
  },
  reddit: {
    name: 'Reddit',
    maxChars: 10000,
    hint: 'Long-form discussion posts should stay informative and relevant.',
    maxHashtags: 5,
  },
  quora: {
    name: 'Quora',
    maxChars: 1000,
    hint: 'Answer-style posts should stay clear and concise.',
    maxHashtags: 3,
  },
  pinterest: {
    name: 'Pinterest',
    maxChars: 500,
    hint: 'Visual pin descriptions should be short and descriptive.',
    maxHashtags: 5,
  },
}

const PLATFORM_ALIASES = {
  pentriest: 'pinterest',
}

export function normalizeSelectedPlatforms(selectedPlatforms = []) {
  return selectedPlatforms.reduce((acc, platformId) => {
    const normalizedId = PLATFORM_ALIASES[platformId] || platformId
    if (platforms[normalizedId] && !acc.includes(normalizedId)) {
      acc.push(normalizedId)
    }
    return acc
  }, [])
}

export function countHashtags(text) {
  return (text.match(/#[\w\u00C0-\u017F]+/g) || []).length
}

export function validateMediaFile(file) {
  if (!file) {
    return null
  }

  if (file.type.startsWith('image/')) {
    if (file.size < 1024 * 1024 || file.size > 10 * 1024 * 1024) {
      return 'Image size must be between 1MB and 10MB.'
    }
    return null
  }

  if (file.type.startsWith('video/')) {
    if (file.size < 4 * 1024 * 1024 || file.size > 5 * 1024 * 1024) {
      return 'Video size must be between 4MB and 5MB.'
    }
    return null
  }

  return 'Please upload an image or video file.'
}

export function validateContent(content, selected, mediaEnabled) {
  const trimmed = content.trim()
  const hashtags = countHashtags(content)
  const results = selected.map((key) => {
    const config = platforms[key]
    const errors = []
    const warnings = []

    if (!trimmed) {
      errors.push('Message cannot be empty.')
      return { platform: config.name, errors, warnings, length: 0 }
    }

    if (content.length > config.maxChars) {
      errors.push(`${config.name} allows up to ${config.maxChars} characters.`)
    }

    if (hashtags > config.maxHashtags) {
      errors.push(`Use no more than ${config.maxHashtags} hashtags for ${config.name}.`)
    }

    if (key === 'ig' && !mediaEnabled) {
      warnings.push('Instagram posts perform better with media attached.')
    }

    if (content.length < 30) {
      warnings.push('Consider adding more detail for better engagement.')
    }

    if (key === 'x' && hashtags > 4) {
      warnings.push('Keep X hashtag usage focused and concise.')
    }

    return {
      platform: config.name,
      errors,
      warnings,
      length: content.length,
    }
  })

  return results
}
