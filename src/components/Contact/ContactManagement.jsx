import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import API from '../../api';
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  PaperClipIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ContactManagement = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      console.log('Non-admin user trying to access contact management, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchContacts();
    }
  }, [currentUser]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/contact');
      console.log('📥 Contacts API Response:', response.data);
      if (response.data.success) {
        setContacts(response.data.contacts || []);
      } else {
        setError(response.data.error || 'Failed to load contact submissions');
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      const errorMsg = err.response?.data?.error || 'Failed to load contact submissions';
      setError(errorMsg);
      
      // If unauthorized, maybe token expired
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewContact = async (contact) => {
    try {
      const response = await API.get(`/contact/${contact._id}`);
      if (response.data.success) {
        setSelectedContact(response.data.contact);
      } else {
        alert('Failed to load contact details');
      }
    } catch (err) {
      console.error('Error fetching contact details:', err);
      alert('Failed to load contact details');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await API.patch(`/contact/${id}/status`, { status });
      if (response.data.success) {
        setContacts(prev => 
          prev.map(contact => 
            contact._id === id ? response.data.contact : contact
          )
        );
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact(response.data.contact);
        }
      } else {
        alert(response.data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    
    try {
      setIsDeleting(true);
      await API.delete(`/contact/${contactToDelete._id}`);
      setContacts(prev => prev.filter(c => c._id !== contactToDelete._id));
      if (selectedContact && selectedContact._id === contactToDelete._id) {
        setSelectedContact(null);
      }
      setShowDeleteConfirm(false);
      setContactToDelete(null);
    } catch (err) {
      console.error('Error deleting contact:', err);
      alert('Failed to delete contact');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500 text-blue-300';
      case 'read': return 'bg-purple-500 text-purple-300';
      case 'replied': return 'bg-green-500 text-green-300';
      case 'resolved': return 'bg-emerald-500 text-emerald-300';
      case 'spam': return 'bg-red-500 text-red-300';
      default: return 'bg-gray-500 text-gray-300';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-900/20 border-blue-700/30';
      case 'read': return 'bg-purple-900/20 border-purple-700/30';
      case 'replied': return 'bg-green-900/20 border-green-700/30';
      case 'resolved': return 'bg-emerald-900/20 border-emerald-700/30';
      case 'spam': return 'bg-red-900/20 border-red-700/30';
      default: return 'bg-gray-900/20 border-gray-700/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'new': return 'New';
      case 'read': return 'Read';
      case 'replied': return 'Replied';
      case 'resolved': return 'Resolved';
      case 'spam': return 'Spam';
      default: return status;
    }
  };

  const getFileIcon = (mimetype) => {
    if (mimetype.includes('image')) return '🖼️';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word')) return '📝';
    if (mimetype.includes('text')) return '📃';
    return '📎';
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: contacts.length,
    new: contacts.filter(c => c.status === 'new').length,
    read: contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
    resolved: contacts.filter(c => c.status === 'resolved').length,
    spam: contacts.filter(c => c.status === 'spam').length
  };

  // If user is not admin, show unauthorized message
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <ShieldCheckIcon className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Admin Access Required</h1>
          <p className="text-gray-400 mb-6">You need administrator privileges to access this page.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  if (loading && contacts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading contact submissions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
              title="Back to Admin"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Contact Management</h1>
              <p className="text-gray-400">Manage all contact form submissions</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                  Admin: {currentUser.username}
                </span>
                <button
                  onClick={logout}
                  className="px-2 py-1 bg-red-900/30 text-red-300 text-xs rounded hover:bg-red-800/50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <button
              onClick={fetchContacts}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors flex items-center"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
          </div>
          <div className={`${getStatusBgColor('new')} backdrop-blur-sm rounded-xl p-4 border`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.new}</div>
              <div className="text-sm text-gray-400">New</div>
            </div>
          </div>
          <div className={`${getStatusBgColor('read')} backdrop-blur-sm rounded-xl p-4 border`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.read}</div>
              <div className="text-sm text-gray-400">Read</div>
            </div>
          </div>
          <div className={`${getStatusBgColor('replied')} backdrop-blur-sm rounded-xl p-4 border`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{stats.replied}</div>
              <div className="text-sm text-gray-400">Replied</div>
            </div>
          </div>
          <div className={`${getStatusBgColor('resolved')} backdrop-blur-sm rounded-xl p-4 border`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{stats.resolved}</div>
              <div className="text-sm text-gray-400">Resolved</div>
            </div>
          </div>
          <div className={`${getStatusBgColor('spam')} backdrop-blur-sm rounded-xl p-4 border`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{stats.spam}</div>
              <div className="text-sm text-gray-400">Spam</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="pl-10 block w-full px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search by name, email, subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FunnelIcon className="h-5 w-5 text-gray-500" />
                </div>
                <select
                  className="pl-10 block px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="resolved">Resolved</option>
                  <option value="spam">Spam</option>
                </select>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-800/50 text-red-300 rounded-xl transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-400 mr-3" />
              <span className="text-red-400">{error}</span>
            </div>
          </div>
        )}

        {/* Contacts Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
          {filteredContacts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full mb-4">
                <EnvelopeIcon className="h-10 w-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Contact Submissions</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No contacts match your search criteria' 
                  : 'No contact submissions yet'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Contact</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Subject</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Date</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Attachments</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredContacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <div>
                            <div className="flex items-center space-x-2">
                              <UserIcon className="h-4 w-4 text-gray-500" />
                              <span className="font-medium text-white">{contact.name}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <EnvelopeIcon className="h-3 w-3 text-gray-500" />
                              <span className="text-sm text-gray-400">{contact.email}</span>
                            </div>
                            {contact.phone && (
                              <div className="flex items-center space-x-2 mt-1">
                                <PhoneIcon className="h-3 w-3 text-gray-500" />
                                <span className="text-sm text-gray-400">{contact.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="max-w-xs">
                            <span className="text-white">{contact.subject}</span>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-1">
                              {contact.message}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-300 text-sm">{formatDate(contact.createdAt)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                            {getStatusText(contact.status)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {contact.attachments?.length > 0 ? (
                            <div className="flex items-center space-x-1">
                              <PaperClipIcon className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-300">{contact.attachments.length} files</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">None</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewContact(contact)}
                              className="p-2 bg-gray-700 hover:bg-blue-600 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setContactToDelete(contact);
                                setShowDeleteConfirm(true);
                              }}
                              className="p-2 bg-gray-700 hover:bg-red-600 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Results Count */}
              <div className="px-6 py-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  Showing {filteredContacts.length} of {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
                  {searchTerm && ` for "${searchTerm}"`}
                  {statusFilter !== 'all' && ` with status "${getStatusText(statusFilter)}"`}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Contact Details Modal */}
        {selectedContact && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getStatusBgColor(selectedContact.status)}`}>
                      <EnvelopeIcon className="h-6 w-6 text-gray-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Contact Details</h2>
                      <p className="text-gray-400 text-sm">ID: {selectedContact._id.substring(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedContact.status)}`}>
                      {getStatusText(selectedContact.status)}
                    </span>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <UserIcon className="h-5 w-5 mr-2" />
                      Personal Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Name</p>
                        <p className="text-white">{selectedContact.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white break-all">{selectedContact.email}</p>
                      </div>
                      {selectedContact.phone && (
                        <div>
                          <p className="text-gray-400 text-sm">Phone</p>
                          <p className="text-white">{selectedContact.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Submission Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Subject</p>
                        <p className="text-white">{selectedContact.subject}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Status</p>
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedContact.status}
                            onChange={(e) => handleUpdateStatus(selectedContact._id, e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="resolved">Resolved</option>
                            <option value="spam">Spam</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Submitted</p>
                        <p className="text-white text-sm">{formatDate(selectedContact.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                    <h3 className="text-white font-semibold mb-3 flex items-center">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                      Technical Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400 text-sm">Source</p>
                        <p className="text-white capitalize">{selectedContact.source || 'website'}</p>
                      </div>
                      {selectedContact.ipAddress && (
                        <div>
                          <p className="text-gray-400 text-sm">IP Address</p>
                          <p className="text-white font-mono text-sm">{selectedContact.ipAddress}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-400 text-sm">Browser</p>
                        <p className="text-white text-sm truncate">{selectedContact.userAgent || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-gray-900/50 p-6 rounded-xl mb-6 border border-gray-700">
                  <h3 className="text-white font-semibold mb-4 flex items-center">
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    Message
                  </h3>
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                {/* Attachments */}
                {selectedContact.attachments?.length > 0 && (
                  <div className="bg-gray-900/50 p-6 rounded-xl mb-6 border border-gray-700">
                    <h3 className="text-white font-semibold mb-4 flex items-center">
                      <PaperClipIcon className="h-5 w-5 mr-2" />
                      Attachments ({selectedContact.attachments.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedContact.attachments.map((file, index) => (
                        <div key={index} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{getFileIcon(file.mimetype)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">{file.filename}</p>
                              <p className="text-gray-400 text-xs">
                                {file.mimetype.split('/')[1].toUpperCase()} • 
                                {file.size > 1024 * 1024 
                                  ? ` ${(file.size / (1024 * 1024)).toFixed(2)} MB`
                                  : ` ${(file.size / 1024).toFixed(2)} KB`
                                }
                              </p>
                            </div>
                            <a
                              href={`https://fitlyfy.onrender.com:5000${file.path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                            >
                              View
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    onClick={() => {
                      setSelectedContact(null);
                      setContactToDelete(selectedContact);
                      setShowDeleteConfirm(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Delete Contact
                  </button>
                  <button
                    onClick={() => window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    Reply via Email
                  </button>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && contactToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full border border-gray-700">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/30 mb-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Delete Contact</h3>
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete the contact from <strong className="text-white">{contactToDelete.name}</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setContactToDelete(null);
                    }}
                    className="px-6 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteContact}
                    disabled={isDeleting}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info - Remove in production */}
        {/* <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
          <p>Debug Info:</p>
          <p>Current User Role: {currentUser?.role}</p>
          <p>Total Contacts: {contacts.length}</p>
          <p>Filtered Contacts: {filteredContacts.length}</p>
          <p>Search Term: "{searchTerm}"</p>
          <p>Status Filter: {statusFilter}</p>
        </div> */}
      </div>
    </div>
  );
};

export default ContactManagement;