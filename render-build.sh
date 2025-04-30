#!/bin/bash

# Render build script for the entire project

echo "Starting U Chitkara build process..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Navigate to server directory
echo "Moving to server directory..."
cd server

# Install server dependencies
echo "Installing server dependencies..."
npm install

# Ensure axios is installed
echo "Ensuring axios is installed..."
npm install axios --save

echo "Build process completed successfully!"
