const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { db } = require('../database');

// User registration
router.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    // Input validation
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (username.length < 3) {
        return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Email validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user into database (using parameterized query to prevent SQL injection)
    db.run(`INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
        [username, hashedPassword, email],
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint')) {
                    return res.status(400).json({ error: 'Username or email already exists' });
                }
                return res.status(500).json({ error: 'Database error' });
            }
            res.redirect('/login.html');
        }
    );
});

// User login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Input validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get user from database (using parameterized query to prevent SQL injection)
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare password
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Set session
        req.session.userId = user.id;
        req.session.username = user.username;

        res.redirect('/dashboard.html');
    });
});

// User logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect('/login.html');
    });
});

// Get session info (for displaying username)
router.get('/session-info', (req, res) => {
    if (req.session.userId) {
        res.json({
            authenticated: true,
            userId: req.session.userId,
            username: req.session.username
        });
    } else {
        res.json({
            authenticated: false
        });
    }
});

module.exports = router;
