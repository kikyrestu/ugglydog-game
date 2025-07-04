# UglyDog Clicker Game - Backend

This is the backend server for the UglyDog Clicker Game, built with Express.js and MySQL.

## Features

- ✅ MySQL database integration (upgraded from SQLite)
- ✅ User management with wallet address authentication
- ✅ Game session logging with bonus/trap tracking
- ✅ Weekly leaderboard system with automatic ranking
- ✅ RESTful API endpoints
- ✅ Wallet signature verification
- ✅ Database connection pooling
- ✅ Error handling and logging

## Database Schema

### Users Table
- User profiles with wallet addresses
- Game statistics (total score, best session, evolution level)
- Username and optional email

### Game Logs Table
- Individual game session records
- Bonus collection and trap interaction tracking
- Play duration and game mode
- JSON storage for complex game data

### Weekly Leaderboard Table
- Weekly competition tracking
- Automatic ranking calculation
- Historical leaderboard data

## API Endpoints

### Core Game Endpoints
- `GET /api/users/:id` - Get user information by ID or wallet address
- `POST /api/game/play` - Submit game session with bonus/trap data
- `GET /api/leaderboard/weekly` - Get weekly leaderboard

### Legacy Compatibility Endpoints
- `GET /api/leaderboard` - All-time leaderboard
- `GET /api/player/:walletAddress` - Get player stats
- `PUT /api/player/:walletAddress/username` - Update username
- `GET /api/stats` - Global game statistics
- `GET /api/leaderboard/history` - Weekly leaderboard history

## Setup Instructions

### 1. Database Setup

First, ensure MySQL is installed and running on your system.

Create the database:
```bash
npm run setup-db
```

Or manually:
```bash
mysql -u root -p < database_setup.sql
```

### 2. Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=uglydog_game
PORT=3001
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Game Session Data Format

When submitting a game session via `POST /api/game/play`:

```json
{
  "walletAddress": "0x...",
  "sessionScore": 150,
  "savepointScore": 100,
  "evolutionLevel": 2,
  "misses": 1,
  "bonusCollected": [
    {
      "type": "golden",
      "timestamp": 1640995200000,
      "points": 50
    }
  ],
  "trapsHit": [
    {
      "type": "mouse",
      "timestamp": 1640995300000,
      "penalty": 5
    }
  ],
  "playDuration": 120000,
  "gameMode": "normal",
  "signature": "0x..."
}
```

## Installation

```bash
npm install
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### POST /api/scores
Submit a game score.

**Body:**
```json
{
  "walletAddress": "0x...",
  "score": 150,
  "evolutionLevel": 3,
  "misses": 2,
  "signature": "0x..." // Optional for verification
}
```

### GET /api/leaderboard
Get the leaderboard.

**Query Parameters:**
- `limit` (default: 10) - Number of entries to return
- `period` (default: 'all') - 'all' or 'weekly'

### GET /api/player/:walletAddress
Get player statistics.

### PUT /api/player/:walletAddress/username
Update player username.

**Body:**
```json
{
  "username": "PlayerName",
  "signature": "0x..." // Optional for verification
}
```

### GET /api/stats
Get global game statistics.

### GET /health
Health check endpoint.

## Database Schema

The server uses SQLite with the following tables:

- `players` - Player profiles and statistics
- `game_sessions` - Individual game session records
- `leaderboard` - Weekly leaderboard cache

## Environment Variables

- `PORT` - Server port (default: 3001)

## Security

- Helmet.js for security headers
- CORS configuration
- Wallet signature verification
- Input validation and sanitization
