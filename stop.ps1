# Task Manager - Stop Script
# This script stops the Task Manager application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Task Manager - Stop Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Stopping Task Manager..." -ForegroundColor Yellow
docker-compose down

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Task Manager stopped successfully" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Failed to stop Task Manager" -ForegroundColor Red
    exit 1
}