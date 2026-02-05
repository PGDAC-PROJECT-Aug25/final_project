// Validation utility functions

export const validators = {
  required: (value) => {
    if (!value || value.toString().trim() === '') {
      return 'This field is required';
    }
    return '';
  },

  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  },

  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  },

  phone: (value) => {
    if (!value) return 'Phone number is required';
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
      return 'Phone number must be exactly 10 digits';
    }
    return '';
  },

  name: (value) => {
    if (!value) return 'Name is required';
    if (value.length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (value.length > 50) {
      return 'Name must not exceed 50 characters';
    }
    return '';
  },

  busNumber: (value) => {
    if (!value) return 'Bus number is required';
    if (value.length < 3 || value.length > 20) {
      return 'Bus number must be between 3 and 20 characters';
    }
    return '';
  },

  positiveNumber: (value, fieldName = 'Value') => {
    if (!value) return `${fieldName} is required`;
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} must be a positive number`;
    }
    return '';
  },

  futureDate: (value) => {
    if (!value) return 'Date is required';
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return 'Date cannot be in the past';
    }
    return '';
  },

  gstNumber: (value) => {
    if (!value) return 'GST number is required';
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(value)) {
      return 'Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)';
    }
    return '';
  },

  address: (value) => {
    if (!value) return 'Address is required';
    if (value.length < 10) {
      return 'Address must be at least 10 characters long';
    }
    if (value.length > 200) {
      return 'Address must not exceed 200 characters';
    }
    return '';
  },

  businessName: (value) => {
    if (!value) return 'Business name is required';
    if (value.length < 3) {
      return 'Business name must be at least 3 characters long';
    }
    if (value.length > 100) {
      return 'Business name must not exceed 100 characters';
    }
    return '';
  },

  price: (value) => {
    if (!value) return 'Price is required';
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return 'Price must be a positive number';
    }
    if (num > 10000) {
      return 'Price seems too high. Please verify';
    }
    return '';
  },

  seats: (value) => {
    if (!value) return 'Number of seats is required';
    const num = Number(value);
    if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
      return 'Number of seats must be a positive whole number';
    }
    if (num > 60) {
      return 'Number of seats cannot exceed 60';
    }
    return '';
  }
};

// Form validation helper
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = formData[field];
    
    if (typeof rule === 'function') {
      const error = rule(value, formData);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    }
  });

  return { errors, isValid };
};
