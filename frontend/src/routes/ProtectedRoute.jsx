import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectAuthToken, selectCurrentUser } from '../store/authSlice.js'

export default function ProtectedRoute({ children, requiredRoles = [] }) {
  const token = useSelector(selectAuthToken)
  const user = useSelector(selectCurrentUser)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requiredRoles.length > 0) {
    const roles = user?.roles || []
    const allowed = roles.some((role) => requiredRoles.includes(role))
    if (!allowed) {
      return <div className="unauthorized"><h2>Access denied</h2><p>You do not have permission to view this page.</p></div>
    }
  }

  return children
}
