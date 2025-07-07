#!/bin/bash

echo "🐕 Starting UglyDog Game (Frontend Only)"
echo "========================================"

echo "📍 Starting Frontend Server..."
cd /workspaces/ugglydog-game/risebot

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🚀 Starting development server..."
npm run dev &

echo ""
echo "✅ Game is starting up!"
echo "📱 Access the game at: http://localhost:3000/home-03"
echo "🎮 Native UglyDog game is integrated into the page"
echo ""
echo "ℹ️  Note: Backend/Leaderboard requires MySQL setup"
echo "   Game will work in offline mode without backend"
echo ""
echo "🎯 How to play:"
echo "   - Click 'Start Game' button"
echo "   - Click the UglyDog for points"
echo "   - Avoid missing 3 times"
echo "   - Watch evolution every 50 points!"
echo ""

# Wait for server to start
sleep 3
echo "🌐 Opening game in browser..."
