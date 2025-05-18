import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaint from './pages/TrackComplaint';
import SubmissionSuccess from './pages/SubmissionSuccess';
import Feedback from './pages/Feedback';
import FeedbackSuccess from './pages/FeedbackSuccess';
import AdminDashboard from './pages/admin/Dashboard';
import AgencyDashboard from './pages/agency/Dashboard';
import ManageComplaints from './pages/admin/ManageComplaints';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Citizen Only Route Component
function CitizenOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect admins and agency admins to their respective dashboards
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    }
    if (user.role === 'agencyadmin') {
      return <Navigate to="/agency-dashboard" />;
    }
  }

  return children;
}

// App Layout Component
function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Citizen Only Routes */}
            <Route
              path="/submit"
              element={
                <CitizenOnlyRoute>
                  <SubmitComplaint />
                </CitizenOnlyRoute>
              }
            />
            <Route path="/track" element={<TrackComplaint />} />
            <Route
              path="/submission-success"
              element={
                <CitizenOnlyRoute>
                  <SubmissionSuccess />
                </CitizenOnlyRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <CitizenOnlyRoute>
                  <Feedback />
                </CitizenOnlyRoute>
              }
            />
            <Route
              path="/feedback/success"
              element={
                <CitizenOnlyRoute>
                  <FeedbackSuccess />
                </CitizenOnlyRoute>
              }
            />
            
            {/* Protected Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/complaints"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageComplaints />
                </ProtectedRoute>
              }
            />

            {/* Protected Agency Admin Routes */}
            <Route
              path="/agency-dashboard"
              element={
                <ProtectedRoute allowedRoles={['agencyadmin']}>
                  <AgencyDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
