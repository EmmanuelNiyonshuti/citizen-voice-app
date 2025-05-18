import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircleIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function SubmissionSuccess() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  
  // If no submission data is available, redirect to home
  if (!location.state?.complaint) {
    return <Navigate to="/" replace />;
  }

  const { complaint } = location.state;
  const submissionDate = new Date(complaint.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(complaint.ticketId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
              Complaint Submitted Successfully!
            </h2>
            
            <p className="mt-2 text-base text-gray-600">
              Your complaint has been successfully submitted on {submissionDate}
            </p>
          </div>

          <div className="mt-8">
            <div className="rounded-md bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Tracking ID</h3>
                  <p className="mt-1 text-lg font-semibold text-primary-600">{complaint.ticketId}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Please keep this ID safe to track the status of your complaint
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  <ClipboardDocumentIcon className="h-5 w-5 mr-2 text-gray-400" />
                  {copied ? 'Copied!' : 'Copy ID'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/track?id=${complaint.ticketId}`}
              className="btn btn-primary flex-1 text-center"
            >
              Track This Complaint
            </Link>
            <Link
              to="/"
              className="btn btn-secondary flex-1 text-center"
            >
              Return to Home
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at support@citizenreport.rw
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 