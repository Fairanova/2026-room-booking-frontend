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
        const headers = this.getHeaders(options.auth !== false);
        
        const config = {
            ...options,
            headers: headers
        };

        console.log(`📡 API Request: ${options.method || 'GET'} ${url}`);
        console.log('Headers:', headers);

        try {
            const response = await fetch(url, config);
            
            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                console.error('❌ API Error Response:', { status: response.status, data });
                throw {
                    status: response.status,
                    message: data?.message || data?.title || 'An error occurred',
                    data
                };
            }

            return data;
        } catch (error) {
            console.error('❌ API Request Failed:', error);
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
        const response = await this.get(API_CONFIG.ENDPOINTS.ROOMS, params);
        return response.data || response;
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
        const response = await this.get(API_CONFIG.ENDPOINTS.BOOKINGS, params);
        return response.data || response;
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
