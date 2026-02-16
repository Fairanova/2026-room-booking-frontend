// Admin Panel Logic

async function renderAdminPage() {
    if (!auth.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    if (!auth.isAdminOrStaff()) {
        showError('Unauthorized access');
        router.navigate('/dashboard');
        return;
    }

    const content = document.getElementById('main-content');
    const user = auth.getUser();
    
    content.innerHTML = `
        <div class="container">
            <div style="margin-bottom: 2rem;">
                <h1>⚙️ Admin Panel</h1>
                <p class="text-secondary">Manage rooms and bookings</p>
            </div>
            
            <!-- Admin Navigation -->
            <div style="margin-bottom: 2rem; border-bottom: 1px solid var(--border);">
                <div style="display: flex; gap: 1rem;">
                    <button class="btn btn-outline active" id="tab-bookings" onclick="switchAdminTab('bookings')">
                        📋 Manage Bookings
                    </button>
                    ${auth.isAdmin() ? `
                    <button class="btn btn-outline" id="tab-rooms" onclick="switchAdminTab('rooms')">
                        🏢 Manage Rooms
                    </button>
                    ` : ''}
                </div>
            </div>
            
            <!-- Admin Content -->
            <div id="admin-content">
                <div class="spinner" style="margin: 3rem auto;"></div>
            </div>
        </div>
    `;
    
    // Load default tab (Bookings)
    switchAdminTab('bookings');
}

// Switch tabs
function switchAdminTab(tab) {
    // Update active button
    document.querySelectorAll('#main-content button.btn-outline').forEach(btn => {
        btn.classList.remove('active', 'btn-primary');
        if (btn.id === `tab-${tab}`) {
            btn.classList.add('active', 'btn-primary');
        }
    });

    const content = document.getElementById('admin-content');
    
    if (tab === 'bookings') {
        renderAdminBookings(content);
    } else if (tab === 'rooms') {
        renderAdminRooms(content);
    }
}

// ==========================================
// BOOKING MANAGEMENT
// ==========================================

async function renderAdminBookings(container) {
    container.innerHTML = `
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
            <h3>All Bookings</h3>
            <div class="form-group" style="margin-bottom: 0; width: 200px;">
                <select id="filter-status" class="form-select" onchange="loadAdminBookings()">
                    <option value="">All Status</option>
                    <option value="${BOOKING_STATUS.PENDING}">Pending</option>
                    <option value="${BOOKING_STATUS.APPROVED}">Approved</option>
                    <option value="${BOOKING_STATUS.REJECTED}">Rejected</option>
                    <option value="${BOOKING_STATUS.CANCELLED}">Cancelled</option>
                </select>
            </div>
        </div>
        <div id="admin-bookings-list">
            <div class="spinner" style="margin: 2rem auto;"></div>
        </div>
    `;
    
    await loadAdminBookings();
}

async function loadAdminBookings() {
    const listContainer = document.getElementById('admin-bookings-list');
    const statusFilter = document.getElementById('filter-status').value;
    
    try {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        
        const bookings = await api.getBookings(params);
        
        if (bookings.length === 0) {
            listContainer.innerHTML = '<p class="text-muted text-center">No bookings found</p>';
            return;
        }
        
        listContainer.innerHTML = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Room</th>
                            <th>Date & Time</th>
                            <th>Purpose</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${bookings.map(booking => `
                            <tr>
                                <td>
                                    <div><strong>${escapeHtml(booking.userFullName || 'Unknown')}</strong></div>
                                    <small class="text-muted">${createRoleBadge(booking.userRole || 1)}</small>
                                </td>
                                <td>${escapeHtml(booking.roomName || 'Room')}</td>
                                <td>
                                    <div>${formatDate(booking.bookingDate)}</div>
                                    <small>${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}</small>
                                </td>
                                <td>${escapeHtml(booking.purpose)}</td>
                                <td>${getStatusBadge(booking.status)}</td>
                                <td>
                                    ${booking.status === BOOKING_STATUS.PENDING ? `
                                        <div style="display: flex; gap: 0.5rem;">
                                            <button class="btn btn-sm btn-primary" onclick="updateBookingStatus('${booking.id}', ${BOOKING_STATUS.APPROVED})">✔ Approve</button>
                                            <button class="btn btn-sm btn-secondary" style="background: var(--error); color: white; border-color: var(--error);" onclick="updateBookingStatus('${booking.id}', ${BOOKING_STATUS.REJECTED})">✖ Reject</button>
                                        </div>
                                    ` : '-'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Failed to load bookings:', error);
        listContainer.innerHTML = '<div class="alert alert-error">Failed to load bookings</div>';
    }
}

async function updateBookingStatus(id, status) {
    let rejectionReason = null;
    if (status === BOOKING_STATUS.REJECTED) {
        rejectionReason = prompt('Enter rejection reason (optional):');
        if (rejectionReason === null) return; // User cancelled prompt
    } else {
        if (!confirm(`Are you sure you want to approve this booking?`)) {
            return;
        }
    }
    
    try {
        await api.updateBookingStatus(id, { status, rejectionReason });
        showSuccess(`Booking ${status === BOOKING_STATUS.APPROVED ? 'approved' : 'rejected'} successfully`);
        await loadAdminBookings();
    } catch (error) {
        showError(error.message || 'Failed to update booking status');
    }
}

// ==========================================
// ROOM MANAGEMENT
// ==========================================

async function renderAdminRooms(container) {
    container.innerHTML = `
        <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
            <h3>All Rooms</h3>
            <button class="btn btn-primary" onclick="openRoomModal()">
                ➕ Add New Room
            </button>
        </div>
        <div id="admin-rooms-list">
            <div class="spinner" style="margin: 2rem auto;"></div>
        </div>
    `;
    
    await loadAdminRooms();
}

async function loadAdminRooms() {
    const listContainer = document.getElementById('admin-rooms-list');
    
    try {
        const rooms = await api.getRooms();
        
        if (rooms.length === 0) {
            listContainer.innerHTML = '<p class="text-muted text-center">No rooms found</p>';
            return;
        }
        
        listContainer.innerHTML = `
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Room Name</th>
                            <th>Code</th>
                            <th>Building</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rooms.map(room => `
                            <tr>
                                <td><strong>${escapeHtml(room.roomName)}</strong></td>
                                <td>${escapeHtml(room.roomCode)}</td>
                                <td>${escapeHtml(room.building)} - Floor ${room.floor}</td>
                                <td>${room.capacity}</td>
                                <td>
                                    ${room.isActive ? 
                                        '<span class="badge badge-approved">Active</span>' : 
                                        '<span class="badge badge-cancelled">Inactive</span>'
                                    }
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-secondary" onclick="openRoomModal('${room.id}')">✏ Edit</button>
                                    <button class="btn btn-sm btn-outline" style="color: var(--error); border-color: var(--error);" onclick="deleteRoom('${room.id}')">🗑 Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error('Failed to load rooms:', error);
        listContainer.innerHTML = '<div class="alert alert-error">Failed to load rooms</div>';
    }
}

async function deleteRoom(id) {
    if (!confirm('Are you sure you want to delete this room?')) {
        return;
    }
    
    try {
        await api.deleteRoom(id);
        showSuccess('Room deleted successfully');
        await loadAdminRooms();
    } catch (error) {
        showError(error.message || 'Failed to delete room');
    }
}

// Room Modal
let currentRoomId = null;

async function openRoomModal(roomId = null) {
    currentRoomId = roomId;
    let room = null;
    
    if (roomId) {
        try {
            room = await api.getRoomById(roomId);
        } catch (error) {
            showError('Failed to load room details');
            return;
        }
    }
    
    const modalHTML = `
        <div class="modal active" id="room-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${roomId ? 'Edit Room' : 'Add New Room'}</h2>
                    <button class="modal-close" onclick="closeRoomModal()">×</button>
                </div>
                
                <div id="room-alert"></div>
                
                <form id="room-form">
                    <div class="grid grid-2">
                        <div class="form-group">
                            <label class="form-label">Room Name</label>
                            <input type="text" id="roomName" class="form-input" required value="${room ? escapeHtml(room.roomName) : ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Room Code</label>
                            <input type="text" id="roomCode" class="form-input" required value="${room ? escapeHtml(room.roomCode) : ''}">
                        </div>
                    </div>
                    
                    <div class="grid grid-2">
                        <div class="form-group">
                            <label class="form-label">Building</label>
                            <input type="text" id="building" class="form-input" required value="${room ? escapeHtml(room.building) : ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Floor</label>
                            <input type="number" id="floor" class="form-input" required value="${room ? room.floor : ''}">
                        </div>
                    </div>
                    
                    <div class="grid grid-2">
                        <div class="form-group">
                            <label class="form-label">Capacity</label>
                            <input type="number" id="capacity" class="form-input" required value="${room ? room.capacity : ''}">
                        </div>
                         <div class="form-group">
                            <label class="form-label">Status</label>
                            <select id="isActive" class="form-select">
                                <option value="true" ${room && room.isActive ? 'selected' : ''}>Active</option>
                                <option value="false" ${room && !room.isActive ? 'selected' : ''}>Inactive</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Facilities (comma separated)</label>
                        <input type="text" id="facilities" class="form-input" placeholder="Projector, Whiteboard, AC" value="${room && room.facilities ? escapeHtml(room.facilities.join(', ')) : ''}">
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1;">${roomId ? 'Update Room' : 'Create Room'}</button>
                        <button type="button" class="btn btn-secondary" onclick="closeRoomModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('room-modal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('room-form').addEventListener('submit', handleRoomSubmit);
}

function closeRoomModal() {
    const modal = document.getElementById('room-modal');
    if (modal) modal.remove();
    currentRoomId = null;
}

async function handleRoomSubmit(e) {
    e.preventDefault();
    
    const alertDiv = document.getElementById('room-alert');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    const facilitiesStr = document.getElementById('facilities').value;
    const facilities = facilitiesStr.split(',').map(f => f.trim()).filter(f => f);
    
    const roomData = {
        roomName: document.getElementById('roomName').value.trim(),
        roomCode: document.getElementById('roomCode').value.trim(),
        building: document.getElementById('building').value.trim(),
        floor: parseInt(document.getElementById('floor').value),
        capacity: parseInt(document.getElementById('capacity').value),
        isActive: document.getElementById('isActive').value === 'true',
        facilities: facilities
    };
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    alertDiv.innerHTML = '';
    
    try {
        if (currentRoomId) {
            await api.updateRoom(currentRoomId, roomData);
            showSuccess('Room updated successfully');
        } else {
            await api.createRoom(roomData);
            showSuccess('Room created successfully');
        }
        
        setTimeout(() => {
            closeRoomModal();
            loadAdminRooms();
        }, 1500);
    } catch (error) {
        alertDiv.innerHTML = `<div class="alert alert-error">${escapeHtml(error.message || 'Failed to save room')}</div>`;
        submitBtn.disabled = false;
        submitBtn.textContent = currentRoomId ? 'Update Room' : 'Create Room';
    }
}
