import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/Navigation'
import { Users, Send, MessageSquare, TrendingUp, Plus } from 'lucide-react'

function Dashboard() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    reachedOut: 0,
    responded: 0,
    responseRate: 0,
    topFirms: [],
    recentContacts: []
  })

  useEffect(() => {
    // TODO: Fetch stats from API
    // For now, using mock data
    setStats({
      totalContacts: 12,
      reachedOut: 8,
      responded: 5,
      responseRate: 62.5,
      topFirms: [
        { name: 'Goldman Sachs', count: 3 },
        { name: 'Morgan Stanley', count: 2 },
        { name: 'JP Morgan', count: 2 }
      ],
      recentContacts: [
        { id: 1, name: 'Jane Doe', firm: 'Goldman Sachs', role: 'M&A Analyst', reachedOut: true, responded: true },
        { id: 2, name: 'John Smith', firm: 'Morgan Stanley', role: 'VP', reachedOut: true, responded: false },
        { id: 3, name: 'Emily Chen', firm: 'JP Morgan', role: 'Associate', reachedOut: false, responded: false }
      ]
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/contacts/new"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Contacts</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.totalContacts}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Send className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Reached Out</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.reachedOut}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Responded</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.responded}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Response Rate</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stats.responseRate}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Recent Contacts */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Contacts</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {stats.recentContacts.map((contact) => (
                    <li key={contact.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                          <p className="text-sm text-gray-500 truncate">
                            {contact.role} at {contact.firm}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {contact.reachedOut && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Reached Out
                            </span>
                          )}
                          {contact.responded && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Responded
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <Link
                  to="/contacts"
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  View all contacts
                </Link>
              </div>
            </div>
          </div>

          {/* Top Firms */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Top Firms</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                {stats.topFirms.map((firm, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{firm.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">{firm.count} contacts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard