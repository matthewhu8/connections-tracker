import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { Users } from 'lucide-react'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '949663493396-59iorc4cv268t41etlfftb9oebkmq5o7.apps.googleusercontent.com'

function Login() {
  const navigate = useNavigate()
  const { user, loginWithGoogle, error } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    console.log('Google Client ID:', GOOGLE_CLIENT_ID)
    console.log('Current origin:', window.location.origin)
  }, [])

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Google login successful, credential received')
    const result = await loginWithGoogle(credentialResponse.credential)
    if (result.success) {
      navigate('/')
    }
  }

  const handleGoogleError = (error) => {
    console.error('Google login failed:', error)
  }

  const testBackendConnection = async () => {
    console.log('Testing backend connection...')
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/test`)
      const data = await response.json()
      console.log('Backend test response:', data)
      alert(`Backend is ${data.message}. Google Client ID: ${data.googleClientId}`)
    } catch (error) {
      console.error('Backend test failed:', error)
      alert('Cannot connect to backend. Make sure the server is running on port 5000')
    }
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                NetworkTracker
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Your personal CRM for professional networking
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-6">
                  Sign in to continue
                </h3>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="rectangular"
                    logo_alignment="left"
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Secure authentication with Google
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 mt-6">
                <p>
                  By signing in, you agree to keep your networking data organized
                </p>
                <p className="mt-2">
                  Track contacts • Log interactions • Build relationships
                </p>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={testBackendConnection}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                >
                  Test Backend Connection (Debug)
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              NetworkTracker helps you manage professional connections efficiently
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  )
}

export default Login