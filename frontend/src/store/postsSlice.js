import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'

const postsAdapter = createEntityAdapter({ sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt) })

const initialState = postsAdapter.getInitialState({ status: 'idle', error: null })

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (token, { rejectWithValue }) => {
  const response = await fetch('/posts', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  const payload = await response.json()
  if (!response.ok) {
    return rejectWithValue(payload.message || 'Failed to load posts')
  }
  return payload.posts
})

export const addPost = createAsyncThunk('posts/addPost', async ({ post, token }, { rejectWithValue }) => {
  const response = await fetch('/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(post),
  })
  const payload = await response.json()
  if (!response.ok) {
    return rejectWithValue(payload.message || 'Failed to create post')
  }
  return payload.post
})

export const updatePost = createAsyncThunk('posts/updatePost', async ({ post, token }, { rejectWithValue }) => {
  const response = await fetch(`/posts/${post._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(post),
  })
  const payload = await response.json()
  if (!response.ok) {
    return rejectWithValue(payload.message || 'Failed to update post')
  }
  return payload.post
})

export const deletePost = createAsyncThunk('posts/deletePost', async ({ postId, token }, { rejectWithValue }) => {
  const response = await fetch(`/posts/${postId}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!response.ok) {
    const payload = await response.json()
    return rejectWithValue(payload.message || 'Failed to delete post')
  }
  return postId
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
