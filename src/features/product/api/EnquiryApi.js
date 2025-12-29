// src/features/enquiry/EnquiryApi.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // Include cookies (access token and refresh token are in httpOnly cookies)
});

// Request interceptor - no token handling needed (tokens in cookies)
apiClient.interceptors.request.use(
  (config) => {
    // No Authorization header needed - tokens are in secure cookies
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        data: config.data,
        params: config.params,
      });
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - tokens managed by backend via cookies
apiClient.interceptors.response.use(
  (response) => {
    // Tokens are managed via secure httpOnly cookies - no frontend handling needed
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    // Handle 401 errors - tokens are refreshed automatically by backend via cookies
    if (error.response?.status === 401) {
      // Redirect to login if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const errorDetails = {
      message: error.response?.data?.message || error.response?.data?.error || error.message || 'Unknown error',
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    };
    console.error('API Error:', errorDetails);

    return Promise.reject(new Error(errorDetails.message));
  }
);

// Get current user info from localStorage (user data stored there, not token)
const getCurrentUserFromToken = () => {
  try {
    // Get user ID from localStorage (stored during login)
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');
    if (!userId) return null;
    return { id: parseInt(userId), role, email };
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

// Input validation function
const validateInput = (data, requiredFields, options = {}) => {
  const { validateEmail, validRoles, validStatuses, validatePincode } = options;
  let inputData = { ...data };
  const missingFields = requiredFields.filter(
    (field) =>
      inputData[field] === undefined ||
      inputData[field] === null ||
      (typeof inputData[field] === 'string' && inputData[field].trim() === '')
  );
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (validateEmail && inputData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputData.email)) {
      throw new Error('Invalid email format');
    }
  }

  if (inputData.phoneNo) {
    const cleanPhone = inputData.phoneNo.replace(/[^\d]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      throw new Error('Phone number must be between 10-15 digits');
    }
    inputData.phoneNo = cleanPhone;
  }

  if (validRoles && inputData.role && !validRoles.includes(inputData.role)) {
    throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
  }

  if (validStatuses && inputData.status && !validStatuses.includes(inputData.status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  if (validatePincode && inputData.pincode) {
    const cleanPincode = inputData.pincode.replace(/[^\d]/g, '');
    if (!cleanPincode || cleanPincode.length !== 6) {
      throw new Error('Pincode must be a 6-digit number');
    }
    inputData.pincode = cleanPincode;
  }

  if (inputData.productId !== undefined && inputData.productId !== null && inputData.productId !== '') {
    const productId = parseInt(inputData.productId, 10);
    if (isNaN(productId)) {
      throw new Error('Invalid product ID format');
    }
    inputData.productId = productId;
  }

  return inputData;
};

// Create enquiry
export const createEnquiry = async (enquiryData) => {
  try {
    const validRoles = ['Customer', 'Dealer', 'Architect', 'Admin', 'Manager', 'Sales', 'Support'];
    const validSources = ['Email', 'WhatsApp', 'Phone', 'VideoCall', 'Website']; // Added 'Website' for flexibility
    const currentUser = getCurrentUserFromToken();

    // Ensure role is always valid (default to 'Customer' if not)
    let roleToSend = enquiryData.role;
    if (!validRoles.includes(roleToSend)) {
      roleToSend = 'Customer';
    }

    const formattedData = validateInput(
      {
        userId: currentUser?.id || null,
        productId: enquiryData.productId || null,
        name: enquiryData.name?.trim(),
        email: enquiryData.email?.trim().toLowerCase(),
        phoneNo: enquiryData.phoneNo,
        companyName: enquiryData.companyName?.trim() || null,
        state: enquiryData.state?.trim(),
        city: enquiryData.city?.trim(),
        userType: enquiryData.userType || 'General',
        source: enquiryData.source || 'Website',
        notes: enquiryData.notes?.trim() || null,
        videoCallDate: enquiryData.videoCallDate || null,
        videoCallTime: enquiryData.videoCallTime || null,
        productDesignNumber: enquiryData.productDesignNumber ? String(enquiryData.productDesignNumber).trim() : null,
        role: roleToSend,
        pincode: enquiryData.pincode || null,
      },
      ['name', 'email', 'phoneNo', 'state', 'city'],
      { validateEmail: true, validRoles, validSources, validatePincode: true }
    );

    console.log('Creating enquiry with formatted data:', formattedData);

    const response = await apiClient.post('/enquiries/create', formattedData);
    if (!response.data?.success || !response.data?.data) {
      throw new Error(response.data?.message || 'Invalid response format from server');
    }

    return {
      success: true,
      message: response.data.message || 'Enquiry created successfully',
      data: response.data.data,
    };
  } catch (error) {
    console.error('Create enquiry failed:', error);
    throw new Error(error.message || 'Failed to create enquiry');
  }
};

// Get all enquiries
export const getAllEnquiries = async ({ page = 1, limit = 10, search, status, source, userType, state, city, role, pincode, includeNotes = false }) => {
  try {
    const validStatuses = ['New', 'InProgress', 'Confirmed', 'Delivered', 'Rejected'];
    const validRoles = ['Customer', 'Dealer', 'Architect', 'Admin', 'Manager', 'Sales', 'Support'];
    const validSources = ['Email', 'WhatsApp', 'Phone', 'VideoCall', 'Website'];

    validateInput({ page, limit, pincode }, ['page', 'limit'], { validStatuses, validRoles, validSources, validatePincode: true });

    const params = { page, limit, search, status, source, userType, state, city, role, pincode, includeNotes };
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== null && value !== undefined && value !== 'all')
    );

    const response = await apiClient.get('/enquiries/all', { params: cleanParams });
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to fetch enquiries');
    }

    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  } catch (error) {
    console.error('Get all enquiries failed:', error);
    throw new Error(error.message || 'Failed to fetch enquiries');
  }
};

// Get enquiry by ID
export const getEnquiryById = async (id, includeNotes = false) => {
  try {
    validateInput({ id }, ['id']);

    const response = await apiClient.get(`/enquiries/${id}`, { params: { includeNotes } });
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to fetch enquiry');
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Get enquiry by ID failed:', error);
    throw new Error(error.message || 'Failed to fetch enquiry');
  }
};

// Update enquiry
export const updateEnquiry = async (id, enquiryData) => {
  try {
    const validRoles = ['Customer', 'Dealer', 'Architect', 'Admin', 'Manager', 'Sales', 'Support'];
    const validStatuses = ['New', 'InProgress', 'Confirmed', 'Delivered', 'Rejected'];
    const validSources = ['Email', 'WhatsApp', 'Phone', 'VideoCall', 'Website'];

    const formattedData = validateInput(
      {
        name: enquiryData.name?.trim(),
        email: enquiryData.email?.trim().toLowerCase(),
        phoneNo: enquiryData.phoneNo,
        companyName: enquiryData.companyName?.trim() || null,
        state: enquiryData.state?.trim(),
        city: enquiryData.city?.trim(),
        userType: enquiryData.userType || 'General',
        source: enquiryData.source || 'Website',
        notes: enquiryData.notes?.trim() || null,
        videoCallDate: enquiryData.videoCallDate || null,
        videoCallTime: enquiryData.videoCallTime || null,
        productId: enquiryData.productId || null,
        productDesignNumber: enquiryData.productDesignNumber?.trim() || null,
        role: enquiryData.role || 'Customer',
        status: enquiryData.status || undefined,
        pincode: enquiryData.pincode || null,
      },
      [],
      { validateEmail: enquiryData.email ? true : false, validRoles, validStatuses, validSources, validatePincode: true }
    );

    const cleanData = Object.fromEntries(
      Object.entries(formattedData).filter(([_, v]) => v !== undefined)
    );

    console.log('Updating enquiry with formatted data:', cleanData);

    const response = await apiClient.put(`/enquiries/${id}`, cleanData);
    if (!response.data?.success || !response.data?.data) {
      throw new Error(response.data?.message || 'Invalid response format from server');
    }

    return {
      success: true,
      message: response.data.message || 'Enquiry updated successfully',
      data: response.data.data,
    };
  } catch (error) {
    console.error('Update enquiry failed:', error);
    throw new Error(error.message || 'Failed to update enquiry');
  }
};

// Update enquiry status
export const updateEnquiryStatus = async (id, { status, notes, role, pincode }) => {
  try {
    const validStatuses = ['New', 'InProgress', 'Confirmed', 'Delivered', 'Rejected'];
    const validRoles = ['Customer', 'Dealer', 'Architect', 'Admin', 'Manager', 'Sales', 'Support'];

    const formattedData = validateInput(
      {
        id,
        status,
        notes: notes?.trim() || null,
        role: role || 'Customer',
        pincode: pincode || null,
      },
      ['id', 'status'],
      { validStatuses, validRoles, validatePincode: true }
    );

    const response = await apiClient.put(`/enquiries/${id}/status`, formattedData);
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to update enquiry status');
    }

    return {
      success: true,
      message: response.data.message || 'Status updated successfully',
      data: response.data.data,
    };
  } catch (error) {
    console.error('Update enquiry status failed:', error);
    throw new Error(error.message || 'Failed to update enquiry status');
  }
};

// Add internal note
export const addInternalNote = async (enquiryId, noteData) => {
  try {
    const validNoteTypes = ['Follow-up', 'Contact Attempt', 'Meeting Notes', 'Status Update', 'Other'];
    const currentUser = getCurrentUserFromToken();

    const formattedData = validateInput(
      {
        note: noteData.note?.trim(),
        noteType: noteData.noteType || 'Follow-up',
        isImportant: noteData.isImportant || false,
        followUpDate: noteData.followUpDate || null,
        userId: noteData.userId || null,
        productId: noteData.productId || null,
      },
      { validNoteTypes }
    );

    console.log('Adding internal note with formatted data:', formattedData);

    const response = await apiClient.post(`/enquiries/${enquiryId}/internal-notes`, formattedData);
    if (!response.data?.success || !response.data?.data) {
      throw new Error(response.data?.message || 'Invalid response format from server');
    }

    return {
      success: true,
      message: response.data.message || 'Internal note added successfully',
      data: response.data.data,
    };
  } catch (error) {
    console.error('Add internal note failed:', error);
    throw new Error(error.message || 'Failed to add internal note');
  }
};

// Get internal notes
export const getInternalNotes = async (enquiryId, { page = 1, limit = 20 }) => {
  try {
    validateInput({ enquiryId, page, limit }, ['enquiryId', 'page', 'limit']);

    const response = await apiClient.get(`/enquiries/${enquiryId}/internal-notes`, { params: { page, limit } });
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to fetch internal notes');
    }

    return {
      success: true,
      data: response.data.data || [],
      pagination: response.data.pagination || {},
    };
  } catch (error) {
    console.error('Get internal notes failed:', error);
    throw new Error(error.message || 'Failed to fetch internal notes');
  }
};

// Update internal note
export const updateInternalNote = async (noteId, noteData) => {
  try {
    const validNoteTypes = ['Follow-up', 'Contact Attempt', 'Meeting Notes', 'Status Update', 'Other'];

    const formattedData = validateInput(
      {
        note: noteData.note?.trim(),
        noteType: noteData.noteType,
        isImportant: noteData.isImportant,
        followUpDate: noteData.followUpDate,
      },
      [],
      { validNoteTypes }
    );

    const cleanData = Object.fromEntries(
      Object.entries(formattedData).filter(([_, v]) => v !== undefined)
    );

    console.log('Updating internal note with formatted data:', cleanData);

    const response = await apiClient.put(`/enquiries/internal-notes/${noteId}`, cleanData);
    if (!response.data?.success || !response.data?.data) {
      throw new Error(response.data?.message || 'Invalid response format from server');
    }

    return {
      success: true,
      message: response.data.message || 'Internal note updated successfully',
      data: response.data.data,
    };
  } catch (error) {
    console.error('Update internal note failed:', error);
    throw new Error(error.message || 'Failed to update internal note');
  }
};

// Delete internal note
export const deleteInternalNote = async (noteId) => {
  try {
    validateInput({ noteId }, ['noteId']);

    const response = await apiClient.delete(`/enquiries/internal-notes/${noteId}`);
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to delete internal note');
    }

    return {
      success: true,
      message: response.data.message || 'Internal note deleted successfully',
    };
  } catch (error) {
    console.error('Delete internal note failed:', error);
    throw new Error(error.message || 'Failed to delete internal note');
  }
};

// Get follow-up dashboard
export const getFollowUpDashboard = async (days = 7) => {
  try {
    validateInput({ days }, ['days']);

    const response = await apiClient.get('/enquiries/dashboard/follow-ups', { params: { days } });
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to fetch follow-up dashboard');
    }

    return {
      success: true,
      data: response.data.data || { upcoming: [], overdue: [], summary: {} },
    };
  } catch (error) {
    console.error('Get follow-up dashboard failed:', error);
    throw new Error(error.message || 'Failed to fetch follow-up dashboard');
  }
};

// Get user types
export const getUserTypes = async () => {
  try {
    const response = await apiClient.get('/user-types');
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to fetch user types');
    }
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error('Get user types failed:', error);
    throw new Error(error.message || 'Failed to fetch user types');
  }
};

// Delete enquiry
export const deleteEnquiry = async (id) => {
  try {
    validateInput({ id }, ['id']);

    const response = await apiClient.delete(`/enquiries/${id}`);
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to delete enquiry');
    }

    return {
      success: true,
      message: response.data.message || 'Enquiry deleted successfully',
    };
  } catch (error) {
    console.error('Delete enquiry failed:', error);
    throw new Error(error.message || 'Failed to delete enquiny');
  }
};

// Debug to confirm exports
console.log('Exporting getEnquiryById:', typeof getEnquiryById);

// Default export
export default {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  updateEnquiryStatus,
  addInternalNote,
  getInternalNotes,
  updateInternalNote,
  deleteInternalNote,
  getFollowUpDashboard,
  getUserTypes,
  deleteEnquiry,
};
