// Login Page

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
