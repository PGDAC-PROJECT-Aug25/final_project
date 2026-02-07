import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyBookings, cancelBooking } from '../../features/bookings/bookingsSlice';
import jsPDF from 'jspdf';

const BookingHistory = () => {
  const dispatch = useDispatch();
  const { bookings, isLoading } = useSelector((state) => state.bookings);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    dispatch(getMyBookings()).then((result) => {
      console.log('Bookings fetched:', result.payload);
      if (result.payload?.data) {
        console.log('First booking:', result.payload.data[0]);
      }
    });
  }, [dispatch]);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking(bookingId));
    }
  };

  const filteredBookings = Array.isArray(bookings) ? bookings.filter(booking => {
    if (filter === 'ALL') return true;
    return booking.status === filter;
  }) : [];

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

  const canCancelBooking = (booking) => {
    const journeyDate = new Date(booking.travelDate);
    const now = new Date();
    const timeDiff = journeyDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return booking.status === 'CONFIRMED' && hoursDiff > 2;
  };

  const handleDownloadTicket = (booking) => {
    try {
      console.log('Downloading ticket for booking:', booking);
      
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('BUS TICKET', 105, 20, { align: 'center' });
      
      // Line separator
      doc.setLineWidth(0.5);
      doc.line(20, 25, 190, 25);
      
      // Booking details
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      
      let yPos = 40;
      const lineHeight = 10;
      
      doc.setFont(undefined, 'bold');
      doc.text('Booking ID:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(String(booking.bookingId), 70, yPos);
      
      yPos += lineHeight;
      doc.setFont(undefined, 'bold');
      doc.text('Bus Number:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(booking.busNumber, 70, yPos);
      
      yPos += lineHeight;
      doc.setFont(undefined, 'bold');
      doc.text('Route:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(`${booking.source} to ${booking.destination}`, 70, yPos);
      
      yPos += lineHeight;
      doc.setFont(undefined, 'bold');
      doc.text('Travel Date:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(booking.travelDate, 70, yPos);
      
      yPos += lineHeight;
      doc.setFont(undefined, 'bold');
      doc.text('Departure Time:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(booking.departureTime, 70, yPos);
      
      yPos += lineHeight;
      doc.setFont(undefined, 'bold');
      doc.text('Seat Number:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(booking.seatNumber, 70, yPos);
      
      yPos += lineHeight;
      doc.setFont(undefined, 'bold');
      doc.text('Price:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(`Rs. ${booking.price}`, 70, yPos);
      
      yPos += lineHeight;
      doc.setFont(undefined, 'bold');
      doc.text('Status:', 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(booking.status, 70, yPos);
      
      // Footer line
      yPos += 15;
      doc.line(20, yPos, 190, yPos);
      
      // Save PDF
      doc.save(`ticket-${booking.bookingId}.pdf`);
      console.log('Ticket downloaded successfully');
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Failed to download ticket. Please try again.');
    }
  };

  return (
    <div className="booking-history">
      <div className="page-header">
        <h1>My Bookings</h1>
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
      ) : filteredBookings.length > 0 ? (
        <div className="bookings-list">
          {filteredBookings.map((booking) => (
            <div key={booking.bookingId} className="booking-card">
              <div className="booking-header">
                <h3>Booking #{booking.bookingId}</h3>
                <span className={`status ${getStatusClass(booking.status)}`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="booking-details">
                <div className="journey-info">
                  <h4>{booking.busNumber}</h4>
                  <p className="route">{booking.source} → {booking.destination}</p>
                  <p className="date">Journey Date: {new Date(booking.travelDate).toLocaleDateString()}</p>
                  <p className="time">Departure: {booking.departureTime}</p>
                </div>
                
                <div className="seat-info">
                  <p>Seat: {booking.seatNumber}</p>
                </div>
                
                <div className="booking-meta">
                  <p className="amount">Amount: ₹{booking.price}</p>
                </div>
              </div>
              
              <div className="booking-actions">
                {canCancelBooking(booking) && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelBooking(booking.bookingId)}
                    disabled={isLoading}
                  >
                    Cancel Booking
                  </button>
                )}
                
                <button 
                  className="btn btn-outline"
                  onClick={() => handleDownloadTicket(booking)}
                >
                  Download Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-bookings">
          <h3>No bookings found</h3>
          <p>You haven't made any bookings yet.</p>
          <a href="/customer/search" className="btn btn-primary">
            Book Your First Journey
          </a>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;