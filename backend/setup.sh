#!/bin/bash
# JelantahKu Backend - Virtual Environment Setup Script for Linux/Mac

echo ""
echo "===================================="
echo "JelantahKu Backend Setup"
echo "===================================="
echo ""

# Check if Python is installed
python3 --version
if [ $? -ne 0 ]; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.10+ first"
    exit 1
fi

echo "[1/4] Python found"

# Create virtual environment
echo ""
echo "[2/4] Creating virtual environment..."
if [ -d "venv" ]; then
    echo "Virtual environment already exists"
else
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment"
        exit 1
    fi
    echo "Virtual environment created successfully"
fi

# Activate virtual environment
echo ""
echo "[3/4] Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo ""
echo "[4/4] Installing dependencies..."
pip install --upgrade pip setuptools wheel > /dev/null 2>&1
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "Dependencies installed successfully"

# Setup environment file
echo ""
echo "[OPTIONAL] Setting up .env file..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo ".env file created from .env.example"
    echo "Please edit .env with your configuration"
else
    echo ".env file already exists"
fi

echo ""
echo "===================================="
echo "Setup Complete!"
echo "===================================="
echo ""
echo "To run the backend server:"
echo "  1. Activate environment: source venv/bin/activate"
echo "  2. Run server: python run.py"
echo ""
echo "To deactivate environment:"
echo "  deactivate"
echo ""
