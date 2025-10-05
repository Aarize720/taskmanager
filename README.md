# Task Manager - Multi-User Task Management Application

A comprehensive, production-ready task management web application with multi-user support, featuring authentication, task management, calendar integration, notes, and notifications.

## 🚀 Features

- **Multi-User Authentication**: Secure JWT-based authentication system with user registration and login
- **Task Management**: Create, update, delete tasks with priorities (low, medium, high) and status tracking (todo, in progress, completed)
- **Calendar Integration**: Interactive calendar view for visualizing events and deadlines
- **Notes System**: Integrated notepad for writing and saving personal notes
- **Notifications**: Email and in-app notifications for task deadlines and priorities
- **Responsive Design**: Clean, intuitive UI that works on desktop and mobile devices
- **REST API**: Complete RESTful API for future mobile app development
- **Docker Support**: Fully containerized with Docker Compose
- **Cloudflare Tunnel**: Easy domain attachment and secure exposure

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express** and **TypeScript**
- **PostgreSQL** 15 database
- **JWT** authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email notifications
- **Node-cron** for scheduled tasks

### Frontend
- **React** 18 with **TypeScript**
- **Redux Toolkit** for state management
- **React Router** v6 for routing
- **Axios** for API calls
- **Vite** for fast development and building

### DevOps
- **Docker** & **Docker Compose**
- **Nginx** for serving frontend
- **Cloudflare Tunnel** for domain exposure

## 📋 Prerequisites

- **Docker** and **Docker Compose** installed
- **Node.js** 18+ (for local development)
- **PostgreSQL** 15+ (for local development without Docker)

## 🚀 Quick Start with Docker

### 1. Clone the Repository

```bash
git clone <repository-url>
cd taskmanager
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and update the following variables:

```env
# Database
POSTGRES_USER=taskmanager
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=taskmanager

# Backend
NODE_ENV=production
PORT=3000
JWT_SECRET=your_jwt_secret_key_here_min_32_chars
DATABASE_URL=postgresql://taskmanager:your_secure_password_here@db:5432/taskmanager

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Task Manager <your_email@gmail.com>

# Frontend
VITE_API_URL=http://localhost:3000/api

# Cloudflare Tunnel (optional)
CLOUDFLARE_TUNNEL_TOKEN=your_cloudflare_tunnel_token_here
```

### 3. Build and Start the Application

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3000
- Frontend on port 80

### 4. Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000/api

### 5. Create Your First Account

1. Click on "Sign up" on the login page
2. Fill in your details (first name, last name, email, password)
3. Click "Create account"
4. You'll be automatically logged in and redirected to the dashboard

## 🔧 Local Development Setup

### Backend Development

```bash
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:3000

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:5173

### Database Setup

Create a PostgreSQL database and run migrations:

```bash
cd backend
npm run migrate
```

## 🌐 Cloudflare Tunnel Setup

### 1. Create a Cloudflare Tunnel

1. Go to [Cloudflare Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. Navigate to **Access** > **Tunnels**
3. Click **Create a tunnel**
4. Give it a name (e.g., "taskmanager")
5. Copy the tunnel token

### 2. Configure the Tunnel

Add the tunnel token to your `.env` file:

```env
CLOUDFLARE_TUNNEL_TOKEN=your_tunnel_token_here
```

### 3. Start with Cloudflare Tunnel

```bash
docker-compose --profile cloudflare up -d
```

### 4. Configure Public Hostname

In the Cloudflare dashboard:
1. Go to your tunnel
2. Click **Public Hostname**
3. Add a public hostname:
   - **Subdomain**: taskmanager (or your choice)
   - **Domain**: yourdomain.com
   - **Service**: http://frontend:80

Your application will now be accessible at https://taskmanager.yourdomain.com

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password
3. Use the app password in your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
```

### Other Email Providers

Update the SMTP settings according to your provider:

**Outlook/Office365:**
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
```

**SendGrid:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

## 🔐 Security Best Practices

1. **Change Default Passwords**: Always change the default database password in production
2. **Use Strong JWT Secret**: Generate a strong, random JWT secret (minimum 32 characters)
3. **Enable HTTPS**: Use Cloudflare Tunnel or a reverse proxy with SSL certificates
4. **Regular Updates**: Keep dependencies updated with `npm update`
5. **Backup Database**: Regularly backup your PostgreSQL database

## 📊 Database Backup

### Create a Backup

```bash
docker-compose exec db pg_dump -U taskmanager taskmanager > backup.sql
```

### Restore from Backup

```bash
docker-compose exec -T db psql -U taskmanager taskmanager < backup.sql
```

## 🐛 Troubleshooting

### Backend won't start

1. Check if PostgreSQL is running:
   ```bash
   docker-compose ps
   ```

2. Check backend logs:
   ```bash
   docker-compose logs backend
   ```

3. Verify database connection in `.env`

### Frontend can't connect to backend

1. Check if backend is running on port 3000
2. Verify `VITE_API_URL` in `.env`
3. Check CORS settings in backend

### Email notifications not working

1. Verify SMTP credentials in `.env`
2. Check if your email provider allows SMTP
3. For Gmail, ensure you're using an App Password
4. Check backend logs for email errors

### Database migration errors

1. Stop all containers:
   ```bash
   docker-compose down
   ```

2. Remove database volume:
   ```bash
   docker volume rm taskmanager_postgres_data
   ```

3. Start fresh:
   ```bash
   docker-compose up -d
   ```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Task Endpoints

- `GET /api/tasks` - Get all tasks (with pagination, search, filters)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Event Endpoints

- `GET /api/events` - Get all events
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get a specific event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Note Endpoints

- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
- `GET /api/notes/:id` - Get a specific note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Notification Endpoints

- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete a notification

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@yourdomain.com or open an issue in the repository.

## 🎯 Roadmap

- [ ] Rich text editor for notes
- [ ] Task attachments
- [ ] Task comments and collaboration
- [ ] Mobile application (React Native)
- [ ] Dark mode
- [ ] Task templates
- [ ] Export tasks to CSV/PDF
- [ ] Integration with third-party calendars (Google Calendar, Outlook)
- [ ] Two-factor authentication
- [ ] Team workspaces

## 📸 Screenshots

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Tasks
![Tasks](docs/screenshots/tasks.png)

### Calendar
![Calendar](docs/screenshots/calendar.png)

### Notes
![Notes](docs/screenshots/notes.png)

---

Made with ❤️ by Your Team