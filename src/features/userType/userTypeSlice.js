import { createSlice } from '@reduxjs/toolkit';

const normalize = (type) => {
  if (!type) return 'General';

  const key = String(type).toLowerCase().replace(/\s+/g, ' ').trim();

  const map = {
    residential: 'Residential',
    commercial: 'Commercial',
    'modular kitchen': 'Modular Kitchen',
    'modular-kitchen': 'Modular Kitchen',
    'modular+kitchen': 'Modular Kitchen',
    modular: 'Modular Kitchen',
    modularkitchen: 'Modular Kitchen',
    general: 'General',
    others: 'Others',
  };

  return map[key] || type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
};

// Get initial type without triggering popup unnecessarily
const getInitialType = () => {
  const storedType = localStorage.getItem('userType');
  const confirmed = localStorage.getItem('userTypeConfirmed') === 'true';

  // Only return a userType if it's been confirmed by the user
  if (storedType && confirmed) {
    const normalized = normalize(storedType);
    // Don't show 'General' in navbar - it's just an internal default
    if (normalized.toLowerCase() === 'general') {
      return null;
    }
    return normalized;
  }

  // Return null so navbar shows placeholder like "Select Type"
  return null;
};

const userTypeSlice = createSlice({
  name: 'userType',
  initialState: {
    userType: getInitialType(),
    userTypeId: localStorage.getItem('userTypeId') ? parseInt(localStorage.getItem('userTypeId')) : null,
    isPopupOpen: false,
  },
  reducers: {
    setUserType(state, action) {
      const mapped = normalize(action.payload);
      const lower = mapped.toLowerCase();
      state.userType = mapped;
      localStorage.setItem('userType', lower);
      localStorage.setItem('userTypeConfirmed', 'true');
      state.isPopupOpen = false;

      console.log('[userTypeSlice] User type set to:', mapped);

      // Dispatch events for other components
      setTimeout(() => {
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'userType',
          newValue: lower,
        }));

        window.dispatchEvent(new CustomEvent('userTypeChanged', {
          detail: {
            userType: mapped,
            userTypeId: state.userTypeId
          }
        }));
      }, 0);
    },

    // New action to set both userType and userTypeId
    setUserTypeWithId(state, action) {
      const { userType, userTypeId } = action.payload;
      const mapped = normalize(userType);
      const lower = mapped.toLowerCase();

      state.userType = mapped;
      state.userTypeId = userTypeId;

      localStorage.setItem('userType', lower);
      localStorage.setItem('userTypeId', userTypeId?.toString() || '');
      localStorage.setItem('userTypeConfirmed', 'true');
      state.isPopupOpen = false;

      console.log('[userTypeSlice] User type set to:', mapped, 'with ID:', userTypeId);

      // Dispatch events for other components
      setTimeout(() => {
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'userType',
          newValue: lower,
        }));

        window.dispatchEvent(new CustomEvent('userTypeChanged', {
          detail: {
            userType: mapped,
            userTypeId
          }
        }));
      }, 0);
    },

    openPopup(state) {
      console.log('[userTypeSlice] Opening popup');
      state.isPopupOpen = true;
    },

    closePopup(state) {
      console.log('[userTypeSlice] Closing popup');
      state.isPopupOpen = false;
      localStorage.setItem('userTypeConfirmed', 'true');
    },

    resetPopupTrigger(state) {
      // Reset the popup trigger state
      state.isPopupOpen = false;
    },

    // Sync from profile data
    syncFromProfile(state, action) {
      const { userTypeId, userTypeName } = action.payload;

      if (userTypeId && userTypeName) {
        const mapped = normalize(userTypeName);
        const lower = mapped.toLowerCase();

        state.userType = mapped;
        state.userTypeId = userTypeId;

        localStorage.setItem('userType', lower);
        localStorage.setItem('userTypeId', userTypeId.toString());

        console.log('[userTypeSlice] Synced from profile:', mapped, userTypeId);
      }
    }
  },
});

export const {
  setUserType,
  setUserTypeWithId,
  openPopup,
  closePopup,
  resetPopupTrigger,
  syncFromProfile
} = userTypeSlice.actions;

// Updated middleware to handle login properly
export const userTypeMiddleware = store => next => action => {
  const result = next(action);

  // Handle login success
  if (action.type === 'auth/login/fulfilled') {
    const state = store.getState();
    const isAuthenticated = state.auth.isAuthenticated;
    const userTypeConfirmed = localStorage.getItem('userTypeConfirmed') === 'true';

    // Only open popup after login if user type is not confirmed
    if (isAuthenticated && !userTypeConfirmed) {
      console.log('[Middleware] Opening popup after login - user type not confirmed');
      setTimeout(() => {
        store.dispatch(openPopup());
      }, 500);
    }
  }

  return result;
};

export default userTypeSlice.reducer;