import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProviderProfile, updateProviderProfile } from '../../features/provider/providerSlice';
import { changePassword } from '../../features/customer/customerSlice';
import { validators } from '../../utils/validation';

const ProviderProfile = () => {
  const dispatch = useDispatch();
  const { profile, isLoading } = useSelector((state) => state.provider);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    businessName: '',
    companyAddress: '',
    gstNumber: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState({});

  useEffect(() => {
    dispatch(getProviderProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        contactNumber: profile.contactNumber || '',
        businessName: profile.businessName || '',
        companyAddress: profile.companyAddress || '',
        gstNumber: profile.gstNumber || '',
      });
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    
    if (passwordTouched[name]) {
      validatePasswordField(name, value);
    }
  };

  const handlePasswordBlur = (e) => {
    const { name, value } = e.target;
    setPasswordTouched({
      ...passwordTouched,
      [name]: true,
    });
    validatePasswordField(name, value);
  };

  const validatePasswordField = (name, value) => {
    let error = '';
    
    if (name === 'currentPassword') {
      error = validators.required(value);
    } else if (name === 'newPassword') {
      error = validators.password(value);
      if (!error && value === passwordData.currentPassword) {
        error = 'New password must be different from current password';
      }
    } else if (name === 'confirmPassword') {
      error = validators.confirmPassword(passwordData.newPassword, value);
    }
    
    setPasswordErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const validatePasswordForm = () => {
    const errors = {};
    
    errors.currentPassword = validators.required(passwordData.currentPassword);
    errors.newPassword = validators.password(passwordData.newPassword);
    
    if (!errors.newPassword && passwordData.newPassword === passwordData.currentPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    errors.confirmPassword = validators.confirmPassword(passwordData.newPassword, passwordData.confirmPassword);
    
    setPasswordErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProviderProfile(profileData));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    setPasswordTouched({
      currentPassword: true,
      newPassword: true,
      confirmPassword: true,
    });
    
    if (!validatePasswordForm()) {
      return;
    }

    dispatch(changePassword({
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    })).then((result) => {
      if (result.type === 'customer/changePassword/fulfilled') {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordErrors({});
        setPasswordTouched({});
      }
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Provider Profile</h1>
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Company Information
          </button>
          <button
            className={`tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="profile-form">
          <h2>Company Information</h2>
          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label htmlFor="name">Contact Person Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={profileData.contactNumber}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={profileData.businessName}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gstNumber">GST Number</label>
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                value={profileData.gstNumber}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="companyAddress">Company Address</label>
              <textarea
                id="companyAddress"
                name="companyAddress"
                value={profileData.companyAddress}
                onChange={handleProfileChange}
                rows="4"
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="password-form">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={passwordTouched.currentPassword && passwordErrors.currentPassword ? 'error' : ''}
              />
              {passwordTouched.currentPassword && passwordErrors.currentPassword && (
                <span className="error-message">{passwordErrors.currentPassword}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={passwordTouched.newPassword && passwordErrors.newPassword ? 'error' : ''}
              />
              {passwordTouched.newPassword && passwordErrors.newPassword && (
                <span className="error-message">{passwordErrors.newPassword}</span>
              )}
              <small className="password-hint">Password must be at least 6 characters long</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                className={passwordTouched.confirmPassword && passwordErrors.confirmPassword ? 'error' : ''}
              />
              {passwordTouched.confirmPassword && passwordErrors.confirmPassword && (
                <span className="error-message">{passwordErrors.confirmPassword}</span>
              )}
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading || Object.values(passwordErrors).some(error => error)}
            >
              {isLoading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProviderProfile;