#!/bin/bash

# UglyDog Game Deployment Script

echo "🐕 Deploying UglyDog Game..."

# Build the frontend
echo "Building frontend..."
cd my-tailwind-project
npm run build-css

# Create deployment directory
echo "Creating deployment package..."
mkdir -p ../deploy
cp -r src/* ../deploy/
cp README.md ../deploy/
cp package.json ../deploy/

# Backend deployment preparation
echo "Preparing backend..."
cd ../backend
cp -r * ../deploy/backend/
mkdir -p ../deploy/backend

echo "✅ Deployment package ready in ./deploy/"
echo "📁 Frontend files: ./deploy/"
echo "🖥️  Backend files: ./deploy/backend/"

echo ""
echo "🚀 To deploy to a web server:"
echo "1. Upload ./deploy/ contents to your web server"
echo "2. Set up Node.js environment for backend"
echo "3. Run 'npm install && npm start' in backend directory"
echo "4. Configure reverse proxy (nginx/apache) if needed"

echo ""
echo "🌐 For local testing:"
echo "Frontend: npx live-server deploy --port=8080"
echo "Backend: cd deploy/backend && npm install && npm start"
