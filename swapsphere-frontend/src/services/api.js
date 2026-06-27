import axios from 'axios'

// Configure Axios client with base URL pointing to proxied backend API path
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach Authorization Bearer token to headers dynamically on every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle global responses and intercept 401 Unauthorized errors to trigger logout redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is a 401 Unauthorized response from backend security filters
    if (error.response && error.response.status === 401) {
      // Clear token and user details to prevent invalid loops
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Prevent redirecting if already on the login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?expired=true'
      }
    }
    return Promise.reject(error)
  }
)

export default api
