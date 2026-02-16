// Bookings Page - Manage user bookings

async function renderBookingsPage() {
    if (!auth.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div class="container">
            <h1>My Bookings</h1>
            <p class="text-secondary">Manage your room bookings</p>
            
            <div id="bookings-list">
                <div style="text-align: center; padding: 3rem;">
                    <div class="spinner" style="margin: 0 auto;"></div>
                    <p class="text-muted" style="margin-top: 1rem;">Loading bookings...</p>
                </div>
            </div>
        </div>
    `;
    
    await loadMyBookings();
}

async function loadMyBookings() {
    try {
        const bookings = await api.getBookings();
        const container = document.getElementById('bookings-list');
        
        if (bookings.length === 0) {
            container.innerHTML = '<p class="text-muted" style="text-align: center;">No bookings found</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Room</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Purpose</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(booking => `
                            <tr>
                                <td><strong>${escapeHtml(booking.roomName || 'Room')}</strong></td>
                                <td>${formatDate(booking.bookingDate)}</td>
                                <td>${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}</td>
                                <td>${escapeHtml(booking.purpose)}</td>
                                <td>${getStatusBadge(booking.status)}</td>
                                <td>
                                    ${booking.status === BOOKING_STATUS.PENDING ? 
                                        `<button class="btn btn-sm btn-secondary" onclick="cancelBooking('${booking.id}')">Cancel</button>` : 
                                        '-'
                                    }
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Failed to load bookings:', error);
        document.getElementById('bookings-list').innerHTML = 
            '<div class="alert alert-error">Failed to load bookings</div>';
    }
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    try {
        await api.cancelBooking(bookingId);
        showSuccess('Booking cancelled successfully');
        await loadMyBookings();
    } catch (error) {
        showError('Failed to cancel booking: ' + error.message);
    }
}
