import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { login, signup } from '../store/authSlice.js'

export default function AuthForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const authStatus = useSelector((state) => state.auth.status)
  const authError = useSelector((state) => state.auth.error)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate, token])

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  const submit = async (event) => {
    event.preventDefault()
    if (isLogin) {
      dispatch(login({ email, password }))
    } else {
      dispatch(signup({ name, email, password }))
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-illustration">
        <p className="auth-badge">Social media workspace</p>
        <h2>Plan smarter posts and publish without friction.</h2>
        <p>
          Create your next campaign, schedule it across channels, and keep your content flowing from one focused dashboard.
        </p>
        <ul className="auth-highlights">
          <li>Coordinate every post from one central workspace</li>
          <li>Stay ahead of deadlines with a clear schedule view</li>
          <li>Keep your publishing flow organized and consistent</li>
        </ul>
      </section>

      <section className="auth-card">
        <div className="auth-card-header">
          <p className="eyebrow">Welcome back</p>
          <h2>{isLogin ? 'Sign in to your studio' : 'Create your account'}</h2>
          <p>{isLogin ? 'Access your post planner and manage your next launch.' : 'Join the studio and start organizing your content plan.'}</p>
        </div>

        <div className="auth-form">
          <form onSubmit={submit}>
            {!isLogin && (
              <label>
                Name
                <input value={name} onChange={(e) => setName(e.target.value)} required={!isLogin} />
              </label>
            )}
            <label>
              Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </label>
            <button type="submit" disabled={authStatus === 'loading'}>{isLogin ? 'Sign In' : 'Sign Up'}</button>
          </form>
          {authError && <p className="error">{authError}</p>}
          {isLogin && (
            <div className="auth-footer-row">
              <Link to="/forgot-password" className="link-button">
                Forgot password?
              </Link>
            </div>
          )}
          <button type="button" className="link-button" onClick={() => setIsLogin((value) => !value)}>
            {isLogin ? 'Create an account' : 'Already have an account? Sign in'}
          </button>
        </div>
      </section>
    </div>
  )
}
