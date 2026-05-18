# Task Manager

A simple CRUD Task Manager web application for Web Application Development project.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   ```
   http://localhost:3000
   ```

## 🔐 How to Login

### Option 1: Use Default Test Account
A test user is automatically created when you start the app:
- **Username:** `testuser`
- **Password:** `test123`

### Option 2: Create Your Own Account
1. Go to the login page
2. Click **"Register here"**
3. Fill in the form:
   - Username (minimum 3 characters)
   - Email (valid email format)
   - Password (minimum 6 characters)
4. Click **"Register"**
5. You'll be redirected to login - use your new credentials

## 📝 How to Use the App

### Create a Task
1. Log in to your account
2. Click the **"New Task"** button in the navbar
3. Fill in the task details:
   - **Title** (required) - Your task name
   - **Description** (optional) - More details about the task
   - **Priority** - Choose Low, Medium, or High
4. Click **"Create Task"**

### View Your Tasks
- All your tasks appear on the dashboard
- Each task shows:
  - Title and status badge
  - Priority indicator (color-coded)
  - Description (if provided)
  - Creation and update timestamps

### Edit a Task
1. Click the **"Edit"** button on any task card
2. Modify the task details
3. Change the status:
   - **Pending** - Not started
   - **In Progress** - Currently working on it
   - **Completed** - Finished
4. Update priority if needed
5. Click **"Update Task"**

### Delete a Task
1. Click the **"Delete"** button on any task card
2. Confirm the deletion in the popup

### Logout
- Click the **"Logout"** button in the navbar
- You'll be redirected to the login page

## 🎨 Features

- ✅ User registration and login
- ✅ Create, Read, Update, Delete tasks
- ✅ Task status tracking (Pending, In Progress, Completed)
- ✅ Priority levels (Low, Medium, High)
- ✅ Persistent data storage (SQLite)
- ✅ Input validation and security features
- ✅ Responsive design for desktop and mobile

## 🔒 Security

- Passwords are hashed using bcrypt
- SQL injection protection via parameterized queries
- XSS protection via input sanitization
- Session-based authentication

## 📁 Project Structure

```
task-manager/
├── server.js              # Main server file
├── database.js             # Database setup
├── routes/
│   ├── auth.js            # Authentication routes
│   └── tasks.js           # Task CRUD routes
├── public/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── create-task.html
│   ├── edit-task.html
│   ├── css/style.css
│   └── js/               # JavaScript files
└── README.md
```

## 🛠️ Troubleshooting

**Port already in use?**
```bash
PORT=8080 npm start
```

**Database issues?**
Delete `tasks.db` file and restart the server - a new database will be created automatically.

**Dependency issues?**
```bash
rm -rf node_modules
npm install
```

---

Built for Web Application Development project.
