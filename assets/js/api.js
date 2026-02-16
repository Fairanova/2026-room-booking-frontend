// API Service - Handles all HTTP requests
class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    // Get auth token from localStorage
    getToken() {
        return localStorage.getItem(APP_CONFIG.TOKEN_KEY);
    }

    // Get default headers
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(options.auth !== false)
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data?.message || data?.title || 'An error occurred',
                    data
                };
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // GET request
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        
        return this.request(url, {
            method: 'GET'
        });
    }

    // POST request
    async post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            ...options
        });
    }

    // PUT request
    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // ===== AUTH ENDPOINTS =====
    async login(credentials) {
        return this.post(API_CONFIG.ENDPOINTS.LOGIN, credentials, { auth: false });
    }

    async register(userData) {
        return this.post(API_CONFIG.ENDPOINTS.REGISTER, userData, { auth: false });
    }

    async getProfile() {
        return this.get(API_CONFIG.ENDPOINTS.PROFILE);
    }

    // ===== ROOMS ENDPOINTS =====
    async getRooms(params = {}) {
        return this.get(API_CONFIG.ENDPOINTS.ROOMS, params);
    }

    async getRoomById(id) {
        return this.get(API_CONFIG.ENDPOINTS.ROOM_DETAIL(id));
    }

    async getAvailableRooms(params) {
        return this.get(API_CONFIG.ENDPOINTS.ROOMS_AVAILABLE, params);
    }

    async createRoom(roomData) {
        return this.post(API_CONFIG.ENDPOINTS.ROOMS, roomData);
    }

    async updateRoom(id, roomData) {
        return this.put(API_CONFIG.ENDPOINTS.ROOM_DETAIL(id), roomData);
    }

    async deleteRoom(id) {
        return this.delete(API_CONFIG.ENDPOINTS.ROOM_DETAIL(id));
    }

    // ===== BOOKINGS ENDPOINTS =====
    async getBookings(params = {}) {
        return this.get(API_CONFIG.ENDPOINTS.BOOKINGS, params);
    }

    async createBooking(bookingData) {
        return this.post(API_CONFIG.ENDPOINTS.BOOKINGS, bookingData);
    }

    async updateBookingStatus(id, statusData) {
        return this.put(API_CONFIG.ENDPOINTS.BOOKING_STATUS(id), statusData);
    }

    async cancelBooking(id) {
        return this.delete(API_CONFIG.ENDPOINTS.BOOKING_CANCEL(id));
    }
}

// Create global instance
const api = new ApiService();
