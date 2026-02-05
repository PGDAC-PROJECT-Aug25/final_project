import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addBus } from '../../features/provider/providerSlice';
import { toast } from 'react-toastify';

const AddBus = () => {
  const [busData, setBusData] = useState({
    busNumber: '',
    busType: 'AC_SEATER',
    status: 'ACTIVE',
    totalSeats: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.provider);

  const handleChange = (e) => {
    setBusData({
      ...busData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!busData.busNumber.trim()) {
      toast.error('Bus number is required');
      return false;
    }
    if (!busData.totalSeats || parseInt(busData.totalSeats) <= 0) {
      toast.error('Total seats must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const formattedData = {
      busNumber: busData.busNumber.trim(),
      busType: busData.busType,
      status: busData.status,
      totalSeats: parseInt(busData.totalSeats),
    };

    dispatch(addBus(formattedData)).then((result) => {
      if (result.type === 'provider/addBus/fulfilled') {
        navigate('/provider/dashboard');
      }
    });
  };

  return (
    <div className="add-bus">
      <div className="page-header">
        <h1>Add New Bus</h1>
        <p>Register a new bus to your fleet</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="bus-form">
          <div className="form-group">
            <label htmlFor="busNumber">Bus Number *</label>
            <input
              type="text"
              id="busNumber"
              name="busNumber"
              value={busData.busNumber}
              onChange={handleChange}
              placeholder="e.g., MH12AB1234"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="busType">Bus Type *</label>
            <select
              id="busType"
              name="busType"
              value={busData.busType}
              onChange={handleChange}
              required
            >
              <option value="AC_SEATER">AC Seater</option>
              <option value="AC_SLEEPER">AC Sleeper</option>
              <option value="NON_AC_SEATER">Non-AC Seater</option>
              <option value="NON_AC_SLEEPER">Non-AC Sleeper</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={busData.status}
              onChange={handleChange}
              required
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="totalSeats">Total Seats *</label>
            <input
              type="number"
              id="totalSeats"
              name="totalSeats"
              value={busData.totalSeats}
              onChange={handleChange}
              min="1"
              placeholder="e.g., 40"
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
              {isLoading ? 'Adding Bus...' : 'Add Bus'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBus;
