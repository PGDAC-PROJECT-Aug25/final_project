import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProviderAnalytics } from '../../features/provider/providerSlice';

const ProviderAnalytics = () => {
  const dispatch = useDispatch();
  const { analytics, isLoading, error } = useSelector((state) => state.provider);

  useEffect(() => {
    dispatch(getProviderAnalytics());
  }, [dispatch]);

  if (isLoading) {
    return <div className="loading">Loading analytics...</div>;
  }

  if (error) {
    return (
      <div className="analytics">
        <div className="page-header">
          <h1>Analytics Dashboard</h1>
          <p>Unable to load analytics data</p>
        </div>
        <div className="no-data">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics">
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Track your business performance</p>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Revenue</h3>
          <p className="analytics-number">₹{analytics?.totalRevenue || 0}</p>
          <span className="analytics-period">This Month</span>
        </div>

        <div className="analytics-card">
          <h3>Total Bookings</h3>
          <p className="analytics-number">{analytics?.totalBookings || 0}</p>
          <span className="analytics-period">This Month</span>
        </div>

        <div className="analytics-card">
          <h3>Total Buses</h3>
          <p className="analytics-number">{analytics?.totalBuses || 0}</p>
          <span className="analytics-period">Currently</span>
        </div>

        <div className="analytics-card">
          <h3>Total Schedules</h3>
          <p className="analytics-number">{analytics?.totalSchedules || 0}</p>
          <span className="analytics-period">Active</span>
        </div>
      </div>

      <div className="analytics-details">
        <div className="analytics-section">
          <h2>Popular Routes</h2>
          {analytics?.popularRoutes?.length > 0 ? (
            <div className="routes-list">
              {analytics.popularRoutes.map((route, index) => (
                <div key={index} className="route-item">
                  <span className="route-name">{route.source} → {route.destination}</span>
                  <span className="route-bookings">{route.bookings} bookings</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No route data available</p>
          )}
        </div>

        <div className="analytics-section">
          <h2>Recent Performance</h2>
          {analytics?.recentPerformance?.length > 0 ? (
            <div className="performance-list">
              {analytics.recentPerformance.map((item, index) => (
                <div key={index} className="performance-item">
                  <span className="performance-date">{item.date}</span>
                  <span className="performance-revenue">₹{item.revenue}</span>
                  <span className="performance-bookings">{item.bookings} bookings</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No performance data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderAnalytics;