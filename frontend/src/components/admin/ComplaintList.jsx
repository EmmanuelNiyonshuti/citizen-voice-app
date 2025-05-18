import { format } from 'date-fns';

export default function ComplaintList({ complaints, selectedComplaintId, onSelectComplaint }) {
  return (
    <div className="overflow-hidden">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Complaints</h3>
      </div>
      <ul role="list" className="divide-y divide-gray-200 overflow-y-auto max-h-[calc(100vh-16rem)]">
        {complaints.map((complaint) => (
          <li
            key={complaint._id}
            className={`cursor-pointer hover:bg-gray-50 ${
              selectedComplaintId === complaint._id ? 'bg-primary-50' : ''
            }`}
            onClick={() => onSelectComplaint(complaint)}
          >
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="truncate text-sm font-medium text-primary-600">
                  {complaint.title}
                </div>
                <div className="ml-2 flex flex-shrink-0">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      {
                        PENDING: 'bg-yellow-100 text-yellow-800',
                        IN_REVIEW: 'bg-blue-100 text-blue-800',
                        RESOLVED: 'bg-green-100 text-green-800',
                        REJECTED: 'bg-red-100 text-red-800',
                      }[complaint.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <div className="sm:flex">
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="truncate">Category: {complaint.category}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <span className="truncate">
                    {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 