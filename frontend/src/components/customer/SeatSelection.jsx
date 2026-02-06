import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getSeats, selectSeat, clearSelectedSeats, selectBus } from '../../features/customer/customerSlice';
import { createBooking, processPayment, getMyBookings } from '../../features/bookings/bookingsSlice';

const SeatSelection = () => {
  const { scheduleId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { seats, selectedSeats, selectedBus, isLoading } = useSelector((state) => state.customer);
  const { bookings } = useSelector((state) => state.bookings);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [paymentErrors, setPaymentErrors] = useState({});
  const [paymentTouched, setPaymentTouched] = useState({});

  useEffect(() => {
    if (scheduleId) {
      dispatch(getSeats(scheduleId));
    }
    
    return () => {
      dispatch(clearSelectedSeats());
    };
  }, [dispatch, scheduleId]);

  const handleSeatSelect = (seat) => {
    if (seat.isBooked) return;
    const seatToSelect = {
      seatNumber: seat.seatNumber,
      isBooked: seat.isBooked,
      price: parseFloat(selectedBus?.price) || 0
    };
    dispatch(selectSeat(seatToSelect));
  };

  const getTotalAmount = () => {
    return selectedSeats.reduce((total, seat) => total + (parseFloat(seat.price) || 0), 0);
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated && !sessionStorage.getItem('token')) {
      alert('Please login to proceed with booking');
      navigate('/login');
      return;
    }
    
    setShowPayment(true);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.replace(/\s/g, '').length > 16) return;
    }

    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    }

    // Limit CVV to 3 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentData({
      ...paymentData,
      [name]: formattedValue,
    });

    if (paymentTouched[name]) {
      validatePaymentField(name, formattedValue);
    }
  };

  const handlePaymentBlur = (e) => {
    const { name, value } = e.target;
    setPaymentTouched({
      ...paymentTouched,
      [name]: true,
    });
    validatePaymentField(name, value);
  };

  const validatePaymentField = (name, value) => {
    let error = '';

    if (name === 'cardHolderName') {
      if (!value.trim()) {
        error = 'Card holder name is required';
      } else if (value.trim().length < 3) {
        error = 'Name must be at least 3 characters';
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        error = 'Name should only contain letters';
      }
    }

    if (name === 'cardNumber') {
      const digits = value.replace(/\s/g, '');
      if (!digits) {
        error = 'Card number is required';
      } else if (digits.length !== 16) {
        error = 'Card number must be 16 digits';
      } else if (!/^\d+$/.test(digits)) {
        error = 'Card number must contain only digits';
      }
    }

    if (name === 'expiryDate') {
      if (!value) {
        error = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(value)) {
        error = 'Format must be MM/YY';
      } else {
        const [month, year] = value.split('/');
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt('20' + year, 10);
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;

        if (monthNum < 1 || monthNum > 12) {
          error = 'Invalid month (01-12)';
        } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
          error = 'Card has expired';
        }
      }
    }

    if (name === 'cvv') {
      if (!value) {
        error = 'CVV is required';
      } else if (value.length !== 3) {
        error = 'CVV must be 3 digits';
      } else if (!/^\d{3}$/.test(value)) {
        error = 'CVV must contain only digits';
      }
    }

    setPaymentErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const validatePaymentForm = () => {
    const errors = {};

    // Validate card holder name
    if (!paymentData.cardHolderName.trim()) {
      errors.cardHolderName = 'Card holder name is required';
    } else if (paymentData.cardHolderName.trim().length < 3) {
      errors.cardHolderName = 'Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(paymentData.cardHolderName)) {
      errors.cardHolderName = 'Name should only contain letters';
    }

    // Validate card number
    const cardDigits = paymentData.cardNumber.replace(/\s/g, '');
    if (!cardDigits) {
      errors.cardNumber = 'Card number is required';
    } else if (cardDigits.length !== 16) {
      errors.cardNumber = 'Card number must be 16 digits';
    }

    // Validate expiry date
    if (!paymentData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      errors.expiryDate = 'Format must be MM/YY';
    } else {
      const [month, year] = paymentData.expiryDate.split('/');
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt('20' + year, 10);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      if (monthNum < 1 || monthNum > 12) {
        errors.expiryDate = 'Invalid month (01-12)';
      } else if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        errors.expiryDate = 'Card has expired';
      }
    }

    // Validate CVV
    if (!paymentData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (paymentData.cvv.length !== 3) {
      errors.cvv = 'CVV must be 3 digits';
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePayment = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setPaymentTouched({
      cardHolderName: true,
      cardNumber: true,
      expiryDate: true,
      cvv: true,
    });

    // Validate form
    if (!validatePaymentForm()) {
      return;
    }

    // Step 1: Create booking
    const bookingData = {
      userId: user?.id,
      scheduleId: parseInt(scheduleId),
      seatNumbers: selectedSeats.map(seat => seat.seatNumber),
    };

    console.log('Creating booking with data:', bookingData);
    console.log('User object:', user);

    if (!user?.id) {
      alert('User not authenticated. Please login again.');
      return;
    }

    if (!scheduleId) {
      alert('Invalid schedule ID');
      return;
    }

    if (selectedSeats.length === 0) {
      alert('No seats selected');
      return;
    }

    dispatch(createBooking(bookingData)).then((bookingResult) => {
      console.log('Booking result:', bookingResult);
      if (bookingResult.type === 'bookings/create/fulfilled') {
        // Step 2: Fetch booking IDs
        dispatch(getMyBookings()).then((bookingsResult) => {
          if (bookingsResult.type === 'bookings/getMyBookings/fulfilled') {
            const allBookings = bookingsResult.payload.data || [];
            const newBookingIds = allBookings
              .filter(b => 
                selectedSeats.some(s => s.seatNumber === b.seatNumber) &&
                b.status === 'CONFIRMED'
              )
              .slice(0, selectedSeats.length)
              .map(b => b.bookingId);
            
            console.log('New booking IDs:', newBookingIds);
            
            // Step 3: Process payment
            const payment = {
              bookingIds: newBookingIds,
              amount: getTotalAmount(),
            };

            dispatch(processPayment(payment)).then((paymentResult) => {
              if (paymentResult.type === 'bookings/processPayment/fulfilled') {
                navigate('/customer/bookings');
              }
            });
          }
        });
      }
    });
  };

  const getSeatClass = (seat) => {
    if (seat.isBooked) return 'seat booked';
    const isSelected = selectedSeats.some(s => s.seatNumber === seat.seatNumber);
    if (isSelected) return 'seat selected';
    return 'seat available';
  };

  const renderSeatLayout = () => {
    const rows = [];
    const seatsPerRow = 4;
    
    for (let i = 0; i < seats.length; i += seatsPerRow) {
      const rowSeats = seats.slice(i, i + seatsPerRow);
      rows.push(
        <div key={`row-${i}`} className="seat-row">
          <div className="seat-column left">
            {rowSeats.slice(0, 2).map((seat) => (
              <div
                key={seat.seatNumber}
                className={getSeatClass(seat)}
                onClick={() => handleSeatSelect(seat)}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
          <div className="seat-aisle"></div>
          <div className="seat-column right">
            {rowSeats.slice(2, 4).map((seat) => (
              <div
                key={seat.seatNumber}
                className={getSeatClass(seat)}
                onClick={() => handleSeatSelect(seat)}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return rows;
  };

  if (showPayment) {
    return (
      <div className="payment-container">
        <div className="payment-form">
          <h2>Payment Details</h2>
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <p>Bus: {selectedBus?.busNumber}</p>
            <p>Route: {selectedBus?.source} → {selectedBus?.destination}</p>
            <p>Seats: {selectedSeats.map(s => s.seatNumber).join(', ')}</p>
            <p>Total Amount: ₹{getTotalAmount()}</p>
          </div>
          
          <form onSubmit={handlePayment}>
            <div className="form-group">
              <label htmlFor="cardHolderName">Card Holder Name</label>
              <input
                type="text"
                id="cardHolderName"
                name="cardHolderName"
                value={paymentData.cardHolderName}
                onChange={handlePaymentChange}
                onBlur={handlePaymentBlur}
                className={paymentTouched.cardHolderName && paymentErrors.cardHolderName ? 'error' : ''}
              />
              {paymentTouched.cardHolderName && paymentErrors.cardHolderName && (
                <span className="error-message">{paymentErrors.cardHolderName}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentChange}
                onBlur={handlePaymentBlur}
                placeholder="1234 5678 9012 3456"
                className={paymentTouched.cardNumber && paymentErrors.cardNumber ? 'error' : ''}
              />
              {paymentTouched.cardNumber && paymentErrors.cardNumber && (
                <span className="error-message">{paymentErrors.cardNumber}</span>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handlePaymentChange}
                  onBlur={handlePaymentBlur}
                  placeholder="MM/YY"
                  className={paymentTouched.expiryDate && paymentErrors.expiryDate ? 'error' : ''}
                />
                {paymentTouched.expiryDate && paymentErrors.expiryDate && (
                  <span className="error-message">{paymentErrors.expiryDate}</span>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handlePaymentChange}
                  onBlur={handlePaymentBlur}
                  placeholder="123"
                  className={paymentTouched.cvv && paymentErrors.cvv ? 'error' : ''}
                />
                {paymentTouched.cvv && paymentErrors.cvv && (
                  <span className="error-message">{paymentErrors.cvv}</span>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading || Object.keys(paymentErrors).some(key => paymentErrors[key]) || !paymentData.cardHolderName || !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv}
            >
              {isLoading ? 'Processing...' : `Pay ₹${getTotalAmount()}`}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="seat-selection">
      {/* Bus Details Header */}
      <div className="bus-details-header">
        <div className="bus-details-left">
          <h2>{selectedBus?.busNumber || 'Bus'}</h2>
          <div className="bus-meta">
            <span className="bus-type">{selectedBus?.busType || 'AC Seater'}</span>
            <span className="bus-route">{selectedBus?.source} → {selectedBus?.destination}</span>
          </div>
        </div>
        <div className="bus-details-right">
          <div className="bus-timing">
            <span>Departure: {selectedBus?.departureTime || 'N/A'}</span>
            <span>Arrival: {selectedBus?.arrivalTime || 'N/A'}</span>
          </div>
          <div className="bus-price">
            <span className="price-label">Price per seat</span>
            <span className="price-value">₹{parseFloat(selectedBus?.price) || 0}</span>
          </div>
        </div>
      </div>

      {/* Main Content: Seat Layout + Booking Summary */}
      <div className="seat-booking-container">
        {/* Left: Seat Layout */}
        <div className="seat-layout-section">
          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat-indicator available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="seat-indicator selected"></div>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="seat-indicator booked"></div>
              <span>Booked</span>
            </div>
          </div>

          <div className="bus-layout">
            <div className="driver-section">
              <div className="driver-seat">🚗</div>
            </div>
            
            <div className="seats-container">
              {Array.isArray(seats) && seats.length > 0 ? renderSeatLayout() : <p>No seats available</p>}
            </div>
          </div>
        </div>

        {/* Right: Booking Summary */}
        <div className="booking-summary-section">
          <h3>Booking Summary</h3>
          
          {selectedSeats.length > 0 ? (
            <>
              <div className="summary-item">
                <span className="summary-label">Selected Seats:</span>
                <div className="selected-seats-list">
                  {selectedSeats.map((seat) => (
                    <span key={seat.seatNumber} className="seat-tag">
                      {seat.seatNumber}
                    </span>
                  ))}
                </div>
              </div>

              <div className="fare-breakdown">
                <div className="fare-item">
                  <span>Base Fare ({selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''})</span>
                  <span>₹{getTotalAmount()}</span>
                </div>
                <div className="fare-item">
                  <span>Taxes & Fees</span>
                  <span>₹0</span>
                </div>
              </div>

              <div className="total-fare">
                <span>Total Amount</span>
                <span className="total-amount">₹{getTotalAmount()}</span>
              </div>

              <button 
                className="btn btn-primary btn-proceed"
                onClick={handleProceedToPayment}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </>
          ) : (
            <div className="no-selection">
              <p>Please select seats to continue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
