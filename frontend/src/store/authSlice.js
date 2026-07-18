import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = import.meta.env.VITE_API_BASE || '/auth'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
  const payload = await response.json()
  if (!response.ok) {
    return rejectWithValue(payload.message || 'Authentication failed')
  }
  return payload
})

export const signup = createAsyncThunk('auth/signup', async (details, { rejectWithValue }) => {
  const response = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  })
  const payload = await response.json()
  if (!response.ok) {
    return rejectWithValue(payload.message || 'Registration failed')
  }
  return payload
})

const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
const persistedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('authUser') || 'null') : null

export const loadCurrentUser = createAsyncThunk('auth/loadCurrentUser', async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  if (!token) {
    return rejectWithValue('No auth token')
  }

  const response = await fetch('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const payload = await response.json()
  if (!response.ok) {
    return rejectWithValue(payload.message || 'Failed to load user')
  }
  return payload.user
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token,
    user: persistedUser,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
      }
    },
    setUser(state, action) {
      state.user = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        state.error = null
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', action.payload.token)
          localStorage.setItem('authUser', JSON.stringify(action.payload.user))
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        state.error = null
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', action.payload.token)
          localStorage.setItem('authUser', JSON.stringify(action.payload.user))
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.user = null
      })
  },
})

export const { logout, setUser } = authSlice.actions
export const selectAuthToken = (state) => state.auth.token
export const selectCurrentUser = (state) => state.auth.user
export default authSlice.reducer
