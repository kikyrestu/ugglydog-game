#!/bin/bash

# 🎮 UglyDog Clicker Game - Production Deployment Script
# This script launches both frontend and backend services

echo "🎮 Starting UglyDog Clicker Game Production Environment..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if required directories exist
if [ ! -d "risebot" ]; then
    echo -e "${RED}❌ Error: risebot directory not found${NC}"
    exit 1
fi

if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: backend directory not found${NC}"
    exit 1
fi

# Check for required dependencies
echo "🔍 Checking dependencies..."

cd risebot
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
    npm install
fi

cd ../backend
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
    npm install
fi

cd ..

# Check MySQL connection
echo "🗄️  Checking MySQL connection..."
if ! command -v mysql &> /dev/null; then
    echo -e "${YELLOW}⚠️  Warning: MySQL client not found. Make sure MySQL server is running.${NC}"
fi

# Kill existing processes on our ports
echo "🧹 Cleaning up existing processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "node server.js" 2>/dev/null || true
sleep 2

# Start backend server
echo "🚀 Starting backend server on port 3005..."
cd backend
node server.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend started successfully
if check_port 3005; then
    echo -e "${GREEN}✅ Backend server running on http://localhost:3005${NC}"
else
    echo -e "${RED}❌ Failed to start backend server${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start frontend development server
echo "🎨 Starting frontend development server..."
cd risebot
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 5

# Find available frontend port
FRONTEND_PORT=3000
if check_port 3000; then
    FRONTEND_PORT=3000
elif check_port 3001; then
    FRONTEND_PORT=3001
elif check_port 3002; then
    FRONTEND_PORT=3002
elif check_port 3003; then
    FRONTEND_PORT=3003
else
    echo -e "${RED}❌ Could not determine frontend port${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 1
fi

echo -e "${GREEN}✅ Frontend server running on http://localhost:${FRONTEND_PORT}${NC}"

# Display service status
echo ""
echo "🎮 UglyDog Clicker Game - Services Running"
echo "=========================================="
echo -e "🎨 Frontend:  ${GREEN}http://localhost:${FRONTEND_PORT}/home-03${NC}"
echo -e "🔧 Backend:   ${GREEN}http://localhost:3005${NC}"
echo -e "🗄️  Database:  ${GREEN}MySQL (uglydog_game)${NC}"
echo ""
echo "🎯 Game Features:"
echo "  ✅ Non-intrusive timer system"
echo "  ✅ Evolution-themed trap system"
echo "  ✅ Ultimate deception mechanics"
echo "  ✅ Progressive difficulty scaling"
echo "  ✅ Modern UI with smooth animations"
echo ""
echo "🎮 Ready to play! Visit the frontend URL above."
echo ""
echo "⏹️  To stop all services, press Ctrl+C or run:"
echo "   pkill -f 'next dev' && pkill -f 'node server.js'"

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping UglyDog Clicker Game services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup INT

# Keep script running to maintain services
echo "📡 Monitoring services... Press Ctrl+C to stop all services."
wait
