# 🏢 Room Booking System Frontend

A modern, responsive web application for managing university room bookings. Built with Vanilla JavaScript, HTML5, and CSS3, featuring a complete role-based access control system.

## ✨ Features

### 🔐 Authentication & Security

- **Secure Login & Registration**: JWT-based authentication.
- **Role-Based Access Control (RBAC)**: Strict separation between Student, Staff, and Admin roles.
- **Protected Routes**: Automatic redirection for unauthorized access.

### 🎓 Student Features

- **Dashboard**: Quick overview of booking stats and recent activities.
- **Browse Rooms**: View available rooms with details (capacity, facilities).
- **Search & Filter**: Find rooms by name, code, or building.
- **Book a Room**: Simple modal interface to request room bookings.
- **My Bookings**: Track booking status (Pending, Approved, Rejected) and cancel pending requests.

### 🛡️ Admin & Staff Features

- **Admin Dashboard**: Overview of system-wide booking statistics.
- **Room Management (CRUD)**:
  - Add new rooms with facilities.
  - Edit existing room details.
  - Soft-delete rooms.
- **Booking Management**:
  - View all bookings in the system.
  - Filter by status (Pending, Approved, Rejected, etc.).
  - **Approve/Reject Workflow**: Review booking requests with optional rejection reasons.

## 🛠️ Tech Stack

- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **Architecture**: Single Page Application (SPA) with custom Router
- **Styling**: Custom CSS Variables, Flexbox/Grid (No frameworks)
- **API**: Fetch API for communication with .NET Core Backend

## 📁 Project Structure

```bash
booking-room-fe/
├── index.html              # Entry point
├── assets/
│   ├── css/
│   │   ├── main.css        # Global variables & reset
│   │   └── components.css  # Reusable UI components
│   └── js/
│       ├── app.js          # Main application logic & navigation
│       ├── router.js       # Client-side routing
│       ├── auth.js         # Authentication service
│       ├── api.js          # API client wrapper
│       ├── config.js       # App configuration
│       └── pages/          # Page controllers
│           ├── home.js
│           ├── login.js
│           ├── register.js
│           ├── dashboard.js
│           ├── rooms.js    # Student room browsing
│           ├── bookings.js # Student booking management
│           └── admin.js    # Admin panel features
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser.
- Backend API running on `http://localhost:5001`.

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Fairanova/2026-room-booking-frontend.git
   cd booking-room-fe
   ```

2. **Serve the application**
   You can use any static file server. Examples:

   **Using Python:**

   ```bash
   python -m http.server 8000
   ```

   **Using Node.js (http-server):**

   ```bash
   npx http-server
   ```

   **VS Code Live Server:**
   Open index.html and click "Go Live".

3. **Access the App**
   Open `http://localhost:8000` (or your server port) in the browser.

## 🔧 Configuration

API Endpoints are configured in `assets/js/config.js`.
Default API URL: `http://localhost:5001/api`

## 👥 User Roles (Demo Credentials)

| Role        | Username     | Password     | Access              |
| ----------- | ------------ | ------------ | ------------------- |
| **Admin**   | `admin`      | `Admin123`   | Full System Control |
| **Staff**   | `staff001`   | `Staff123`   | Admin Features      |
| **Student** | `student001` | `Student123` | Booking Features    |
