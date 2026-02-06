import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="unauthorized">
      <div className="unauthorized-content">
        <h1>403 - Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p>Please login to continue.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/" className="btn btn-secondary">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;