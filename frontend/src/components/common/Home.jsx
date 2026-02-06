import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuthInit } from '../../hooks/useAuthInit';

const Home = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  
  // Initialize auth state from sessionStorage
  useAuthInit();
  
  // Debug logging
  console.log('Home component - Auth state:', {
    isAuthenticated,
    role,
    sessionToken: sessionStorage.getItem('token'),
    sessionRole: sessionStorage.getItem('role')
  });

  const getDashboardLink = () => {
    const dashboardRoute = {
      'ROLE_CUSTOMER': '/customer/dashboard',
      'ROLE_PROVIDER': '/provider/dashboard', 
      'ROLE_ADMIN': '/admin/dashboard'
    }[role] || '/login';
    
    return dashboardRoute;
  };

  const handleDashboardClick = () => {
    console.log('Dashboard button clicked - role:', role, 'isAuthenticated:', isAuthenticated);
    console.log('Target route:', getDashboardLink());
  };

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Enjoy Travelling With Us</h1>
        <p>Your trusted partner for comfortable and safe bus journeys</p>
        
        {isAuthenticated ? (
          <div className="hero-actions">
            <Link 
              to={getDashboardLink()} 
              className="btn btn-primary"
              onClick={handleDashboardClick}
            >
              Go to Dashboard
            </Link>
            {role === 'ROLE_CUSTOMER' && (
              <Link to="/customer/search" className="btn btn-secondary">
                Search Buses
              </Link>
            )}
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register/customer" className="btn btn-secondary">
              Register as Customer
            </Link>
            <Link to="/register/provider" className="btn btn-outline">
              Register as Provider
            </Link>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Safe & Secure</h3>
            <p>All our buses are regularly maintained and follow safety protocols</p>
          </div>
          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Book your tickets online with just a few clicks</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>Our customer support team is available round the clock</p>
          </div>
          <div className="feature-card">
            <h3>Best Prices</h3>
            <p>Competitive pricing with no hidden charges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;