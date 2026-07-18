import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import postsReducer from './postsSlice.js'
import platformsReducer from './platformsSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    platforms: platformsReducer,
  },
})
