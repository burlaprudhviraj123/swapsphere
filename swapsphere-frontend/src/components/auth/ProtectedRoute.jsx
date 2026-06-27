import { Navigate, useLocation } from 'react-router-dom'
import { authService } from '../../services/authService.js'

export function ProtectedRoute({ children }) {
  const location = useLocation()
  const authenticated = authService.isAuthenticated()

  if (!authenticated) {
    // Redirect to login page and store current location for post-login return redirect
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
