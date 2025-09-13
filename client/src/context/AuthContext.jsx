import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'

const AuthContext = createContext({})

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUser(response.data.user)
    } catch (error) {
      console.error('Auth check failed:', error)
      Cookies.remove('token')
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (credential) => {
    try {
      setError(null)
      
      console.log('=== Google Login Debug ===')
      console.log('API URL:', API_URL)
      console.log('Credential received:', credential ? 'Yes' : 'No')
      console.log('Credential length:', credential?.length)
      
      const response = await axios.post(`${API_URL}/api/auth/google`, {
        credential
      })

      console.log('Response status:', response.status)
      console.log('Response data:', response.data)

      const { token, user } = response.data
      
      // Store token in cookie
      Cookies.set('token', token, { expires: 7 })
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      
      return { success: true }
    } catch (error) {
      console.error('=== Login Error Details ===')
      console.error('Full error object:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)
      console.error('Error response status:', error.response?.status)
      console.error('Error message:', error.message)
      
      if (error.code === 'ERR_NETWORK') {
        console.error('Network error - backend might not be running')
        setError('Cannot connect to server. Please check if the backend is running.')
      } else if (error.response?.status === 401) {
        setError('Google authentication failed. Please try again.')
      } else {
        setError(error.response?.data?.message || error.message || 'Login failed')
      }
      
      return { success: false, error: error.response?.data?.message || error.message }
    }
  }

  const logout = () => {
    Cookies.remove('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    window.location.href = '/'
  }

  const value = {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext