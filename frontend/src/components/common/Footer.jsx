import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Bus Booking System</h3>
          <p className="footer-tagline">Book your journey with comfort</p>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search Buses</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4 className="footer-heading">Contact</h4>
          <p className="footer-text">Email: support@busbooking.com</p>
          <p className="footer-text">Phone: +91 1234567890</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 Bus Booking System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
