// appointmentApi.js remains the same as previously provided
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Interfaces for type safety (pseudo-TypeScript)
const AppointmentData = {
  name: String,
  email: String,
  phoneNo: String,
  videoCallDate: String,
  videoCallTime: String,
  source: String,
  notes: String,
  status: String,
  userId: Number,
};

const NoteData = {
  note: String,
  noteType: String,
  isImportant: Boolean,
  followUpDate: String,
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `HTTP error ${response.status}`);
  }
  const data = await response.json();
  return data;
};

const validateId = (id) => {
  if (!id || isNaN(Number(id))) throw new Error('Invalid or missing ID');
};

const appointmentApi = {
  async createAppointment(appointmentData, currentUser) {
    try {
      if (!appointmentData || typeof appointmentData !== 'object') {
        throw new Error('Invalid appointment data');
      }
      const dataWithUser = { ...appointmentData, userId: currentUser?.id || null };
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataWithUser),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error(error.message || 'Failed to create appointment');
    }
  },

  async getAllAppointments({ page = 1, limit = 10, status = '', search = '', includeNotes = false } = {}) {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(search && { search }),
        ...(includeNotes && { includeNotes: 'true' }),
      });
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/all?${query}`, {
        method: 'GET',
        credentials: 'include',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      throw new Error(error.message || 'Failed to fetch appointments');
    }
  },

  async getAppointmentById(id, { includeNotes = false, email = '' } = {}) {
    try {
      validateId(id);
      const query = new URLSearchParams();
      if (includeNotes) query.append('includeNotes', 'true');
      if (email) query.append('email', email.trim());
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/${id}${query.toString() ? `?${query}` : ''}`, {
        method: 'GET',
        credentials: 'include',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching appointment by ID:', error);
      throw new Error(error.message || 'Failed to fetch appointment');
    }
  },

  async getMyAppointments({ page = 1, limit = 10, includeNotes = false } = {}) {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(includeNotes && { includeNotes: 'true' }),
      });
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/my-enquiries?${query}`, {
        method: 'GET',
        credentials: 'include',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching my appointments:', error);
      throw new Error(error.message || 'Failed to fetch my appointments');
    }
  },

  async updateAppointment(id, appointmentData, currentUser) {
    try {
      validateId(id);
      if (!appointmentData || typeof appointmentData !== 'object') {
        throw new Error('Invalid appointment data');
      }
      const dataWithUser = { ...appointmentData, userId: currentUser?.id || null };
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataWithUser),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw new Error(error.message || 'Failed to update appointment');
    }
  },

  async deleteAppointment(id) {
    try {
      validateId(id);
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw new Error(error.message || 'Failed to delete appointment');
    }
  },

  async addInternalNote(enquiryId, noteData) {
    try {
      validateId(enquiryId);
      if (!noteData?.note?.trim()) throw new Error('Note content is required');
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/${enquiryId}/internal-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(noteData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding internal note:', error);
      throw new Error(error.message || 'Failed to add internal note');
    }
  },

  async getInternalNotes(enquiryId, { page = 1, limit = 20 } = {}) {
    try {
      validateId(enquiryId);
      const query = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/${enquiryId}/internal-notes?${query}`, {
        method: 'GET',
        credentials: 'include',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching internal notes:', error);
      throw new Error(error.message || 'Failed to fetch internal notes');
    }
  },

  async updateInternalNote(noteId, noteData) {
    try {
      validateId(noteId);
      if (!noteData || typeof noteData !== 'object') throw new Error('Invalid note data');
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/internal-notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(noteData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating internal note:', error);
      throw new Error(error.message || 'Failed to update internal note');
    }
  },

  async deleteInternalNote(noteId) {
    try {
      validateId(noteId);
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/internal-notes/${noteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting internal note:', error);
      throw new Error(error.message || 'Failed to delete internal note');
    }
  },

  async getFollowUpDashboard(days = 7) {
    try {
      const query = new URLSearchParams({ days: days.toString() });
      const response = await fetch(`${API_BASE_URL}/video-call-enquiries/dashboard/follow-ups?${query}`, {
        method: 'GET',
        credentials: 'include',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching follow-up dashboard:', error);
      throw new Error(error.message || 'Failed to fetch follow-up dashboard');
    }
  },
};

export default appointmentApi;