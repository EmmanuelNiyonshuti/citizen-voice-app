import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  DocumentTextIcon,
  ClockIcon,
  MagnifyingGlassCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const StatCard = ({ title, value, description, icon: Icon, color, percentage }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {value}
              </div>
              {percentage && (
                <span className={`ml-2 text-sm font-medium ${
                  percentage > 0 ? 'text-green-600' : percentage < 0 ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {percentage > 0 ? '+' : ''}{percentage}%
                </span>
              )}
            </dd>
            {description && (
              <p className="text-sm text-gray-600 mt-1">
                {description}
              </p>
            )}
          </dl>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inReview: 0,
    resolved: 0,
    rejected: 0,
    recentComplaints: 0,
    categoryDistribution: {},
    weeklyTrend: 0,
    averageResolutionTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchDashboardStats, 300000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch dashboard statistics. ' + (err.response?.data?.message || err.message));
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-200 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
          <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
    <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Last updated: {new Date().toLocaleString()}
          </p>
        </div>
          <button
            onClick={fetchDashboardStats}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Refresh Stats
          </button>
      </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Complaints"
            value={stats.total}
            description="All time complaints received"
            icon={DocumentTextIcon}
            color="text-gray-400"
            percentage={stats.weeklyTrend}
          />

          <StatCard
            title="Pending Review"
            value={stats.pending}
            description={`${((stats.pending / stats.total) * 100).toFixed(1)}% of total complaints`}
            icon={ClockIcon}
            color="text-yellow-400"
          />

          <StatCard
            title="In Review"
            value={stats.inReview}
            description={`${((stats.inReview / stats.total) * 100).toFixed(1)}% of total complaints`}
            icon={MagnifyingGlassCircleIcon}
            color="text-blue-400"
          />

          <StatCard
            title="Resolved"
            value={stats.resolved}
            description={`${((stats.resolved / stats.total) * 100).toFixed(1)}% resolution rate`}
            icon={CheckCircleIcon}
            color="text-green-400"
          />

          <StatCard
            title="Average Resolution Time"
            value={`${stats.averageResolutionTime || 0} days`}
            description="Average time to resolve a complaint"
            icon={CalendarIcon}
            color="text-indigo-400"
          />

          <StatCard
            title="Recent (7 Days)"
            value={stats.recentComplaints}
            description="New complaints in the last week"
            icon={ChartBarIcon}
            color="text-purple-400"
          />
      </div>

      {/* Category Distribution */}
        {stats.categoryDistribution && Object.keys(stats.categoryDistribution).length > 0 && (
      <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Complaints by Category</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(stats.categoryDistribution || {}).map(([category, count]) => (
            <div
              key={category}
                  className="bg-white overflow-hidden shadow rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {category.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {count} complaints
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-semibold text-gray-900">
                        {((count / stats.total) * 100).toFixed(1)}%
                      </div>
                    </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        )}
      </div>
    </div>
  );
} 