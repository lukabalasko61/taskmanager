// Load task data when page loads
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');
    
    if (taskId) {
        loadTask(taskId);
    } else {
        window.location.href = 'dashboard.html';
    }
    
    // Handle form submission
    const form = document.getElementById('edit-form');
    const errorDiv = document.getElementById('error-message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Client-side validation
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const status = document.getElementById('status').value;
            const priority = document.getElementById('priority').value;
            const taskId = document.getElementById('task-id').value;
            
            if (!title) {
                showError('Title is required');
                return;
            }
            
            if (title.length > 100) {
                showError('Title must be less than 100 characters');
                return;
            }
            
            if (description.length > 500) {
                showError('Description must be less than 500 characters');
                return;
            }
            
            // Send update request
            fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    status: status,
                    priority: priority
                })
            })
            .then(response => {
                if (response.ok) {
                    window.location.href = 'dashboard.html';
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Error updating task');
                    });
                }
            })
            .catch(error => {
                showError(error.message);
            });
        });
    }
    
    function showError(message) {
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.add('show');
        }
    }
});

// Load task data from server
function loadTask(taskId) {
    fetch(`/tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            // Populate form fields
            document.getElementById('task-id').value = task.id;
            document.getElementById('title').value = task.title;
            document.getElementById('description').value = task.description || '';
            document.getElementById('status').value = task.status;
            document.getElementById('priority').value = task.priority;
        })
        .catch(error => {
            console.error('Error loading task:', error);
            alert('Error loading task. Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        });
}
