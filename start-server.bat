@echo off
echo ========================================
echo   QuizTva Studio - Local Server
echo ========================================
echo.

REM Kiem tra Python
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python da duoc cai dat
    echo.
    echo Dang khoi dong server...
    echo.
    echo Server se chay tai: http://localhost:8000
    echo.
    echo Nhan Ctrl+C de dung server
    echo ========================================
    echo.
    python -m http.server 8000
) else (
    echo [LOI] Python chua duoc cai dat!
    echo.
    echo Vui long cai dat Python tu: https://www.python.org/downloads/
    echo.
    pause
)
