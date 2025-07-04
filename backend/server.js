const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { ethers } = require('ethers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// MySQL connection configuration
const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'uglydog_game',
    charset: 'utf8mb4',
    timezone: '+00:00',
    authPlugins: {
        mysql_native_password: () => () => Buffer.alloc(0)
    }
};

let db;

// Initialize MySQL database
async function initializeDatabase() {
    try {
        // Create connection without specifying database first
        const tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            charset: dbConfig.charset
        });

        // Create database if it doesn't exist
        await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await tempConnection.end();

        // Now connect to the database
        db = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL database');

        // Create tables
        await createTables();
        console.log('Database tables initialized');
    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
}

// Create database tables
async function createTables() {
    const tables = [
        // Users table (Laravel standard structure)
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            email_verified_at TIMESTAMP NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,

        // User wallets table (separate table for wallet management)
        `CREATE TABLE IF NOT EXISTS user_wallets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            wallet_address VARCHAR(42) UNIQUE NOT NULL,
            wallet_type ENUM('metamask', 'walletconnect', 'coinbase', 'other') DEFAULT 'metamask',
            is_primary BOOLEAN DEFAULT FALSE,
            is_verified BOOLEAN DEFAULT FALSE,
            last_used_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_wallet_address (wallet_address),
            INDEX idx_user_id (user_id),
            INDEX idx_is_primary (is_primary)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,

        // User game profiles table (game-specific data)
        `CREATE TABLE IF NOT EXISTS user_game_profiles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            total_score INT DEFAULT 0,
            best_session INT DEFAULT 0,
            total_sessions INT DEFAULT 0,
            evolution_level INT DEFAULT 0,
            current_savepoint INT DEFAULT 0,
            last_play_date DATE DEFAULT NULL,
            game_settings JSON DEFAULT NULL,
            achievements JSON DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_total_score (total_score),
            INDEX idx_best_session (best_session)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,

        // Game logs table (updated to reference user_id)
        `CREATE TABLE IF NOT EXISTS game_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            wallet_id INT NULL,
            session_score INT NOT NULL,
            savepoint_score INT DEFAULT 0,
            evolution_level INT DEFAULT 0,
            misses INT DEFAULT 0,
            bonus_collected JSON DEFAULT NULL,
            traps_hit JSON DEFAULT NULL,
            play_duration INT DEFAULT NULL,
            game_mode ENUM('normal', 'bonus', 'challenge') DEFAULT 'normal',
            signature TEXT DEFAULT NULL,
            ip_address VARCHAR(45) DEFAULT NULL,
            user_agent TEXT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (wallet_id) REFERENCES user_wallets(id) ON DELETE SET NULL,
            INDEX idx_user_id (user_id),
            INDEX idx_wallet_id (wallet_id),
            INDEX idx_session_score (session_score),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,

        // Weekly leaderboard table (updated to reference user_id)
        `CREATE TABLE IF NOT EXISTS weekly_leaderboard (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            week_start DATE NOT NULL,
            week_end DATE NOT NULL,
            best_score INT NOT NULL,
            total_sessions INT DEFAULT 0,
            total_score INT DEFAULT 0,
            rank_position INT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_week (user_id, week_start),
            INDEX idx_week_start (week_start),
            INDEX idx_best_score (best_score),
            INDEX idx_rank (rank_position)
        ) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    ];

    for (const table of tables) {
        await db.execute(table);
    }
}

// Utility function to verify wallet signature
function verifySignature(address, message, signature) {
    try {
        const recoveredAddress = ethers.verifyMessage(message, signature);
        return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
        console.error('Signature verification error:', error);
        return false;
    }
}

// Get current week start date (Monday)
function getCurrentWeekStart() {
    return moment().startOf('isoWeek').format('YYYY-MM-DD');
}

// Get current week end date (Sunday)
function getCurrentWeekEnd() {
    return moment().endOf('isoWeek').format('YYYY-MM-DD');
}

// Calculate game score with bonus/trap effects
function calculateGameScore(baseScore, bonusCollected = [], trapsHit = []) {
    let finalScore = baseScore;
    
    // Apply bonus effects
    if (bonusCollected && bonusCollected.length > 0) {
        bonusCollected.forEach(bonus => {
            switch (bonus.type) {
                case 'golden':
                    finalScore += 50;
                    break;
                case 'ghost':
                    // Ghost gives instant level up (handled separately)
                    break;
                case 'mirror':
                    finalScore += bonus.correct ? 10 : 0;
                    break;
            }
        });
    }
    
    // Apply trap penalties
    if (trapsHit && trapsHit.length > 0) {
        trapsHit.forEach(trap => {
            switch (trap.type) {
                case 'mouse':
                    finalScore = Math.max(0, finalScore - 5);
                    break;
                case 'bomb':
                    // Bomb causes instant game over (handled separately)
                    break;
            }
        });
    }
    
    return Math.max(0, finalScore);
}

// Helper function to find or create user by wallet address
async function findOrCreateUserByWallet(walletAddress) {
    try {
        // Check if wallet exists
        const [wallets] = await db.execute(
            'SELECT uw.*, u.* FROM user_wallets uw JOIN users u ON uw.user_id = u.id WHERE uw.wallet_address = ?',
            [walletAddress]
        );

        if (wallets.length > 0) {
            // Update last used
            await db.execute(
                'UPDATE user_wallets SET last_used_at = CURRENT_TIMESTAMP WHERE wallet_address = ?',
                [walletAddress]
            );
            return {
                userId: wallets[0].user_id,
                walletId: wallets[0].id,
                user: wallets[0]
            };
        }

        // Create new user and wallet
        const defaultEmail = `${walletAddress}@uglydog.temp`;
        const defaultName = `Player_${walletAddress.slice(-6)}`;
        const defaultPassword = '$2y$10$defaulthash'; // Placeholder

        // Create user
        const [userResult] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [defaultName, defaultEmail, defaultPassword]
        );

        const userId = userResult.insertId;

        // Create wallet
        const [walletResult] = await db.execute(
            'INSERT INTO user_wallets (user_id, wallet_address, wallet_type, is_primary, is_verified, last_used_at) VALUES (?, ?, ?, TRUE, FALSE, CURRENT_TIMESTAMP)',
            [userId, walletAddress, 'metamask']
        );

        const walletId = walletResult.insertId;

        // Create game profile
        await db.execute(
            'INSERT INTO user_game_profiles (user_id) VALUES (?)',
            [userId]
        );

        return {
            userId,
            walletId,
            user: {
                id: userId,
                name: defaultName,
                email: defaultEmail
            }
        };

    } catch (error) {
        console.error('Error in findOrCreateUserByWallet:', error);
        throw error;
    }
}

// Routes

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// GET /api/users/:id - Get user information by ID or wallet address
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let query, params;
        
        // Check if ID is numeric (user ID) or wallet address
        if (/^\d+$/.test(id)) {
            // Get by user ID
            query = `
                SELECT u.*, ugp.*, uw.wallet_address, uw.wallet_type, uw.is_primary
                FROM users u 
                LEFT JOIN user_game_profiles ugp ON u.id = ugp.user_id
                LEFT JOIN user_wallets uw ON u.id = uw.user_id AND uw.is_primary = TRUE
                WHERE u.id = ?
            `;
            params = [id];
        } else {
            // Get by wallet address
            query = `
                SELECT u.*, ugp.*, uw.wallet_address, uw.wallet_type, uw.is_primary
                FROM users u 
                JOIN user_wallets uw ON u.id = uw.user_id
                LEFT JOIN user_game_profiles ugp ON u.id = ugp.user_id
                WHERE uw.wallet_address = ?
            `;
            params = [id];
        }
        
        const [rows] = await db.execute(query, params);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = rows[0];
        
        // Get recent game sessions
        const [sessions] = await db.execute(
            `SELECT session_score, savepoint_score, evolution_level, misses, 
                    bonus_collected, traps_hit, play_duration, game_mode, created_at 
             FROM game_logs 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 10`,
            [user.id]
        );
        
        // Remove sensitive information
        delete user.password;
        delete user.email_verified_at;
        
        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                wallet_address: user.wallet_address,
                total_score: user.total_score || 0,
                best_session: user.best_session || 0,
                total_sessions: user.total_sessions || 0,
                evolution_level: user.evolution_level || 0,
                current_savepoint: user.current_savepoint || 0,
                last_play_date: user.last_play_date,
                created_at: user.created_at,
                updated_at: user.updated_at
            },
            recentSessions: sessions.map(session => ({
                ...session,
                bonus_collected: session.bonus_collected ? JSON.parse(session.bonus_collected) : [],
                traps_hit: session.traps_hit ? JSON.parse(session.traps_hit) : []
            }))
        });
        
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST /api/game/play - Submit game session
app.post('/api/game/play', async (req, res) => {
    try {
        const { 
            walletAddress, 
            sessionScore, 
            savepointScore = 0, 
            evolutionLevel = 0, 
            misses = 0, 
            bonusCollected = [], 
            trapsHit = [], 
            playDuration = null, 
            gameMode = 'normal', 
            signature 
        } = req.body;

        // Validate input
        if (!walletAddress || sessionScore === undefined) {
            return res.status(400).json({ error: 'Missing required fields: walletAddress, sessionScore' });
        }

        // Verify signature if provided
        if (signature) {
            const message = `UglyDog Score: ${sessionScore} - ${new Date().toDateString()}`;
            if (!verifySignature(walletAddress, message, signature)) {
                return res.status(401).json({ error: 'Invalid signature' });
            }
        }

        // Calculate final score with bonus/trap effects
        const finalScore = calculateGameScore(sessionScore, bonusCollected, trapsHit);

        // Find or create user by wallet address
        const { userId, walletId } = await findOrCreateUserByWallet(walletAddress);

        // Update user game profile
        await db.execute(
            `UPDATE user_game_profiles 
             SET total_score = total_score + ?, 
                 best_session = GREATEST(best_session, ?), 
                 total_sessions = total_sessions + 1, 
                 evolution_level = GREATEST(evolution_level, ?),
                 last_play_date = CURRENT_DATE,
                 updated_at = CURRENT_TIMESTAMP 
             WHERE user_id = ?`,
            [finalScore, finalScore, evolutionLevel || 0, userId]
        );

        // Insert game log
        const [gameResult] = await db.execute(
            `INSERT INTO game_logs (user_id, wallet_id, session_score, savepoint_score, evolution_level, misses, 
                                   bonus_collected, traps_hit, play_duration, game_mode, signature, ip_address, user_agent) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, 
                walletId,
                sessionScore, 
                savepointScore || 0, 
                evolutionLevel || 0, 
                misses || 0, 
                bonusCollected && bonusCollected.length > 0 ? JSON.stringify(bonusCollected) : null, 
                trapsHit && trapsHit.length > 0 ? JSON.stringify(trapsHit) : null, 
                playDuration || null, 
                gameMode || 'normal', 
                signature || null,
                req.ip || req.connection.remoteAddress || null,
                req.get('User-Agent') || null
            ]
        );

        // Update weekly leaderboard
        await updateWeeklyLeaderboard(userId, finalScore);

        res.json({
            success: true,
            sessionId: gameResult.insertId,
            finalScore,
            message: 'Game session recorded successfully'
        });

    } catch (error) {
        console.error('Game play error:', error);
        res.status(500).json({ error: 'Failed to record game session' });
    }
});

// GET /api/leaderboard/weekly - Get weekly leaderboard
app.get('/api/leaderboard/weekly', async (req, res) => {
    try {
        const { limit = 10, week } = req.query;
        
        let weekStart, weekEnd;
        if (week) {
            // Parse specific week (format: YYYY-MM-DD)
            weekStart = moment(week).startOf('isoWeek').format('YYYY-MM-DD');
            weekEnd = moment(week).endOf('isoWeek').format('YYYY-MM-DD');
        } else {
            // Current week
            weekStart = getCurrentWeekStart();
            weekEnd = getCurrentWeekEnd();
        }

        const [rows] = await db.execute(
            `SELECT 
                wl.rank_position,
                uw.wallet_address,
                u.name as username,
                wl.best_score,
                wl.total_sessions,
                wl.total_score,
                wl.week_start,
                wl.week_end
             FROM weekly_leaderboard wl
             JOIN users u ON wl.user_id = u.id
             LEFT JOIN user_wallets uw ON u.id = uw.user_id AND uw.is_primary = TRUE
             WHERE wl.week_start = ?
             ORDER BY wl.rank_position ASC
             LIMIT ?`,
            [weekStart, parseInt(limit)]
        );

        // Anonymize wallet addresses for privacy
        const leaderboard = rows.map(row => ({
            rank: row.rank_position,
            walletAddress: row.wallet_address ? (row.wallet_address.slice(0, 6) + '...' + row.wallet_address.slice(-4)) : 'N/A',
            username: row.username || 'Anonymous',
            bestScore: row.best_score,
            totalSessions: row.total_sessions,
            totalScore: row.total_score,
            weekStart: row.week_start,
            weekEnd: row.week_end
        }));

        res.json({ 
            leaderboard,
            weekStart,
            weekEnd,
            totalEntries: leaderboard.length
        });

    } catch (error) {
        console.error('Weekly leaderboard error:', error);
        res.status(500).json({ error: 'Failed to fetch weekly leaderboard' });
    }
});

// Helper function to update weekly leaderboard
async function updateWeeklyLeaderboard(userId, sessionScore) {
    try {
        const weekStart = getCurrentWeekStart();
        const weekEnd = getCurrentWeekEnd();

        // Check if user entry exists for this week
        const [existing] = await db.execute(
            'SELECT id, best_score, total_sessions, total_score FROM weekly_leaderboard WHERE user_id = ? AND week_start = ?',
            [userId, weekStart]
        );

        if (existing.length === 0) {
            // Create new weekly entry
            await db.execute(
                `INSERT INTO weekly_leaderboard (user_id, week_start, week_end, best_score, total_sessions, total_score) 
                 VALUES (?, ?, ?, ?, 1, ?)`,
                [userId, weekStart, weekEnd, sessionScore, sessionScore]
            );
        } else {
            // Update existing entry
            const entry = existing[0];
            const newBestScore = Math.max(entry.best_score, sessionScore);
            const newTotalSessions = entry.total_sessions + 1;
            const newTotalScore = entry.total_score + sessionScore;

            await db.execute(
                `UPDATE weekly_leaderboard 
                 SET best_score = ?, total_sessions = ?, total_score = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [newBestScore, newTotalSessions, newTotalScore, entry.id]
            );
        }

        // Recalculate rankings for this week
        await recalculateWeeklyRankings(weekStart);

    } catch (error) {
        console.error('Update weekly leaderboard error:', error);
    }
}

// Recalculate weekly rankings
async function recalculateWeeklyRankings(weekStart) {
    try {
        // Get all entries for the week ordered by best score
        const [entries] = await db.execute(
            'SELECT id FROM weekly_leaderboard WHERE week_start = ? ORDER BY best_score DESC, total_score DESC',
            [weekStart]
        );

        // Update rankings
        for (let i = 0; i < entries.length; i++) {
            await db.execute(
                'UPDATE weekly_leaderboard SET rank_position = ? WHERE id = ?',
                [i + 1, entries[i].id]
            );
        }
    } catch (error) {
        console.error('Recalculate rankings error:', error);
    }
}

// Legacy endpoints for backward compatibility

// Get leaderboard (all-time)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const { limit = 10, period = 'all' } = req.query;

        let query, params;
        
        if (period === 'weekly') {
            // Redirect to new weekly endpoint
            return res.redirect(307, `/api/leaderboard/weekly?limit=${limit}`);
        } else {
            // All-time leaderboard
            query = `
                SELECT uw.wallet_address, u.name as username, ugp.best_session as score, 
                       ugp.total_sessions, ugp.evolution_level, u.created_at
                FROM users u
                JOIN user_wallets uw ON u.id = uw.user_id AND uw.is_primary = TRUE
                LEFT JOIN user_game_profiles ugp ON u.id = ugp.user_id
                ORDER BY ugp.best_session DESC
                LIMIT ?
            `;
            params = [parseInt(limit)];
        }

        const [rows] = await db.execute(query, params);

        // Anonymize wallet addresses for privacy
        const leaderboard = rows.map((row, index) => ({
            rank: index + 1,
            walletAddress: row.wallet_address ? (row.wallet_address.slice(0, 6) + '...' + row.wallet_address.slice(-4)) : 'N/A',
            username: row.username || 'Anonymous',
            score: row.score || 0,
            totalSessions: row.total_sessions || 0,
            evolutionLevel: row.evolution_level || 0,
            joinedAt: row.created_at
        }));

        res.json({ leaderboard });

    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get player stats (legacy endpoint)
app.get('/api/player/:walletAddress', async (req, res) => {
    try {
        const { walletAddress } = req.params;

        const [users] = await db.execute(
            `SELECT u.*, ugp.*, uw.wallet_address, uw.wallet_type
             FROM users u 
             JOIN user_wallets uw ON u.id = uw.user_id
             LEFT JOIN user_game_profiles ugp ON u.id = ugp.user_id
             WHERE uw.wallet_address = ?`,
            [walletAddress]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        const user = users[0];

        // Get recent sessions
        const [sessions] = await db.execute(
            `SELECT session_score as score, evolution_level, misses, 
                    DATE(created_at) as session_date, created_at
             FROM game_logs 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 10`,
            [user.id]
        );

        res.json({
            player: {
                walletAddress: user.wallet_address,
                username: user.name,
                totalScore: user.total_score || 0,
                bestSession: user.best_session || 0,
                totalSessions: user.total_sessions || 0,
                evolutionLevel: user.evolution_level || 0,
                createdAt: user.created_at
            },
            recentSessions: sessions
        });

    } catch (error) {
        console.error('Get player error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update username
app.put('/api/player/:walletAddress/username', async (req, res) => {
    try {
        const { walletAddress } = req.params;
        const { username, signature } = req.body;

        if (!username || username.length > 50) {
            return res.status(400).json({ error: 'Invalid username (max 50 characters)' });
        }

        // Verify signature
        if (signature) {
            const message = `Set username: ${username}`;
            if (!verifySignature(walletAddress, message, signature)) {
                return res.status(401).json({ error: 'Invalid signature' });
            }
        }

        const [result] = await db.execute(
            'UPDATE users u JOIN user_wallets uw ON u.id = uw.user_id SET u.name = ?, u.updated_at = CURRENT_TIMESTAMP WHERE uw.wallet_address = ?',
            [username, walletAddress]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Player not found' });
        }

        res.json({ success: true, message: 'Username updated' });

    } catch (error) {
        console.error('Update username error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get game statistics
app.get('/api/stats', async (req, res) => {
    try {
        const queries = [
            'SELECT COUNT(*) as count FROM users',
            'SELECT COUNT(*) as count FROM game_logs',
            'SELECT AVG(session_score) as avg FROM game_logs',
            'SELECT MAX(session_score) as max FROM game_logs',
            'SELECT COUNT(*) as count FROM game_logs WHERE DATE(created_at) = CURRENT_DATE'
        ];

        const results = await Promise.all(
            queries.map(query => db.execute(query).then(([rows]) => rows[0]))
        );

        res.json({
            totalPlayers: results[0].count,
            totalSessions: results[1].count,
            averageScore: Math.round(results[2].avg || 0),
            highestScore: results[3].max || 0,
            todaySessions: results[4].count
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get weekly leaderboard history
app.get('/api/leaderboard/history', async (req, res) => {
    try {
        const { weeks = 4 } = req.query;
        
        const [weeks_data] = await db.execute(
            `SELECT DISTINCT week_start, week_end 
             FROM weekly_leaderboard 
             ORDER BY week_start DESC 
             LIMIT ?`,
            [parseInt(weeks)]
        );

        const history = await Promise.all(
            weeks_data.map(async (week) => {
                const [entries] = await db.execute(
                    `SELECT wl.rank_position, uw.wallet_address, u.name as username, wl.best_score
                     FROM weekly_leaderboard wl
                     JOIN users u ON wl.user_id = u.id
                     LEFT JOIN user_wallets uw ON u.id = uw.user_id AND uw.is_primary = TRUE
                     WHERE wl.week_start = ?
                     ORDER BY wl.rank_position ASC
                     LIMIT 10`,
                    [week.week_start]
                );

                return {
                    weekStart: week.week_start,
                    weekEnd: week.week_end,
                    leaderboard: entries.map(entry => ({
                        rank: entry.rank_position,
                        walletAddress: entry.wallet_address ? (entry.wallet_address.slice(0, 6) + '...' + entry.wallet_address.slice(-4)) : 'N/A',
                        username: entry.username || 'Anonymous',
                        score: entry.best_score
                    }))
                };
            })
        );

        res.json({ history });

    } catch (error) {
        console.error('Leaderboard history error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard history' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
async function startServer() {
    try {
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log(`🐕 UglyDog backend server running on port ${PORT}`);
            console.log(`Database: MySQL (${dbConfig.database})`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    try {
        if (db) {
            await db.end();
            console.log('Database connection closed');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    try {
        if (db) {
            await db.end();
            console.log('Database connection closed');
        }
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

// Start the server
startServer();
