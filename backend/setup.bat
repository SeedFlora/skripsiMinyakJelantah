@echo off
REM JelantahKu Backend - Virtual Environment Setup Script for Windows
REM This script sets up the Python virtual environment and installs dependencies

setlocal enabledelayedexpansion

echo.
echo ====================================
echo JelantahKu Backend Setup
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.10+ from https://www.python.org/
    exit /b 1
)

echo [1/4] Python found:
python --version

REM Create virtual environment
echo.
echo [2/4] Creating virtual environment...
if exist venv (
    echo Virtual environment already exists
) else (
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        exit /b 1
    )
    echo Virtual environment created successfully
)

REM Activate virtual environment
echo.
echo [3/4] Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    exit /b 1
)
echo Virtual environment activated

REM Install dependencies
echo.
echo [4/4] Installing dependencies...
pip install --upgrade pip setuptools wheel >nul 2>&1
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)
echo Dependencies installed successfully

REM Setup environment file
echo.
echo [OPTIONAL] Setting up .env file...
if not exist .env (
    copy .env.example .env
    echo .env file created from .env.example
    echo Please edit .env with your configuration
) else (
    echo .env file already exists
)

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo To run the backend server:
echo   1. Activate environment: venv\Scripts\activate.bat
echo   2. Run server: python run.py
echo.
echo To deactivate environment:
echo   deactivate
echo.
