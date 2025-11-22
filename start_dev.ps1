# Healthcare Platform Development Startup Script
Write-Host "Starting Healthcare Platform Development Environment..." -ForegroundColor Green

# Check if we're in the correct directory
$currentDir = Get-Location
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "Error: Please run this script from the Healthcare project root directory" -ForegroundColor Red
    Write-Host "Current directory: $currentDir" -ForegroundColor Yellow
    exit 1
}

# Function to start backend
function Start-Backend {
    Write-Host "`nStarting Backend (Flask)..." -ForegroundColor Cyan
    
    # Change to backend directory
    Push-Location backend
    
    try {
        # Check if virtual environment exists
        if (Test-Path "venv") {
            Write-Host "Activating virtual environment..." -ForegroundColor Yellow
            .\venv\Scripts\Activate.ps1
        } else {
            Write-Host "Creating virtual environment..." -ForegroundColor Yellow
            python -m venv venv
            .\venv\Scripts\Activate.ps1
        }
        
        # Install dependencies
        Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
        pip install -r requirements.txt
        
        # Set environment variables
        $env:FLASK_APP = "app.py"
        $env:FLASK_ENV = "development"
        $env:FLASK_DEBUG = "1"
        
        Write-Host "Starting Flask development server..." -ForegroundColor Green
        # Start Flask in background
        Start-Process -FilePath "python" -ArgumentList "app.py" -WindowStyle Normal
        
    } catch {
        Write-Host "Error starting backend: $($_.Exception.Message)" -ForegroundColor Red
    } finally {
        Pop-Location
    }
}

# Function to start frontend
function Start-Frontend {
    Write-Host "`nStarting Frontend (React + Vite)..." -ForegroundColor Cyan
    
    # Change to frontend directory
    Push-Location frontend
    
    try {
        # Install dependencies
        if (-not (Test-Path "node_modules")) {
            Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
            npm install
        } else {
            Write-Host "Node modules found, checking for updates..." -ForegroundColor Yellow
            npm update
        }
        
        Write-Host "Starting Vite development server..." -ForegroundColor Green
        # Start Vite in background
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Normal
        
    } catch {
        Write-Host "Error starting frontend: $($_.Exception.Message)" -ForegroundColor Red
    } finally {
        Pop-Location
    }
}

# Function to open development URLs
function Open-DevUrls {
    Start-Sleep -Seconds 5
    Write-Host "`nOpening development URLs..." -ForegroundColor Cyan
    
    # Open frontend in default browser
    Start-Process "http://localhost:5173"
    
    # Give user info about backend
    Write-Host "`nDevelopment servers started!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
    Write-Host "Backend API: http://localhost:5000" -ForegroundColor White
    Write-Host "`nPress Ctrl+C in any terminal window to stop the servers" -ForegroundColor Yellow
}

# Main execution
try {
    # Start backend first
    Start-Backend
    Start-Sleep -Seconds 3
    
    # Start frontend
    Start-Frontend
    Start-Sleep -Seconds 3
    
    # Open URLs
    Open-DevUrls
    
    Write-Host "`n=== Development Environment Ready ===" -ForegroundColor Green
    Write-Host "Backend running on: http://localhost:5000" -ForegroundColor White
    Write-Host "Frontend running on: http://localhost:5173" -ForegroundColor White
    Write-Host "`nTo stop all services, close the terminal windows or press Ctrl+C" -ForegroundColor Yellow
    
    # Keep script running
    Write-Host "`nPress any key to exit this script (servers will continue running)..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
} catch {
    Write-Host "Error in startup script: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}