#!/bin/bash

# Build script for Render.com deployment

echo "Starting build process for U Chitkara..."

# Install dependencies for frontend
echo "Installing frontend dependencies..."
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Install dependencies for backend
echo "Installing backend dependencies..."
cd server
npm install

echo "Build process completed successfully!"
