import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../../features/auth/authSlice';
import { validators } from '../../utils/validation';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    let error = '';
    if (name === 'email') error = validators.email(value);
    else if (name === 'password') error = validators.password(value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {
    email: validators.email(formData.email),
    password: validators.password(formData.password),
  };

  setErrors(newErrors);
  setTouched({ email: true, password: true });

  if (newErrors.email || newErrors.password) return;

  try {
    const payload = await dispatch(loginUser(formData)).unwrap();

    const { role } = payload;

    switch (role) {
      case 'ROLE_CUSTOMER':
        navigate('/customer/dashboard', { replace: true });
        break;
      case 'ROLE_PROVIDER':
        navigate('/provider/dashboard', { replace: true });
        break;
      case 'ROLE_ADMIN':
        navigate('/admin/dashboard', { replace: true });
        break;
      default:
        navigate('/');
    }
  } catch (error) {
    // ✅ Login failed → stay on page
    // ✅ Show toast here (MOST IMPORTANT)
    // Example:
    // toast.error(error || 'Invalid email or password');
  }
};


  const isFormValid = !errors.email && !errors.password && formData.email && formData.password;

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${errors.email && touched.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className={`form-group ${errors.password && touched.password ? 'has-error' : ''}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading || !isFormValid}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>Don't have an account?</p>
          <Link to="/register/customer">Register as Customer</Link>
          <Link to="/register/provider">Register as Provider</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
