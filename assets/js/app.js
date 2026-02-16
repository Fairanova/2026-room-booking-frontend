// Main Application Entry Point

// Render navigation
function renderNavigation() {
    const navbar = document.getElementById('navbar');
    const user = auth.getUser();
    const isAuthenticated = auth.isAuthenticated();

    let navHTML = `
        <div class="container">
            <div class="nav-container">
                <a href="#/" class="nav-brand">🏢 ${APP_CONFIG.APP_NAME}</a>
                
                <ul class="nav-menu">
    `;

    if (isAuthenticated) {
        navHTML += `<li><a href="#/dashboard" class="nav-link" data-route="/dashboard">Dashboard</a></li>`;

        // Only show Rooms and My Bookings for Student
        if (auth.hasRole(USER_ROLES.STUDENT)) {
            navHTML += `
                <li><a href="#/rooms" class="nav-link" data-route="/rooms">Rooms</a></li>
                <li><a href="#/bookings" class="nav-link" data-route="/bookings">My Bookings</a></li>
            `;
        }

        if (auth.isAdminOrStaff()) {
            navHTML += `<li><a href="#/admin" class="nav-link" data-route="/admin">Admin</a></li>`;
        }

        navHTML += `
            <li>
                <span class="text-muted">Welcome, ${escapeHtml(user.fullName)}</span>
            </li>
            <li><button class="btn btn-secondary btn-sm" onclick="handleLogout()">Logout</button></li>
        `;
    } else {
        navHTML += `
            <li><a href="#/login" class="nav-link" data-route="/login">Login</a></li>
            <li><a href="#/register" class="btn btn-primary btn-sm">Register</a></li>
        `;
    }

    navHTML += `
                </ul>
            </div>
        </div>
    `;

    navbar.innerHTML = navHTML;
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        auth.logout();
    }
}

// Register all routes
function registerRoutes() {
    router.addRoute('/', renderHomePage);
    router.addRoute('/login', renderLoginPage);
    router.addRoute('/register', renderRegisterPage);
    router.addRoute('/dashboard', renderDashboardPage);
    router.addRoute('/rooms', renderRoomsPage);
    router.addRoute('/bookings', renderBookingsPage);
    
    // Admin route
    router.addRoute('/admin', renderAdminPage);
}

// Initialize application
function initApp() {
    console.log('🚀 Initializing Room Booking System...');
    
    // Render navigation
    renderNavigation();
    
    // Register routes
    registerRoutes();
    
    // Initialize router
    router.init();
    
    console.log('✅ Application initialized successfully');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
