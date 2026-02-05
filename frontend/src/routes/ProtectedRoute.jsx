import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  
  const sessionToken = sessionStorage.getItem('token');
  const sessionRole = sessionStorage.getItem('role');
  
  const actuallyAuthenticated = isAuthenticated || !!sessionToken;
  const actualRole = role || sessionRole;

  if (!actuallyAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(actualRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;