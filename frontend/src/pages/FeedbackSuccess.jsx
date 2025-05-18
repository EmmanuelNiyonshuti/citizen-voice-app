import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function FeedbackSuccess() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          🎉 Thank you for your feedback!
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Your voice matters to us. We appreciate you taking the time to share your thoughts.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="btn btn-primary"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 