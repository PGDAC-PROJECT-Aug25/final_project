import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addSchedule, getProviderDashboard } from '../../features/provider/providerSlice';
import { toast } from 'react-toastify';

const AddSchedule = () => {
  const [scheduleData, setScheduleData] = useState({
    busId: '',
    source: '',
    destination: '',
    travelDate: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { buses, isLoading } = useSelector((state) => state.provider);

  useEffect(() => {
    dispatch(getProviderDashboard());
  }, [dispatch]);

  const handleChange = (e) => {
    setScheduleData({
      ...scheduleData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!scheduleData.busId) {
      toast.error('Please select a bus');
      return false;
    }
    if (!scheduleData.source.trim() || !scheduleData.destination.trim()) {
      toast.error('Source and destination are required');
      return false;
    }
    if (!scheduleData.travelDate) {
      toast.error('Travel date is required');
      return false;
    }
    if (!scheduleData.departureTime || !scheduleData.arrivalTime) {
      toast.error('Departure and arrival times are required');
      return false;
    }
    if (!scheduleData.price || parseFloat(scheduleData.price) <= 0) {
      toast.error('Price must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formattedData = {
      busId: parseInt(scheduleData.busId),
      source: scheduleData.source.trim(),
      destination: scheduleData.destination.trim(),
      travelDate: scheduleData.travelDate,
      departureTime: `${scheduleData.travelDate}T${scheduleData.departureTime}:00`,
      arrivalTime: `${scheduleData.travelDate}T${scheduleData.arrivalTime}:00`,
      price: parseFloat(scheduleData.price),
    };

    dispatch(addSchedule(formattedData)).then((result) => {
      if (result.type === 'provider/addSchedule/fulfilled') {
        navigate('/provider/dashboard');
      }
    });
  };

  return (
    <div className="add-schedule">
      <div className="page-header">
        <h1>Add New Schedule</h1>
        <p>Create a new bus schedule</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-group">
            <label htmlFor="busId">Select Bus *</label>
            <select
              id="busId"
              name="busId"
              value={scheduleData.busId}
              onChange={handleChange}
              required
            >
              <option value="">Choose a bus</option>
              {buses?.filter(bus => bus.status === 'ACTIVE').map((bus) => (
                <option key={bus.busId} value={bus.busId}>
                  {bus.busNumber} - {bus.busType}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="source">Source City *</label>
              <input
                type="text"
                id="source"
                name="source"
                value={scheduleData.source}
                onChange={handleChange}
                placeholder="e.g., Mumbai"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="destination">Destination City *</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={scheduleData.destination}
                onChange={handleChange}
                placeholder="e.g., Pune"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="travelDate">Travel Date *</label>
            <input
              type="date"
              id="travelDate"
              name="travelDate"
              value={scheduleData.travelDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="departureTime">Departure Time *</label>
              <input
                type="time"
                id="departureTime"
                name="departureTime"
                value={scheduleData.departureTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="arrivalTime">Arrival Time *</label>
              <input
                type="time"
                id="arrivalTime"
                name="arrivalTime"
                value={scheduleData.arrivalTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price per Seat (₹) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={scheduleData.price}
              onChange={handleChange}
              min="1"
              step="0.01"
              placeholder="e.g., 500"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/provider/dashboard')}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Creating Schedule...' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchedule;
