import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './app/store';
import ProtectedRoute from './routes/ProtectedRoute';
import { initializeAuth } from './features/auth/authSlice';

// Auth Components
import Login from './components/auth/Login';
import CustomerRegister from './components/auth/CustomerRegister';
import ProviderRegister from './components/auth/ProviderRegister';

// Customer Components
import CustomerDashboard from './components/customer/CustomerDashboard';
import BusSearch from './components/customer/BusSearch';
import SeatSelection from './components/customer/SeatSelection';
import BookingHistory from './components/customer/BookingHistory';
import CustomerProfile from './components/customer/CustomerProfile';

// Provider Components
import ProviderDashboard from './components/provider/ProviderDashboard';
import AddBus from './components/provider/AddBus';
import AddSchedule from './components/provider/AddSchedule';
import ProviderProfile from './components/provider/ProviderProfile';
import ProviderAnalytics from './components/provider/ProviderAnalytics';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsers from './components/admin/AdminUsers';
import AdminBuses from './components/admin/AdminBuses';
import AdminBookings from './components/admin/AdminBookings';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './components/common/Home';
import Unauthorized from './components/common/Unauthorized';

const AppContent = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const [authInitialized, setAuthInitialized] = useState(false);
  
  useEffect(() => {
    // Check if there's a token in sessionStorage
    const token = sessionStorage.getItem('token');
    const storedRole = sessionStorage.getItem('role');
    
    if (token && storedRole) {
      // Initialize auth from sessionStorage
      dispatch(initializeAuth());
    }
    
    // Mark as initialized after a brief delay to ensure Redux state is updated
    const timer = setTimeout(() => {
      setAuthInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [dispatch]);

  if (!authInitialized) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<BusSearch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/customer" element={<CustomerRegister />} />
            <Route path="/register/provider" element={<ProviderRegister />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/search" element={<BusSearch />} />
            <Route path="/seats/:scheduleId" element={<SeatSelection />} />

            {/* Customer Routes */}
            <Route
              path="/customer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/search"
              element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                  <BusSearch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/seats/:scheduleId"
              element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                  <SeatSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/bookings"
              element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                  <BookingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer/profile"
              element={
                <ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}>
                  <CustomerProfile />
                </ProtectedRoute>
              }
            />

            {/* Provider Routes */}
            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER']}>
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/add-bus"
              element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER']}>
                  <AddBus />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/add-schedule"
              element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER']}>
                  <AddSchedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/profile"
              element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER']}>
                  <ProviderProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/analytics"
              element={
                <ProtectedRoute allowedRoles={['ROLE_PROVIDER']}>
                  <ProviderAnalytics />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/buses"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminBuses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />

            {/* Redirect based on role */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
      </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
