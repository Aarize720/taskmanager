# Quick Start Guide - Task Manager

This guide will help you get the Task Manager application up and running in minutes.

## 🚀 Option 1: Docker (Recommended)

### Prerequisites
- Docker Desktop installed and running
- Download from: https://www.docker.com/products/docker-desktop

### Steps

1. **Open PowerShell in the project directory**

2. **Run the startup script**
   ```powershell
   .\start.ps1
   ```

3. **Wait for the application to start** (about 30-60 seconds)

4. **Access the application**
   - Open your browser to: http://localhost
   - Create your account and start using the app!

### To Stop the Application
```powershell
.\stop.ps1
```

## 💻 Option 2: Local Development

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 15+ installed and running
- Download Node.js from: https://nodejs.org/

### Steps

1. **Configure the database**
   - Create a PostgreSQL database named `taskmanager`
   - Update the `DATABASE_URL` in `.env` file

2. **Run the development startup script**
   ```powershell
   .\dev-start.ps1
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🔧 Configuration

### Minimum Required Configuration

Edit the `.env` file and set:

```env
# Database Password (change this!)
POSTGRES_PASSWORD=your_secure_password

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_very_long_random_secret_key_here

# Email Settings (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Gmail App Password Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > 2-Step Verification > App passwords
4. Generate a new app password
5. Use this password in the `SMTP_PASS` field

## 📱 First Steps

1. **Create an Account**
   - Click "Sign up" on the login page
   - Fill in your details
   - Click "Create account"

2. **Create Your First Task**
   - Go to the "Tasks" page
   - Click "New Task"
   - Fill in the task details
   - Click "Create Task"

3. **Add an Event**
   - Go to the "Calendar" page
   - Click "New Event"
   - Set the date and details
   - Click "Create Event"

4. **Write a Note**
   - Go to the "Notes" page
   - Click the "+" button
   - Write your note
   - Click "Save"

## 🌐 Cloudflare Tunnel (Optional)

To expose your application to the internet with a custom domain:

1. **Create a Cloudflare Tunnel**
   - Go to https://one.dash.cloudflare.com/
   - Navigate to Access > Tunnels
   - Create a new tunnel
   - Copy the tunnel token

2. **Add the token to .env**
   ```env
   CLOUDFLARE_TUNNEL_TOKEN=your_token_here
   ```

3. **Start with Cloudflare profile**
   ```powershell
   docker-compose --profile cloudflare up -d
   ```

4. **Configure public hostname in Cloudflare dashboard**
   - Add your domain
   - Point to `http://frontend:80`

## 🆘 Troubleshooting

### Docker won't start
- Make sure Docker Desktop is running
- Check if ports 80, 3000, and 5432 are available
- Try: `docker-compose down` then `.\start.ps1`

### Can't connect to database
- Check if PostgreSQL container is running: `docker-compose ps`
- Verify DATABASE_URL in .env file
- Check logs: `docker-compose logs db`

### Frontend can't reach backend
- Verify backend is running on port 3000
- Check VITE_API_URL in .env
- Check browser console for errors

### Email notifications not working
- Verify SMTP credentials in .env
- For Gmail, use an App Password (not your regular password)
- Check backend logs: `docker-compose logs backend`

## 📚 More Information

For detailed documentation, see [README.md](README.md)

## 🎯 Default Ports

- **Frontend**: http://localhost (port 80)
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432

## 🔐 Security Notes

⚠️ **Important for Production:**
- Change the default database password
- Use a strong, random JWT secret (32+ characters)
- Enable HTTPS (use Cloudflare Tunnel or reverse proxy)
- Keep dependencies updated
- Backup your database regularly

## 📞 Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review logs: `docker-compose logs -f`
- Check Docker status: `docker-compose ps`

---

Happy task managing! 🎉