import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import { ArrowLeft, Trash2, Mail, Phone, ExternalLink, Calendar, User, Building, Briefcase, AlertCircle, Check, X, Plus, Save, Pencil } from 'lucide-react'
import axios from 'axios'
import Cookies from 'js-cookie'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function ContactDetailEditable() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [tempValue, setTempValue] = useState('')
  const [newNote, setNewNote] = useState('')
  const [addingNote, setAddingNote] = useState(false)

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
        fullName: response.data.fullName,
        jobTitle: response.data.jobTitle,
        firm: response.data.firm,
        role: response.data.role,
        email: response.data.email,
        phone: response.data.phone,
        linkedIn: response.data.linkedIn,
        reachedOut: response.data.reachedOut,
        responded: response.data.responded,
        referredBy: response.data.referredBy?.fullName || '',
        contactsProvided: response.data.referredContacts?.map(c => c.fullName) || [],
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

  const updateContact = async (field, value) => {
    setSaving(true)
    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const updateData = { [field]: value }
      
      await axios.put(`${API_URL}/api/contacts/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Update local state
      setContact(prev => ({ ...prev, [field]: value }))
      setEditingField(null)
    } catch (error) {
      console.error('Error updating contact:', error)
      alert('Failed to update contact. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (field) => {
    const newValue = !contact[field]
    await updateContact(field, newValue)
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

  const startEditing = (field, value) => {
    setEditingField(field)
    setTempValue(value || '')
  }

  const saveField = () => {
    if (tempValue !== contact[editingField]) {
      updateContact(editingField, tempValue)
    } else {
      setEditingField(null)
    }
  }

  const cancelEditing = () => {
    setEditingField(null)
    setTempValue('')
  }

  const addNote = async () => {
    if (!newNote.trim()) return
    
    setAddingNote(true)
    try {
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await axios.post(
        `${API_URL}/api/notes`,
        {
          contactId: id,
          content: newNote
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // Add note to local state
      setContact(prev => ({
        ...prev,
        notes: [...(prev.notes || []), response.data]
      }))
      setNewNote('')
    } catch (error) {
      console.error('Error adding note:', error)
      alert('Failed to add note. Please try again.')
    } finally {
      setAddingNote(false)
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

  const EditableField = ({ field, value, type = 'text', label, icon: Icon }) => {
    const isEditing = editingField === field

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          <input
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveField()
              if (e.key === 'Escape') cancelEditing()
            }}
            className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button onClick={saveField} className="text-green-600 hover:text-green-800">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={cancelEditing} className="text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )
    }

    return (
      <div className="group flex items-center justify-between">
        <div className="flex items-center">
          {Icon && <Icon className="w-4 h-4 mr-2 text-gray-400" />}
          <div>
            {label && <dt className="text-sm font-medium text-gray-500">{label}</dt>}
            <dd className="text-sm text-gray-900">{value || 'N/A'}</dd>
          </div>
        </div>
        <button
          onClick={() => startEditing(field, value)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    )
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
                {contact.fullName}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Added on {new Date(contact.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
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
                <dl className="space-y-4">
                  <EditableField field="jobTitle" value={contact.jobTitle} label="Position" icon={Briefcase} />
                  <EditableField field="firm" value={contact.firm} label="Firm" icon={Building} />
                  <EditableField field="role" value={contact.role} label="Division/Group" />
                  <EditableField field="email" value={contact.email} label="Email" type="email" icon={Mail} />
                  <EditableField field="phone" value={contact.phone} label="Phone" type="tel" icon={Phone} />
                  <EditableField field="linkedIn" value={contact.linkedIn} label="LinkedIn" icon={ExternalLink} />
                  <EditableField field="referredBy" value={contact.referredBy} label="Referred By" icon={User} />
                </dl>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Notes & Timeline</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                {/* Add new note */}
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addNote()}
                      placeholder="Add a note..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addNote}
                      disabled={addingNote || !newNote.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingNote ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Notes list */}
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
                  <p className="text-gray-500 text-sm">No notes yet. Add your first note above.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card with Quick Toggles */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Outreach Status</h3>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Reached Out</span>
                    <button
                      onClick={() => toggleStatus('reachedOut')}
                      disabled={saving}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        contact.reachedOut ? 'bg-blue-600' : 'bg-gray-200'
                      } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          contact.reachedOut ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Responded</span>
                    <button
                      onClick={() => toggleStatus('responded')}
                      disabled={saving || !contact.reachedOut}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        contact.responded ? 'bg-green-600' : 'bg-gray-200'
                      } ${saving || !contact.reachedOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          contact.responded ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {contact.reachedOut && !contact.responded && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-yellow-600">Waiting for response</p>
                    </div>
                  )}
                  
                  {contact.responded && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-green-600">Contact has responded!</p>
                    </div>
                  )}
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

export default ContactDetailEditable