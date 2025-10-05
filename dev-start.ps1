# Task Manager - Development Mode Startup Script
# This script starts the application in development mode (without Docker)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Task Manager - Development Mode" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed" -ForegroundColor Red
    Write-Host "  Download Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "✗ .env file not found" -ForegroundColor Red
    Write-Host "  Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Please edit the .env file and configure:" -ForegroundColor Yellow
    Write-Host "   - Database connection (DATABASE_URL)" -ForegroundColor Yellow
    Write-Host "   - JWT secret (JWT_SECRET)" -ForegroundColor Yellow
    Write-Host "   - Email settings (SMTP_*)" -ForegroundColor Yellow
    Write-Host ""
}

# Install backend dependencies
if (-not (Test-Path "backend\node_modules")) {
    Write-Host ""
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
}

# Install frontend dependencies
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host ""
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Starting Development Servers" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\backend'; Write-Host 'Starting Backend Server...' -ForegroundColor Cyan; npm run dev"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\frontend'; Write-Host 'Starting Frontend Server...' -ForegroundColor Cyan; npm run dev"

Write-Host "✓ Development servers started in separate windows" -ForegroundColor Green
Write-Host ""
Write-Host "To stop the servers, close the PowerShell windows or press Ctrl+C in each window" -ForegroundColor Yellow