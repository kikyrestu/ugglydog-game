'use client'
import React, { useState, useEffect, useCallback } from 'react'

// Evolution stages data
const EVOLUTION_STAGES = [
  { id: 1, name: 'Puppy', emoji: '🐶', threshold: 0, description: 'A cute little puppy' },
  { id: 2, name: 'Young Dog', emoji: '🐕', threshold: 50, description: 'Growing stronger' },
  { id: 3, name: 'Guard Dog', emoji: '🦮', threshold: 100, description: 'Ready to protect' },
  { id: 4, name: 'Wolf', emoji: '🐺', threshold: 200, description: 'Wild and fierce' },
  { id: 5, name: 'Mythical Beast', emoji: '🐉', threshold: 350, description: 'Legendary creature' },
  { id: 6, name: 'Space Dog', emoji: '🚀', threshold: 500, description: 'Cosmic guardian' },
  { id: 7, name: 'Robot Dog', emoji: '🤖', threshold: 700, description: 'Cybernetic evolution' },
  { id: 8, name: 'Angel Dog', emoji: '😇', threshold: 1000, description: 'Divine protector' },
  { id: 9, name: 'Demon Dog', emoji: '👹', threshold: 1500, description: 'Dark power unleashed' },
  { id: 10, name: 'Ultimate UglyDog', emoji: '👑', threshold: 2500, description: 'The final form' }
]

// Level system based on score - Fixed consistent progression
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
]  // Enhanced evolutionary trap system with VISUAL SIMILARITY DECEPTION!
const getEvolutionTraps = (evolution, level) => {
  const baseTraps = [
    { id: 'decoy_toy', emoji: '🧸', name: 'Toy Decoy', penalty: 'miss', deceptionLevel: 'low' },
    { id: 'decoy_bone', emoji: '🦴', name: 'Bone Decoy', penalty: 'miss', deceptionLevel: 'low' },
    { id: 'danger_bomb', emoji: '💥', name: 'Explosion', penalty: 'health', deceptionLevel: 'medium' }
  ]
  
  // REVOLUTIONARY: Visual similarity traps - hampir mirip concept!
  const createVisualSimilarityTraps = (realEvolution) => {
    return [
      {
        id: `mirror_${realEvolution.id}`,
        emoji: realEvolution.emoji,
        name: `Mirror ${realEvolution.name}`,
        penalty: 'health',
        deceptionLevel: 'ultimate',
        isVisualTrap: true,
        similarity: 95, // 95% visual similarity
        trapStyle: 'transform: scaleX(-1);' // Mirror flip
      },
      {
        id: `shade_${realEvolution.id}`,
        emoji: realEvolution.emoji,
        name: `Shade ${realEvolution.name}`,
        penalty: 'health', 
        deceptionLevel: 'ultimate',
        isVisualTrap: true,
        similarity: 90, // 90% visual similarity
        trapStyle: 'filter: brightness(0.7) hue-rotate(15deg);' // Slight color shift
      },
      {
        id: `variant_${realEvolution.id}`,
        emoji: realEvolution.emoji,
        name: `Variant ${realEvolution.name}`,
        penalty: 'miss',
        deceptionLevel: 'very_high',
        isVisualTrap: true,
        similarity: 85, // 85% visual similarity
        trapStyle: 'transform: scale(0.9) rotate(2deg);' // Slightly smaller + rotated
      }
    ]
  }
  
  // THE ULTIMATE TRAP: Exact evolution emoji as deceptive trap
  const ultimateEvolutionTrap = {
    id: `exact_evolution_${evolution.id}`,
    emoji: evolution.emoji, // EXACT SAME EMOJI!
    name: `Fake ${evolution.name}`,
    penalty: 'health',
    deceptionLevel: 'ultimate',
    isUltimateTrap: true
  }
  
  // Enhanced evolution-specific traps with thematic consistency
  const evolutionTraps = {
    1: [
      { id: 'similar_pup', emoji: '🐕', name: 'Wild Puppy', penalty: 'miss', deceptionLevel: 'medium' },
      { id: 'puppy_cat', emoji: '🐱', name: 'Sneaky Cat', penalty: 'miss', deceptionLevel: 'low' }
    ],
    2: [
      { id: 'similar_dog', emoji: '🐕‍🦺', name: 'Service Dog', penalty: 'miss', deceptionLevel: 'high' },
      { id: 'police_dog', emoji: '👮‍♂️', name: 'Police Officer', penalty: 'miss', deceptionLevel: 'medium' }
    ],
    3: [
      { id: 'similar_guard', emoji: '🐕‍🦺', name: 'Guard Impostor', penalty: 'miss', deceptionLevel: 'high' },
      { id: 'security_camera', emoji: '📹', name: 'Security Cam', penalty: 'miss', deceptionLevel: 'medium' }
    ],
    4: [
      { id: 'similar_wolf', emoji: '🐺', name: 'Shadow Wolf', penalty: 'miss', deceptionLevel: 'very_high' },
      { id: 'moon_howl', emoji: '🌙', name: 'Moonlight', penalty: 'miss', deceptionLevel: 'high' }
    ],
    5: [
      { id: 'similar_dragon', emoji: '🐉', name: 'Dragon Echo', penalty: 'health', deceptionLevel: 'very_high' },
      { id: 'fire_breath', emoji: '🔥', name: 'Dragon Fire', penalty: 'health', deceptionLevel: 'high' }
    ],
    6: [
      { id: 'similar_space', emoji: '🛸', name: 'Alien Ship', penalty: 'miss', deceptionLevel: 'very_high' },
      { id: 'asteroid', emoji: '☄️', name: 'Space Rock', penalty: 'health', deceptionLevel: 'high' }
    ],
    7: [
      { id: 'similar_robot', emoji: '🤖', name: 'AI Clone', penalty: 'health', deceptionLevel: 'ultimate' },
      { id: 'circuit_board', emoji: '⚡', name: 'Short Circuit', penalty: 'health', deceptionLevel: 'high' }
    ],
    8: [
      { id: 'similar_angel', emoji: '👼', name: 'False Angel', penalty: 'miss', deceptionLevel: 'ultimate' },
      { id: 'holy_light', emoji: '✨', name: 'Divine Light', penalty: 'miss', deceptionLevel: 'high' }
    ],
    9: [
      { id: 'similar_demon', emoji: '👺', name: 'Demon Twin', penalty: 'health', deceptionLevel: 'ultimate' },
      { id: 'hellfire', emoji: '🔥', name: 'Hellfire', penalty: 'health', deceptionLevel: 'very_high' }
    ],
    10: [
      { id: 'similar_crown', emoji: '👑', name: 'False Crown', penalty: 'health', deceptionLevel: 'ultimate' },
      { id: 'royal_scepter', emoji: '🔱', name: 'Royal Trap', penalty: 'health', deceptionLevel: 'ultimate' }
    ]
  }
  
  // Select traps based on difficulty level with VISUAL SIMILARITY DECEPTION
  const availableTraps = [...baseTraps, ...(evolutionTraps[evolution.id] || [])]
  
  // Add visual similarity traps for higher levels (hampir mirip concept!)
  const visualSimilarityTraps = level >= 6 ? createVisualSimilarityTraps(evolution) : []
  
  // Apply deception level filtering for progressive difficulty
  const filteredTraps = availableTraps.filter(trap => {
    switch (level) {
      case 1:
      case 2:
        return trap.deceptionLevel === 'low' || trap.deceptionLevel === 'medium'
      case 3:
      case 4:
        return trap.deceptionLevel !== 'ultimate'
      case 5:
      case 6:
        return trap.deceptionLevel !== 'ultimate' || Math.random() < 0.3
      case 7:
      case 8:
        return trap.deceptionLevel !== 'ultimate' || Math.random() < 0.6
      case 9:
      case 10:
        return true // All traps available including EXACT EVOLUTION TRAP!
      default:
        return trap.deceptionLevel === 'low'
    }
  })
  
  // For levels 6+ add VISUAL SIMILARITY TRAPS (hampir mirip!)
  if (level >= 6) {
    filteredTraps.push(...visualSimilarityTraps.filter(trap => {
      const similarityChance = level >= 8 ? 0.5 : 0.3 // Higher chance at higher levels
      return Math.random() < similarityChance
    }))
  }
  
  // For levels 8+ add the ULTIMATE EVOLUTION TRAP possibility
  if (level >= 8 && Math.random() < (level >= 10 ? 0.4 : 0.2)) {
    filteredTraps.push(ultimateEvolutionTrap)
  }
  
  return filteredTraps
}

// Legacy trap types for backward compatibility
const TRAP_TYPES = [
  { id: 'fake_dog', emoji: '🐕‍🦺', name: 'Fake Dog', penalty: 'miss' },
  { id: 'bomb', emoji: '💣', name: 'Bomb', penalty: 'health' },
  { id: 'cat', emoji: '🐱', name: 'Decoy Cat', penalty: 'miss' },
  { id: 'rabbit', emoji: '🐰', name: 'Decoy Rabbit', penalty: 'miss' }
]

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
  const [traps, setTraps] = useState([])
  const [showEvolution, setShowEvolution] = useState(null)
  const [showLevelUp, setShowLevelUp] = useState(null)
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

  // Get current evolution based on score
  const getCurrentEvolution = () => {
    for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
      if (gameState.score >= EVOLUTION_STAGES[i].threshold) {
        return EVOLUTION_STAGES[i]
      }
    }
    return EVOLUTION_STAGES[0]
  }

  const currentEvolution = getCurrentEvolution()

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

  // Get game difficulty settings based on level - IMPROVED PROGRESSION
  const getDifficultySettings = useCallback(() => {
    const level = currentLevel.level
    
    if (level <= 2) {
      return {
        moveInterval: 4000,    // 4 seconds between moves
        trapCount: level === 1 ? 0 : 1,  // Level 2 introduces 1 easy trap
        autoMissTimer: 6000,   // 6 seconds to click
        showCountdown: false,  // No pressure countdown for beginners
        deceptionLevel: 'tutorial'
      }
    } else if (level <= 4) {
      return {
        moveInterval: 3500,    // 3.5 seconds
        trapCount: 1,          // 1 trap with medium deception
        autoMissTimer: 5000,   // 5 seconds to click
        showCountdown: true,
        deceptionLevel: 'easy'
      }
    } else if (level <= 6) {
      return {
        moveInterval: 3000,    // 3 seconds
        trapCount: level >= 6 ? 2 : 1,
        autoMissTimer: 4500,   // 4.5 seconds to click
        showCountdown: true,
        deceptionLevel: 'medium'
      }
    } else if (level <= 8) {
      return {
        moveInterval: 2500,    // 2.5 seconds
        trapCount: 2,
        autoMissTimer: 4000,   // 4 seconds to click
        showCountdown: true,
        deceptionLevel: 'hard'
      }
    } else {
      return {
        moveInterval: 2000,    // 2 seconds - Ultimate mode
        trapCount: level === 10 ? 3 : 2,  // 3 traps only at ultimate level
        autoMissTimer: 3500,   // 3.5 seconds to click (more forgiving than before)
        showCountdown: true,
        deceptionLevel: 'ultimate'
      }
    }
  }, [currentLevel.level])

  // PURE INSTANT MODE - Move dog to random position instantly
  const moveDog = useCallback(() => {
    if (!gameState.gameActive) return
    
    console.log('🚀 INSTANT MODE: Moving dog to new position immediately!')
    
    // Generate new position for dog
    const newDogPosition = {
      x: Math.random() * 70 + 15, // 15% to 85% to avoid edges
      y: Math.random() * 60 + 20  // 20% to 80% to avoid edges
    }
    
    // For instant mode, keep traps minimal to focus on speed clicking
    const difficulty = getDifficultySettings()
    let newTraps = []
    if (difficulty.trapCount > 0 && currentLevel.level >= 3) {
      // Only spawn traps from level 3+ to keep early game pure clicking
      newTraps = generateTrapsAtPosition(Math.min(difficulty.trapCount, 1), newDogPosition)
    }
    
    // Set new positions instantly
    setDogPosition(newDogPosition)
    setTraps(newTraps)
    setDogClickable(true)
    setCurrentDogId(prev => prev + 1)
    setDogTimeoutState(false)
    
    // INSTANT MODE: No timers, no countdown, no auto-miss!
    setCountdown(0) // Always 0 in instant mode
  }, [gameState.gameActive, dogClickable, getDifficultySettings])

  // Generate traps with proper positioning - ENHANCED DECEPTION SYSTEM
  const generateTrapsAtPosition = (count, dogPos) => {
    const difficulty = getDifficultySettings()
    const availableTraps = getEvolutionTraps(currentEvolution, currentLevel.level)
    const newTraps = []
    const usedPositions = [dogPos] // Include dog position to avoid overlap
    
    for (let i = 0; i < count; i++) {
      let position
      let attempts = 0
      
      // Find position that doesn't overlap with dog or other traps
      do {
        position = {
          x: Math.random() * 70 + 15,
          y: Math.random() * 60 + 20
        }
        attempts++
      } while (attempts < 20 && (
        usedPositions.some(pos => 
          Math.abs(pos.x - position.x) < 20 || 
          Math.abs(pos.y - position.y) < 20
        )
      ))
      
      // If we can't find a good position after 20 attempts, use it anyway
      usedPositions.push(position)
      
      // Smart trap selection based on deception level
      let selectedTrap
      if (difficulty.deceptionLevel === 'tutorial') {
        // Easy to distinguish traps for learning
        selectedTrap = availableTraps.filter(t => t.deceptionLevel === 'low')[0] || availableTraps[0]
      } else if (difficulty.deceptionLevel === 'ultimate') {
        // Prefer high deception traps, including exact matches
        const highDeceptionTraps = availableTraps.filter(t => 
          t.deceptionLevel === 'ultimate' || t.deceptionLevel === 'very_high'
        )
        selectedTrap = highDeceptionTraps[Math.floor(Math.random() * highDeceptionTraps.length)] || availableTraps[0]
      } else {
        // Random selection from appropriate difficulty level
        const appropriateTraps = availableTraps.filter(t => 
          t.deceptionLevel === difficulty.deceptionLevel || t.deceptionLevel === 'medium'
        )
        selectedTrap = appropriateTraps[Math.floor(Math.random() * appropriateTraps.length)] || availableTraps[0]
      }
      
      newTraps.push({
        id: `trap_${i}_${Date.now()}_${Math.random()}`,
        ...selectedTrap,
        position,
        spawnTime: Date.now()
      })
    }
    
    return newTraps
  }

  // Check for level up and show notification with 5-second breathing period - FIXED TIMER CONFLICTS
  useEffect(() => {
    if (currentLevel.level > previousLevel && gameState.gameActive) {
      console.log(`Level up detected: ${previousLevel} → ${currentLevel.level}`)
      
      // Clear all timers first to prevent conflicts during transition
      clearAllTimers()
      
      // Pause game for 5 seconds during level transition
      setGameState(prev => ({ ...prev, gameActive: false }))
      setDogClickable(false)
      
      // Show level up notification
      setShowLevelUp(currentLevel)
      
      // 5-second breathing period before resuming
      setTimeout(() => {
        setShowLevelUp(null)
        setGameState(prev => ({ ...prev, gameActive: true }))
        // Resume game flow after transition with safety check
        setTimeout(() => {
          // Double-check game is still supposed to be active
          if (gameState.gameActive) {
            moveDog()
          }
        }, 500)
      }, 5000) // 5 seconds breathing room
      
      setPreviousLevel(currentLevel.level)
    }
  }, [currentLevel.level, previousLevel, gameState.gameActive, moveDog])

  // PURE INSTANT MODE: No auto-miss system - pure clicking speed challenge!
  // Players can take their time, focus is on accuracy and clicking speed

  // Start game - INSTANT MODE OPTIMIZED
  const startGame = () => {
    console.log('🚀 Starting Pure Instant Mode game!')
    
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
    setTraps([])
    setPreviousLevel(1)
    setCurrentDogId(0)
    setDogClickable(true)
    setCountdown(0) // Always 0 in instant mode
    setDogTimeoutState(false)
    
    // Start first dog position immediately in instant mode
    setTimeout(() => {
      moveDog()
    }, 100) // Minimal delay for smooth start
  }

  // Stop game - INSTANT MODE
  const stopGame = () => {
    console.log('🛑 Stopping Pure Instant Mode game...')
    
    setGameState(prev => {
      const newHighest = Math.max(prev.score, prev.highestScore)
      return {
        ...prev,
        gameActive: false,
        highestScore: newHighest
      }
    })
    
    setTraps([])
    setDogClickable(false)
    setCountdown(0) // Always 0 in instant mode
    setDogTimeoutState(false)
    
    // Submit score to backend
    if (gameState.score > 0) {
      submitScore(gameState.score)
    }
  }

  // Handle UglyDog click - IMPROVED GAME FLOW & BUG FIXES
  const handleUglyDogClick = (e) => {
    e.stopPropagation()
    // Strict guards to prevent double execution and race conditions
    if (!gameState.gameActive || !dogClickable) return

  // PURE INSTANT MODE - Handle UglyDog click with 0ms delay
  const handleUglyDogClick = (e) => {
    e.stopPropagation()
    // Strict guards to prevent double execution
    if (!gameState.gameActive || !dogClickable) return

    console.log('🎯 INSTANT CLICK: Immediate dog spawn!')
    
    // Immediately disable clicking to prevent double clicks
    setDogClickable(false)

    const prevEvolution = getCurrentEvolution()
    
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

    // Check for evolution
    setTimeout(() => {
      const newEvolution = getCurrentEvolution()
      if (newEvolution.id > prevEvolution.id) {
        setShowEvolution(newEvolution)
        setTimeout(() => setShowEvolution(null), 3000)
      }
    }, 50) // Faster evolution check

    // Create click effect
    createClickEffect(e.clientX, e.clientY)
    
    // 🚀 PURE INSTANT MODE: 0ms delay before next spawn!
    setTimeout(() => {
      if (gameState.gameActive) {
        moveDog() // Instant new position
      }
    }, 0) // ZERO DELAY - Pure instant mode!
  }

  // Handle trap click
  const handleTrapClick = (trap, e) => {
    e.stopPropagation()
    if (!gameState.gameActive) return

    console.log(`Clicked on trap: ${trap.name}`)
    
    if (trap.penalty === 'health') {
      // Bomb - direct health damage
      const newHealth = gameState.health - 1
      setGameState(prev => ({
        ...prev,
        health: newHealth,
        score: Math.max(0, prev.score - 20) // Heavy penalty for bombs
      }))
      
      if (newHealth <= 0) {
        stopGame()
        return
      }
    } else {
      // Other traps - count as miss
      handleMissClick()
    }
    
    // Create trap effect
    createTrapEffect(e.clientX, e.clientY, trap)
  }

  // Handle miss click - ENHANCED LOGGING
  const handleMissClick = () => {
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
  }

  // Create click effect - ENHANCED
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
    
    // Add success sound effect (optional)
    // playSuccessSound()
  }

  // Create trap effect - ENHANCED
  const createTrapEffect = (x, y, trap) => {
    const effect = document.createElement('div')
    effect.style.position = 'fixed'
    effect.style.left = x + 'px'
    effect.style.top = y + 'px'
    effect.style.color = trap.penalty === 'health' ? '#ef4444' : '#fbbf24'
    effect.style.fontSize = '20px'
    effect.style.fontWeight = 'bold'
    effect.style.pointerEvents = 'none'
    effect.style.zIndex = '9999'
    effect.style.animation = 'float-up 1s ease-out forwards'
    effect.style.textShadow = `0 0 8px ${trap.penalty === 'health' ? '#ef4444' : '#fbbf24'}`
    effect.textContent = trap.penalty === 'health' ? '-❤️ BOMB!' : '❌ TRAP!'
    
    document.body.appendChild(effect)
    setTimeout(() => effect.remove(), 1000)
  }

  // Create timeout effect - ENHANCED VISUAL FEEDBACK & MEMORY LEAK FIX
  const createTimeoutEffect = (x, y) => {
    const effect = document.createElement('div')
    effect.style.position = 'fixed'
    effect.style.left = `${x}%`
    effect.style.top = `${y}%`
    effect.style.color = '#ef4444'
    effect.style.fontSize = '32px' // Increased size for better visibility
    effect.style.fontWeight = 'bold'
    effect.style.pointerEvents = 'none'
    effect.style.zIndex = '9999'
    effect.style.animation = 'timeout-miss-float 1.5s ease-out forwards'
    effect.style.textShadow = '0 0 20px #ef4444, 0 0 40px #ef4444' // Enhanced glow
    effect.style.transform = 'translate(-50%, -50%)'
    effect.style.border = '2px solid #ef4444'
    effect.style.borderRadius = '12px'
    effect.style.padding = '8px 12px'
    effect.style.background = 'rgba(239, 68, 68, 0.1)'
    effect.style.backdropFilter = 'blur(4px)'
    effect.textContent = '⏰ TIME OUT!'
    
    // Add to document with proper cleanup tracking
    document.body.appendChild(effect)
    
    // Enhanced cleanup with safety checks
    const cleanup = () => {
      if (effect && effect.parentNode) {
        effect.parentNode.removeChild(effect)
      }
    }
    
    const timeoutId = setTimeout(cleanup, 1500)
    
    // Store cleanup reference for emergency cleanup
    effect.cleanupTimeoutId = timeoutId
    
    // Add secondary warning text with proper cleanup
    setTimeout(() => {
      // Check if main effect still exists before creating secondary
      if (effect && effect.parentNode) {
        const warningEffect = document.createElement('div')
        warningEffect.style.position = 'fixed'
        warningEffect.style.left = `${x}%`
        warningEffect.style.top = `${y + 8}%` // Slightly below main text
        warningEffect.style.color = '#fbbf24'
        warningEffect.style.fontSize = '18px'
        warningEffect.style.fontWeight = 'bold'
        warningEffect.style.pointerEvents = 'none'
        warningEffect.style.zIndex = '9998'
        warningEffect.style.animation = 'timeout-miss-float 1.2s ease-out forwards'
        warningEffect.style.textShadow = '0 0 10px #fbbf24'
        warningEffect.style.transform = 'translate(-50%, -50%)'
        warningEffect.style.opacity = '0.8'
        warningEffect.textContent = 'MISSED!'
        
        document.body.appendChild(warningEffect)
        
        // Cleanup secondary effect with safety check
        const secondaryCleanup = () => {
          if (warningEffect && warningEffect.parentNode) {
            warningEffect.parentNode.removeChild(warningEffect)
          }
        }
        
        setTimeout(secondaryCleanup, 1200)
      }
    }, 300)
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
          evolution_stage: currentEvolution.name
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
          z-index: 10;
          animation: float 2s infinite ease-in-out;
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.3));
          font-size: 50px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
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
          animation: timeout-fade-out 1.2s ease-out forwards;
          pointer-events: none;
        }
        
        @keyframes timeout-fade-out {
          0% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1);
            filter: brightness(1) grayscale(0%);
          }
          20% { 
            opacity: 0.8; 
            transform: translate(-50%, -50%) scale(0.95);
            filter: brightness(0.8) grayscale(20%);
          }
          100% { 
            opacity: 0.3; 
            transform: translate(-50%, -50%) scale(0.8);
            filter: brightness(0.5) grayscale(80%);
          }
        }
        
        .trap {
          position: absolute;
          cursor: pointer;
          transition: all 0.3s ease;
          user-select: none;
          z-index: 5;
          animation: float 2s infinite ease-in-out;
          font-size: 45px;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.3));
          border-radius: 50%;
          padding: 8px;
          background: rgba(255, 255, 255, 0.05);
        }
        
        .trap:hover {
          transform: translate(-50%, -50%) scale(1.15) rotate(-3deg);
          filter: brightness(1.2) drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
        }
        
        .trap.ultimate-trap {
          font-size: 50px;
          animation: ultimate-pulse 2s infinite ease-in-out;
          filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
          position: relative;
        }
        
        .ultimate-trap-indicator {
          position: absolute;
          top: -15px;
          right: -15px;
          font-size: 16px;
          animation: warning-flash 1s infinite ease-in-out;
          z-index: 20;
        }
        
        /* Visual Similarity Traps - Hampir Mirip System */
        .trap.visual-similarity-trap {
          font-size: 48px;
          animation: visual-similarity-pulse 3s infinite ease-in-out;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .trap.visual-similarity-trap:hover {
          animation-play-state: paused;
          transform: translate(-50%, -50%) scale(1.1);
        }
        
        .visual-trap-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          font-size: 8px;
          opacity: 0.7;
          animation: eye-blink 2s infinite ease-in-out;
          z-index: 15;
        }
        
        @keyframes visual-similarity-pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.3));
          }
          33% { 
            transform: translate(-50%, -50%) scale(1.02);
            filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.4));
          }
          66% { 
            transform: translate(-50%, -50%) scale(0.98);
            filter: drop-shadow(0 0 6px rgba(139, 92, 246, 0.2));
          }
        }
        
        @keyframes eye-blink {
          0%, 90%, 100% { opacity: 0.7; }
          93%, 97% { opacity: 0.2; }
        }
        
        @keyframes ultimate-pulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.6));
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.05);
            filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.8));
          }
        }
        
        @keyframes warning-flash {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
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
            <span className="stat-icon">{currentEvolution.emoji}</span>
            <div className="stat-label">Evolution</div>
            <div className="stat-value" style={{ fontSize: '12px' }}>
              {currentEvolution.name}
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="game-canvas" onClick={handleMissClick}>
          {gameState.gameActive ? (
            <>
              {/* UglyDog */}
              <div
                className={`uglydog ${!dogClickable ? 'not-clickable' : ''} ${dogTimeoutState ? 'timeout-fade' : ''}`}
                style={{
                  left: `${dogPosition.x}%`,
                  top: `${dogPosition.y}%`
                }}
                onClick={dogClickable ? handleUglyDogClick : undefined}
              >
                {currentEvolution.emoji}
                
                {/* Non-intrusive peripheral timer - Enhanced UX */}
                {countdown > 0 && dogClickable && (
                  <>
                    {/* Subtle glow effect that intensifies with time pressure */}
                    <div className={`peripheral-timer-glow ${countdown <= 2 ? 'danger' : countdown <= 4 ? 'warning' : 'normal'}`} />
                    
                    {/* Peripheral progress border */}
                    <div 
                      className="peripheral-timer-border"
                      style={{
                        '--timer-progress': `${(countdown / (getDifficultySettings().autoMissTimer / 1000)) * 100}%`,
                        '--timer-color': countdown <= 2 ? '#ef4444' : countdown <= 4 ? '#fbbf24' : '#86FF00'
                      }}
                    />
                  </>
                )}
              </div>
              
              {/* Traps - Enhanced with visual similarity deception */}
              {traps.map(trap => (
                <div
                  key={trap.id}
                  className={`trap ${trap.penalty === 'health' ? 'danger-trap' : ''} ${trap.isUltimateTrap ? 'ultimate-trap' : ''} ${trap.isVisualTrap ? 'visual-similarity-trap' : ''} ${trap.deceptionLevel === 'low' && currentLevel.level <= 2 ? 'tutorial-trap' : ''}`}
                  style={{
                    left: `${trap.position.x}%`,
                    top: `${trap.position.y}%`,
                    // Apply visual similarity transforms (hampir mirip concept!)
                    ...(trap.trapStyle ? { transform: trap.trapStyle.split(': ')[1].replace(';', '') } : {}),
                    ...(trap.trapStyle && trap.trapStyle.includes('filter') ? { filter: trap.trapStyle.split(': ')[1].replace(';', '') } : {}),
                    // Dynamic theming based on evolution stage
                    boxShadow: trap.penalty === 'health' ? 
                      '0 0 12px rgba(239, 68, 68, 0.4)' : 
                      trap.isVisualTrap ? 
                        '0 0 10px rgba(139, 92, 246, 0.3)' : // Purple glow for visual traps
                        '0 0 8px rgba(255, 255, 255, 0.2)',
                    fontSize: trap.isUltimateTrap ? '50px' : trap.isVisualTrap ? '48px' : '45px'
                  }}
                  onClick={(e) => handleTrapClick(trap, e)}
                  title={currentLevel.level <= 2 ? `${trap.name} - Avoid this!` : undefined}
                >
                  {trap.emoji}
                  
                  {/* Ultimate trap indicator for exact matches */}
                  {trap.isUltimateTrap && (
                    <div className="ultimate-trap-indicator">⚠️</div>
                  )}
                  
                  {/* Visual similarity trap indicator - subtle hint */}
                  {trap.isVisualTrap && currentLevel.level >= 8 && (
                    <div className="visual-trap-indicator" style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      fontSize: '8px',
                      opacity: 0.7
                    }}>👁️</div>
                  )}
                </div>
              ))}
              
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
                zIndex: 15,
                boxShadow: `0 0 10px ${currentLevel.color}40`
              }}>
                Level {currentLevel.level} - {currentLevel.difficulty}
              </div>
              
              {/* Non-intrusive peripheral timer - Small corner indicator */}
              {countdown > 0 && getDifficultySettings().showCountdown && (
                <div className={`peripheral-timer-corner ${countdown <= 2 ? 'danger' : countdown <= 4 ? 'warning' : 'normal'}`}>
                  <div className="timer-dot" />
                  <div className="timer-text">{countdown}</div>
                </div>
              )}
              
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
                  🎯 Click the glowing {currentEvolution.emoji} to score!<br/>
                  {currentLevel.level >= 2 && '⚠️ Avoid deceptive traps!'}<br/>
                  {getDifficultySettings().showCountdown && '⏱️ Watch the subtle timer cues!'}
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

      {/* Evolution Notification */}
      {showEvolution && (
        <div className="evolution-popup">
          <span className="evolution-emoji">{showEvolution.emoji}</span>
          <div className="evolution-title">Evolution!</div>
          <div className="evolution-name">{showEvolution.name}</div>
        </div>
      )}

      {/* Enhanced Level Up Notification with 5-second breathing period */}
      {showLevelUp && (
        <div className="evolution-popup level-transition-popup" style={{ borderColor: showLevelUp.color }}>
          <span className="evolution-emoji">🎊</span>
          <div className="evolution-title" style={{ color: showLevelUp.color }}>
            Level Up!
          </div>
          <div className="evolution-name">
            Level {showLevelUp.level} - {showLevelUp.difficulty}
          </div>
          
          {/* 5-second countdown indicator */}
          <div style={{ 
            fontSize: '14px', 
            marginTop: '15px', 
            color: '#86FF00',
            fontWeight: 'bold'
          }}>
            ⏱️ Preparing next level...
          </div>
          
          {/* Level preview information */}
          <div style={{ fontSize: '11px', marginTop: '10px', opacity: 0.9, lineHeight: '1.4' }}>
            {showLevelUp.level === 3 && '🎯 Traps system activated!'} 
            {showLevelUp.level === 6 && '👁️ Visual similarity traps incoming!'} 
            {showLevelUp.level === 7 && '🔥 Hard mode - More deception!'} 
            {showLevelUp.level === 8 && '⚠️ Ultimate traps with exact matches!'} 
            {showLevelUp.level === 9 && '💀 Expert mode - Psychological warfare!'} 
            {showLevelUp.level === 10 && '👑 Ultimate challenge - Master level!'}
            
            {showLevelUp.level >= 6 && (
              <div style={{ marginTop: '8px', fontSize: '10px', opacity: 0.7 }}>
                🚨 New feature: Hampir mirip visual traps!
              </div>
            )}
          </div>
          
          {/* Visual breathing indicator */}
          <div style={{
            marginTop: '12px',
            fontSize: '10px',
            opacity: 0.6,
            animation: 'breathe-indicator 1s infinite ease-in-out'
          }}>
            💨 Take a breath... Game resumes automatically
          </div>
        </div>
      )}
    </>
  )
}
