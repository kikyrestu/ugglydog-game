# 🗄️ UGLYDOG GAME - DATABASE SCHEMA OVERVIEW 

## 📋 **TABEL UTAMA YANG ADA**

### **1. 👤 `users` - Tabel User Utama**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,                    -- Nama player
    email VARCHAR(255) UNIQUE NOT NULL,            -- Email unique
    email_verified_at TIMESTAMP NULL,              -- Verifikasi email
    password VARCHAR(255) NOT NULL,                -- Password hash
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
**Fungsi:** Base user authentication, traditional login system

---

### **2. 💰 `user_wallets` - Wallet Management**
```sql
CREATE TABLE user_wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                          -- Link ke users
    wallet_address VARCHAR(42) UNIQUE NOT NULL,    -- Ethereum address
    wallet_type ENUM('metamask', 'walletconnect', 'coinbase', 'other'),
    is_primary BOOLEAN DEFAULT FALSE,              -- Wallet utama
    is_verified BOOLEAN DEFAULT FALSE,             -- Status verifikasi
    last_used_at TIMESTAMP NULL,                   -- Terakhir digunakan
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
**Fungsi:** 
- Multiple wallet per user
- Web3 integration
- Primary wallet selection
- Wallet verification status

---

### **3. 🎮 `user_game_profiles` - Profile Gaming**
```sql
CREATE TABLE user_game_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                          -- Link ke users
    total_score INT DEFAULT 0,                     -- Total score sepanjang masa
    best_session INT DEFAULT 0,                    -- Best score dalam satu session
    total_sessions INT DEFAULT 0,                  -- Jumlah game session
    evolution_level INT DEFAULT 0,                 -- Level evolution UglyDog
    current_savepoint INT DEFAULT 0,               -- Save checkpoint
    last_play_date DATE DEFAULT NULL,              -- Terakhir main
    game_settings JSON DEFAULT NULL,               -- Setting preferences
    achievements JSON DEFAULT NULL,                -- Achievement badges
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```
**Fungsi:**
- Game progress tracking
- Evolution system data
- Personal best records
- Achievement system
- Game preferences

---

### **4. 📊 `game_logs` - Session Logs**
```sql
CREATE TABLE game_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                          -- Link ke users
    wallet_id INT NULL,                           -- Optional wallet yang digunakan
    session_score INT NOT NULL,                    -- Score session ini
    savepoint_score INT DEFAULT 0,                -- Score dari savepoint
    evolution_level INT DEFAULT 0,                -- Level saat main
    misses INT DEFAULT 0,                         -- Jumlah miss dalam session
    bonus_collected JSON DEFAULT NULL,            -- Bonus yang dikumpulkan
    traps_hit JSON DEFAULT NULL,                  -- Trap yang kena
    play_duration INT DEFAULT NULL,               -- Durasi bermain (detik)
    game_mode ENUM('normal', 'bonus', 'challenge'),
    signature TEXT DEFAULT NULL,                   -- Web3 signature verification
    ip_address VARCHAR(45),                        -- IP tracking
    user_agent TEXT,                              -- Browser tracking
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (wallet_id) REFERENCES user_wallets(id)
);
```
**Fungsi:**
- Detail setiap game session
- Analytics data
- Anti-cheat tracking
- Performance metrics

---

### **5. 🏆 `weekly_leaderboard` - Leaderboard Mingguan**
```sql
CREATE TABLE weekly_leaderboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                          -- Link ke users
    week_start DATE NOT NULL,                      -- Mulai minggu
    week_end DATE NOT NULL,                        -- Akhir minggu
    best_score INT NOT NULL,                       -- Best score minggu ini
    total_sessions INT DEFAULT 0,                  -- Total session minggu ini
    total_score INT DEFAULT 0,                     -- Total score minggu ini
    rank_position INT DEFAULT NULL,                -- Posisi ranking
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_week (user_id, week_start)
);
```
**Fungsi:**
- Weekly competition
- Ranking system
- Historical leaderboard data

---

## 🔄 **RELASI ANTAR TABEL**

```
users (1) ──→ (N) user_wallets
  │
  ├─→ (1) user_game_profiles  
  │
  ├─→ (N) game_logs
  │
  └─→ (N) weekly_leaderboard

user_wallets (1) ──→ (N) game_logs [OPTIONAL]
```

---

## 📊 **CONTOH DATA FLOW**

### **1. User Registration:**
```sql
-- Insert new user
INSERT INTO users (name, email, password) VALUES (?, ?, ?);

-- Create game profile  
INSERT INTO user_game_profiles (user_id, total_score, evolution_level) 
VALUES (?, 0, 0);
```

### **2. Connect Wallet:**
```sql
INSERT INTO user_wallets (user_id, wallet_address, wallet_type, is_primary)
VALUES (?, ?, 'metamask', TRUE);
```

### **3. Save Game Session:**
```sql
-- Log the session
INSERT INTO game_logs (user_id, wallet_id, session_score, misses, play_duration)
VALUES (?, ?, ?, ?, ?);

-- Update user profile
UPDATE user_game_profiles 
SET total_score = total_score + ?, 
    best_session = GREATEST(best_session, ?),
    total_sessions = total_sessions + 1,
    last_play_date = CURDATE()
WHERE user_id = ?;
```

### **4. Update Weekly Leaderboard:**
```sql
INSERT INTO weekly_leaderboard (user_id, week_start, week_end, best_score)
VALUES (?, ?, ?, ?)
ON DUPLICATE KEY UPDATE 
best_score = GREATEST(best_score, VALUES(best_score)),
total_sessions = total_sessions + 1;
```

---

## 🛡️ **FITUR KEAMANAN**

### **Anti-Cheat Measures:**
- `ip_address` tracking
- `user_agent` verification  
- `signature` untuk Web3 verification
- `play_duration` untuk detect impossible scores

### **Data Integrity:**
- Foreign key constraints
- Unique constraints
- JSON validation untuk complex data
- Proper indexing untuk performance

---

## 🚀 **API ENDPOINTS YANG TERSEDIA**

### **Authentication:**
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/connect-wallet` - Connect Web3 wallet

### **Game Operations:**
- `POST /api/save-score` - Save game score
- `GET /api/leaderboard` - Get weekly leaderboard
- `GET /api/profile/:userId` - Get user profile
- `POST /api/update-profile` - Update game settings

### **Analytics:**
- `GET /api/user-stats/:userId` - User statistics
- `GET /api/game-logs/:userId` - User game history

---

## 💡 **REKOMENDASI TAMBAHAN**

### **Tabel yang Bisa Ditambah:**
1. **`achievements`** - Achievement system yang lebih detail
2. **`daily_challenges`** - Daily challenge system
3. **`tournaments`** - Tournament/event system
4. **`user_friends`** - Social features
5. **`nft_rewards`** - NFT reward system

### **Optimisasi:**
1. **Partitioning** untuk `game_logs` berdasarkan tanggal
2. **Archiving** old leaderboard data
3. **Caching** untuk frequent queries
4. **Analytics views** untuk reporting

---

Gimana bro? Udah jelas struktur database-nya? Ada yang mau didiskusikan lebih lanjut? 🤔
