#!/bin/bash

# Render build script for server

echo "Starting server build process..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if axios is installed
if ! npm list axios > /dev/null 2>&1; then
  echo "Installing axios..."
  npm install axios
fi

# Check if all required dependencies are installed
echo "Verifying all dependencies..."
npm install

echo "Server build process completed successfully!"
