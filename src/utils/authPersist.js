// Utility functions to persist authentication state

/**
 * Save authentication state to localStorage (without token - tokens are in secure cookies)
 * @param {Object} authState - The authentication state to persist
 */
export const saveAuthState = (authState) => {
  try {
    const serializedState = JSON.stringify({
      user: authState.user,
      isAuthenticated: authState.isAuthenticated,
      // Token removed - now stored in secure httpOnly cookie
      userType: authState.userType,
      userRole: authState.userRole
    });
    localStorage.setItem('authState', serializedState);
  } catch (err) {
    console.error('Could not save auth state', err);
  }
};

/**
 * Load authentication state from localStorage
 * @returns {Object|null} The loaded authentication state or null if not found
 */
export const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (!serializedState) return null;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load auth state', err);
    return null;
  }
};

/**
 * Clear authentication state from localStorage
 */
export const clearAuthState = () => {
  try {
    localStorage.removeItem('authState');
  } catch (err) {
    console.error('Could not clear auth state', err);
  }
};