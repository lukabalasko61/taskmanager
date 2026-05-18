const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
const { initDB } = require('./database');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for simplicity in this project
}));

// Body parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'your-secret-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

// Middleware to make user data available in templates
app.use((req, res, next) => {
    res.locals.userId = req.session.userId;
    res.locals.username = req.session.username;
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Protect dashboard and task pages
app.get('/dashboard.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/create-task.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create-task.html'));
});

app.get('/edit-task.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit-task.html'));
});

// Redirect root to login
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/dashboard.html');
    } else {
        res.redirect('/login.html');
    }
});

// Initialize database and start server
initDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Default test user: username = testuser, password = test123');
});
