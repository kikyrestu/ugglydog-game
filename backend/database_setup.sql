-- UglyDog Game Database Setup Script
-- Run this script in your MySQL database to create the initial structure

CREATE DATABASE IF NOT EXISTS uglydog_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE uglydog_game;

-- Users table (Laravel standard structure)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User wallets table (separate table for wallet management)
CREATE TABLE IF NOT EXISTS user_wallets (
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
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- User game profiles table (game-specific data)
CREATE TABLE IF NOT EXISTS user_game_profiles (
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
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Game logs table (updated to reference user_id)
CREATE TABLE IF NOT EXISTS game_logs (
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
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Weekly leaderboard table (updated to reference user_id)
CREATE TABLE IF NOT EXISTS weekly_leaderboard (
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
) ENGINE=InnoDB CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insert sample data for testing (optional)
INSERT IGNORE INTO users (id, name, email, password, created_at) VALUES
(1, 'Test Player 1', 'player1@uglydog.game', '$2y$10$example.hash.here', NOW()),
(2, 'Test Player 2', 'player2@uglydog.game', '$2y$10$example.hash.here', NOW()),
(3, 'Test Player 3', 'player3@uglydog.game', '$2y$10$example.hash.here', NOW());

INSERT IGNORE INTO user_wallets (user_id, wallet_address, wallet_type, is_primary, is_verified) VALUES
(1, '0x742d35Cc6634C0532925a3b8D6Ac8C6f53b2C1E5', 'metamask', TRUE, TRUE),
(2, '0x8ba1f109551bD432803012645Hac136c3C8B8B8B', 'metamask', TRUE, TRUE),
(3, '0x1234567890123456789012345678901234567890', 'metamask', TRUE, TRUE);

INSERT IGNORE INTO user_game_profiles (user_id, total_score, best_session, evolution_level, current_savepoint) VALUES
(1, 150, 150, 2, 100),
(2, 89, 89, 1, 50),
(3, 234, 234, 3, 200);

-- Show created tables
SHOW TABLES;

-- Show table structures
DESCRIBE users;
DESCRIBE user_wallets;
DESCRIBE user_game_profiles;
