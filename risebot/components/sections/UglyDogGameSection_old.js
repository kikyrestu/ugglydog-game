'use client'
import React from 'react'
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
            <div className="col-md-12">
              {/* Native Game Component - Full Width */}
              <div data-aos="fade-up" data-aos-duration={1000}>
                <NativeUglyDogGame />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
