import { Routes, Route, Navigate } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';

import HomePage from '../pages/HomePage';
import ActivitiesPage from '../pages/ActivitiesPage';
import ActivityDetail from '../components/ActivityDetail';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Protected Activities Routes */}
      <Route
        path="/activities"
        element={
          <ProtectedRoute>
            <ActivitiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activities/:id"
        element={
          <ProtectedRoute>
            <ActivityDetail />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;