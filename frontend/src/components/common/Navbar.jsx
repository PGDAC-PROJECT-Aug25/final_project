import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const Navbar = () => {
  const { isAuthenticated, role, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Enjoy Travelling With Us
        </Link>
        
        <div className="nav-menu">
          <Link to="/search" className="nav-link">Search Buses</Link>
          
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register/customer" className="nav-link">Register as Customer</Link>
              <Link to="/register/provider" className="nav-link">Register as Provider</Link>
            </>
          ) : (
            <>
              {role === 'ROLE_CUSTOMER' && (
                <>
                  <Link to="/customer/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/customer/bookings" className="nav-link">My Bookings</Link>
                  <Link to="/customer/profile" className="nav-link">Profile</Link>
                </>
              )}
              
              {role === 'ROLE_PROVIDER' && (
                <>
                  <Link to="/provider/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/provider/add-bus" className="nav-link">Add Bus</Link>
                  <Link to="/provider/add-schedule" className="nav-link">Add Schedule</Link>
                  <Link to="/provider/analytics" className="nav-link">Analytics</Link>
                  <Link to="/provider/profile" className="nav-link">Profile</Link>
                </>
              )}
              
              {role === 'ROLE_ADMIN' && (
                <>
                  <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/admin/users" className="nav-link">Users</Link>
                  <Link to="/admin/buses" className="nav-link">Buses</Link>
                  <Link to="/admin/bookings" className="nav-link">Bookings</Link>
                </>
              )}
              
              <span className="nav-user">Welcome, {user?.name || user?.email}</span>
              <button onClick={handleLogout} className="nav-logout">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;