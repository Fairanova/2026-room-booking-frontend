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
        navHTML += `
            <li><a href="#/dashboard" class="nav-link" data-route="/dashboard">Dashboard</a></li>
            <li><a href="#/rooms" class="nav-link" data-route="/rooms">Rooms</a></li>
            <li><a href="#/bookings" class="nav-link" data-route="/bookings">My Bookings</a></li>
        `;

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

// Home page (placeholder for now)
function renderHomePage() {
    const content = document.getElementById('main-content');
    const isAuthenticated = auth.isAuthenticated();

    if (isAuthenticated) {
        router.navigate('/dashboard');
        return;
    }

    content.innerHTML = `
        <div class="container text-center" style="padding: 4rem 0;">
            <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">🏢 Room Booking System</h1>
            <p style="font-size: 1.125rem; margin-bottom: 2rem;">
                Sistem peminjaman ruangan yang mudah dan efisien
            </p>
            
            <div style="display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem;">
                <a href="#/login" class="btn btn-primary btn-lg">Login</a>
                <a href="#/register" class="btn btn-outline btn-lg">Register</a>
            </div>
        </div>
    `;
}

// Login page
function renderLoginPage() {
    if (auth.isAuthenticated()) {
        router.navigate('/dashboard');
        return;
    }

    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div class="container">
            <div class="card" style="max-width: 450px; margin: 2rem auto;">
                <div class="card-header text-center">
                    <h2>Login</h2>
                    <p class="text-secondary" style="margin-bottom: 0;">Masuk ke akun Anda</p>
                </div>
                
                <div id="login-alert"></div>
                
                <form id="login-form">
                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <input type="text" id="username" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" id="password" class="form-input" required>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Login
                    </button>
                </form>
                
                <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                    <p class="text-secondary">
                        Belum punya akun? 
                        <a href="#/register" style="color: var(--primary); font-weight: 500;">Register</a>
                    </p>
                </div>
            </div>
            
            <!-- Demo Credentials Card -->
            <div class="card" style="max-width: 450px; margin: 1rem auto; background: var(--bg-tertiary);">
                <h4 style="font-size: 0.875rem; margin-bottom: 0.5rem;">🔑 Demo Credentials:</h4>
                <div style="font-size: 0.875rem; font-family: monospace;">
                    <p style="margin: 0.25rem 0;"><strong>Admin:</strong> admin / Admin123</p>
                    <p style="margin: 0.25rem 0;"><strong>Staff:</strong> staff001 / Staff123</p>
                    <p style="margin: 0.25rem 0;"><strong>Student:</strong> student001 / Student123</p>
                </div>
            </div>
        </div>
    `;

    // Handle form submission
    const form = document.getElementById('login-form');
    form.addEventListener('submit', handleLogin);
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const alertDiv = document.getElementById('login-alert');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Get form values
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!username || !password) {
        alertDiv.innerHTML = '<div class="alert alert-error">Username dan password harus diisi</div>';
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';
    alertDiv.innerHTML = '';
    
    try {
        // Call login API
        const result = await auth.login({ username, password });
        
        if (result.success) {
            alertDiv.innerHTML = '<div class="alert alert-success">Login berhasil! Redirecting...</div>';
            
            // Refresh navigation
            renderNavigation();
            
            // Redirect to dashboard
            setTimeout(() => {
                router.navigate('/dashboard');
            }, 500);
        } else {
            alertDiv.innerHTML = `<div class="alert alert-error">${escapeHtml(result.message)}</div>`;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    } catch (error) {
        alertDiv.innerHTML = `<div class="alert alert-error">Login gagal. Silakan coba lagi.</div>`;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}

// Register page
function renderRegisterPage() {
    if (auth.isAuthenticated()) {
        router.navigate('/dashboard');
        return;
    }

    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div class="container">
            <div class="card" style="max-width: 450px; margin: 2rem auto;">
                <div class="card-header text-center">
                    <h2>Register</h2>
                    <p class="text-secondary" style="margin-bottom: 0;">Buat akun baru</p>
                </div>
                
                <div id="register-alert"></div>
                
                <form id="register-form">
                    <div class="form-group">
                        <label class="form-label">Full Name</label>
                        <input type="text" id="fullName" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <input type="text" id="reg-username" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" id="email" class="form-input" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Password</label>
                        <input type="password" id="reg-password" class="form-input" required>
                        <small class="text-muted">Minimal 6 karakter</small>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Role</label>
                        <select id="role" class="form-select" required>
                            <option value="1">Student</option>
                            <option value="2">Staff</option>
                            <option value="3">Admin</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;">
                        Register
                    </button>
                </form>
                
                <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border);">
                    <p class="text-secondary">
                        Sudah punya akun? 
                        <a href="#/login" style="color: var(--primary); font-weight: 500;">Login</a>
                    </p>
                </div>
            </div>
        </div>
    `;

    // Handle form submission
    const form = document.getElementById('register-form');
    form.addEventListener('submit', handleRegister);
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();
    
    const alertDiv = document.getElementById('register-alert');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('reg-password').value;
    const role = parseInt(document.getElementById('role').value);
    
    // Validation
    if (!fullName || !username || !email || !password) {
        alertDiv.innerHTML = '<div class="alert alert-error">Semua field harus diisi</div>';
        return;
    }
    
    if (!isValidEmail(email)) {
        alertDiv.innerHTML = '<div class="alert alert-error">Email tidak valid</div>';
        return;
    }
    
    if (password.length < 6) {
        alertDiv.innerHTML = '<div class="alert alert-error">Password minimal 6 karakter</div>';
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Loading...';
    alertDiv.innerHTML = '';
    
    try {
        // Call register API
        const result = await auth.register({
            fullName,
            username,
            email,
            password,
            role
        });
        
        if (result.success) {
            alertDiv.innerHTML = '<div class="alert alert-success">Registrasi berhasil! Silakan login.</div>';
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.navigate('/login');
            }, 2000);
        } else {
            alertDiv.innerHTML = `<div class="alert alert-error">${escapeHtml(result.message)}</div>`;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    } catch (error) {
        alertDiv.innerHTML = `<div class="alert alert-error">Registrasi gagal. Silakan coba lagi.</div>`;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
}

// Dashboard page (placeholder for now)
function renderDashboardPage() {
    if (!auth.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div class="container">
            <h2>Dashboard</h2>
            <p class="text-muted">Dashboard will be implemented in Phase 3</p>
        </div>
    `;
}

// Register all routes
function registerRoutes() {
    router.addRoute('/', renderHomePage);
    router.addRoute('/login', renderLoginPage);
    router.addRoute('/register', renderRegisterPage);
    router.addRoute('/dashboard', renderDashboardPage);
    router.addRoute('/rooms', () => {
        const content = document.getElementById('main-content');
        content.innerHTML = '<div class="container"><h2>Rooms</h2><p>Coming in Phase 3</p></div>';
    });
    router.addRoute('/bookings', () => {
        const content = document.getElementById('main-content');
        content.innerHTML = '<div class="container"><h2>My Bookings</h2><p>Coming in Phase 3</p></div>';
    });
    router.addRoute('/admin', () => {
        const content = document.getElementById('main-content');
        content.innerHTML = '<div class="container"><h2>Admin Panel</h2><p>Coming in Phase 4</p></div>';
    });
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
