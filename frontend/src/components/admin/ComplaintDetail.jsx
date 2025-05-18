import { useState } from 'react';
import { format } from 'date-fns';

export default function ComplaintDetail({ complaint, onStatusUpdate, onResponse }) {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    setIsSubmitting(true);
    try {
      await onResponse(complaint._id, response);
      setResponse('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = ['PENDING', 'IN_REVIEW', 'RESOLVED', 'REJECTED'];

  return (
    <div className="h-full bg-white">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Complaint Details
        </h3>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Title</dt>
            <dd className="mt-1 text-sm text-gray-900">{complaint.title}</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
              {complaint.description}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="mt-1 text-sm text-gray-900">{complaint.category}</dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Submitted On</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <select
                value={complaint.status}
                onChange={(e) => onStatusUpdate(complaint._id, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </dd>
          </div>
        </dl>

        {/* Response History */}
        {complaint.responses && complaint.responses.length > 0 && (
          <div className="mt-8">
            <h4 className="text-sm font-medium text-gray-500">Response History</h4>
            <div className="mt-2 flow-root">
              <ul role="list" className="-mb-8">
                {complaint.responses.map((response, idx) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx !== complaint.responses.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
                            <span className="text-primary-700 text-sm font-medium">
                              {response.responder?.fullName?.[0] || 'A'}
                            </span>
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              {response.message}
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            {format(new Date(response.createdAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Add Response Form */}
        <div className="mt-8">
          <form onSubmit={handleSubmitResponse}>
            <div>
              <label
                htmlFor="response"
                className="block text-sm font-medium text-gray-700"
              >
                Add Response
              </label>
              <div className="mt-1">
                <textarea
                  id="response"
                  name="response"
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                type="submit"
                disabled={isSubmitting || !response.trim()}
                className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 