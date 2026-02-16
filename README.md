# 🎨 Room Booking Frontend

Frontend web application untuk Room Booking System menggunakan HTML, CSS, dan JavaScript vanilla.

## 📁 Project Structure

```
booking-room-fe/
├── index.html              # Main HTML file
├── TASKS.md               # Development task tracking
├── assets/
│   ├── css/
│   │   ├── main.css       # Base styles & design system
│   │   └── components.css # UI components
│   └── js/
│       ├── config.js      # App & API configuration
│       ├── api.js         # API service layer
│       ├── auth.js        # Authentication service
│       ├── utils.js       # Utility functions
│       ├── router.js      # SPA router
│       └── app.js         # Main application
```

## 🚀 Getting Started

### Prerequisites

- Web browser (Chrome, Firefox, Safari, Edge)
- Backend API running on `http://localhost:5001`

### Installation

1. Clone/download project to `d:\booking-room-fe`

2. Open `index.html` in browser or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using PHP
php -S localhost:8000

# Using Node.js (http-server)
npx http-server
```

3. Access application at `http://localhost:8000`

## ✨ Features (Phase 1 - Completed)

- ✅ Project structure setup
- ✅ Design system with modern dark theme
- ✅ API integration layer
- ✅ Authentication service
- ✅ Simple SPA routing
- ✅ Responsive navigation
- ✅ Base UI components (buttons, cards, forms, badges)

## 📋 Development Phases

### ✅ Phase 1: Project Initialization (DONE)

- Project structure
- CSS design system
- API configuration
- Base routing

### 🔄 Phase 2: Authentication (Next)

- Login page
- Register page
- JWT token management

### ⏳ Phase 3: Main Features (Upcoming)

- Dashboard
- Rooms listing & search
- Booking management

### ⏳ Phase 4: Admin Panel (Upcoming)

- Booking approval
- Room management

## 🎨 Design System

### Colors

- Primary: Purple gradient (#667eea → #764ba2)
- Background: Dark navy (#0f172a, #1e293b)
- Text: Light (#f1f5f9, #cbd5e1)

### Components

- Buttons (primary, secondary, outline)
- Cards with hover effects
- Form inputs with focus states
- Status badges
- Alerts & notifications
- Loading spinners
- Modal dialogs

## 🔗 API Configuration

Backend API: `http://localhost:5001/api`

See `assets/js/config.js` for all endpoint configurations.

## 📝 License

MIT License
