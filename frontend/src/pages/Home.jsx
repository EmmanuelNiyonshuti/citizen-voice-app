import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  DocumentCheckIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  BellAlertIcon,
  ClockIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline';

const citizenFeatures = [
  {
    name: 'Easy Submission',
    description: 'Submit your concerns quickly and easily through our user-friendly form.',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    name: 'Real-time Tracking',
    description: 'Stay informed about your submission status with our transparent tracking system.',
    icon: ChartBarIcon,
  },
  {
    name: 'Direct Communication',
    description: 'Receive updates directly from the government officials working on your case.',
    icon: UserGroupIcon,
  },
  {
    name: 'Share Your Experience',
    description: 'Help improve public services by providing feedback on resolved cases.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
];

const adminFeatures = [
  {
    name: 'Complaint Management',
    description: 'Review and manage citizen complaints efficiently through a centralized dashboard.',
    icon: DocumentMagnifyingGlassIcon,
  },
  {
    name: 'Status Updates',
    description: 'Update complaint statuses and track resolution progress in real-time.',
    icon: ClipboardDocumentListIcon,
  },
  {
    name: 'Direct Response',
    description: 'Communicate directly with citizens about their complaints and resolutions.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Performance Tracking',
    description: 'Monitor complaint resolution metrics and department performance.',
    icon: DocumentCheckIcon,
  },
];

const agencyFeatures = [
  {
    name: 'Specialized Dashboard',
    description: "Access a dashboard tailored to your agency's specific categories and responsibilities.",
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Category Management',
    description: "Handle complaints specifically assigned to your agency's domain of expertise.",
    icon: ShieldCheckIcon,
  },
  {
    name: 'Quick Response',
    description: 'Provide timely responses to citizen complaints within your jurisdiction.',
    icon: BellAlertIcon,
  },
  {
    name: 'Resolution Tracking',
    description: 'Monitor resolution times and maintain high service standards.',
    icon: ClockIcon,
  },
];

export default function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isAgencyAdmin = user?.role === 'agencyadmin';
  
  // Select features based on user role
  let features;
  if (isAdmin) {
    features = adminFeatures;
  } else if (isAgencyAdmin) {
    features = agencyFeatures;
  } else {
    features = citizenFeatures;
  }

  // Get appropriate title and description based on user role
  const getContent = () => {
    if (isAdmin) {
      return {
        title: 'Admin Dashboard',
        description: 'Manage and respond to citizen complaints efficiently. Monitor complaint status, provide updates, and ensure timely resolution.',
        primaryButton: {
          text: 'View Dashboard',
          link: '/admin/dashboard'
        },
        secondaryButton: {
          text: 'Manage Complaints',
          link: '/admin/complaints'
        }
      };
    } else if (isAgencyAdmin && user.agency) {
      return {
        title: `${user.agency.name} Dashboard`,
        description: `Manage and respond to citizen complaints about ${user.agency.categories.join(', ').toLowerCase()} efficiently. Monitor complaint statuses, provide updates, and ensure timely resolution within your jurisdiction.`,
        primaryButton: {
          text: 'View Dashboard',
          link: '/agency-dashboard'
        }
      };
    } else {
      return {
        title: 'Speak Up. Engage. Improve Your Community.',
        description: 'Your voice matters in shaping better public services across Rwanda. Share your concerns, track their resolution, and help build a more responsive government.',
        primaryButton: {
          text: 'Submit a Complaint',
          link: '/submit'
        },
        secondaryButton: {
          text: 'Track Complaint',
          link: '/track'
        },
        tertiaryButton: {
          text: 'Give Feedback',
          link: '/feedback'
        }
      };
    }
  };

  const content = getContent();

  return (
    <div className="relative isolate">
      {/* Hero section */}
      <div className="relative pt-14">
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                {content.title}
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {content.description}
              </p>
              
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to={content.primaryButton.link}
                  className="btn btn-primary"
                >
                  {content.primaryButton.text}
                </Link>
                {content.secondaryButton && (
                  <Link
                    to={content.secondaryButton.link}
                    className="btn btn-secondary"
                  >
                    {content.secondaryButton.text}
                  </Link>
                )}
                {content.tertiaryButton && (
                  <Link
                    to={content.tertiaryButton.link}
                    className="btn btn-secondary"
                  >
                    {content.tertiaryButton.text}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary-600">
              {isAdmin ? 'Administrative Tools' : isAgencyAdmin ? 'Agency Tools' : 'Your Voice Matters'}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {isAdmin ? 'Tools to serve citizens better' : isAgencyAdmin ? 'Tools to handle complaints effectively' : 'Building a Better Rwanda Together'}
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {isAdmin
                ? 'Our administrative dashboard provides all the tools you need to manage complaints effectively and ensure citizen satisfaction.'
                : isAgencyAdmin && user.agency
                ? `Our specialized agency dashboard helps you manage ${user.agency.categories.join(', ').toLowerCase()} related complaints efficiently and maintain high service standards.`
                : 'Together, we can improve public services and build stronger communities. Your feedback helps create positive change across Rwanda.'}
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon className="h-5 w-5 flex-none text-primary-600" aria-hidden="true" />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0">
            <p className="text-center text-sm leading-5 text-gray-500">
              &copy; {new Date().getFullYear()} Citizen Complaints & Engagement Platform
              <span className="block sm:inline sm:ml-1">Built with love for Rwanda</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 