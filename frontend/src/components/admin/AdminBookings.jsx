import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminBookings } from '../../features/admin/adminSlice';

const AdminBookings = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.admin);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    dispatch(getAdminBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'ALL') return true;
    return booking.status === filter;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="admin-bookings">
      <div className="page-header">
        <h1>Manage Bookings</h1>
        <div className="filter-options">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All Bookings</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading bookings...</div>
      ) : (
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Bus</th>
                <th>Route</th>
                <th>Journey Date</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>#{booking.bookingId}</td>
                  <td>{booking.userName}</td>
                  <td>{booking.busNumber}</td>
                  <td>{booking.source} → {booking.destination}</td>
                  <td>{new Date(booking.travelDate).toLocaleDateString()}</td>
                  <td>{booking.seatNumber}</td>
                  <td>₹{booking.price}</td>
                  <td>
                    <span className={`status ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>{booking.travelDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredBookings.length === 0 && !isLoading && (
        <div className="no-bookings">
          <p>No bookings found</p>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;