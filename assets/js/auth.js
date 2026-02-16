// Authentication Service
class AuthService {
    constructor() {
        this.currentUser = null;
        this.loadUser();
    }

    // Save token to localStorage
    saveToken(token) {
        localStorage.setItem(APP_CONFIG.TOKEN_KEY, token);
    }

    // Get token from localStorage
    getToken() {
        return localStorage.getItem(APP_CONFIG.TOKEN_KEY);
    }

    // Remove token from localStorage
    removeToken() {
        localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
    }

    // Save user data
    saveUser(user) {
        this.currentUser = user;
        localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(user));
    }

    // Load user data
    loadUser() {
        const userData = localStorage.getItem(APP_CONFIG.USER_KEY);
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    // Get current user
    getUser() {
        return this.currentUser;
    }

    // Check if user is logged in
    isAuthenticated() {
        return !!this.getToken();
    }

    // Check if user has specific role
    hasRole(role) {
        return this.currentUser?.role === role;
    }

    // Check if user is admin or staff
    isAdminOrStaff() {
        return this.hasRole(USER_ROLES.ADMIN) || this.hasRole(USER_ROLES.STAFF);
    }

    // Check if user is admin
    isAdmin() {
        return this.hasRole(USER_ROLES.ADMIN);
    }

    // Login
    async login(credentials) {
        try {
            const response = await api.login(credentials);
            
            // Backend returns: { token, username, email, fullName, role, expiresAt }
            if (response.token) {
                this.saveToken(response.token);
                
                // Convert backend response to user object
                const user = {
                    username: response.username,
                    email: response.email,
                    fullName: response.fullName,
                    role: response.role
                };
                
                this.saveUser(user);
                return { success: true, user };
            }
            
            throw new Error('Invalid response from server');
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error.message || 'Login failed'
            };
        }
    }

    // Register
    async register(userData) {
        try {
            const response = await api.register(userData);
            return { success: true, user: response };
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: error.message || 'Registration failed'
            };
        }
    }

    // Logout
    logout() {
        this.removeToken();
        localStorage.removeItem(APP_CONFIG.USER_KEY);
        this.currentUser = null;
        window.location.href = '/';
    }

    // Refresh user profile
    async refreshProfile() {
        try {
            const user = await api.getProfile();
            this.saveUser(user);
            return user;
        } catch (error) {
            console.error('Failed to refresh profile:', error);
            // If token is invalid, logout
            if (error.status === 401) {
                this.logout();
            }
            throw error;
        }
    }
}

// Create global instance
const auth = new AuthService();
