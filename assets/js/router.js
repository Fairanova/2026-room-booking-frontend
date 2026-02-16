// Simple Router for SPA
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
    }

    // Register a route
    addRoute(path, handler) {
        this.routes[path] = handler;
    }

    // Navigate to a route
    navigate(path) {
        if (this.routes[path]) {
            this.currentRoute = path;
            this.routes[path]();
            this.updateActiveNav(path);
        } else {
            console.error(`Route not found: ${path}`);
        }
    }

    // Update active navigation link
    updateActiveNav(path) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-route') === path) {
                link.classList.add('active');
            }
        });
    }

    // Initialize router
    init() {
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || '/';
            this.navigate(hash);
        });

        // Load initial route
        const initialHash = window.location.hash.slice(1) || '/';
        this.navigate(initialHash);
    }
}

// Create global router instance
const router = new Router();
