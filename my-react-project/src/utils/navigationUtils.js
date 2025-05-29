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
 * Validates user information
 * @param {Object} user - User object
 * @returns {boolean} True if user is valid
 */
export const validateUserInfo = (user) => {
  return user && 
         user.id && 
         user.name && 
         user.username && 
         user.email;
};

/**
 * Gets navigation items for a user
 * @param {number} userId - User ID
 * @returns {Array} Array of navigation items
 */
export const getNavigationItems = (userId) => [
  {
    path: `/users/${userId}/info`,
    title: 'User Details',
    description: 'View detailed user information',
    icon: '👤'
  },
  {
    path: `/users/${userId}/todos`,
    title: 'My Todos',
    description: 'Manage your tasks and todos',
    icon: '✅'
  },
  {
    path: `/users/${userId}/posts`,
    title: 'My Posts',
    description: 'View and manage your posts',
    icon: '📝'
  },
  {
    path: `/users/${userId}/albums`,
    title: 'My Albums',
    description: 'Browse your photo albums',
    icon: '📸'
  }
];

/**
 * Gets user statistics for display
 * @param {Object} user - User object
 * @returns {Array} Array of user stats
 */
export const getUserStats = (user) => [
  {
    id: 'user-id',
    label: 'User ID',
    value: user.id,
    icon: '🆔'
  },
  {
    id: 'email',
    label: 'Email',
    value: user.email || 'Not available',
    icon: '📧'
  },
  {
    id: 'phone',
    label: 'Phone',
    value: user.phone || 'Not available',
    icon: '📱'
  },
  {
    id: 'website',
    label: 'Website',
    value: user.website || 'Not available',
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
  if (!company) return null;
  
  return {
    name: company.name || 'Unknown Company',
    catchPhrase: company.catchPhrase || 'No slogan available',
    bs: company.bs || 'No business description'
  };
};

/**
 * Formats user geo location for display
 * @param {Object} geo - Geo object from address
 * @returns {string} Formatted coordinates
 */
export const formatUserGeo = (geo) => {
  if (!geo || !geo.lat || !geo.lng) {
    return 'Location not available';
  }
  
  return `${geo.lat}, ${geo.lng}`;
};

/**
 * Gets user's full address as a single string
 * @param {Object} address - Address object
 * @returns {string} Full formatted address
 */
export const getFullAddress = (address) => {
  const addressLines = formatUserAddress(address);
  return addressLines.length > 0 ? addressLines.join(', ') : 'Address not available';
};

/**
 * Checks if user has complete profile information
 * @param {Object} user - User object
 * @returns {Object} Completeness status
 */
export const getProfileCompleteness = (user) => {
  const requiredFields = ['name', 'username', 'email', 'phone', 'website'];
  const addressFields = ['street', 'city', 'zipcode'];
  const companyFields = ['name', 'catchPhrase'];
  
  const completedBasic = requiredFields.filter(field => user[field] && user[field].trim() !== '').length;
  const completedAddress = addressFields.filter(field => user.address && user.address[field] && user.address[field].trim() !== '').length;
  const completedCompany = companyFields.filter(field => user.company && user.company[field] && user.company[field].trim() !== '').length;
  
  const totalFields = requiredFields.length + addressFields.length + companyFields.length;
  const completedFields = completedBasic + completedAddress + completedCompany;
  
  return {
    percentage: Math.round((completedFields / totalFields) * 100),
    completed: completedFields,
    total: totalFields,
    isComplete: completedFields === totalFields
  };
};