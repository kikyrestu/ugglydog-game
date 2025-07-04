# 🐕 UglyDog Game - Complete Web3 Minigame Project

A complete Web3-enabled click-based minigame featuring character evolution, save points, leaderboards, and wallet integration.

## 📋 Project Structure

```
UglyDogGame/
├── my-tailwind-project/     # Frontend game files
│   ├── src/                 # Game source code
│   │   ├── index.html       # Main game interface
│   │   ├── css/             # Tailwind CSS styles
│   │   └── js/              # Game logic modules
│   ├── package.json         # Frontend dependencies
│   └── README.md            # Frontend documentation
├── backend/                 # Backend API server
│   ├── server.js            # Express.js API server
│   ├── package.json         # Backend dependencies
│   └── README.md            # Backend documentation
├── deploy.sh                # Deployment script
└── README.md                # This file
```

## 🚀 Quick Start

### 1. Frontend Setup
```bash
cd my-tailwind-project
npm install
npm run build-css
npm run dev
```

### 2. Backend Setup (Optional)
```bash
cd backend
npm install
npm run dev
```

The game will be available at `http://localhost:8080` (frontend) and API at `http://localhost:3001` (backend).

## 🎮 Game Features

### Core Gameplay
- **Click-Based**: Click UglyDog to score points
- **20 Evolution Stages**: From Puppy to God Dog (🐕 → 🌌👑🌟💎🔥⚡🐕)
- **Save System**: Auto-save every 50 points
- **Miss Penalty**: 3 misses = reset to last save
- **Daily Limit**: One 1000-point session per day
- **Web3 Integration**: Connect MetaMask for leaderboards

### Advanced Features
- **🔧 JavaScript Parser**: Dynamic configuration and mod support
- **🎯 Mod System**: Load custom evolution stages and game modes
- **⚙️ Configuration Manager**: Real-time game setting adjustments
- **🎨 Custom Themes**: Built-in mods (Cat Evolution, Hardcore Mode)
- **🔒 Safe Execution**: Secure JavaScript evaluation environment

### Technical Features
- **Responsive Design**: Works on desktop, mobile, and tablets
- **Sound Effects**: Optional audio feedback system
- **Particle Effects**: Dynamic visual feedback
- **Offline Support**: Works without backend connection
- **Embeddable**: Can be integrated into other websites
- **🔧 Parser System**: JavaScript configuration and mod engine
- **🛡️ Secure Evaluation**: Safe code execution environment
- **🎛️ Real-time Config**: Live game setting modifications

## 🌐 Deployment Options

### Static Hosting (Frontend Only)
Deploy to Netlify, Vercel, or GitHub Pages:
```bash
./deploy.sh
# Upload ./deploy/ folder to your hosting provider
```

### Full Stack Deployment
For complete functionality with backend:

1. **Frontend**: Deploy to any static host
2. **Backend**: Deploy to Railway, Heroku, or VPS
3. **Database**: SQLite (included) or PostgreSQL for production

### Docker Deployment
```bash
# Frontend
docker run -p 8080:80 -v ./deploy:/usr/share/nginx/html nginx

# Backend
cd backend
docker build -t uglydog-backend .
docker run -p 3001:3001 uglydog-backend
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend
PORT=3001                    # API server port
NODE_ENV=production         # Environment mode

# Frontend (optional)
API_BASE_URL=https://api.yourdomain.com  # Backend API URL
```

### Game Settings
Modify these in `src/js/gameState.js`:
- `EVOLUTION_THRESHOLD`: Points needed for evolution (default: 50)
- `MAX_MISSES`: Allowed misses before reset (default: 3)
- `MAX_SCORE`: Daily score limit (default: 1000)
- `EVOLUTION_STAGES`: Custom evolution stages

## 🎯 Integration Guide

### Embed in Existing Website
```html
<iframe 
  src="https://yourdomain.com/uglydog" 
  width="800" 
  height="600"
  frameborder="0">
</iframe>
```

### Custom API Integration
```javascript
// Access game state externally
const gameAPI = window.UglyDogGameAPI;
const currentScore = gameAPI.getScore();
const evolution = gameAPI.getEvolution();
const walletAddress = gameAPI.getWalletAddress();

// Parser and mod integration
gameAPI.parseConfig({ evolutionThreshold: 75 });
gameAPI.loadPlugin(modCode, 'my-mod');
```

## 🔧 Parser & Mod System

UglyDog includes a powerful JavaScript parser for dynamic configuration and mod support:

### Configuration Management
- **Real-time Settings**: Modify game parameters without code changes
- **Import/Export**: Save and share configuration files
- **Schema Validation**: Type-safe configuration with error checking

### Mod Support
- **Custom Evolution**: Create new evolution stages and themes
- **Game Modes**: Define hardcore, easy, or custom gameplay modes
- **Built-in Mods**: Cat Evolution and Hardcore Mode included
- **Safe Execution**: Secure JavaScript evaluation environment

### Example Mod
```javascript
/**
 * @uglydog-mod
 * Name: Custom Theme
 */
const myEvolution = [
    { emoji: '🚀', size: 'text-6xl', name: 'Rocket' },
    { emoji: '🛸', size: 'text-7xl', name: 'UFO' }
];

defineEvolution(myEvolution);
```

See `my-tailwind-project/PARSER.md` for complete documentation.

## 📊 Analytics & Tracking

The backend provides comprehensive analytics:
- Player statistics and progression
- Session tracking and patterns
- Leaderboard rankings
- Evolution stage distribution
- Daily/weekly activity metrics

Access via API endpoints or database queries.

## 🔒 Security Features

- **Wallet Signature Verification**: Prevent score tampering
- **Rate Limiting**: Protect against abuse
- **Input Validation**: Sanitize all user inputs
- **CORS Configuration**: Secure cross-origin requests
- **Helmet.js**: Security headers

## 🐛 Troubleshooting

### Common Issues

1. **Sound not working**: Enable in browser settings or click sound toggle
2. **Wallet connection fails**: Check MetaMask installation and network
3. **Game doesn't load**: Verify all JavaScript files are accessible
4. **API errors**: Check backend server status and CORS configuration

### Debug Mode
Add `?debug=1` to URL for console logging and debug information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📜 License

MIT License - feel free to use, modify, and distribute.

## 🎉 Credits

- **Game Design**: Click-based evolution mechanics
- **Frontend**: Tailwind CSS, Vanilla JavaScript
- **Web3**: Ethers.js for wallet integration
- **Backend**: Express.js, SQLite
- **Character**: ASCII emoji evolution system

---

**🐕 Help UglyDog reach his ultimate evolution! From humble puppy to cosmic god! 🌌👑**

For support, feature requests, or bug reports, please open an issue on GitHub.
