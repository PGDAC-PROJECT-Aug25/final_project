// Utility function to decode JWT token
export const decodeJWT = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Get user info from token
export const getUserFromToken = (token) => {
  try {
    console.log('Decoding token:', token);
    const payload = decodeJWT(token);
    console.log('JWT payload:', payload);
    
    if (!payload) return null;
    
    const user = {
      id: payload.user_id,
      email: payload.sub,
      role: payload.user_role,
      name: payload.sub?.split('@')[0] || 'User'
    };
    
    console.log('Extracted user info:', user);
    return user;
  } catch (error) {
    console.error('Error extracting user from token:', error);
    return null;
  }
};