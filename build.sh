#!/bin/bash

# Build the React frontend
echo "Building frontend..."
npm run build

# Build the Go backend
echo "Building backend..."
cd api
CGO_ENABLED=0 GOOS=linux go build -o server

echo "Build complete! You can now run the server with:"
echo "cd api && GO_ENV=production ./server"