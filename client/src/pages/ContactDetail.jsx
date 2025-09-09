import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import { ArrowLeft, Edit, Trash2, Mail, Phone, ExternalLink, Calendar, User, Building, Briefcase } from 'lucide-react'

function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [notes, setNotes] = useState([])

  useEffect(() => {
    // TODO: Fetch contact details from API
    // Mock data for now
    setContact({
      id: 1,
      name: 'Jane Doe',
      job: 'Analyst',
      firm: 'Goldman Sachs',
      role: 'M&A',
      email: 'jane.doe@gs.com',
      phone: '555-0101',
      linkedin: 'linkedin.com/in/janedoe',
      reachedOut: true,
      responded: true,
      referredBy: 'Professor Lee',
      contactsProvided: ['John Smith - Morgan Stanley', 'Emily Chen - JP Morgan'],
      createdAt: '2024-01-15'
    })

    setNotes([
      {
        id: 1,
        date: '2024-01-20',
        content: 'Had coffee chat at Starbucks. Discussed career path in investment banking and recruiting timeline.'
      },
      {
        id: 2,
        date: '2024-01-25',
        content: 'Follow-up call. She referred me to John Smith at Morgan Stanley and Emily Chen at JP Morgan. Very helpful insights on technical interview prep.'
      }
    ])
  }, [id])

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this contact?')) {
      // TODO: Delete from API
      navigate('/contacts')
    }
  }

  if (!contact) {
    return <div>Loading...</div>
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
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
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
                {notes.length > 0 ? (
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {notes.map((note, noteIdx) => (
                        <li key={note.id}>
                          <div className="relative pb-8">
                            {noteIdx !== notes.length - 1 ? (
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
                                    {new Date(note.date).toLocaleDateString()}
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