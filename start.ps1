# Task Manager - Startup Script
# This script starts the Task Manager application using Docker Compose

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Task Manager - Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} 
catch {
    Write-Host "✗ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    Write-Host "  Download Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
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
    Write-Host "   - Database password (POSTGRES_PASSWORD)" -ForegroundColor Yellow
    Write-Host "   - JWT secret (JWT_SECRET)" -ForegroundColor Yellow
    Write-Host "   - Email settings (SMTP_*)" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Do you want to continue with default values? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Please edit .env file and run this script again." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "Starting Task Manager..." -ForegroundColor Yellow
Write-Host ""

# Stop any existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Build and start containers
Write-Host "Building and starting containers..." -ForegroundColor Yellow
docker-compose up -d --build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  Task Manager Started Successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access the application at:" -ForegroundColor Cyan
    Write-Host "  Frontend: http://localhost" -ForegroundColor White
    Write-Host "  Backend API: http://localhost:3000/api" -ForegroundColor White
    Write-Host ""
    Write-Host "To view logs:" -ForegroundColor Cyan
    Write-Host "  docker-compose logs -f" -ForegroundColor White
    Write-Host ""
    Write-Host "To stop the application:" -ForegroundColor Cyan
    Write-Host "  docker-compose down" -ForegroundColor White
    Write-Host ""
    
    # Wait for services to be ready
    Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # Check if services are running
    Write-Host ""
    Write-Host "Service Status:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host ""
    Write-Host "Opening browser..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    Start-Process "http://localhost"
}
else {
    Write-Host ""
    Write-Host "✗ Failed to start Task Manager" -ForegroundColor Red
    Write-Host "  Check the logs with: docker-compose logs" -ForegroundColor Yellow
    exit 1
}
