import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAdminAnalytics } from '../../features/admin/adminSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { analytics, isLoading } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAdminAnalytics());
  }, [dispatch]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}! Manage the entire platform</p>
      </div>

      <div className="dashboard-actions">
        <Link to="/admin/users" className="action-card">
          <h3>Manage Users</h3>
          <p>View and manage customers and providers</p>
        </Link>
        
        <Link to="/admin/buses" className="action-card">
          <h3>Manage Buses</h3>
          <p>Oversee all registered buses</p>
        </Link>
        
        <Link to="/admin/bookings" className="action-card">
          <h3>Manage Bookings</h3>
          <p>Monitor all booking activities</p>
        </Link>
      </div>

      <div className="dashboard-stats">
        <h2>Platform Statistics</h2>
        {isLoading ? (
          <p>Loading statistics...</p>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p className="stat-number">{(analytics?.totalCustomers || 0) + (analytics?.totalProviders || 0)}</p>
            </div>
            <div className="stat-card">
              <h3>Total Buses</h3>
              <p className="stat-number">{analytics?.totalBuses || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-number">{analytics?.totalBookings || 0}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-number">₹{analytics?.totalRevenue || 0}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;