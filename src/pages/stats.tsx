
import { useNavigate } from 'react-router-dom'


function Stats() {

  const navigate = useNavigate()

  return (
    <div className="stats-page">

      <h1>Statistics</h1>

      {/* LEVEL */}

      <div className="stats-level">

        <div className="stats-level-top">

          <span className="stats-level-title">
            Level
          </span>

          <span className="stats-level-number">
            Level 1
          </span>

        </div>

        <div className="stats-level-bar">
          <div className="stats-level-progress"></div>
        </div>

        <div className="stats-level-xp">
          <span>0 XP</span>
          <span>100 XP</span>
        </div>

      </div>


      {/* PERSONAL RECORDS */}

      <div
        className="stats-section"
        onClick={() => navigate('/stats/personal-records')}
      >

        <div className="stats-section-header">

          <h2>🏆 Personal Records</h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>


      {/* WORKOUT HISTORY */}

      <div
        className="stats-section"
        onClick={() => navigate('/stats/history')}
      >

        <div className="stats-section-header">

          <h2>📅 Workout History</h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>


      {/* EXERCISE PROGRESS */}

      <div
        className="stats-section"
        onClick={() => navigate('/stats/exercise-progress')}
      >

        <div className="stats-section-header">

          <h2>💪 Exercise Progress</h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>


      {/* MUSCLE GROUPS */}

      <div
        className="stats-section"
        onClick={() => navigate('/stats/muscles')}
      >

        <div className="stats-section-header">

          <h2>🥧 Muscle Groups</h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>


      {/* AVERAGE STATISTICS */}

      <div
        className="stats-section"
        onClick={() => navigate('/stats/averages')}
      >

        <div className="stats-section-header">

          <h2>📈 Average Statistics</h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>


      {/* TRAINING CALENDAR */}

      <div
        className="stats-section"
        onClick={() => navigate('/stats/calendar')}
      >

        <div className="stats-section-header">

          <h2>🗓 Training Calendar</h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>

    </div>
  )
}

export default Stats
