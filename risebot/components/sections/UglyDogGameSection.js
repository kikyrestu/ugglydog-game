'use client'
import React, { useState, useEffect } from 'react'
import NativeUglyDogGame from './NativeUglyDogGame'

export default function UglyDogGameSection() {
  const [leaderboard, setLeaderboard] = useState([])
  const [gameStats, setGameStats] = useState({
    totalPlayers: 0,
    highestScore: 0,
    totalGames: 0
  })

  // Fetch leaderboard and stats
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/leaderboard')
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data.slice(0, 5))
        
        // Calculate stats
        const totalPlayers = data.length
        const highestScore = data.length > 0 ? data[0].best_session || data[0].score : 0
        const totalGames = data.reduce((sum, player) => sum + (player.total_games || 1), 0)
        
        setGameStats({
          totalPlayers,
          highestScore,
          totalGames
        })
      }
    } catch (error) {
      console.log('Leaderboard fetch failed:', error)
    }
  }

  // Load data on mount
  useEffect(() => {
    fetchLeaderboard()
    
    // Refresh leaderboard every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <style jsx>{`
        .leaderboard-container {
          background: linear-gradient(135deg, #1A222C 0%, #1E2835 100%);
          border-radius: 20px;
          border: 2px solid rgba(255, 255, 255, 0.0784313725);
          padding: 25px;
          height: 100%;
        }
        
        .leaderboard-header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.0784313725);
        }
        
        .leaderboard-title {
          font-size: 1.4rem;
          font-weight: bold;
          color: #86FF00;
          margin-bottom: 5px;
        }
        
        .leaderboard-subtitle {
          font-size: 0.9rem;
          color: #798DA3;
        }
        
        .stats-overview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .stat-box {
          text-align: center;
          padding: 10px;
          background: rgba(30, 40, 53, 0.3);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .stat-number {
          font-size: 1.2rem;
          font-weight: bold;
          color: #86FF00;
          display: block;
        }
        
        .stat-label {
          font-size: 0.7rem;
          color: #798DA3;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .leaderboard-list {
          max-height: 300px;
          overflow-y: auto;
        }
        
        .leaderboard-entry {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          margin-bottom: 8px;
          background: rgba(30, 40, 53, 0.3);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.3s ease;
        }
        
        .leaderboard-entry:hover {
          background: rgba(134, 255, 0, 0.1);
          border-color: rgba(134, 255, 0, 0.2);
        }
        
        .entry-rank {
          font-size: 1.1rem;
          font-weight: bold;
          color: #86FF00;
          min-width: 30px;
        }
        
        .entry-player {
          flex: 1;
          margin-left: 10px;
        }
        
        .entry-name {
          font-size: 0.9rem;
          color: white;
          margin-bottom: 2px;
        }
        
        .entry-details {
          font-size: 0.7rem;
          color: #798DA3;
        }
        
        .entry-score {
          font-size: 1rem;
          font-weight: bold;
          color: #86FF00;
          text-align: right;
        }
        
        .no-players {
          text-align: center;
          padding: 30px 20px;
          color: #798DA3;
        }
        
        .no-players-icon {
          font-size: 2.5rem;
          margin-bottom: 10px;
          display: block;
        }
        
        .refresh-button {
          width: 100%;
          margin-top: 15px;
          background: rgba(134, 255, 0, 0.1);
          border: 1px solid rgba(134, 255, 0, 0.3);
          color: #86FF00;
          padding: 8px 15px;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .refresh-button:hover {
          background: rgba(134, 255, 0, 0.2);
          border-color: rgba(134, 255, 0, 0.5);
        }
      `}</style>
      
      <section className="tf-section project">
        <div className="overlay"></div>
        <div className="container w_1280">
          <div className="row">
            <div className="col-md-12">
              <div className="tf-title" data-aos="fade-up" data-aos-duration={800}>
                <h2 className="title">
                  🐕 UglyDog Clicker Game
                </h2>
                <p className="sub">
                  Click the UglyDog to score points and watch it evolve! Complete game experience built into the template.
                </p>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-8">
              {/* Native Game Component */}
              <div className="project-box-style6" data-aos="fade-in" data-aos-duration={800}>
                <span className="boder" />
                
                <div className="content">
                  <div className="img-box">
                    <div className="content-inner">
                      <h5 className="heading">🎮 Play Now</h5>
                      <p className="desc">Native game experience - no loading, no external tabs!</p>
                    </div>
                  </div>
                  
                  <div className="content-bottom">
                    <NativeUglyDogGame />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              {/* Leaderboard & Stats */}
              <div className="project-box-style6" data-aos="fade-in" data-aos-duration={1000}>
                <span className="boder" />
                <div className="content">
                  <div className="img-box">
                    <div className="content-inner">
                      <h5 className="heading">🏆 Leaderboard</h5>
                      <p className="desc">Top players and game statistics</p>
                    </div>
                  </div>
                  
                  <div className="content-bottom">
                    <div className="leaderboard-container">
                      {/* Game Stats Overview */}
                      <div className="stats-overview">
                        <div className="stat-box">
                          <span className="stat-number">{gameStats.totalPlayers}</span>
                          <span className="stat-label">Players</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-number">{gameStats.highestScore}</span>
                          <span className="stat-label">High Score</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-number">{gameStats.totalGames}</span>
                          <span className="stat-label">Games Played</span>
                        </div>
                      </div>

                      {/* Leaderboard List */}
                      <div className="leaderboard-list">
                        {leaderboard.length > 0 ? (
                          leaderboard.map((player, index) => (
                            <div key={index} className="leaderboard-entry">
                              <div className="entry-rank">
                                {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                              </div>
                              <div className="entry-player">
                                <div className="entry-name">
                                  {player.username || `Player ${index + 1}`}
                                </div>
                                <div className="entry-details">
                                  {player.total_games || 1} games played
                                </div>
                              </div>
                              <div className="entry-score">
                                {player.best_session || player.score}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="no-players">
                            <span className="no-players-icon">🚀</span>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px' }}>
                              No players yet!
                            </div>
                            <div style={{ fontSize: '0.8rem' }}>
                              Be the first to play and make it to the leaderboard.
                            </div>
                          </div>
                        )}
                      </div>

                      <button 
                        className="refresh-button"
                        onClick={fetchLeaderboard}
                      >
                        🔄 Refresh Leaderboard
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to Play */}
              <div className="project-box-style6" data-aos="fade-in" data-aos-duration={1200} style={{ marginTop: '20px' }}>
                <span className="boder" />
                <div className="content">
                  <div className="img-box">
                    <div className="content-inner">
                      <h5 className="heading">🎯 How to Play</h5>
                      <p className="desc">Master the evolution system</p>
                    </div>
                  </div>
                  
                  <div className="content-bottom">
                    <ul className="sub-content">
                      <li>
                        <p>🎮 Click the UglyDog</p>
                        <p style={{ color: '#86FF00', fontWeight: 'bold' }}>+1 Point</p>
                      </li>
                      <li>
                        <p>❌ Miss 3 times</p>
                        <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>-10 Points, -1 Health</p>
                      </li>
                      <li>
                        <p>🚀 Evolution</p>
                        <p style={{ color: '#86FF00', fontWeight: 'bold' }}>Every 50 points</p>
                      </li>
                      <li>
                        <p>💀 Game Over</p>
                        <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>0 Health remaining</p>
                      </li>
                    </ul>
                    
                    <div style={{
                      marginTop: '15px',
                      padding: '12px',
                      background: 'linear-gradient(135deg, rgba(134, 255, 0, 0.1), rgba(134, 255, 0, 0.05))',
                      borderRadius: '10px',
                      border: '1px solid rgba(134, 255, 0, 0.2)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '16px', marginBottom: '5px' }}>🏆</div>
                      <div style={{ fontSize: '0.8rem', color: '#86FF00', fontWeight: 'bold' }}>
                        Evolution Stages: 10
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#798DA3' }}>
                        From Puppy to Ultimate UglyDog
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
