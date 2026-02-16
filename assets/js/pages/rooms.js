// Rooms Page - Browse and search available rooms

// Render rooms listing page
async function renderRoomsPage() {
    if (!auth.isAuthenticated()) {
        router.navigate('/login');
        return;
    }

    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div class="container">
            <div style="margin-bottom: 2rem;">
                <h1>Browse Rooms</h1>
                <p class="text-secondary">Find and book available rooms</p>
            </div>
            
            <!-- Search & Filter -->
            <div class="card" style="margin-bottom: 2rem;">
                <div class="grid grid-2">
                    <div class="form-group" style="margin-bottom: 0;">
                        <input type="text" id="search-room" class="form-input" placeholder="Search by room name or code...">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <select id="filter-building" class="form-select">
                            <option value="">All Buildings</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Rooms Grid -->
            <div id="rooms-container">
                <div style="text-align: center; padding: 3rem;">
                    <div class="spinner" style="margin: 0 auto;"></div>
                    <p class="text-muted" style="margin-top: 1rem;">Loading rooms...</p>
                </div>
            </div>
        </div>
    `;
    
    // Load rooms
    await loadRooms();
    
    // Setup search and filter
    document.getElementById('search-room').addEventListener('input', filterRooms);
    document.getElementById('filter-building').addEventListener('change', filterRooms);
}

let allRooms = [];

// Load all rooms
async function loadRooms() {
    try {
        allRooms = await api.getRooms();
        
        // Get unique buildings
        const buildings = [...new Set(allRooms.map(r => r.building))];
        const buildingSelect = document.getElementById('filter-building');
        buildings.forEach(building => {
            const option = document.createElement('option');
            option.value = building;
            option.textContent = building;
            buildingSelect.appendChild(option);
        });
        
        // Display rooms
        displayRooms(allRooms);
    } catch (error) {
        console.error('Failed to load rooms:', error);
        document.getElementById('rooms-container').innerHTML = 
            '<div class="alert alert-error">Failed to load rooms</div>';
    }
}

// Display rooms
function displayRooms(rooms) {
    const container = document.getElementById('rooms-container');
    
    if (rooms.length === 0) {
        container.innerHTML = '<p class="text-muted" style="text-align: center;">No rooms found</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="grid grid-3">
            ${rooms.map(room => `
                <div class="card">
                    <div style="margin-bottom: 1rem;">
                        <h3 style="font-size: 1.125rem; margin-bottom: 0.25rem;">${escapeHtml(room.roomName)}</h3>
                        <p class="text-muted" style="font-size: 0.875rem;">${escapeHtml(room.roomCode)}</p>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <span style="font-size: 0.875rem;">🏢 ${escapeHtml(room.building)}</span>
                            <span style="font-size: 0.875rem;">📍 Floor ${room.floor}</span>
                        </div>
                        <div style="font-size: 0.875rem;">👥 Capacity: ${room.capacity} people</div>
                    </div>
                    
                    ${room.facilities && room.facilities.length > 0 ? `
                        <div style="margin-bottom: 1rem;">
                            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                                ${room.facilities.slice(0, 3).map(facility => 
                                    `<span class="badge" style="background: var(--bg-tertiary); color: var(--text-secondary); font-size: 0.75rem;">${escapeHtml(facility)}</span>`
                                ).join('')}
                                ${room.facilities.length > 3 ? `<span class="badge" style="background: var(--bg-tertiary); color: var(--text-secondary);">+${room.facilities.length - 3}</span>` : ''}
                            </div>
                        </div>
                    ` : ''}
                    
                    <button class="btn btn-primary" style="width: 100%;" onclick="openBookingModal('${room.id}')">
                        Book Room
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

// Filter rooms
function filterRooms() {
    const searchTerm = document.getElementById('search-room').value.toLowerCase();
    const building = document.getElementById('filter-building').value;
    
    const filtered = allRooms.filter(room => {
        const matchesSearch = room.roomName.toLowerCase().includes(searchTerm) || 
                            room.roomCode.toLowerCase().includes(searchTerm);
        const matchesBuilding = !building || room.building === building;
        return matchesSearch && matchesBuilding;
    });
    
    displayRooms(filtered);
}

// Open booking modal
function openBookingModal(roomId) {
    const room = allRooms.find(r => r.id === roomId);
    if (!room) return;
    
    // Create modal
    const modalHTML = `
        <div class="modal active" id="booking-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Book ${escapeHtml(room.roomName)}</h2>
                    <button class="modal-close" onclick="closeBookingModal()">×</button>
                </div>
                
                <div id="booking-alert"></div>
                
                <form id="booking-form">
                    <div class="form-group">
                        <label class="form-label">Booking Date</label>
                        <input type="date" id="booking-date" class="form-input" required min="${getTodayDate()}">
                    </div>
                    
                    <div class="grid grid-2">
                        <div class="form-group">
                            <label class="form-label">Start Time</label>
                            <input type="time" id="start-time" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">End Time</label>
                            <input type="time" id="end-time" class="form-input" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Purpose</label>
                        <input type="text" id="purpose" class="form-input" required placeholder="e.g., Team Meeting">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Description (Optional)</label>
                        <textarea id="description" class="form-textarea" placeholder="Additional details..."></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 1rem;">
                        <button type="submit" class="btn btn-primary" style="flex: 1;">Submit Booking</button>
                        <button type="button" class="btn btn-secondary" onclick="closeBookingModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Handle form submission
    document.getElementById('booking-form').addEventListener('submit', (e) => handleBookingSubmit(e, roomId));
}

// Close booking modal
function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.remove();
    }
}

// Handle booking submission
async function handleBookingSubmit(e, roomId) {
    e.preventDefault();
    
    const alertDiv = document.getElementById('booking-alert');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    const bookingData = {
        roomId,
        bookingDate: document.getElementById('booking-date').value,
        startTime: document.getElementById('start-time').value,
        endTime: document.getElementById('end-time').value,
        purpose: document.getElementById('purpose').value,
        description: document.getElementById('description').value
    };
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    alertDiv.innerHTML = '';
    
    try {
        await api.createBooking(bookingData);
        alertDiv.innerHTML = '<div class="alert alert-success">Booking submitted successfully!</div>';
        
        setTimeout(() => {
            closeBookingModal();
            router.navigate('/bookings');
        }, 1500);
    } catch (error) {
        alertDiv.innerHTML = `<div class="alert alert-error">${escapeHtml(error.message || 'Failed to create booking')}</div>`;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Booking';
    }
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}
