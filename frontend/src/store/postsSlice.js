import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import api from '../utils/api.js'

const postsAdapter = createEntityAdapter({ sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt) })

const initialState = postsAdapter.getInitialState({ status: 'idle', error: null })

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (token, { rejectWithValue }) => {
  try {
    const response = await api.get('/posts', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return response.data.posts
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load posts')
  }
})

export const addPost = createAsyncThunk('posts/addPost', async ({ post, token }, { rejectWithValue }) => {
  try {
    const response = await api.post('/posts', post, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return response.data.post
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create post')
  }
})

export const updatePost = createAsyncThunk('posts/updatePost', async ({ post, token }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/posts/${post._id}`, post, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return response.data.post
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update post')
  }
})

export const deletePost = createAsyncThunk('posts/deletePost', async ({ postId, token }, { rejectWithValue }) => {
  try {
    await api.delete(`/posts/${postId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    return postId
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete post')
  }
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        postsAdapter.setAll(state, action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(addPost.fulfilled, (state, action) => {
        postsAdapter.addOne(state, action.payload)
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        postsAdapter.upsertOne(state, action.payload)
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        postsAdapter.removeOne(state, action.payload)
      })
  },
})

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts)

export default postsSlice.reducer
