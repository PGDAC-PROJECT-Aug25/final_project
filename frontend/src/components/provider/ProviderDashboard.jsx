import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProviderDashboard, getProviderAnalytics } from '../../features/provider/providerSlice';

const ProviderDashboard = () => {
  const dispatch = useDispatch();
  const { buses, analytics, isLoading } = useSelector((state) => state.provider);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getProviderDashboard());
    dispatch(getProviderAnalytics());
  }, [dispatch]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Manage your buses and schedules</p>
      </div>

      <div className="dashboard-actions">
        <Link to="/provider/add-bus" className="action-card">
          <h3>Add Bus</h3>
          <p>Register a new bus to your fleet</p>
        </Link>
        
        <Link to="/provider/add-schedule" className="action-card">
          <h3>Add Schedule</h3>
          <p>Create new bus schedules</p>
        </Link>
        
        <Link to="/provider/analytics" className="action-card">
          <h3>Analytics</h3>
          <p>View your business performance</p>
        </Link>
        
        <Link to="/provider/profile" className="action-card">
          <h3>Profile</h3>
          <p>Update your company information</p>
        </Link>
      </div>

      <div className="dashboard-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Buses</h3>
            <p className="stat-number">{analytics?.totalBuses || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Active Schedules</h3>
            <p className="stat-number">{analytics?.totalSchedules || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">₹{analytics?.totalRevenue || 0}</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Buses</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : buses?.length > 0 ? (
          <div className="buses-list">
            {buses.slice(0, 5).map((bus) => (
              <div key={bus.busId} className="bus-card">
                <div className="bus-info">
                  <h4>{bus.busNumber || 'N/A'}</h4>
                  <p>{bus.busType || 'N/A'} - {bus.totalSeats || 0} seats</p>
                  <p>Status: <span className={`status ${bus.status?.toLowerCase() || 'inactive'}`}>{bus.status || 'N/A'}</span></p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-buses">
            <p>No buses registered yet</p>
            <Link to="/provider/add-bus" className="btn btn-primary">
              Add Your First Bus
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
