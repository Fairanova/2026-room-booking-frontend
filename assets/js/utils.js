// Utility Functions

// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('id-ID', options);
}

// Format time to HH:MM
function formatTime(timeString) {
    return timeString.substring(0, 5); // Get HH:MM from HH:MM:SS
}

// Show loading spinner
function showLoading(message = 'Loading...') {
    const content = document.getElementById('main-content');
    content.innerHTML = `
        <div class="loading">
            <div style="text-align: center;">
                <div class="spinner" style="margin: 0 auto;"></div>
                <p class="mt-2">${message}</p>
            </div>
        </div>
    `;
}

// Show error message
function showError(message, container = 'main-content') {
    const element = document.getElementById(container);
    element.innerHTML = `
        <div class="container">
            <div class="alert alert-error">
                <strong>Error:</strong> ${message}
            </div>
        </div>
    `;
}

// Show success message
function showSuccess(message, container = 'main-content') {
    const element = document.getElementById(container);
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.innerHTML = `<strong>Success!</strong> ${message}`;
    
    element.insertBefore(alert, element.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Create status badge
function createStatusBadge(status) {
    const statusClass = {
        [BOOKING_STATUS.PENDING]: 'badge-pending',
        [BOOKING_STATUS.APPROVED]: 'badge-approved',
        [BOOKING_STATUS.REJECTED]: 'badge-rejected',
        [BOOKING_STATUS.CANCELLED]: 'badge-cancelled'
    };

    return `<span class="badge ${statusClass[status]}">${STATUS_LABELS[status]}</span>`;
}

// Create role badge  
function createRoleBadge(role) {
    const roleClass = {
        [USER_ROLES.STUDENT]: 'badge-info',
        [USER_ROLES.STAFF]: 'badge-warning',
        [USER_ROLES.ADMIN]: 'badge-error'
    };

    return `<span class="badge ${roleClass[role] || ''}">${ROLE_LABELS[role]}</span>`;
}

// Validate email
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Debounce function for search
function debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Create pagination HTML
function createPagination(currentPage, totalPages, onPageChange) {
    if (totalPages <= 1) return '';

    let html = '<div class="pagination">';
    
    // Previous button
    if (currentPage > 1) {
        html += `<button class="btn btn-secondary btn-sm" onclick="${onPageChange}(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    html += `<span class="text-muted">Page ${currentPage} of ${totalPages}</span>`;
    
    // Next button
    if (currentPage < totalPages) {
        html += `<button class="btn btn-secondary btn-sm" onclick="${onPageChange}(${currentPage + 1})">Next</button>`;
    }
    
    html += '</div>';
    return html;
}

// Handle API errors
function handleApiError(error) {
    console.error('API Error:', error);
    
    if (error.status === 401) {
        auth.logout();
        return 'Session expired. Please login again.';
    }
    
    if (error.status === 403) {
        return 'You do not have permission to perform this action.';
    }
    
    if (error.status === 404) {
        return 'Resource not found.';
    }
    
    if (error.status === 400) {
        return error.message || 'Invalid request.';
    }
    
    return error.message || 'An unexpected error occurred.';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
