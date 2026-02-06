import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerCustomer, clearError } from '../../features/auth/authSlice';
import { validators } from '../../utils/validation';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

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
    
    switch(name) {
      case 'name': error = validators.name(value); break;
      case 'email': error = validators.email(value); break;
      case 'phone': error = validators.phone(value); break;
      case 'address': error = validators.address(value); break;
      case 'password': error = validators.password(value); break;
      case 'confirmPassword': error = validators.confirmPassword(formData.password, value); break;
      case 'dob': error = validators.required(value); break;
      case 'gender': error = validators.required(value); break;
    }
    
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {
      name: validators.name(formData.name),
      email: validators.email(formData.email),
      phone: validators.phone(formData.phone),
      address: validators.address(formData.address),
      password: validators.password(formData.password),
      confirmPassword: validators.confirmPassword(formData.password, formData.confirmPassword),
      dob: validators.required(formData.dob),
      gender: validators.required(formData.gender)
    };
    
    setErrors(newErrors);
    setTouched({
      name: true, email: true, phone: true, address: true,
      password: true, confirmPassword: true, dob: true, gender: true
    });
    
    if (Object.values(newErrors).some(err => err)) return;

    const { confirmPassword, ...registrationData } = formData;
    dispatch(registerCustomer(registrationData)).then((result) => {
      if (result.type === 'auth/registerCustomer/fulfilled') {
        navigate('/login');
      }
    });
  };

  const isFormValid = Object.keys(formData).every(key => 
    key === 'confirmPassword' ? true : formData[key]
  ) && !Object.values(errors).some(err => err);

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register as Customer</h2>
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${errors.name && touched.name ? 'has-error' : ''}`}>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name && <div className="error-message">{errors.name}</div>}
          </div>
          
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
          
          <div className={`form-group ${errors.phone && touched.phone ? 'has-error' : ''}`}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength="10"
            />
            {errors.phone && touched.phone && <div className="error-message">{errors.phone}</div>}
          </div>
          
          <div className={`form-group ${errors.address && touched.address ? 'has-error' : ''}`}>
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.address && touched.address && <div className="error-message">{errors.address}</div>}
          </div>
          
          <div className={`form-group ${errors.dob && touched.dob ? 'has-error' : ''}`}>
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.dob && touched.dob && <div className="error-message">{errors.dob}</div>}
          </div>
          
          <div className={`form-group ${errors.gender && touched.gender ? 'has-error' : ''}`}>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.gender && touched.gender && <div className="error-message">{errors.gender}</div>}
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
          
          <div className={`form-group ${errors.confirmPassword && touched.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && touched.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading || !isFormValid}>
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="auth-links">
          <p>Already have an account?</p>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
