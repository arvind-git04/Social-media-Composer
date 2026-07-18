import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="forgot-password-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <p className="eyebrow">Forgot password</p>
          <h2>Recover your account</h2>
          <p>Enter your email and we will send instructions to reset your password.</p>
        </div>

        {submitted ? (
          <div className="forgot-success">
            <p>If the email exists, a password reset link has been sent.</p>
            <button type="button" className="secondary-button" onClick={() => navigate('/login')}>
              Back to login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="create-post">
            <label htmlFor="forgot-email">Email address</label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <button type="submit">Send reset link</button>
          </form>
        )}
      </div>
    </div>
  )
}
