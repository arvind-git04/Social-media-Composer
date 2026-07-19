import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeSelectedPlatforms, validateMediaFile } from './platforms.js'

test('normalizes legacy platform aliases and keeps supported platforms', () => {
  const normalized = normalizeSelectedPlatforms(['fb', 'pentriest', 'unknown'])
  assert.deepEqual(normalized, ['fb', 'pinterest'])
})

test('accepts valid image and video sizes and rejects invalid ones', () => {
  const validImage = { type: 'image/png', size: 8 * 1024 * 1024 }
  const validVideo = { type: 'video/mp4', size: 40 * 1024 * 1024 }
  const invalidImage = { type: 'image/png', size: 11 * 1024 * 1024 }
  const invalidVideo = { type: 'video/mp4', size: 51 * 1024 * 1024 }

  assert.equal(validateMediaFile(validImage), null)
  assert.equal(validateMediaFile(validVideo), null)
  assert.match(validateMediaFile(invalidImage), /10MB/)
  assert.match(validateMediaFile(invalidVideo), /50MB/)
})
