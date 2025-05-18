import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import ComplaintList from '../../components/admin/ComplaintList';
import ComplaintDetail from '../../components/admin/ComplaintDetail';

export default function AgencyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inReview: 0,
    resolved: 0,
    rejected: 0
  });
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if user is not an agency admin or agency info is missing
    if (!user || user.role !== 'agencyadmin' || !user.agency) {
      navigate('/login');
      return;
    }
    
    fetchAgencyComplaints();
  }, [user, navigate]);

  // Fetch agency complaints and stats
  const fetchAgencyComplaints = async () => {
    try {
      const [complaintsRes, statsRes] = await Promise.all([
        api.get('/agency/complaints'),
        api.get('/agency/complaints/stats')
      ]);

      setComplaints(complaintsRes.data.complaints);
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to load agency dashboard data');
      console.error('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle complaint status update
  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await api.patch(`/complaints/${complaintId}`, { status: newStatus });
      await fetchAgencyComplaints();
      setError(null);
    } catch (err) {
      setError('Failed to update complaint status');
      console.error('Status update error:', err);
    }
  };

  // Handle complaint response
  const handleResponse = async (complaintId, response) => {
    try {
      await api.post(`/complaints/${complaintId}`, { message: response });
      await fetchAgencyComplaints();
      setError(null);
    } catch (err) {
      setError('Failed to submit response');
      console.error('Response submission error:', err);
    }
  };

  if (!user || user.role !== 'agencyadmin' || !user.agency) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { name: 'Total Complaints', value: stats.total, icon: ChartBarIcon },
    { name: 'Pending Review', value: stats.pending, icon: ClockIcon },
    { name: 'In Progress', value: stats.inReview, icon: ClipboardDocumentCheckIcon },
    { name: 'Resolved', value: stats.resolved, icon: ClipboardDocumentCheckIcon },
    { name: 'Rejected', value: stats.rejected, icon: XCircleIcon },
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {user.agency.name} - Dashboard
        </h1>
        
        {error && (
          <div className="mt-4 bg-red-50 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="mt-8 bg-white shadow-sm rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Complaints List */}
            <div className="lg:col-span-1 border-r border-gray-200">
              <ComplaintList
                complaints={complaints}
                selectedComplaintId={selectedComplaint?._id}
                onSelectComplaint={(complaint) => setSelectedComplaint(complaint)}
              />
            </div>

            {/* Complaint Detail */}
            <div className="lg:col-span-2">
              {selectedComplaint ? (
                <ComplaintDetail
                  complaint={selectedComplaint}
                  onStatusUpdate={handleStatusUpdate}
                  onResponse={handleResponse}
                />
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Select a complaint to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 