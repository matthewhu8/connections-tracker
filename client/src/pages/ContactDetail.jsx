import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import { ArrowLeft, Edit, Trash2, Mail, Phone, ExternalLink, Calendar, User, Building, Briefcase, AlertCircle } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchContact()
  }, [id])

  const fetchContact = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.get(`${API_URL}/api/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // Transform the data to match the component's expected format
      const contactData = {
        id: response.data.id,
        name: response.data.fullName,
        job: response.data.jobTitle,
        firm: response.data.firm,
        role: response.data.role,
        email: response.data.email,
        phone: response.data.phone,
        linkedin: response.data.linkedIn,
        reachedOut: response.data.reachedOut,
        responded: response.data.responded,
        referredBy: response.data.referredBy?.fullName || null,
        contactsProvided: response.data.referredContacts?.map(c => `${c.fullName}`) || [],
        createdAt: response.data.createdAt,
        notes: response.data.notes || []
      }

      setContact(contactData)
    } catch (error) {
      console.error('Error fetching contact:', error)
      if (error.response?.status === 404) {
        setError('Contact not found')
      } else {
        setError(error.response?.data?.message || 'Failed to load contact details')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      setDeleting(true)
      try {
        const token = Cookies.get('token')
        if (!token) {
          throw new Error('No authentication token found')
        }

        await axios.delete(`${API_URL}/api/contacts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        navigate('/contacts')
      } catch (error) {
        console.error('Error deleting contact:', error)
        alert('Failed to delete contact. Please try again.')
        setDeleting(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading contact</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <Link to="/contacts" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800">
                  Back to Contacts
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!contact) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/contacts"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Contacts
          </Link>
          
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {contact.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Added on {new Date(contact.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <button
                onClick={() => navigate(`/contacts/${id}/edit`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Position
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.job}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Firm
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.firm}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Division/Group</dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.role}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Referred By
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">{contact.referredBy || 'N/A'}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {contact.email ? (
                        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-500">
                          {contact.email}
                        </a>
                      ) : 'N/A'}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {contact.phone ? (
                        <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-500">
                          {contact.phone}
                        </a>
                      ) : 'N/A'}
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      LinkedIn
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {contact.linkedin ? (
                        <a 
                          href={`https://${contact.linkedin}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500"
                        >
                          {contact.linkedin}
                        </a>
                      ) : 'N/A'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Notes & Timeline</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                {contact.notes && contact.notes.length > 0 ? (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {contact.notes.map((note, noteIdx) => (
                        <li key={note.id}>
                          <div className="relative pb-8">
                            {noteIdx !== contact.notes.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                  <Calendar className="h-4 w-4 text-white" />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    {new Date(note.createdAt || note.date).toLocaleDateString()}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-900">{note.content}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No notes yet. Add notes when editing this contact.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Outreach Status</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Reached Out</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contact.reachedOut ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.reachedOut ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Responded</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contact.responded ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {contact.responded ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Referrals Card */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Contacts Provided</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                {contact.contactsProvided && contact.contactsProvided.length > 0 ? (
                  <ul className="space-y-2">
                    {contact.contactsProvided.map((referral, idx) => (
                      <li key={idx} className="text-sm text-gray-900">
                        • {referral}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No referrals provided yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ContactDetail