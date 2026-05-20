// Load tasks when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    loadUsername();
});

// Load username from session
function loadUsername() {
    // Username is set by server middleware
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
        // The username should be available from server-side rendering
        // For now, we'll fetch it from a simple endpoint or use session
        fetch('/auth/session-info')
            .then(response => response.json())
            .then(data => {
                if (data.username) {
                    usernameDisplay.textContent = data.username;
                }
            })
            .catch(error => {
                console.error('Error loading username:', error);
            });
    }
}

// Load all tasks for the current user
function loadTasks() {
    const tasksContainer = document.getElementById('tasks-container');
    
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            displayTasks(tasks);
            updateStats(tasks);
        })
        .catch(error => {
            console.error('Error loading tasks:', error);
            tasksContainer.innerHTML = '<p class="error">Error loading tasks. Please try again.</p>';
        });
}

// Display tasks in the container
function displayTasks(tasks) {
    const tasksContainer = document.getElementById('tasks-container');
    
    if (!tasks || tasks.length === 0) {
        tasksContainer.innerHTML = '<p class="no-tasks">No tasks found. Create your first task!</p>';
        return;
    }
    
    tasksContainer.innerHTML = tasks.map(task => `
        <div class="task-card priority-${task.priority}">
            <div class="task-header">
                <h3 class="task-title">${escapeHtml(task.title)}</h3>
                <div class="task-badges">
                    <span class="status-badge status-${task.status}">${formatStatus(task.status)}</span>
                    <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                </div>
            </div>
            <div class="task-meta">
                <span>Created: ${formatDate(task.created_at)}</span>
                <span>Updated: ${formatDate(task.updated_at)}</span>
            </div>
            ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
            <div class="task-actions">
                <a href="edit-task.html?id=${task.id}" class="btn btn-primary btn-small">Edit</a>
                <button onclick="deleteTask(${task.id})" class="btn btn-danger btn-small">Delete</button>
            </div>
        </div>
    `).join('');
}

// Update task statistics
function updateStats(tasks) {
    const totalTasks = document.getElementById('total-tasks');
    const completedTasks = document.getElementById('completed-tasks');
    
    if (totalTasks) {
        totalTasks.textContent = `Total: ${tasks.length}`;
    }
    
    if (completedTasks) {
        const completed = tasks.filter(task => task.status === 'completed').length;
        completedTasks.textContent = `Completed: ${completed}`;
    }
}

// Delete a task
function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadTasks(); // Reload tasks after deletion
        } else {
            alert('Error deleting task');
        }
    })
    .catch(error => {
        console.error('Error deleting task:', error);
        alert('Error deleting task');
    });
}

// Helper function to escape HTML (prevent XSS)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format status for display
function formatStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'completed': 'Completed'
    };
    return statusMap[status] || status;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
