// Handle form submission with AJAX
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const errorDiv = document.getElementById('error-message');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Clear previous errors
            if (errorDiv) {
                errorDiv.classList.remove('show');
                errorDiv.textContent = '';
            }
            
            // Client-side validation
            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const priority = document.getElementById('priority').value;
            
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
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Send request
            fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.redirected) {
                    window.location.href = response.url;
                } else if (response.ok) {
                    window.location.href = '/dashboard.html';
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error || 'An error occurred');
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
