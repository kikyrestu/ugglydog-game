'use client'
import React, { useState, useEffect, useCallback } from 'react'

// Level system based on score - Simple and clean
const GAME_LEVELS = [
  { level: 1, name: 'Easy', minScore: 0, maxScore: 29, color: '#86FF00', difficulty: 'Beginner' },
  { level: 2, name: 'Easy', minScore: 30, maxScore: 59, color: '#86FF00', difficulty: 'Easy' },
  { level: 3, name: 'Easy+', minScore: 60, maxScore: 99, color: '#86FF00', difficulty: 'Easy Plus' },
  { level: 4, name: 'Medium', minScore: 100, maxScore: 149, color: '#fbbf24', difficulty: 'Medium' },
  { level: 5, name: 'Medium', minScore: 150, maxScore: 199, color: '#fbbf24', difficulty: 'Medium+' },
  { level: 6, name: 'Medium+', minScore: 200, maxScore: 299, color: '#fbbf24', difficulty: 'Challenging' },
  { level: 7, name: 'Hard', minScore: 300, maxScore: 399, color: '#ef4444', difficulty: 'Hard' },
  { level: 8, name: 'Hard', minScore: 400, maxScore: 549, color: '#ef4444', difficulty: 'Very Hard' },
  { level: 9, name: 'Expert', minScore: 550, maxScore: 749, color: '#ef4444', difficulty: 'Expert' },
  { level: 10, name: 'Ultimate', minScore: 750, maxScore: 9999, color: '#8b5cf6', difficulty: 'Ultimate' }
]

// SIMPLIFIED: No more trap system - pure UglyDog clicking game!
// Removed all trap-related constants for cleaner gameplay

export default function NativeUglyDogGame() {
  const [gameState, setGameState] = useState({
    score: 0,
    misses: 0,
    health: 3,
    gameActive: false,
    highestScore: 0,
    level: 1
  })
  
  const [dogPosition, setDogPosition] = useState({ x: 50, y: 50 })
  // SIMPLIFIED: No trap system - empty array for any remaining references
  const traps = []
  const [leaderboard, setLeaderboard] = useState([])
  const [gameStats, setGameStats] = useState({
    totalClicks: 0,
    accuracy: 100,
    gameTime: 0
  })
  const [currentDogId, setCurrentDogId] = useState(0)
  const [autoMissTimer, setAutoMissTimer] = useState(null)
  const [countdownInterval, setCountdownInterval] = useState(null)
  const [previousLevel, setPreviousLevel] = useState(1)
  const [dogClickable, setDogClickable] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [dogTimeoutState, setDogTimeoutState] = useState(false)

  // Get current level based on score
  const getCurrentLevel = useCallback(() => {
    for (let i = GAME_LEVELS.length - 1; i >= 0; i--) {
      if (gameState.score >= GAME_LEVELS[i].minScore) {
        return GAME_LEVELS[i]
      }
    }
    return GAME_LEVELS[0]
  }, [gameState.score])

  const currentLevel = getCurrentLevel()

  // Clear all timers - ENHANCED UTILITY FUNCTION (MOVED UP TO FIX INITIALIZATION ERROR)
  const clearAllTimers = useCallback(() => {
    // Clear auto-miss timer
    if (autoMissTimer) {
      clearTimeout(autoMissTimer)
      setAutoMissTimer(null)
    }
    
    // Clear countdown interval
    if (countdownInterval) {
      clearInterval(countdownInterval)
      setCountdownInterval(null)
    }
    
    // Reset countdown display
    setCountdown(0)
  }, [autoMissTimer, countdownInterval])

  // Get game difficulty settings for SPAWN-DISAPPEAR MODE - SIMPLIFIED (No traps!)
  const getDifficultySettings = useCallback(() => {
    const level = currentLevel.level
    
    if (level <= 2) {
      return {
        spawnDelay: 2000,      // 2 seconds between spawns (easy)
        autoMissTimer: 5000,   // 5 seconds before disappear (forgiving)
        showCountdown: false   // No pressure countdown for beginners
      }
    } else if (level <= 4) {
      return {
        spawnDelay: 1800,      // 1.8 seconds between spawns
        autoMissTimer: 4000,   // 4 seconds before disappear
        showCountdown: true
      }
    } else if (level <= 6) {
      return {
        spawnDelay: 1500,      // 1.5 seconds between spawns
        autoMissTimer: 3500,   // 3.5 seconds before disappear
        showCountdown: true
      }
    } else if (level <= 8) {
      return {
        spawnDelay: 1200,      // 1.2 seconds between spawns (getting intense!)
        autoMissTimer: 3000,   // 3 seconds before disappear
        showCountdown: true
      }
    } else {
      return {
        spawnDelay: 1000,      // 1 second between spawns (ultimate challenge!)
        autoMissTimer: 2500,   // 2.5 seconds before disappear (very challenging!)
        showCountdown: true
      }
    }
  }, [currentLevel.level])

  // SIMPLIFIED: No more trap system - pure UglyDog clicking!

  // SPAWN-DISAPPEAR SYSTEM - UglyDog appears and disappears randomly!
  const spawnUglyDog = useCallback(() => {
    if (!gameState.gameActive) return
    
    console.log('🎯 SPAWN-DISAPPEAR MODE: New UglyDog appearing!')
    
    // Generate random position for new spawn
    const newDogPosition = {
      x: Math.random() * 10 + 45, // ULTRA SAFE: 45-55% range (absolute center only!)
      y: Math.random() * 10 + 45  // ULTRA SAFE: 45-55% range (absolute center only!)
    }
    
    // SIMPLIFIED: No more traps! Pure UglyDog spawning
    
    // Spawn UglyDog at new position
    setDogPosition(newDogPosition)
    // REMOVED: setTraps - no more trap system!
    setDogClickable(true)
    setCurrentDogId(prev => prev + 1)
    setDogTimeoutState(false)
    setCountdown(0)
    
    // Auto-disappear after some time if not clicked (adds pressure!)
    const difficulty_settings = getDifficultySettings()
    const disappearTime = difficulty_settings.autoMissTimer || 4000 // 4 seconds default
    
    // Store timer reference for proper cleanup
    const autoMissTimeoutId = setTimeout(() => {
      if (gameState.gameActive && dogClickable) {
        console.log('⏰ UglyDog disappeared! Player missed it!')
        handleAutoMiss()
      }
    }, disappearTime)
    
    // Store the timer ID for cleanup
    setAutoMissTimer(autoMissTimeoutId)
    
  }, [gameState.gameActive, dogClickable, getDifficultySettings, currentLevel.level])

  // Handle auto-miss when UglyDog disappears
  const handleAutoMiss = useCallback(() => {
    if (!gameState.gameActive || !dogClickable) return
    
    console.log('💨 UglyDog disappeared - counting as miss!')
    
    // Clear the auto-miss timer first to prevent duplicate calls
    clearAllTimers()
    setDogClickable(false)
    setDogTimeoutState(true)
    
    // Create disappear effect
    createTimeoutEffect(dogPosition.x, dogPosition.y)
    
    // Count miss directly here (avoid circular dependency)
    const newMisses = gameState.misses + 1
    let newHealth = gameState.health
    let newScore = gameState.score

    if (newMisses >= 3) {
      console.log('3 misses reached, reducing health')
      newHealth = gameState.health - 1
      newScore = Math.max(0, gameState.score - 10)
      
      if (newHealth <= 0) {
        console.log('Health depleted, stopping game')
        stopGame()
        return
      }
      
      setGameState(prev => ({
        ...prev,
        misses: 0,
        health: newHealth,
        score: newScore
      }))
    } else {
      console.log(`Miss count: ${newMisses}/3`)
      setGameState(prev => ({
        ...prev,
        misses: newMisses
      }))
    }
    
    setGameStats(prev => ({
      ...prev,
      accuracy: Math.round((prev.totalClicks / (prev.totalClicks + newMisses)) * 100)
    }))
    
    // Schedule next spawn after difficulty-based delay
    const difficulty = getDifficultySettings()
    setTimeout(() => {
      if (gameState.gameActive) {
        // Call spawnUglyDog directly to avoid circular dependency
        console.log('🎯 SPAWN-DISAPPEAR MODE: New UglyDog appearing!')
        
        // Generate random position for new spawn
        const newDogPosition = {
          x: Math.random() * 10 + 45, // ULTRA SAFE: 45-55% range (absolute center only!)
          y: Math.random() * 10 + 45  // ULTRA SAFE: 45-55% range (absolute center only!)
        }
        
        // SIMPLIFIED: No more trap spawning! Pure UglyDog game
        
        // Spawn UglyDog at new position
        setDogPosition(newDogPosition)
        // REMOVED: No more trap system!
        setDogClickable(true)
        setCurrentDogId(prev => prev + 1)
        setDogTimeoutState(false)
        setCountdown(0)
        
        // Auto-disappear after some time if not clicked (adds pressure!)
        const disappearTime = difficulty_settings.autoMissTimer || 4000 // 4 seconds default
        
        // Store timer reference for proper cleanup
        const autoMissTimeoutId = setTimeout(() => {
          if (gameState.gameActive && dogClickable) {
            console.log('⏰ UglyDog disappeared! Player missed it!')
            handleAutoMiss()
          }
        }, disappearTime)
        
        // Store the timer ID for cleanup
        setAutoMissTimer(autoMissTimeoutId)
      }
    }, difficulty.spawnDelay) // Dynamic spawn delay based on level
  }, [gameState.gameActive, gameState.misses, gameState.health, gameState.score, dogClickable, dogPosition, clearAllTimers, getDifficultySettings, currentLevel.level])

  // Check for level up - SIMPLIFIED (removed evolution complexity)
  useEffect(() => {
    if (currentLevel.level > previousLevel && gameState.gameActive) {
      console.log(`Level up detected: ${previousLevel} → ${currentLevel.level}`)
      
      // Clear all timers first to prevent conflicts during transition
      clearAllTimers()
      
      // Just update the previous level, no popup needed
      setPreviousLevel(currentLevel.level)
    }
  }, [currentLevel.level, previousLevel, gameState.gameActive, clearAllTimers])

  // PURE INSTANT MODE: No auto-miss system - pure clicking speed challenge!
  // Players can take their time, focus is on accuracy and clicking speed

  // Start game - SPAWN-DISAPPEAR MODE
  const startGame = () => {
    console.log('🎯 Starting Spawn-Disappear Mode game!')
    
    // Clear any existing timers first
    clearAllTimers()
    
    setGameState(prev => ({
      ...prev,
      gameActive: true,
      score: 0,
      misses: 0,
      health: 3,
      level: 1
    }))
    setGameStats({
      totalClicks: 0,
      accuracy: 100,
      gameTime: 0
    })
    // REMOVED: No more trap system!
    setPreviousLevel(1)
    setCurrentDogId(0)
    setDogClickable(true)
    setCountdown(0)
    setDogTimeoutState(false)
    
    // Start first UglyDog spawn
    setTimeout(() => {
      if (gameState.gameActive) {
        spawnUglyDog()
      }
    }, 1000) // 1 second delay for game start
  }

  // Stop game - SPAWN-DISAPPEAR MODE
  const stopGame = useCallback(() => {
    console.log('🛑 Stopping Spawn-Disappear Mode game...')
    
    // Clear all timers first to prevent any lingering effects
    clearAllTimers()
    
    setGameState(prev => {
      const newHighest = Math.max(prev.score, prev.highestScore)
      return {
        ...prev,
        gameActive: false,
        highestScore: newHighest
      }
    })
    
    // REMOVED: No more trap system!
    setDogClickable(false)
    setCountdown(0)
    setDogTimeoutState(false)
    
    // Submit score to backend
    if (gameState.score > 0) {
      submitScore(gameState.score)
    }
  }, [clearAllTimers, gameState.score])

  // Create click effect - ENHANCED (MOVED UP TO FIX INITIALIZATION)
  const createClickEffect = (x, y) => {
    const effect = document.createElement('div')
    effect.style.position = 'fixed'
    effect.style.left = x + 'px'
    effect.style.top = y + 'px'
    effect.style.color = '#86FF00'
    effect.style.fontSize = '24px'
    effect.style.fontWeight = 'bold'
    effect.style.pointerEvents = 'none'
    effect.style.zIndex = '9999'
    effect.style.animation = 'float-up 1.2s ease-out forwards'
    effect.style.textShadow = '0 0 10px #86FF00'
    effect.textContent = '+1 ✨'
    
    document.body.appendChild(effect)
    setTimeout(() => effect.remove(), 1200)
  }

  // Handle UglyDog click - SIMPLIFIED: Pure UglyDog clicking game!
  const handleUglyDogClick = useCallback((e) => {
    e.stopPropagation()
    // Strict guards to prevent double execution
    if (!gameState.gameActive || !dogClickable) return

    console.log('🎯 UglyDog caught! +1 Score, UglyDog disappears!')
    
    // Clear auto-miss timer immediately to prevent conflicts
    clearAllTimers()
    
    // Immediately disable clicking and make UglyDog disappear
    setDogClickable(false)
    
    // Update score
    setGameState(prev => ({
      ...prev,
      score: prev.score + 1
    }))
    
    // Update stats
    setGameStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      accuracy: Math.round(((prev.totalClicks + 1) / (prev.totalClicks + 1 + gameState.misses)) * 100)
    }))

    // Create click effect
    createClickEffect(e.clientX, e.clientY)
    
    // 🎯 SIMPLIFIED: UglyDog disappears and respawns immediately
    console.log('💨 UglyDog disappears! Spawning new one...')
    
    // Make UglyDog disappear with animation
    setDogTimeoutState(true) // Trigger disappear animation
    
    // SIMPLIFIED: No more traps! Just spawn new UglyDog after short delay
    setTimeout(() => {
      if (gameState.gameActive) {
        console.log('🐕 Spawning new UglyDog for next round')
        spawnUglyDog() // Just spawn new UglyDog normally
      }
    }, 100) // Quick respawn for smooth gameplay
  }, [gameState.gameActive, gameState.misses, dogClickable, clearAllTimers, createClickEffect, spawnUglyDog])

  // Handle miss click - ENHANCED LOGGING
  const handleMissClick = useCallback(() => {
    if (!gameState.gameActive) return

    console.log('Miss click registered')
    
    const newMisses = gameState.misses + 1
    let newHealth = gameState.health
    let newScore = gameState.score

    if (newMisses >= 3) {
      console.log('3 misses reached, reducing health')
      newHealth = gameState.health - 1
      newScore = Math.max(0, gameState.score - 10)
      
      if (newHealth <= 0) {
        console.log('Health depleted, stopping game')
        stopGame()
        return
      }
      
      setGameState(prev => ({
        ...prev,
        misses: 0,
        health: newHealth,
        score: newScore
      }))
    } else {
      console.log(`Miss count: ${newMisses}/3`)
      setGameState(prev => ({
        ...prev,
        misses: newMisses
      }))
    }
    
    setGameStats(prev => ({
      ...prev,
      accuracy: Math.round((prev.totalClicks / (prev.totalClicks + newMisses)) * 100)
    }))
  }, [gameState])

  // STANDARDIZED: Create timeout effect - consistent with other feedback
  const createTimeoutEffect = (x, y) => {
    const effect = document.createElement('div')
    effect.style.position = 'fixed'
    effect.style.left = `${x}%`
    effect.style.top = `${y}%`
    effect.style.color = '#ef4444'
    effect.style.fontSize = '22px' // STANDARDIZED: Same size as other effects
    effect.style.fontWeight = 'bold'
    effect.style.pointerEvents = 'none'
    effect.style.zIndex = '9999'
    effect.style.animation = 'float-up 1.2s ease-out forwards' // STANDARDIZED: Same animation
    effect.style.textShadow = '0 0 12px #ef4444' // STANDARDIZED: Same glow pattern
    effect.style.transform = 'translate(-50%, -50%)'
    effect.style.border = '2px solid #ef4444'
    effect.style.borderRadius = '8px' // STANDARDIZED: Same border radius
    effect.style.padding = '6px 12px' // STANDARDIZED: Same padding
    effect.style.background = 'rgba(239, 68, 68, 0.15)' // STANDARDIZED: Same background opacity
    effect.style.backdropFilter = 'blur(2px)' // STANDARDIZED: Same blur
    effect.textContent = '⏰ TIMEOUT!'
    
    document.body.appendChild(effect)
    setTimeout(() => effect.remove(), 1200) // STANDARDIZED: Same cleanup time
  }
  // Submit score to backend
  const submitScore = async (score) => {
    try {
      const response = await fetch('http://localhost:3005/api/submit-score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: score,
          username: 'Player',
          evolution_stage: `Level ${currentLevel.level}`
        })
      })
      
      if (response.ok) {
        fetchLeaderboard()
      }
    } catch (error) {
      console.log('Score submission failed:', error)
    }
  }

  // Fetch leaderboard
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3005/api/leaderboard')
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.slice(0, 5))
      }
    } catch (error) {
      console.log('Leaderboard fetch failed:', error)
    }
  }

  // Game timer
  useEffect(() => {
    if (gameState.gameActive) {
      const timer = setInterval(() => {
        setGameStats(prev => ({
          ...prev,
          gameTime: prev.gameTime + 1
        }))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameState.gameActive])

  // Cleanup timers on unmount - ENHANCED CLEANUP
  useEffect(() => {
    return () => {
      console.log('Component unmounting, cleaning up all timers and effects...')
      
      // Clear all game timers
      clearAllTimers()
      
      // Clean up any remaining visual effects
      const timeoutEffects = document.querySelectorAll('div[style*="timeout-miss-float"]')
      timeoutEffects.forEach(effect => {
        if (effect && effect.parentNode) {
          // Clear any pending cleanup timeouts
          if (effect.cleanupTimeoutId) {
            clearTimeout(effect.cleanupTimeoutId)
          }
          effect.parentNode.removeChild(effect)
        }
      })
      
      // Remove any remaining timeout shake classes
      const gameContainer = document.querySelector('.native-uglydog-game')
      if (gameContainer) {
        gameContainer.classList.remove('timeout-shake')
      }
      
      // Remove any remaining miss highlight classes
      const missIndicator = document.querySelector('.miss-indicator')
      if (missIndicator) {
        missIndicator.classList.remove('miss-highlight')
      }
    }
  }, [clearAllTimers])

  // Load leaderboard on mount
  useEffect(() => {
    fetchLeaderboard()
  }, [])

  return (
    <>
      <style jsx>{`
        /* SIMPLIFIED: Z-Index Hierarchy Management (No more traps!) */
        /* Layer 1 (z-index: 1-5): Background elements */
        /* Layer 2 (z-index: 10-15): [REMOVED] Game elements (traps) */
        /* Layer 3 (z-index: 20-25): Primary targets (UglyDog) */
        /* Layer 4 (z-index: 30-50): UI overlays (level indicator, instructions) */
        /* Layer 5 (z-index: 9999): Feedback effects (click effects) */
        
        .native-uglydog-game {
          width: 100%;
          background: linear-gradient(135deg, #1A222C 0%, #1E2835 100%);
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.0784313725);
          overflow: hidden;
        }
        
        .game-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          padding: 20px;
          background: rgba(30, 40, 53, 0.5);
          border-bottom: 1px solid rgba(255, 255, 255, 0.0784313725);
        }
        
        .stat-item {
          text-align: center;
          padding: 10px;
          border-radius: 10px;
          background: rgba(30, 40, 53, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        
        .stat-item:hover {
          background: rgba(134, 255, 0, 0.1);
          border-color: rgba(134, 255, 0, 0.2);
        }
        
        .stat-icon {
          font-size: 20px;
          margin-bottom: 5px;
          display: block;
        }
        
        .stat-label {
          font-size: 11px;
          color: #798DA3;
          margin-bottom: 3px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-value {
          font-size: 16px;
          color: #86FF00;
          font-weight: bold;
          text-shadow: 0 0 8px rgba(134, 255, 0, 0.3);
        }
        
        .game-canvas {
          position: relative;
          height: 350px;
          background: linear-gradient(135deg, #1A222C 0%, #1E2835 100%);
          cursor: crosshair;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 255, 255, 0.0784313725);
        }
        
        .uglydog {
          position: absolute;
          cursor: pointer;
          transition: all 0.3s ease;
          user-select: none;
          z-index: 20; /* SIMPLIFIED: Higher priority for primary target */
          animation: spawn-appear 0.3s ease-out;
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.3));
          font-size: 50px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
        }
        
        @keyframes spawn-appear {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0);
            filter: drop-shadow(0 0 20px rgba(134, 255, 0, 0.8));
          }
          50% { 
            opacity: 0.8; 
            transform: translate(-50%, -50%) scale(1.2);
            filter: drop-shadow(0 0 15px rgba(134, 255, 0, 0.6));
          }
          100% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.3));
          }
        }
        
        .uglydog:hover {
          transform: translate(-50%, -50%) scale(1.15) rotate(3deg);
          filter: brightness(1.2) drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
        }
        
        .uglydog.not-clickable {
          opacity: 0.6;
          filter: grayscale(50%);
          cursor: not-allowed;
        }
        
        .uglydog.timeout-fade {
          animation: true-disappear 0.5s ease-out forwards;
          pointer-events: none;
        }
        
        @keyframes true-disappear {
          0% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
            filter: brightness(1);
          }
          50% { 
            opacity: 0.5; 
            transform: translate(-50%, -50%) scale(0.3);
            filter: brightness(2);
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0);
            filter: brightness(0);
          }
          }
        }
        
        /* SIMPLIFIED: No more trap system - CSS removed for cleaner codebase */
        
        /* Non-intrusive timer system */
        .peripheral-timer-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 5;
        }
        
        .peripheral-timer-glow.normal {
          box-shadow: 0 0 15px rgba(134, 255, 0, 0.3);
          animation: glow-normal 2s infinite ease-in-out;
        }
        
        .peripheral-timer-glow.warning {
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
          animation: glow-warning 1s infinite ease-in-out;
        }
        
        .peripheral-timer-glow.danger {
          box-shadow: 0 0 25px rgba(239, 68, 68, 0.7);
          animation: glow-danger 0.5s infinite ease-in-out;
        }
        
        .peripheral-timer-border {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top: 3px solid var(--timer-color);
          animation: timer-progress 1s linear;
          pointer-events: none;
          z-index: 6;
          opacity: 0.7;
        }
        
        .peripheral-timer-corner {
          position: absolute;
          top: 15px;
          right: 15px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: bold;
          z-index: 15;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .peripheral-timer-corner.normal {
          background: rgba(134, 255, 0, 0.2);
          color: #86FF00;
          border: 1px solid rgba(134, 255, 0, 0.3);
        }
        
        .peripheral-timer-corner.warning {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
          animation: subtle-pulse-timer 1s infinite ease-in-out;
        }
        
        .peripheral-timer-corner.danger {
          background: rgba(239, 68, 68, 0.3);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.4);
          animation: danger-pulse-timer 0.5s infinite ease-in-out;
        }
        
        .timer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: dot-pulse 2s infinite ease-in-out;
        }
        
        .timer-text {
          min-width: 12px;
          text-align: center;
        }
        
        @keyframes glow-normal {
          0%, 100% { box-shadow: 0 0 15px rgba(134, 255, 0, 0.3); }
          50% { box-shadow: 0 0 20px rgba(134, 255, 0, 0.5); }
        }
        
        @keyframes glow-warning {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.5); }
          50% { box-shadow: 0 0 25px rgba(251, 191, 36, 0.7); }
        }
        
        @keyframes glow-danger {
          0%, 100% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.7); }
          50% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.9); }
        }
        
        @keyframes timer-progress {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes subtle-pulse-timer {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        
        @keyframes danger-pulse-timer {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        
        @keyframes dot-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes subtle-pulse {
          0%, 100% { 
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.4));
          }
          50% { 
            filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
          }
        }
        
        @keyframes danger-pulse {
          0%, 100% { 
            filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.3));
          }
          50% { 
            filter: drop-shadow(0 0 10px rgba(255, 100, 100, 0.5));
          }
        }
        
        @keyframes breathe-indicator {
          0%, 100% { 
            opacity: 0.4; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.8; 
            transform: scale(1.05);
          }
        }
        
        .game-controls {
          padding: 20px;
          text-align: center;
          background: rgba(30, 40, 53, 0.3);
        }
        
        .start-stop-text {
          color: #798DA3;
          margin-bottom: 15px;
          font-size: 14px;
        }
        
        .evolution-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #86FF00;
          border-radius: 15px;
          padding: 30px;
          text-align: center;
          z-index: 1000;
          animation: evolve-in 0.5s ease-out;
          backdrop-filter: blur(10px);
        }
        
        .evolution-popup.level-transition-popup {
          max-width: 400px;
          padding: 35px;
          border: 2px solid;
          box-shadow: 0 0 20px rgba(134, 255, 0, 0.3);
        }
        
        .evolution-emoji {
          font-size: 3rem;
          display: block;
          margin-bottom: 10px;
          animation: bounce 0.6s ease-out;
        }
        
        .evolution-title {
          font-size: 1.3rem;
          font-weight: bold;
          color: #86FF00;
          margin-bottom: 5px;
          text-shadow: 0 0 10px currentColor;
        }
        
        .evolution-name {
          font-size: 1.1rem;
          color: white;
          opacity: 0.9;
        }
        
        .game-over-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 350px;
          color: #798DA3;
        }
        
        .game-over-icon {
          font-size: 64px;
          margin-bottom: 20px;
          animation: float 3s infinite ease-in-out;
        }
        
        .miss-indicators {
          display: flex;
          justify-content: center;
          gap: 5px;
          margin-top: 10px;
        }
        
        .miss-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }
        
        .miss-dot.active {
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
        }
        
        @keyframes float {
          0% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
          100% { transform: translate(-50%, -50%) translateY(0px); }
        }
        
        @keyframes evolve-in {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes bounce {
          0% { transform: scale(0.3); }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        
        @keyframes float-up {
          0% { 
            opacity: 1; 
            transform: translateY(0px); 
          }
          100% { 
            opacity: 0; 
            transform: translateY(-50px); 
          }
        }
        
        @keyframes timeout-miss-float {
          0% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) translateY(0px);
          }
          20% { 
            transform: translate(-50%, -50%) scale(1.2) translateY(-10px);
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8) translateY(-60px);
          }
        }
        
        /* Miss Counter Highlight Animation */
        @keyframes miss-highlight {
          0%, 100% { 
            background: rgba(239, 68, 68, 0.1);
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
            transform: scale(1);
          }
          25% { 
            background: rgba(239, 68, 68, 0.3);
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
            transform: scale(1.05);
          }
          75% { 
            background: rgba(239, 68, 68, 0.2);
            box-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
            transform: scale(1.02);
          }
        }
        
        .miss-highlight {
          animation: miss-highlight 1.5s ease-in-out;
          border: 2px solid #ef4444 !important;
        }
        
        /* Screen Shake Effect for Timeout */
        @keyframes timeout-shake {
          0%, 100% { transform: translateX(0px); }
          10% { transform: translateX(-2px); }
          20% { transform: translateX(2px); }
          30% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          50% { transform: translateX(-1px); }
          60% { transform: translateX(1px); }
          70% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
          90% { transform: translateX(0px); }
        }
        
        .timeout-shake {
          animation: timeout-shake 0.6s ease-in-out;
        }
        
        /* ADDED: Responsive Design Improvements */
        @media (max-width: 768px) {
          .game-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding: 15px;
          }
          
          .stat-item {
            padding: 8px;
            font-size: 0.9rem;
          }
          
          .game-canvas {
            height: 300px; /* Smaller on mobile */
          }
          
          .uglydog img, .trap img {
            width: 50px !important; /* Smaller touch targets */
            height: 50px !important;
          }
          
          .level-indicator {
            font-size: 10px !important;
            padding: 6px 10px !important;
          }
        }
        
        @media (max-width: 480px) {
          .game-stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            padding: 10px;
          }
          
          .uglydog img, .trap img {
            width: 45px !important; /* Even smaller for tiny screens */
            height: 45px !important;
          }
          
          .game-canvas {
            height: 250px;
          }
        }
        
        /* ADDED: High DPI Display Support */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .uglydog img, .trap img {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }
        
        /* ADDED: Landscape Mobile Optimization */
        @media (max-height: 500px) and (orientation: landscape) {
          .game-stats-grid {
            grid-template-columns: repeat(4, 1fr);
            padding: 8px;
          }
          
          .game-canvas {
            height: 200px;
          }
        }
      `}</style>

      <div className="native-uglydog-game">
        {/* Game Stats */}
        <div className="game-stats-grid">
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <div className="stat-label">Score</div>
            <div className="stat-value">{gameState.score}</div>
          </div>
          
          <div className="stat-item miss-indicator">
            <span className="stat-icon">❌</span>
            <div className="stat-label">Misses</div>
            <div className="stat-value">{gameState.misses}/3</div>
            <div className="miss-indicators">
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className={`miss-dot ${i <= gameState.misses ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">❤️</span>
            <div className="stat-label">Health</div>
            <div className="stat-value">{gameState.health}</div>
          </div>
          
          <div className="stat-item">
            <img 
              src="/assets/images/img-game/rewards.png" 
              alt="UglyDog"
              className="stat-icon"
              style={{
                width: '24px',
                height: '24px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 4px rgba(134, 255, 0, 0.5))',
                marginBottom: '5px'
              }}
            />
            <div className="stat-label">Level</div>
            <div className="stat-value" style={{ fontSize: '12px' }}>
              Level {currentLevel.level}
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="game-canvas" onClick={handleMissClick}>
          {gameState.gameActive ? (
            <>
              {/* UglyDog - Real Target */}
              <div
                className={`uglydog ${!dogClickable ? 'not-clickable' : ''} ${dogTimeoutState ? 'timeout-fade' : ''}`}
                style={{
                  left: `${dogPosition.x}%`,
                  top: `${dogPosition.y}%`
                }}
                onClick={dogClickable ? handleUglyDogClick : undefined}
              >
                {/* PNG Image for Real UglyDog */}
                <img 
                  src="/assets/images/img-game/ugglydog-original.png" 
                  alt="UglyDog"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 8px rgba(134, 255, 0, 0.5))',
                    transition: 'all 0.3s ease'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '12px',
                  color: '#86FF00',
                  fontWeight: 'bold',
                  textShadow: '0 0 6px rgba(134, 255, 0, 0.8)',
                  pointerEvents: 'none'
                }}>
                  UglyDog
                </div>
                
                {/* 🚀 PURE INSTANT MODE: No timer elements - focus on pure clicking! */}
              </div>
              
              {/* SIMPLIFIED: No more trap system! Pure UglyDog clicking game */}
              
              {/* Level indicator overlay */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'rgba(0, 0, 0, 0.8)',
                color: currentLevel.color,
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                border: `2px solid ${currentLevel.color}`,
                zIndex: 30, // IMPROVED: UI overlay layer
                boxShadow: `0 0 10px ${currentLevel.color}40`
              }}>
                Level {currentLevel.level} - {currentLevel.difficulty}
              </div>
              
              {/* 🚀 PURE INSTANT MODE: No corner timer - clean UI for speed clicking! */}
              
              {/* Enhanced instructions overlay for new players */}
              {gameState.score === 0 && currentLevel.level === 1 && (
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(0, 0, 0, 0.9)',
                  color: '#86FF00',
                  padding: '12px 18px',
                  borderRadius: '15px',
                  fontSize: '11px',
                  zIndex: 15,
                  border: '1px solid #86FF00',
                  textAlign: 'center',
                  maxWidth: '280px',
                  lineHeight: '1.4'
                }}>
                  🎯 SPAWN-DISAPPEAR MODE: Click UglyDog before it disappears!<br/>
                  {currentLevel.level >= 2 && '⚠️ Avoid fake UglyDogs!'}<br/>
                  ⏰ Quick reactions required - stay alert!
                </div>
              )}
            </>
          ) : (
            <div className="game-over-state">
              <div className="game-over-icon">🎮</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                {gameState.health <= 0 ? 'Game Over!' : 'UglyDog Clicker Game'}
              </div>
              <div style={{ fontSize: '14px' }}>
                {gameState.health <= 0 
                  ? `Final Score: ${gameState.score}`
                  : 'Click Start Game to begin!'
                }
              </div>
              {gameState.highestScore > 0 && (
                <div style={{ fontSize: '12px', marginTop: '10px', color: '#86FF00' }}>
                  Best Score: {gameState.highestScore}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Game Controls */}
        <div className="game-controls">
          <div className="start-stop-text">
            {gameState.gameActive ? 'Game is running...' : 'Ready to start?'}
          </div>
          {!gameState.gameActive ? (
            <button
              onClick={startGame}
              className="tf-button style1"
              style={{ fontSize: '14px', padding: '10px 25px' }}
            >
              🎮 Start Game
            </button>
          ) : (
            <button
              onClick={stopGame}
              className="tf-button style1"
              style={{ 
                fontSize: '14px', 
                padding: '10px 25px',
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                borderColor: '#dc2626'
              }}
            >
              🛑 Stop Game
            </button>
          )}
        </div>
      </div>


    </>
  )
}
