// Home Page

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
