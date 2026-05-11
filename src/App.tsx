import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DestinationProvider } from './context/DestinationContext';
import { AdminBookings }
from './pages/AdminBookings';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const ExplorePage = lazy(() => import('./pages/ExplorePage').then(m => ({ default: m.ExplorePage })));
const DestinationDetailsPage = lazy(() => import('./pages/DestinationDetailsPage').then(m => ({ default: m.DestinationDetailsPage })));
const AboutPage = lazy(() => import('./pages/AboutContactPages').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/AboutContactPages').then(m => ({ default: m.ContactPage })));
const AuthPage = lazy(() => import('./pages/AuthPages').then(m => ({ default: m.AuthPage })));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const WishlistPage = lazy(() => import('./pages/WishlistPage').then(m => ({ default: m.WishlistPage })));

const ScrollToHash = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [hash]);

  return null;
};

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased">
      <ScrollToHash />
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/destination/:id" element={<DestinationDetailsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
            path="/admin/bookings"
              element={<AdminBookings />}
             />
          </Routes>
        </Suspense>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DestinationProvider>
        <Router>
          <AppContent />
        </Router>
      </DestinationProvider>
    </AuthProvider>
  );
}
