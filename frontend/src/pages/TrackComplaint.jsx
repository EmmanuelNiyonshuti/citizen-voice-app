import { useState } from 'react';
import api from '../api/axios';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const statusIcons = {
  PENDING: ClockIcon,
  IN_REVIEW: MagnifyingGlassIcon,
  RESOLVED: CheckCircleIcon,
  REJECTED: ExclamationTriangleIcon
};

const statusColors = {
  PENDING: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  IN_REVIEW: 'text-blue-700 bg-blue-50 border-blue-200',
  RESOLVED: 'text-green-700 bg-green-50 border-green-200',
  REJECTED: 'text-red-700 bg-red-50 border-red-200'
};

const statusMessages = {
  PENDING: 'Your complaint is pending review',
  IN_REVIEW: 'Your complaint is being reviewed',
  RESOLVED: 'Your complaint has been resolved',
  REJECTED: 'Your complaint has been rejected'
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

export default function TrackComplaint() {
  const [trackingId, setTrackingId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }
    
    setError('');
    setComplaint(null);
    setLoading(true);

    try {
      const response = await api.get(`/complaints/track/${trackingId.trim()}`);
      setComplaint(response.data.complaint);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch complaint status');
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = complaint ? statusIcons[complaint.status] : null;
  const statusColor = complaint ? statusColors[complaint.status] : '';
  const statusMessage = complaint ? statusMessages[complaint.status] : '';

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Track Your Complaint</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700">
                Tracking ID
              </label>
              <input
                type="text"
                id="trackingId"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Enter your tracking ID"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
              >
                {loading ? 'Tracking...' : 'Track Complaint'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {complaint && (
            <div className="mt-8 space-y-6">
              <div className={`p-4 rounded-md border ${statusColor}`}>
                <div className="flex items-center">
                  {StatusIcon && <StatusIcon className="h-5 w-5 mr-2" />}
                  <div>
                    <h3 className="font-medium">Status: {complaint.status?.replace(/_/g, ' ')}</h3>
                    <p className="text-sm mt-1">{statusMessage}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Complaint Details</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tracking ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{complaint.ticketId}</dd>
                  </div>
                  
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{complaint.fullName || 'Not provided'}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {complaint.category?.replace(/_/g, ' ') || 'Not specified'}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {complaint.description || 'No description provided'}
                    </dd>
                  </div>

                  {complaint.location && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900">{complaint.location}</dd>
                    </div>
                  )}

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Submitted On</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(complaint.createdAt)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(complaint.updatedAt)}
                    </dd>
                  </div>

                  {complaint.adminResponse && (
                    <div className="pt-4 border-t border-gray-200">
                      <dt className="text-sm font-medium text-gray-500">Admin Response</dt>
                      <dd className="mt-2 text-sm text-gray-900">
                        <div className="bg-white p-4 rounded-md border border-gray-200">
                          <p className="whitespace-pre-wrap">{complaint.adminResponse.message}</p>
                          {complaint.adminResponse.respondedAt && (
                            <p className="mt-2 text-xs text-gray-500">
                              Responded on: {formatDate(complaint.adminResponse.respondedAt)}
                            </p>
                          )}
                        </div>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 