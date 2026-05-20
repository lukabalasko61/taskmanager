const express = require('express');
const router = express.Router();
const { db } = require('../database');

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Get all tasks for logged-in user
router.get('/', requireAuth, (req, res) => {
    const userId = req.session.userId;
    
    // Using parameterized query to prevent SQL injection
    db.all(`SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC`,
        [userId],
        (err, tasks) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(tasks);
        }
    );
});

// Get single task by ID
router.get('/:id', requireAuth, (req, res) => {
    const taskId = req.params.id;
    const userId = req.session.userId;
    
    // Using parameterized query to prevent SQL injection
    db.get(`SELECT * FROM tasks WHERE id = ? AND user_id = ?`,
        [taskId, userId],
        (err, task) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!task) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json(task);
        }
    );
});

// Create new task
router.post('/', requireAuth, (req, res) => {
    const { title, description, priority } = req.body;
    const userId = req.session.userId;

    // Input validation
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    if (title.length > 100) {
        return res.status(400).json({ error: 'Title must be less than 100 characters' });
    }

    if (description && description.length > 500) {
        return res.status(400).json({ error: 'Description must be less than 500 characters' });
    }

    const validPriorities = ['low', 'medium', 'high'];
    const taskPriority = priority && validPriorities.includes(priority) ? priority : 'medium';

    // Sanitize input to prevent XSS
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description ? description.trim() : '';

    // Using parameterized query to prevent SQL injection
    db.run(`INSERT INTO tasks (user_id, title, description, priority) VALUES (?, ?, ?, ?)`,
        [userId, sanitizedTitle, sanitizedDescription, taskPriority],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true });
        }
    );
});

// Update task
router.put('/:id', requireAuth, (req, res) => {
    const taskId = req.params.id;
    const userId = req.session.userId;
    const { title, description, status, priority } = req.body;

    // Input validation
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    if (title.length > 100) {
        return res.status(400).json({ error: 'Title must be less than 100 characters' });
    }

    if (description && description.length > 500) {
        return res.status(400).json({ error: 'Description must be less than 500 characters' });
    }

    const validStatuses = ['pending', 'in-progress', 'completed'];
    const validPriorities = ['low', 'medium', 'high'];
    const taskStatus = status && validStatuses.includes(status) ? status : 'pending';
    const taskPriority = priority && validPriorities.includes(priority) ? priority : 'medium';

    // Sanitize input to prevent XSS
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description ? description.trim() : '';

    // Using parameterized query to prevent SQL injection
    db.run(`UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND user_id = ?`,
        [sanitizedTitle, sanitizedDescription, taskStatus, taskPriority, taskId, userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ success: true });
        }
    );
});

// Delete task
router.delete('/:id', requireAuth, (req, res) => {
    const taskId = req.params.id;
    const userId = req.session.userId;

    // Using parameterized query to prevent SQL injection
    db.run(`DELETE FROM tasks WHERE id = ? AND user_id = ?`,
        [taskId, userId],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Task not found' });
            }
            res.json({ success: true });
        }
    );
});

module.exports = router;
