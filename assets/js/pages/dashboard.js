// Dashboard Page

async function renderDashboardPage() {
    if (!auth.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    const content = document.getElementById('main-content');
    const user = auth.getUser();
    
    content.innerHTML = `
        <div class="container">
            <div style="margin-bottom: 2rem;">
                <h1>Dashboard</h1>
                <p class="text-secondary">Welcome back, ${escapeHtml(user.fullName)}!</p>
            </div>
            
            <!-- Quick Stats -->
            <div class="grid grid-3" id="stats-grid" style="margin-bottom: 2rem;">
                <div class="card">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="font-size: 2rem;">📅</div>
                        <div>
                            <div class="text-muted" style="font-size: 0.875rem;">My Bookings</div>
                            <div style="font-size: 1.5rem; font-weight: 600;" id="total-bookings">-</div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="font-size: 2rem;">⏳</div>
                        <div>
                            <div class="text-muted" style="font-size: 0.875rem;">Pending</div>
                            <div style="font-size: 1.5rem; font-weight: 600;" id="pending-bookings">-</div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="font-size: 2rem;">✅</div>
                        <div>
                            <div class="text-muted" style="font-size: 0.875rem;">Approved</div>
                            <div style="font-size: 1.5rem; font-weight: 600;" id="approved-bookings">-</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div class="card" style="margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;">Quick Actions</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    ${auth.hasRole(USER_ROLES.STUDENT) ? `
                    <a href="#/rooms" class="btn btn-primary">
                        🏢 Browse Rooms
                    </a>
                    <a href="#/bookings" class="btn btn-outline">
                        📋 My Bookings
                    </a>
                    ` : ''}
                    ${auth.isAdminOrStaff() ? '<a href="#/admin" class="btn btn-secondary">⚙️ Admin Panel</a>' : ''}
                </div>
            </div>
            
            <!-- Recent Bookings -->
            <div class="card">
                <h3 style="margin-bottom: 1rem;">Recent Bookings</h3>
                <div id="recent-bookings">
                    <div style="text-align: center; padding: 2rem;">
                        <div class="spinner"></div>
                        <p class="text-muted">Loading...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Load dashboard data
    await loadDashboardData();
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Fetch bookings
        const bookings = await api.getBookings();
        
        // Calculate stats
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === BOOKING_STATUS.PENDING).length;
        const approvedBookings = bookings.filter(b => b.status === BOOKING_STATUS.APPROVED).length;
        
        // Update stats
        document.getElementById('total-bookings').textContent = totalBookings;
        document.getElementById('pending-bookings').textContent = pendingBookings;
        document.getElementById('approved-bookings').textContent = approvedBookings;
        
        // Render recent bookings (last 5)
        const recentBookings = bookings.slice(0, 5);
        const recentBookingsDiv = document.getElementById('recent-bookings');
        
        if (recentBookings.length === 0) {
            recentBookingsDiv.innerHTML = '<p class="text-muted" style="text-align: center;">No bookings yet</p>';
        } else {
            recentBookingsDiv.innerHTML = `
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${recentBookings.map(booking => `
                                <tr>
                                    <td><strong>${escapeHtml(booking.roomName || 'Room')}</strong></td>
                                    <td>${formatDate(booking.bookingDate)}</td>
                                    <td>${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}</td>
                                    <td>${getStatusBadge(booking.status)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        document.getElementById('recent-bookings').innerHTML = 
            '<div class="alert alert-error">Failed to load bookings</div>';
    }
}
