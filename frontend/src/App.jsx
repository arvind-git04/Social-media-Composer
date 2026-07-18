import { BrowserRouter, Route, Routes, NavLink, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import './App.css'
import ComposerPage from './pages/ComposerPage.jsx'
import PostList from './components/PostList.jsx'
import AuthForm from './components/AuthForm.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ScheduleCalendar from './components/ScheduleCalendar.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import { logout, selectAuthToken, selectCurrentUser } from './store/authSlice.js'

function App() {
  const dispatch = useDispatch()
  const token = useSelector(selectAuthToken)
  const user = useSelector(selectCurrentUser)

  return (
    <BrowserRouter>
      {token && (
        <header className="app-header">
          <nav>
            <NavLink to="/" end>
              Dashboard
            </NavLink>
            <NavLink to="/schedule">Schedule</NavLink>
            <NavLink to="/posts">Posts</NavLink>
          </nav>
          <div className="user-meta">
            <span>Logged in as {user?.email || 'user'}</span>
            <button type="button" className="link-button" onClick={() => dispatch(logout())}>
              Sign out
            </button>
          </div>
        </header>
      )}
      <main className="app-shell">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ComposerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <section className="posts-section">
                  <h2>Posts</h2>
                  <PostList onEdit={(p) => console.log('edit', p)} />
                </section>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute>
                <ScheduleCalendar />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<AuthForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
