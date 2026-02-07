import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchBuses, selectBus } from '../../features/customer/customerSlice';

const BusSearch = () => {
  const [searchParams, setSearchParams] = useState({
    source: '',
    destination: '',
    journeyDate: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { buses, isLoading, error } = useSelector((state) => state.customer);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(searchBuses(searchParams));
  };

  const handleSelectBus = (bus) => {
    dispatch(selectBus(bus));
    navigate(`/seats/${bus.scheduleId}`);
  };

  return (
    <div className="bus-search">
      <div className="search-form">
        <h2>🚌 Find Your Bus</h2>
        <p className="search-subtitle">Search and book bus tickets across India</p>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="source">📍 From</label>
              <input
                type="text"
                id="source"
                name="source"
                value={searchParams.source}
                onChange={handleChange}
                placeholder="Enter source city"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="destination">🎯 To</label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={searchParams.destination}
                onChange={handleChange}
                placeholder="Enter destination city"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="journeyDate">📅 Journey Date</label>
              <input
                type="date"
                id="journeyDate"
                name="journeyDate"
                value={searchParams.journeyDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? '🔍 Searching...' : '🔍 Search Buses'}
            </button>
          </div>
        </form>
      </div>

      {Array.isArray(buses) && buses.length > 0 && (
        <div className="search-results">
          <h3>🚍 {buses.length} Bus{buses.length > 1 ? 'es' : ''} Found</h3>
          <div className="buses-list">
            {buses.map((bus) => (
              <div key={bus.scheduleId} className="bus-card">
                <div className="bus-info">
                  <h4>🚌 {bus.busNumber}</h4>
                  <p className="bus-type">{bus.busType}</p>
                  <div className="route-info">
                    <span>{bus.source}</span>
                    <span className="arrow">→</span>
                    <span>{bus.destination}</span>
                  </div>
                  <div className="time-info">
                    <span>⏰ Departure: {bus.departureTime}</span>
                    <span>⏰ Arrival: {bus.arrivalTime}</span>
                  </div>
                </div>
                
                <div className="bus-details">
                  <div className="seats-info">
                    <span>💺 {bus.availableSeats} Seats Available</span>
                  </div>
                  <div className="price-info">
                    <span className="price">₹{bus.price}</span>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleSelectBus(bus)}
                      disabled={bus.availableSeats === 0}
                    >
                      {bus.availableSeats === 0 ? '❌ Sold Out' : '✓ Select Seats'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(buses) && buses.length === 0 && !isLoading && searchParams.source && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No Buses Found</h3>
          <p>We couldn't find any buses for your search</p>
          <p className="search-details">{searchParams.source} → {searchParams.destination} on {searchParams.journeyDate}</p>
          <p className="search-tip">💡 Try different dates or cities</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>⚠️ Error: {error}</p>
        </div>
      )}
    </div>
  );
};

export default BusSearch;