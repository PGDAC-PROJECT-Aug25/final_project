import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminBuses } from '../../features/admin/adminSlice';

const AdminBuses = () => {
  const dispatch = useDispatch();
  const { buses, isLoading } = useSelector((state) => state.admin);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    dispatch(getAdminBuses());
  }, [dispatch]);

  const filteredBuses = buses.filter(bus => {
    if (filter === 'ALL') return true;
    return bus.status === filter;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'INACTIVE':
        return 'status-inactive';
      case 'MAINTENANCE':
        return 'status-maintenance';
      default:
        return '';
    }
  };

  return (
    <div className="admin-buses">
      <div className="page-header">
        <h1>Manage Buses</h1>
        <div className="filter-options">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All Buses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading buses...</div>
      ) : (
        <div className="buses-table">
          <table>
            <thead>
              <tr>
                <th>Bus ID</th>
                <th>Bus Number</th>
                <th>Type</th>
                <th>Total Seats</th>
                <th>Provider</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.map((bus) => (
                <tr key={bus.busId}>
                  <td>{bus.busId}</td>
                  <td>{bus.busNumber}</td>
                  <td>{bus.busType}</td>
                  <td>{bus.totalSeats}</td>
                  <td>{bus.providerName}</td>
                  <td>
                    <span className={`status ${getStatusClass(bus.status)}`}>
                      {bus.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredBuses.length === 0 && !isLoading && (
        <div className="no-buses">
          <p>No buses found</p>
        </div>
      )}
    </div>
  );
};

export default AdminBuses;