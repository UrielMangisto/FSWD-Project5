// src/utils/navigationUtils.js

/**
 * Navigation utility functions for HomePage
 */

/**
 * Navigates to user-specific route
 * @param {number} userId - User ID
 * @param {string} path - Path to navigate to
 */
export const navigateToUserRoute = (userId, path) => {
  const fullPath = `/users/${userId}${path}`;
  window.history.pushState({}, '', fullPath);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

/**
 * Handles logout process
 * @param {Function} onLogout - Logout callback function
 */
export const handleUserLogout = (onLogout) => {
  // Clear localStorage
  localStorage.removeItem('currentUser');
  
  // Call parent logout handler
  if (onLogout) {
    onLogout();
  }
  
  // Navigate to login
  window.history.pushState({}, '', '/login');
  window.dispatchEvent(new PopStateEvent('popstate'));
};

/**
 * Gets navigation items configuration
 * @returns {Array} Array of navigation items
 */
export const getNavigationItems = (userId) => [
  {
    id: 'info',
    title: 'מידע אישי',
    description: 'הצג ועדכן את הפרטים האישיים שלך',
    icon: 'ℹ️',
    path: `/users/${userId}/info`,
    className: 'info'
  },
  {
    id: 'todos',
    title: 'משימות',
    description: 'נהל את רשימת המשימות שלך',
    icon: '✅',
    path: `/users/${userId}/todos`,
    className: 'todos'
  },
  {
    id: 'posts',
    title: 'פוסטים',
    description: 'כתוב וערוך פוסטים, נהל תגובות',
    icon: '📝',
    path: `/users/${userId}/posts`,
    className: 'posts'
  },
  {
    id: 'albums',
    title: 'אלבומים',
    description: 'צפה ונהל את אלבומי התמונות שלך',
    icon: '📸',
    path: `/users/${userId}/albums`,
    className: 'albums'
  }
];

/**
 * Gets user stats for quick display
 * @param {Object} user - User object
 * @returns {Array} Array of stat objects
 */
export const getUserStats = (user) => [
  {
    id: 'user-id',
    label: 'מזהה משתמש',
    value: user.id,
    icon: '🆔'
  },
  {
    id: 'email',
    label: 'אימייל',
    value: user.email || 'לא זמין',
    icon: '📧'
  },
  {
    id: 'phone',
    label: 'טלפון',
    value: user.phone || 'לא זמין',
    icon: '📱'
  },
  {
    id: 'website',
    label: 'אתר אינטרנט',
    value: user.website || 'לא זמין',
    icon: '🌐'
  }
];

/**
 * Formats user address for display
 * @param {Object} address - Address object
 * @returns {Array} Array of address lines
 */
export const formatUserAddress = (address) => {
  if (!address) return [];
  
  const addressLines = [];
  
  if (address.street) addressLines.push(address.street);
  if (address.suite) addressLines.push(address.suite);
  if (address.city) addressLines.push(address.city);
  if (address.zipcode) addressLines.push(address.zipcode);
  
  return addressLines.filter(line => line && line.trim() !== '');
};

/**
 * Formats user company information for display
 * @param {Object} company - Company object
 * @returns {Object|null} Formatted company info or null
 */
export const formatUserCompany = (company) => {
  if (!company || !company.name) return null;
  
  return {
    name: company.name,
    catchPhrase: company.catchPhrase || '',
    bs: company.bs || ''
  };
};

/**
 * Validates if user has required information
 * @param {Object} user - User object
 * @returns {boolean} True if user has minimum required info
 */
export const validateUserInfo = (user) => {
  console.log('Validating user info:', user);
  
  return user && user.id && user.name && user.username;
};