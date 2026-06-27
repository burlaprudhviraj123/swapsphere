import api from './api.js'

// Simple helper to base64-decode the JWT payload on the client side
function decodeTokenClaims(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Failed to parse JWT claims:', error)
    return null
  }
}

export const authService = {
  /**
   * Register a new user
   * @param {Object} registerRequest - name, email, password, phoneNumber, pincode, collegeName, city
   */
  async register(registerRequest) {
    const response = await api.post('/auth/register', registerRequest)
    // Cache the registered profile details in localStorage as a fallback 
    // since the backend does not have user profile GET/PUT endpoints.
    const userProfile = response.data
    localStorage.setItem('user_fallback', JSON.stringify({
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      phoneNumber: userProfile.phoneNumber,
      collegeName: userProfile.collegeName,
      city: userProfile.city,
      pincode: userProfile.pincode
    }))
    return userProfile
  },

  /**
   * Log in an existing user
   * @param {Object} loginRequest - email, password
   */
  async login(loginRequest) {
    const response = await api.post('/auth/login', loginRequest)
    const { token, userId, name, email } = response.data || {}
    
    // Save JWT token
    if (token) {
      localStorage.setItem('token', token)
    }
    
    // Decode claims to extract userId, role, and email (subject)
    const claims = decodeTokenClaims(token)
    const resolvedId = userId || claims?.userId
    const resolvedEmail = email || claims?.sub
    const resolvedName = name || (resolvedEmail ? resolvedEmail.split('@')[0] : 'User')

    const userData = {
      id: resolvedId,
      email: resolvedEmail,
      name: resolvedName,
      role: claims?.role,
    }
    localStorage.setItem('user', JSON.stringify(userData))
    
    // Manage user fallback profile cache
    const existingFallback = localStorage.getItem('user_fallback')
    if (!existingFallback) {
      localStorage.setItem('user_fallback', JSON.stringify({
        id: resolvedId,
        email: resolvedEmail,
        name: resolvedName,
        collegeName: 'University Campus',
        city: 'Student Town',
        phoneNumber: 'Click Edit to set',
        pincode: '000000'
      }))
    } else {
      try {
        const current = JSON.parse(existingFallback)
        localStorage.setItem('user_fallback', JSON.stringify({
          ...current,
          id: resolvedId || current.id,
          email: resolvedEmail || current.email,
          name: resolvedName || current.name
        }))
      } catch (e) {
        // Fallback catch
      }
    }
    
    return response.data
  },

  /**
   * Log out current user, cleaning all tokens and caches
   */
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // We keep user_fallback cached so returning users see their profile details, 
    // but clear active auth credentials.
  },

  /**
   * Get active logged-in user auth details
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  /**
   * Get fallback cached profile details for user display
   */
  getUserProfileFallback() {
    const profileStr = localStorage.getItem('user_fallback')
    return profileStr ? JSON.parse(profileStr) : null
  },

  /**
   * Update local profile details cache
   */
  updateUserProfileFallback(updatedData) {
    const current = this.getUserProfileFallback() || {}
    const newProfile = { ...current, ...updatedData }
    localStorage.setItem('user_fallback', JSON.stringify(newProfile))
    return newProfile
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('token')
    return !!token
  }
}
