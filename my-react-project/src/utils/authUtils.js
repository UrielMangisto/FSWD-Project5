// src/utils/authUtils.js

export const validateLoginForm = (formData) => {
  if (!formData.username.trim()) {
    return { isValid: false, error: 'שם משתמש הוא שדה חובה' };
  }
  
  if (!formData.password.trim()) {
    return { isValid: false, error: 'סיסמה היא שדה חובה' };
  }
  
  return { isValid: true, error: null };
};

export const authenticateUser = (username, password, users) => {
  return users.find(user => 
    user.username === username && user.website === password
  ) || null;
};

export const saveUserToStorage = (user) => {
  try {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
    throw new Error('שגיאה בשמירת נתוני המשתמש');
  }
};

export const getUserFromStorage = () => {
  try {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error('Error parsing saved user:', error);
    localStorage.removeItem('currentUser');
    return null;
  }
};

/**
 * Removes user from localStorage
 */
export const removeUserFromStorage = () => {
  localStorage.removeItem('currentUser');
};

/**
 * Navigates to a specific route
 * @param {string} path - Path to navigate to
 */
export const navigateTo = (path) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};