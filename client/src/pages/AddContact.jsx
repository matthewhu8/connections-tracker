import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navigation from '../components/Navigation'
import { Save, X, AlertCircle } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function AddContact() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    job: '',
    firm: '',
    role: '',
    email: '',
    phone: '',
    linkedin: '',
    reachedOut: false,
    responded: false,
    referredBy: '',
    notes: '',
    contactsProvided: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Transform form data to match API expectations
      const contactData = {
        fullName: formData.name,
        jobTitle: formData.job,
        firm: formData.firm,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        linkedIn: formData.linkedin,
        reachedOut: formData.reachedOut,
        responded: formData.responded,
        notes: formData.notes,
        contactsProvided: formData.contactsProvided ? formData.contactsProvided.split('\n').filter(c => c.trim()) : []
      }

      // Add referredBy if provided (this might need to be a contact ID)
      if (formData.referredBy) {
        contactData.referredByName = formData.referredBy
      }

      const response = await axios.post(
        `${API_URL}/api/contacts`,
        contactData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // Navigate back to contacts page after successful save
      navigate('/contacts')
    } catch (error) {
      console.error('Error saving contact:', error)
      setError(error.response?.data?.message || 'Failed to save contact. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Add New Contact
            </h2>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error saving contact</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="job" className="block text-sm font-medium text-gray-700">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="job"
                      id="job"
                      required
                      value={formData.job}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Analyst"
                    />
                  </div>

                  <div>
                    <label htmlFor="firm" className="block text-sm font-medium text-gray-700">
                      Firm *
                    </label>
                    <input
                      type="text"
                      name="firm"
                      id="firm"
                      required
                      value={formData.firm}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Goldman Sachs"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Division/Group
                    </label>
                    <input
                      type="text"
                      name="role"
                      id="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="M&A, LevFin, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="jane.doe@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="555-0123"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                      LinkedIn Profile
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      id="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="linkedin.com/in/janedoe"
                    />
                  </div>
                </div>
              </div>

              {/* Outreach Status */}
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Outreach Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="reachedOut"
                      id="reachedOut"
                      checked={formData.reachedOut}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="reachedOut" className="ml-3 block text-sm font-medium text-gray-700">
                      I have reached out to this contact
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="responded"
                      id="responded"
                      checked={formData.responded}
                      onChange={handleChange}
                      disabled={!formData.reachedOut}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <label htmlFor="responded" className="ml-3 block text-sm font-medium text-gray-700">
                      They have responded
                    </label>
                  </div>
                </div>
              </div>

              {/* Referral Information */}
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Referral Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="referredBy" className="block text-sm font-medium text-gray-700">
                      Referred By
                    </label>
                    <input
                      type="text"
                      name="referredBy"
                      id="referredBy"
                      value={formData.referredBy}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Who introduced you to this contact?"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactsProvided" className="block text-sm font-medium text-gray-700">
                      Contacts Provided
                    </label>
                    <textarea
                      name="contactsProvided"
                      id="contactsProvided"
                      rows={2}
                      value={formData.contactsProvided}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="List any contacts this person referred you to (one per line)"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Coffee chat takeaways, advice received, etc."
                />
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 rounded-b-lg">
            <button
              type="button"
              onClick={() => navigate('/contacts')}
              className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Contact
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default AddContact