import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CalendarIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  PhotoIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  StarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

// API base URL
const API_BASE_URL = 'https://fitlyfy.onrender.com';

const CoachApplicationsAdmin = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'submittedAt', direction: 'desc' });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    averageExperience: 0,
    topSpecializations: []
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [exporting, setExporting] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailContent, setEmailContent] = useState({
    subject: '',
    body: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState({});

  // Check if current user is admin
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      // console.log('Non-admin user trying to access coach applications, redirecting...');
      navigate('/unauthorized');
    }
  }, [currentUser, navigate]);

  // Show message
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Fetch applications
  const fetchApplications = async () => {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    try {
      setLoading(true);
      
      // Get authentication token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        showMessage('error', 'No authentication token found. Please login again.');
        setLoading(false);
        return;
      }
      
      // console.log('Fetching applications from:', `${API_BASE_URL}/api/coach/applications`);
      
      const response = await fetch(`${API_BASE_URL}/api/coach/applications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please login again.');
        } else if (response.status === 403) {
          throw new Error('Access forbidden. Admin privileges required.');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      const result = await response.json();
      // console.log('API Response:', result);
      
      // Your backend returns: { success: true, count: number, data: array }
      let appsArray = [];
      
      if (result && result.success === true && Array.isArray(result.data)) {
        appsArray = result.data;
      } else if (Array.isArray(result)) {
        appsArray = result;
      } else if (result && Array.isArray(result.applications)) {
        appsArray = result.applications;
      } else if (result && result.data && Array.isArray(result.data.applications)) {
        appsArray = result.data.applications;
      }
      
      // console.log('Parsed applications array:', appsArray);
      // console.log('Number of applications:', appsArray.length);
      
      setApplications(appsArray);
      calculateStats(appsArray);
      
    } catch (error) {
      // console.error('Error fetching applications:', error);
      showMessage('error', `Failed to load applications: ${error.message}`);
      setApplications([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (apps) => {
    const validApps = apps.filter(app => app);
    const experienceSum = validApps.reduce((sum, app) => sum + (parseFloat(app.experience) || 0), 0);
    const avgExperience = validApps.length > 0 ? (experienceSum / validApps.length).toFixed(1) : 0;
    
    // Calculate top specializations
    const specializationCount = {};
    validApps.forEach(app => {
      const spec = app.specialization;
      if (spec) {
        specializationCount[spec] = (specializationCount[spec] || 0) + 1;
      }
    });
    
    const topSpecializations = Object.entries(specializationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
    
    const stats = {
      total: validApps.length,
      pending: validApps.filter(app => app.status === 'pending').length,
      under_review: validApps.filter(app => app.status === 'under_review').length,
      approved: validApps.filter(app => app.status === 'approved').length,
      rejected: validApps.filter(app => app.status === 'rejected').length,
      averageExperience: avgExperience,
      topSpecializations
    };
    setStats(stats);
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchApplications();
    }
  }, [currentUser]);

  // Update application status
  const updateStatus = async (id, status, notes = '') => {
    if (!currentUser || currentUser.role !== 'admin') return;
    
    try {
      // console.log(`Updating application ${id} to status: ${status}`);
      
      // Get authentication token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        showMessage('error', 'No authentication token found. Please login again.');
        return;
      }
      
      // First update locally for immediate UI feedback
      const updatedApplications = applications.map(app => 
        app && app._id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app
      );
      setApplications(updatedApplications);
      calculateStats(updatedApplications);
      
      // Then update on server
      const response = await fetch(`${API_BASE_URL}/api/coach/applications/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, notes })
      });
      
      // console.log('Update response status:', response.status);
      
      const result = await response.json();
      // console.log('Update response data:', result);
      
      if (!response.ok) {
        throw new Error(result.message || `Server returned ${response.status}`);
      }
      
      showMessage('success', `Status updated to ${status.replace('_', ' ')}`);
      
    } catch (error) {
      // console.error('Error updating status:', error);
      showMessage('error', `Failed to update status: ${error.message}`);
      // Revert if error
      fetchApplications();
    }
  };

  // Send email to applicant
  const sendEmailToApplicant = async (application) => {
    try {
      setSendingEmail(true);
      
      // Get authentication token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        showMessage('error', 'No authentication token found. Please login again.');
        setSendingEmail(false);
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/coach/applications/${application._id}/send-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: emailContent.subject || `Update on Your Coach Application - ${application.firstName}`,
          body: emailContent.body || getDefaultEmailBody(application, application.status),
          status: application.status
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || `Server returned ${response.status}`);
      }
      
      showMessage('success', 'Email sent successfully');
      setShowEmailModal(false);
      setEmailContent({ subject: '', body: '' });
      
    } catch (error) {
      // console.error('Error sending email:', error);
      showMessage('error', `Failed to send email: ${error.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  const getDefaultEmailBody = (app, status) => {
    const statusText = status.replace('_', ' ');
    return `
Dear ${app.firstName},

Thank you for your interest in becoming a coach with us.

Your application status has been updated to: ${statusText.toUpperCase()}

${
  status === 'approved' 
    ? 'Congratulations! Your application has been approved. Our team will contact you shortly with next steps.'
    : status === 'rejected'
    ? 'After careful review, we regret to inform you that your application has not been approved at this time.'
    : 'Your application is currently under review. We will notify you once a decision has been made.'
}

Best regards,
The Coach Team
    `.trim();
  };

  // Delete application
  const deleteApplication = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }
    
    try {
      // console.log('Deleting application:', id);
      
      // Get authentication token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        showMessage('error', 'No authentication token found. Please login again.');
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/api/coach/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // console.log('Delete response status:', response.status);
      
      const result = await response.json();
      // console.log('Delete response data:', result);
      
      if (!response.ok) {
        throw new Error(result.message || `Server returned ${response.status}`);
      }
      
      // Remove from local state
      const updatedApplications = applications.filter(app => app && app._id !== id);
      setApplications(updatedApplications);
      calculateStats(updatedApplications);
      showMessage('success', 'Application deleted successfully');
      
      // Close modal if open
      if (isModalOpen && selectedApplication && selectedApplication._id === id) {
        setIsModalOpen(false);
      }
      
    } catch (error) {
      // console.error('Error deleting application:', error);
      showMessage('error', `Failed to delete application: ${error.message}`);
    }
  };

  // Filter and sort applications
  const filteredApplications = applications
    .filter(app => {
      if (!app) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (app.firstName?.toLowerCase() || '').includes(searchLower) ||
        (app.lastName?.toLowerCase() || '').includes(searchLower) ||
        (app.email?.toLowerCase() || '').includes(searchLower) ||
        (app.specialization?.toLowerCase() || '').includes(searchLower) ||
        (app.city?.toLowerCase() || '').includes(searchLower) ||
        (app.phone?.toLowerCase() || '').includes(searchLower) ||
        (app.certification?.toLowerCase() || '').includes(searchLower);

      const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle dates
      if (sortConfig.key === 'submittedAt' || sortConfig.key === 'updatedAt') {
        const aDate = new Date(aValue || 0);
        const bDate = new Date(bValue || 0);
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue.toLowerCase() < bValue.toLowerCase()) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue.toLowerCase() > bValue.toLowerCase()) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
      
      // Handle numbers
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

  // Export to CSV
  const exportToCSV = () => {
    setExporting(true);
    try {
      const headers = [
        'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'City', 'State',
        'Specialization', 'Experience', 'Certification', 'Available Days',
        'Available Hours', 'Bio Length', 'Status', 'Submitted At', 'Updated At'
      ];
      
      const csvData = filteredApplications.map(app => [
        `"${app._id || ''}"`,
        `"${app.firstName || ''}"`,
        `"${app.lastName || ''}"`,
        `"${app.email || ''}"`,
        `"${app.phone || ''}"`,
        `"${app.city || ''}"`,
        `"${app.state || ''}"`,
        `"${app.specialization || ''}"`,
        `"${app.experience || ''}"`,
        `"${app.certification || ''}"`,
        `"${(app.availableDays || []).join(', ') || ''}"`,
        `"${app.availableHours || ''}"`,
        `"${app.bio ? app.bio.length : 0}"`,
        `"${app.status || ''}"`,
        `"${app.submittedAt ? new Date(app.submittedAt).toISOString() : ''}"`,
        `"${app.updatedAt ? new Date(app.updatedAt).toISOString() : ''}"`
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coach_applications_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showMessage('success', 'CSV exported successfully');
    } catch (error) {
      // console.error('Export error:', error);
      showMessage('error', 'Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  // Format available days
  const formatDays = (days) => {
    if (!days || !Array.isArray(days) || days.length === 0) return 'None';
    return days.map(day => day.substring(0, 3)).join(', ');
  };

  // Get file URL
  // Get file URL - FIXED
const getFileUrl = (file) => {
  if (!file || !file.filename) return null;
  
  // If the file object already has a path, use it
  if (file.path) {
    // Check if path is already a full URL
    if (file.path.startsWith('http')) return file.path;
    // For relative paths, prepend the base URL
    return `${API_BASE_URL}${file.path.startsWith('/') ? '' : '/'}${file.path}`;
  }
  
  // If no path but has filename, check if filename includes directory
  if (file.filename.includes('/')) {
    // Already has directory in filename
    return `${API_BASE_URL}${file.filename.startsWith('/') ? '' : '/'}${file.filename}`;
  }
  
  // Default: Try both possible locations
  const possiblePaths = [
    `/uploads/profile-photo/${file.filename}`,
    `/uploads/resume/${file.filename}`,
    `/uploads/${file.filename}`,
    file.filename // Try as is
  ];
  
  // Return the first valid path format
  return `${API_BASE_URL}${possiblePaths[0]}`;
};

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { 
        color: 'bg-yellow-900/30 text-yellow-300', 
        icon: ClockIcon,
        label: 'PENDING'
      },
      under_review: { 
        color: 'bg-blue-900/30 text-blue-300', 
        icon: EyeIcon,
        label: 'UNDER REVIEW'
      },
      approved: { 
        color: 'bg-green-900/30 text-green-300', 
        icon: CheckCircleIcon,
        label: 'APPROVED'
      },
      rejected: { 
        color: 'bg-red-900/30 text-red-300', 
        icon: XCircleIcon,
        label: 'REJECTED'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  // Helper component for info rows
  const InfoRow = ({ icon: Icon, label, value, className = '' }) => (
    <div className={`flex items-start ${className}`}>
      <Icon className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <span className="text-gray-400 block text-sm mb-1">{label}</span>
        <span className="text-white font-medium truncate block">{value || 'N/A'}</span>
      </div>
    </div>
  );

  // Application detail modal
  const ApplicationModal = ({ application, onClose }) => {
    if (!application) return null;
    
    const profilePhotoUrl = getFileUrl(application.profilePhoto);
    const resumeUrl = getFileUrl(application.resume);
    const availableDays = Array.isArray(application.availableDays) ? application.availableDays : [];

    return (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-700">
          {/* Modal Header */}
          <div className="sticky top-0 bg-gray-900/95 border-b border-gray-700 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {profilePhotoUrl ? (
                  <img 
                    src={profilePhotoUrl} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="w-20 h-20 bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-full flex items-center justify-center border-2 border-emerald-500">
                          <svg class="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-full flex items-center justify-center border-2 border-emerald-500">
                    <UserIcon className="w-10 h-10 text-emerald-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {application.firstName} {application.lastName}
                  </h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <p className="text-gray-400">{application.specialization}</p>
                    <StatusBadge status={application.status} />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedApplication(application);
                    setShowEmailModal(true);
                  }}
                  className="p-2 bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white rounded-xl transition-colors"
                  title="Send Email"
                >
                  <EnvelopeIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-xl transition text-gray-400 hover:text-white"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-8">
            {/* Contact & Professional Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <UserIcon className="w-5 h-5 mr-2 text-emerald-400" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <InfoRow icon={EnvelopeIcon} label="Email" value={application.email} />
                  <InfoRow icon={PhoneIcon} label="Phone" value={application.phone} />
                  <InfoRow icon={MapPinIcon} label="Location" value={`${application.city}${application.state ? `, ${application.state}` : ''}`} />
                  <InfoRow icon={CalendarIcon} label="Submitted" value={new Date(application.submittedAt).toLocaleString()} />
                </div>
              </div>

              {/* Professional Info */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <BriefcaseIcon className="w-5 h-5 mr-2 text-blue-400" />
                  Professional Information
                </h3>
                <div className="space-y-4">
                  <InfoRow icon={AcademicCapIcon} label="Specialization" value={application.specialization} />
                  <InfoRow icon={CalendarIcon} label="Experience" value={`${application.experience || '0'} years`} />
                  <InfoRow icon={ShieldCheckIcon} label="Certifications" value={application.certification} />
                  <InfoRow icon={UserGroupIcon} label="Available Days" value={formatDays(availableDays)} />
                </div>
              </div>
            </div>

            {/* Availability & Hours */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-yellow-400" />
                Availability & Hours
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Available Days</h4>
                  <div className="flex flex-wrap gap-2">
                    {availableDays.map(day => (
                      <span key={day} className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 font-medium">
                        {day}
                      </span>
                    ))}
                    {availableDays.length === 0 && (
                      <span className="text-gray-500 italic">No days specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-400 text-sm mb-2">Preferred Hours</h4>
                  <p className="text-white font-medium">{application.availableHours || 'Not specified'}</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2 text-purple-400" />
                Bio / Introduction
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <p className="text-gray-300 whitespace-pre-line">{application.bio || 'No bio provided'}</p>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Characters: {application.bio ? application.bio.length : 0}</span>
                  <span className="text-gray-500">Words: {application.bio ? application.bio.split(/\s+/).filter(Boolean).length : 0}</span>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <DocumentTextIcon className="w-5 h-5 mr-2 text-red-400" />
                Attachments
              </h3>
              <div className="flex flex-wrap gap-4">
                {profilePhotoUrl && (
                  <a 
                    href={profilePhotoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-300"
                  >
                    <PhotoIcon className="w-5 h-5" />
                    <span>View Profile Photo</span>
                  </a>
                )}
                {resumeUrl && (
                  <a 
                    href={resumeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors duration-300"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>Download Resume</span>
                  </a>
                )}
                {!profilePhotoUrl && !resumeUrl && (
                  <p className="text-gray-500 italic">No attachments uploaded</p>
                )}
              </div>
            </div>

            {/* Status Actions */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">Update Application Status</h3>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {['pending', 'under_review', 'approved', 'rejected'].map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        updateStatus(application._id, status, applicationNotes[application._id] || '');
                        onClose();
                      }}
                      disabled={application.status === status}
                      className={`px-6 py-3 rounded-xl font-medium transition-colors duration-300 flex items-center ${
                        application.status === status
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : getStatusButtonClass(status)
                      }`}
                    >
                      {getStatusIcon(status)}
                      <span className="ml-2">Mark as {status.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
                
                <div className="pt-6 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Last updated: {application.updatedAt ? new Date(application.updatedAt).toLocaleString() : 'Never'}
                    </div>
                    <button
                      onClick={() => deleteApplication(application._id)}
                      className="flex items-center space-x-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-300"
                    >
                      <TrashIcon className="w-5 h-5" />
                      <span>Delete Application</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getStatusButtonClass = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'under_review': return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'approved': return 'bg-emerald-600 hover:bg-emerald-700 text-white';
      case 'rejected': return 'bg-red-600 hover:bg-red-700 text-white';
      default: return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  const getStatusIcon = (status) => {
    const Icon = status === 'approved' ? CheckCircleIcon :
                 status === 'rejected' ? XCircleIcon :
                 status === 'under_review' ? EyeIcon : ClockIcon;
    return <Icon className="w-5 h-5" />;
  };

  // Email Modal Component
  const EmailModal = ({ application, onClose }) => {
    if (!application) return null;

    return (
      <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
          {/* Modal Header */}
          <div className="sticky top-0 bg-gray-900/95 border-b border-gray-700 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Send Email to Applicant</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {application.firstName} {application.lastName} • {application.email}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-xl transition text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Email Form */}
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={emailContent.subject}
                onChange={(e) => setEmailContent({...emailContent, subject: e.target.value})}
                placeholder={`Update on Your Coach Application - ${application.firstName}`}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Message Body
              </label>
              <textarea
                value={emailContent.body}
                onChange={(e) => setEmailContent({...emailContent, body: e.target.value})}
                rows={10}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                placeholder={getDefaultEmailBody(application, application.status)}
              />
            </div>

            <div className="text-sm text-gray-400">
              <p>Tokens available: {application.firstName}, {application.lastName}, {application.status}</p>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => sendEmailToApplicant(application)}
                  disabled={sendingEmail}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {sendingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="w-5 h-5 mr-2" />
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Login as Admin
          </button>
        </div>
      </div>
    );
  }

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 pt-16 sm:pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
              <p className="text-gray-400">Loading coach applications...</p>
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
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors"
                title="Back to Admin Dashboard"
              >
                <ArrowLeftIcon className="h-5 w-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Coach Applications</h1>
                <p className="text-gray-400">Manage all coach applications in one place</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="px-3 py-1 bg-emerald-900/30 text-emerald-300 text-sm rounded-full">
                    Admin: {currentUser.username || currentUser.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1 bg-red-900/30 text-red-300 text-sm rounded-full hover:bg-red-800/50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <button
                onClick={exportToCSV}
                disabled={exporting || filteredApplications.length === 0}
                className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center ${
                  exporting || filteredApplications.length === 0
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Export CSV
                  </>
                )}
              </button>
              <button
                onClick={fetchApplications}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors"
                aria-label="Refresh applications"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-emerald-900/30 rounded-xl mr-4">
                  <DocumentTextIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Applications</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-blue-900/30 rounded-xl mr-4">
                  <ClockIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Pending Review</p>
                  <p className="text-2xl font-bold text-white">{stats.pending + stats.under_review}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center">
                <div className="p-3 bg-purple-900/30 rounded-xl mr-4">
                  <StarIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Average Experience</p>
                  <p className="text-2xl font-bold text-white">{stats.averageExperience} years</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'error' 
              ? 'bg-red-500/10 border-red-500/30' 
              : 'bg-green-500/10 border-green-500/30'
          }`}>
            <p className={`flex items-center ${
              message.type === 'error' ? 'text-red-400' : 'text-green-400'
            }`}>
              <span className="mr-2">
                {message.type === 'error' ? (
                  <XCircleIcon className="h-5 w-5" />
                ) : (
                  <CheckCircleIcon className="h-5 w-5" />
                )}
              </span> 
              {message.text}
            </p>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, email, specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-3 rounded-xl transition-colors ${
                  showFilters ? 'bg-emerald-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
              <button
                onClick={fetchApplications}
                className="p-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                title="Refresh"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-red-900/30 hover:bg-red-800/50 text-red-300 rounded-xl transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-4 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {currentApplications.length} of {filteredApplications.length} applications
          </div>
          <div className="bg-gray-800/50 p-3 rounded-xl">
            <div className="flex items-center">
              <span className="text-white font-bold text-lg mr-2">{filteredApplications.length}</span>
              <span className="text-gray-500 text-sm">of {applications.length}</span>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
              <span className="ml-4 text-gray-400">Loading applications...</span>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 p-8">
              <div className="text-6xl mb-4 text-gray-600">📋</div>
              <p className="text-gray-400 text-xl mb-2">No applications found</p>
              <p className="text-gray-500 text-center max-w-md">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try changing your filters or search term'
                  : 'Applications will appear here once submitted by coaches.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-gray-900/50">
                      <th className="py-4 px-6 text-left">
                        <button
                          onClick={() => handleSort('firstName')}
                          className="flex items-center space-x-1 hover:text-white transition-colors text-sm font-medium text-gray-300"
                        >
                          <span>Applicant</span>
                          <ChevronUpDownIcon className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="text-sm font-medium text-gray-300">Contact</span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="text-sm font-medium text-gray-300">Location</span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="text-sm font-medium text-gray-300">Specialization</span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <button
                          onClick={() => handleSort('experience')}
                          className="flex items-center space-x-1 hover:text-white transition-colors text-sm font-medium text-gray-300"
                        >
                          <span>Experience</span>
                          <ChevronUpDownIcon className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="text-sm font-medium text-gray-300">Status</span>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <button
                          onClick={() => handleSort('submittedAt')}
                          className="flex items-center space-x-1 hover:text-white transition-colors text-sm font-medium text-gray-300"
                        >
                          <span>Submitted</span>
                          <ChevronUpDownIcon className="h-4 w-4" />
                        </button>
                      </th>
                      <th className="py-4 px-6 text-left">
                        <span className="text-sm font-medium text-gray-300">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {currentApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden border-2 border-gray-700">
                              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-emerald-900/30 to-green-900/30">
                                <UserIcon className="h-6 w-6 text-emerald-400" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-white">
                                {app.firstName} {app.lastName}
                              </div>
                              <div className="text-sm text-gray-400">
                                {app.experience || '0'} {app.experience === '1' ? 'year' : 'years'} exp
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <EnvelopeIcon className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-300 truncate max-w-[150px]" title={app.email}>
                                {app.email}
                              </span>
                            </div>
                            <div className="text-sm text-gray-400">
                              {app.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300" title={`${app.city}${app.state ? `, ${app.state}` : ''}`}>
                            {app.city}{app.state ? `, ${app.state}` : ''}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300 truncate max-w-[150px]" title={app.specialization}>
                            {app.specialization}
                          </div>
                          {app.certification && (
                            <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]" title={app.certification}>
                              {app.certification}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-3 py-1 bg-gray-700 rounded-full text-sm">
                            {app.experience || '0'} {app.experience === '1' ? 'year' : 'years'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 text-gray-500 mr-2" />
                              <div>
                                <p className="text-gray-300">
                                  {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {app.submittedAt ? new Date(app.submittedAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  }) : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedApplication(app);
                                setIsModalOpen(true);
                              }}
                              className="p-2 bg-gray-700 hover:bg-blue-600 rounded-xl transition-colors"
                              title="View Details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedApplication(app);
                                setShowEmailModal(true);
                              }}
                              className="p-2 bg-gray-700 hover:bg-emerald-600 rounded-xl transition-colors"
                              title="Send Email"
                            >
                              <EnvelopeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(app._id, 'approved')}
                              disabled={app.status === 'approved'}
                              className="p-2 bg-gray-700 hover:bg-emerald-600 disabled:bg-emerald-800 rounded-xl transition-colors disabled:cursor-not-allowed"
                              title="Approve"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="text-sm text-gray-400">
                      Page {currentPage} of {totalPages} • Showing {currentApplications.length} of {filteredApplications.length} applications
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-xl transition-colors ${
                          currentPage === 1
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <ChevronLeftIcon className="h-5 w-5" />
                      </button>
                      
                      {/* Page numbers */}
                      {(() => {
                        const pageButtons = [];
                        const maxVisiblePages = 5;
                        
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                        
                        // Adjust start page if we're near the end
                        if (endPage - startPage + 1 < maxVisiblePages) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }
                        
                        for (let page = startPage; page <= endPage; page++) {
                          pageButtons.push(
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-4 py-2 rounded-xl transition-colors ${
                                currentPage === page
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                        
                        return pageButtons;
                      })()}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-xl transition-colors ${
                          currentPage === totalPages
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <ChevronRightIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Debug Info - Remove in production */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-800/30 rounded-xl text-xs text-gray-400">
            <p>Debug Info:</p>
            <p>Applications: {applications.length}, Filtered: {filteredApplications.length}</p>
            <p>Backend: {API_BASE_URL}</p>
            <p>Current User: {currentUser?.email} ({currentUser?.role})</p>
            <p>Status filter: {filterStatus}</p>
            <p>Search term: {searchTerm || '(none)'}</p>
            <p>Page: {currentPage} of {totalPages}</p>
          </div>
        )} */}
      </div>

      {/* Application Detail Modal */}
      {isModalOpen && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Email Modal */}
      {showEmailModal && selectedApplication && (
        <EmailModal
          application={selectedApplication}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
};

export default CoachApplicationsAdmin;