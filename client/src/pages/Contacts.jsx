import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import { Search, Filter, Plus, Mail, Phone, ExternalLink, Check, X } from 'lucide-react'

function Contacts() {
  const [contacts, setContacts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFirm, setFilterFirm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    // TODO: Fetch contacts from API
    // Mock data for now
    setContacts([
      {
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
        referredBy: 'Professor Lee'
      },
      {
        id: 2,
        name: 'John Smith',
        job: 'Vice President',
        firm: 'Morgan Stanley',
        role: 'LevFin',
        email: 'john.smith@ms.com',
        phone: '555-0102',
        linkedin: 'linkedin.com/in/johnsmith',
        reachedOut: true,
        responded: false,
        referredBy: 'Jane Doe'
      },
      {
        id: 3,
        name: 'Emily Chen',
        job: 'Associate',
        firm: 'JP Morgan',
        role: 'ECM',
        email: 'emily.chen@jpmorgan.com',
        phone: '555-0103',
        linkedin: 'linkedin.com/in/emilychen',
        reachedOut: false,
        responded: false,
        referredBy: 'Career Center'
      }
    ])
  }, [])

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.role.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFirm = !filterFirm || contact.firm === filterFirm
    const matchesRole = !filterRole || contact.role === filterRole
    
    let matchesStatus = true
    if (filterStatus === 'reached') matchesStatus = contact.reachedOut
    if (filterStatus === 'responded') matchesStatus = contact.responded
    if (filterStatus === 'pending') matchesStatus = contact.reachedOut && !contact.responded
    
    return matchesSearch && matchesFirm && matchesRole && matchesStatus
  })

  const uniqueFirms = [...new Set(contacts.map(c => c.firm))]
  const uniqueRoles = [...new Set(contacts.map(c => c.role))]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              All Contacts
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/contacts/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterFirm}
              onChange={(e) => setFilterFirm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Firms</option>
              {uniqueFirms.map(firm => (
                <option key={firm} value={firm}>{firm}</option>
              ))}
            </select>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="reached">Reached Out</option>
              <option value="responded">Responded</option>
              <option value="pending">Pending Response</option>
            </select>

            <button
              onClick={() => {
                setSearchTerm('')
                setFilterFirm('')
                setFilterRole('')
                setFilterStatus('all')
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Firm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referred By
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.job}</div>
                    <div className="text-sm text-gray-500">{contact.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.firm}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} className="text-gray-400 hover:text-gray-600">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                      {contact.phone && (
                        <a href={`tel:${contact.phone}`} className="text-gray-400 hover:text-gray-600">
                          <Phone className="w-4 h-4" />
                        </a>
                      )}
                      {contact.linkedin && (
                        <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contact.reachedOut ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.reachedOut ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Reached
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        contact.responded ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.responded ? <Check className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                        Responded
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {contact.referredBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/contacts/${contact.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No contacts found matching your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Contacts