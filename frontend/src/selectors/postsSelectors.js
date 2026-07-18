import { createSelector } from '@reduxjs/toolkit'
import { selectAllPosts } from '../store/postsSlice.js'

export const selectPostsByPlatform = createSelector(
  [selectAllPosts, (state, platformId) => platformId],
  (posts, platformId) => posts.filter((post) => post.platforms.includes(platformId)),
)

export const selectScheduledPosts = createSelector(
  [selectAllPosts],
  (posts) => posts.filter((post) => !!post.schedule),
)

export const selectPlatformCounts = createSelector(
  [selectAllPosts],
  (posts) => posts.reduce((counts, post) => {
    post.platforms.forEach((platform) => {
      counts[platform] = (counts[platform] || 0) + 1
    })
    return counts
  }, {})
)
