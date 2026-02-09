import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminUsers, verifyProvider, changeUserStatus } from '../../features/admin/adminSlice';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.admin);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    dispatch(getAdminUsers());
  }, [dispatch]);

  const handleVerifyProvider = (providerId) => {
    if (window.confirm('Are you sure you want to verify this provider?')) {
      dispatch(verifyProvider(providerId)).then((result) => {
        if (result.type === 'admin/verifyProvider/fulfilled') {
          setTimeout(() => {
            dispatch(getAdminUsers());
          }, 500);
        }
      });
    }
  };

  const handleBlockUser = (userId, currentStatus) => {
    const action = currentStatus ? 'block' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      dispatch(changeUserStatus({ userId, active: !currentStatus })).then((result) => {
        if (result.type === 'admin/changeUserStatus/fulfilled') {
          setTimeout(() => {
            dispatch(getAdminUsers());
          }, 500);
        }
      });
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (!user) return false; // Filter out null/undefined users
    if (filter === 'ALL') return true;
    // Backend returns role without ROLE_ prefix
    return user.role === filter || user.role === `ROLE_${filter}`;
  }) : [];

  const getRoleClass = (role) => {
    // Remove ROLE_ prefix if present
    const cleanRole = role?.replace('ROLE_', '');
    switch (cleanRole) {
      case 'CUSTOMER':
        return 'role-customer';
      case 'PROVIDER':
        return 'role-provider';
      case 'ADMIN':
        return 'role-admin';
      default:
        return '';
    }
  };

  return (
    <div className="admin-users">
      <div className="page-header">
        <h1>Manage Users</h1>
        <div className="filter-options">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All Users</option>
            <option value="CUSTOMER">Customers</option>
            <option value="PROVIDER">Providers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Provider Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.filter(user => user && user.userId).map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.name || '-'}</td>
                  <td>{user.email || '-'}</td>
                  <td>
                    <span className={`role-badge ${getRoleClass(user.role)}`}>
                      {user.role?.replace('ROLE_', '') || '-'}
                    </span>
                  </td>
                  <td>
                    <span className={`status ${user.isActive ? 'verified' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    {user.role === 'ROLE_PROVIDER' ? (
                      user.isProviderVerified ? (
                        <span className="status verified">✓ Verified</span>
                      ) : (
                        <span className="status pending">Not Verified</span>
                      )
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td>
                    {user.role === 'ROLE_PROVIDER' && !user.isProviderVerified && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleVerifyProvider(user.providerId)}
                        disabled={isLoading}
                      >
                        Verify Provider
                      </button>
                    )}
                    {user.role !== 'ROLE_ADMIN' && (
                      <button
                        className={`btn btn-sm ${user.isActive ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => handleBlockUser(user.userId, user.isActive)}
                        disabled={isLoading}
                        style={{ marginLeft: '0.5rem' }}
                      >
                        {user.isActive ? 'Block' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredUsers.length === 0 && !isLoading && (
        <div className="no-users">
          <p>No users found</p>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;