// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppProvider } from './context/AppContext';
import AppointmentDetails from './components/appointments/AppointmentDetails';
import AppointmentList from './components/appointments/AppointmentList';
import AppointmentFilters from './components/appointments/AppointmentFilters';
import RescheduleForm from './components/appointments/RescheduleForm';

// Components
import ErrorBoundary from './components/common/ErrorBoundary';
import SlotPicker from './components/booking/SlotPicker';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorListing from './pages/DoctorListing';
import BookAppointment from './pages/BookAppointment';
import AppointmentDashboard from './components/dashboard/AppointmentDashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Hooks
import { useAuth } from './hooks/useAuth';

// Styles
import './styles/globals.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// // Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <AppProvider>
            <Router>
              <div className="app">
                <main className="main-content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/register"
                      element={
                        <PublicRoute>
                          <Register />
                        </PublicRoute>
                      }
                    />
                    <Route path="/doctors" element={<DoctorListing />} />
                    {/* Protected Routes */}
                    <Route
                      path="/book/:doctorId"
                      element={
                        // <ProtectedRoute>
                          <BookAppointment />
                        // </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        // <ProtectedRoute>
                          <AppointmentDashboard />
                        // </ProtectedRoute>
                      }
                    >
                      {/* Sub-routes for AppointmentDashboard */}
                      {/* <Route path="card" element={<AppointmentCard />} /> */}
                      <Route path="details/:id" element={<AppointmentDetails />} />
                      {/* <Route path="list" element={<AppointmentList />} /> */}
                      <Route path="filters" element={<AppointmentFilters />} />
                      <Route path="reschedule/:id" element={<RescheduleForm />} />
                    </Route>
                    <Route
                      path="/list"
                      element={
                        // <ProtectedRoute>
                          <AppointmentList />
                        // </ProtectedRoute>
                      }
                    ></Route>
                    <Route
                      path="/profile"
                      element={
                        // <ProtectedRoute>
                          <Profile />
                        // </ProtectedRoute>
                      }
                    />
                    {/* Catch all route */}
                    <Route path="*" element={<NotFound />} />
                    <Route path="/slot-picker" element={<SlotPicker />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </AppProvider>
        </NotificationProvider>
        </AuthProvider>
      </ErrorBoundary>
  );
}

export default App;