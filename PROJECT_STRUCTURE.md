# Task Manager - Project Structure

## 📁 Directory Structure

```
taskmanager/
├── backend/                    # Backend Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   └── database.ts    # Database connection
│   │   ├── controllers/       # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── tasks.controller.ts
│   │   │   ├── events.controller.ts
│   │   │   ├── notes.controller.ts
│   │   │   └── notifications.controller.ts
│   │   ├── database/          # Database migrations
│   │   │   ├── migrate.ts
│   │   │   └── migrations/
│   │   │       └── 001_initial_schema.sql
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── routes/            # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── tasks.routes.ts
│   │   │   ├── events.routes.ts
│   │   │   ├── notes.routes.ts
│   │   │   └── notifications.routes.ts
│   │   ├── services/          # Business logic
│   │   │   ├── email.service.ts
│   │   │   └── notification.service.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/             # Utility functions
│   │   │   └── jwt.ts
│   │   └── server.ts          # Main server file
│   ├── Dockerfile             # Backend Docker configuration
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Layout.tsx
│   │   │   └── Layout.css
│   │   ├── config/            # Configuration
│   │   │   └── api.ts
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useAppDispatch.ts
│   │   │   └── useAppSelector.ts
│   │   ├── pages/             # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Tasks.tsx
│   │   │   ├── Calendar.tsx
│   │   │   ├── Notes.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Tasks.css
│   │   │   ├── Calendar.css
│   │   │   ├── Notes.css
│   │   │   └── Profile.css
│   │   ├── store/             # Redux store
│   │   │   ├── index.ts
│   │   │   └── slices/
│   │   │       ├── authSlice.ts
│   │   │       ├── tasksSlice.ts
│   │   │       ├── eventsSlice.ts
│   │   │       ├── notesSlice.ts
│   │   │       └── notificationsSlice.ts
│   │   ├── types/             # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx            # Main App component
│   │   ├── App.css            # Global styles
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Base styles
│   ├── public/                # Static assets
│   ├── Dockerfile             # Frontend Docker configuration
│   ├── nginx.conf             # Nginx configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── docker-compose.yml          # Docker Compose configuration
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── README.md                   # Detailed documentation
├── QUICK_START.md              # Quick start guide
├── PROJECT_STRUCTURE.md        # This file
├── start.ps1                   # Docker startup script
├── stop.ps1                    # Docker stop script
└── dev-start.ps1               # Development mode script
```

## 🎯 Key Components

### Backend Architecture

#### Controllers
Handle HTTP requests and responses:
- **auth.controller.ts**: User registration, login, profile management
- **tasks.controller.ts**: CRUD operations for tasks
- **events.controller.ts**: CRUD operations for calendar events
- **notes.controller.ts**: CRUD operations for notes
- **notifications.controller.ts**: Notification management

#### Services
Business logic and external integrations:
- **email.service.ts**: Email sending functionality
- **notification.service.ts**: Notification creation and cron jobs

#### Middleware
Request processing:
- **auth.middleware.ts**: JWT authentication
- **error.middleware.ts**: Global error handling

#### Database
- **PostgreSQL** with 5 main tables:
  - users
  - tasks
  - events
  - notes
  - notifications

### Frontend Architecture

#### State Management (Redux Toolkit)
- **authSlice**: User authentication state
- **tasksSlice**: Tasks state and API calls
- **eventsSlice**: Events state and API calls
- **notesSlice**: Notes state and API calls
- **notificationsSlice**: Notifications state and API calls

#### Pages
- **Login/Register**: Authentication pages
- **Dashboard**: Overview with statistics
- **Tasks**: Task management with filters
- **Calendar**: Interactive calendar view
- **Notes**: Note-taking interface
- **Profile**: User profile settings

#### Components
- **Layout**: Main layout with sidebar navigation

## 🔄 Data Flow

### Authentication Flow
```
User → Login Page → API Call → Backend Auth Controller
                                      ↓
                              JWT Token Generated
                                      ↓
                              Token Stored in Redux + LocalStorage
                                      ↓
                              User Redirected to Dashboard
```

### Task Creation Flow
```
User → Tasks Page → Create Task Form → API Call with JWT
                                            ↓
                                    Backend Validates Token
                                            ↓
                                    Task Saved to Database
                                            ↓
                                    Response Sent to Frontend
                                            ↓
                                    Redux State Updated
                                            ↓
                                    UI Refreshed
```

### Notification Flow
```
Cron Job (Every Hour) → Check Due Tasks → Create Notifications
                                                ↓
                                        Send Email Notifications
                                                ↓
                                        Store in Database
                                                ↓
                                        Frontend Polls for Updates
                                                ↓
                                        Display in UI
```

## 🗄️ Database Schema

### Users Table
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password_hash
- first_name
- last_name
- created_at
- updated_at
```

### Tasks Table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- title
- description
- due_date
- priority (low, medium, high)
- status (todo, in_progress, completed)
- created_at
- updated_at
```

### Events Table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- title
- description
- start_date
- end_date
- all_day
- created_at
- updated_at
```

### Notes Table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- title
- content
- created_at
- updated_at
```

### Notifications Table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY → users.id)
- type
- title
- message
- is_read
- created_at
```

## 🔐 Security Features

1. **Password Hashing**: Bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth
3. **CORS Protection**: Configured CORS middleware
4. **Rate Limiting**: Prevents brute force attacks
5. **Helmet**: Security headers
6. **Input Validation**: Express-validator
7. **SQL Injection Prevention**: Parameterized queries

## 🚀 Deployment Architecture

### Docker Containers
1. **PostgreSQL**: Database server
2. **Backend**: Node.js API server
3. **Frontend**: Nginx serving React app
4. **Cloudflared** (optional): Tunnel for domain exposure

### Network Flow
```
Internet → Cloudflare Tunnel → Nginx (Frontend) → Backend API → PostgreSQL
```

## 📊 API Endpoints Summary

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- PUT /api/auth/profile

### Tasks
- GET /api/tasks (with pagination, search, filters)
- POST /api/tasks
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

### Events
- GET /api/events
- POST /api/events
- GET /api/events/:id
- PUT /api/events/:id
- DELETE /api/events/:id

### Notes
- GET /api/notes
- POST /api/notes
- GET /api/notes/:id
- PUT /api/notes/:id
- DELETE /api/notes/:id

### Notifications
- GET /api/notifications
- PUT /api/notifications/:id/read
- DELETE /api/notifications/:id

## 🛠️ Development Tools

### Backend
- **TypeScript**: Type safety
- **Nodemon**: Auto-restart on changes
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Frontend
- **Vite**: Fast build tool
- **React DevTools**: Component debugging
- **Redux DevTools**: State debugging

## 📦 Dependencies

### Backend Main Dependencies
- express: Web framework
- pg: PostgreSQL client
- bcrypt: Password hashing
- jsonwebtoken: JWT handling
- nodemailer: Email sending
- node-cron: Scheduled tasks
- express-validator: Input validation
- helmet: Security headers
- cors: CORS handling

### Frontend Main Dependencies
- react: UI library
- react-router-dom: Routing
- @reduxjs/toolkit: State management
- axios: HTTP client
- react-toastify: Notifications

## 🔄 CI/CD Ready

The project structure supports:
- Docker-based deployment
- Environment-based configuration
- Health checks
- Logging
- Monitoring

## 📝 Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb style guide
- **Prettier**: Consistent formatting
- **Naming Conventions**:
  - camelCase for variables and functions
  - PascalCase for components and classes
  - UPPER_CASE for constants

---

This structure provides a solid foundation for a scalable, maintainable task management application.