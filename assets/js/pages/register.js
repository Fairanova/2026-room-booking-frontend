// Register Page

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
