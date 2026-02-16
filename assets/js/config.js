// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5001/api',
    ENDPOINTS: {
        // Auth
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
        
        // Rooms
        ROOMS: '/rooms',
        ROOM_DETAIL: (id) => `/rooms/${id}`,
        ROOMS_AVAILABLE: '/rooms/available',
        
        // Bookings
        BOOKINGS: '/bookings',
        BOOKING_DETAIL: (id) => `/bookings/${id}`,
        BOOKING_STATUS: (id) => `/bookings/${id}/status`,
        BOOKING_CANCEL: (id) => `/bookings/${id}`
    }
};

// App Configuration
const APP_CONFIG = {
    APP_NAME: 'Room Booking System',
    TOKEN_KEY: 'auth_token',
    USER_KEY: 'user_data',
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50
};

// Booking Status
const BOOKING_STATUS = {
    PENDING: 1,
    APPROVED: 2,
    REJECTED: 3,
    CANCELLED: 4
};

// User Roles
const USER_ROLES = {
    STUDENT: 1,
    STAFF: 2,
    ADMIN: 3
};

// Status Labels
const STATUS_LABELS = {
    [BOOKING_STATUS.PENDING]: 'Pending',
    [BOOKING_STATUS.APPROVED]: 'Approved',
    [BOOKING_STATUS.REJECTED]: 'Rejected',
    [BOOKING_STATUS.CANCELLED]: 'Cancelled'
};

// Role Labels
const ROLE_LABELS = {
    [USER_ROLES.STUDENT]: 'Student',
    [USER_ROLES.STAFF]: 'Staff',
    [USER_ROLES.ADMIN]: 'Admin'
};
