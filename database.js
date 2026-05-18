const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'tasks.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Initialize database tables
const initDB = () => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        }
    });

    // Create tasks table
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )`, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err.message);
        }
    });

    // Insert default test user (password: test123)
    // Hash will be created when server starts
    setTimeout(() => {
        seedDefaultUser();
    }, 1000);
};

// Seed default test user
const seedDefaultUser = () => {
    const bcrypt = require('bcryptjs');
    const defaultPassword = bcrypt.hashSync('test123', 10);
    
    db.run(`INSERT OR IGNORE INTO users (username, password, email) 
            VALUES (?, ?, ?)`, 
        ['testuser', defaultPassword, 'test@example.com'], 
        (err) => {
            if (err) {
                console.error('Error seeding default user:', err.message);
            } else {
                console.log('Default test user created (username: testuser, password: test123)');
            }
        }
    );
};

module.exports = { db, initDB };
