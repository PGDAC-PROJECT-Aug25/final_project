import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyBookings } from '../../features/bookings/bookingsSlice';

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  const recentBookings = Array.isArray(bookings) ? bookings.slice(0, 5) : [];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Manage your bookings and explore new destinations</p>
      </div>

      <div className="dashboard-actions">
        <Link to="/customer/search" className="action-card">
          <h3>Search Buses</h3>
          <p>Find and book your next journey</p>
        </Link>
        
        <Link to="/customer/bookings" className="action-card">
          <h3>My Bookings</h3>
          <p>View and manage your bookings</p>
        </Link>
        
        <Link to="/customer/profile" className="action-card">
          <h3>Profile</h3>
          <p>Update your personal information</p>
        </Link>
      </div>

      <div className="recent-bookings">
        <h2>Recent Bookings</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : recentBookings.length > 0 ? (
          <div className="bookings-list">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-info">
                  <h4>{booking.busName}</h4>
                  <p>{booking.source} → {booking.destination}</p>
                  <p>Date: {new Date(booking.journeyDate).toLocaleDateString()}</p>
                  <p>Status: <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span></p>
                </div>
                <div className="booking-amount">
                  ₹{booking.totalAmount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-bookings">
            <p>No bookings found</p>
            <Link to="/customer/search" className="btn btn-primary">
              Book Your First Journey
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;