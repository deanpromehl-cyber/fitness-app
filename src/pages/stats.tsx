

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  calculateLevel,
  calculateTotalXP,
  type LevelInfo
} from '../utils/level'


function Stats() {

  const navigate = useNavigate()

  const [levelInfo, setLevelInfo] =
    useState<LevelInfo>(
      calculateLevel(0)
    )


  /* =========================
     XP LADEN
  ========================= */

  useEffect(() => {

    const savedTrainings =
      localStorage.getItem(
        'trainingHistory'
      )

    if (!savedTrainings) {
      setLevelInfo(
        calculateLevel(0)
      )
      return
    }


    try {

      const trainings =
        JSON.parse(savedTrainings)

      const totalXP =
        calculateTotalXP(trainings)

      setLevelInfo(
        calculateLevel(totalXP)
      )

    } catch {

      setLevelInfo(
        calculateLevel(0)
      )

    }

  }, [])


  return (
    <div className="stats-page">

      <h1>Statistics</h1>


      {/* LEVEL */}

      <div className="stats-level">

        <div className="stats-level-top">

  <span className="stats-level-title">
    Level {levelInfo.level}
  </span>

  

</div>


        <div className="stats-level-bar">

          <div
            className="stats-level-progress"
            style={{
              width: `${levelInfo.progress}%`
            }}
          />

        </div>


        <div className="stats-level-xp">

          <span>
            {Math.floor(levelInfo.currentLevelXP)} XP
          </span>

          <span>
            {levelInfo.nextLevelXP} XP
          </span>

        </div>

      </div>


      {/* PERSONAL RECORDS */}

      <div
        className="stats-section"
        onClick={() =>
          navigate(
            '/stats/personal-records'
          )
        }
      >

        <div className="stats-section-header">

          <h2>
            🏆 Personal Records
          </h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>


      {/* WORKOUT HISTORY */}

      <div
        className="stats-section"
        onClick={() =>
          navigate(
            '/stats/history'
          )
        }
      >

        <div className="stats-section-header">

          <h2>
            📅 Workout History
          </h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>


      {/* EXERCISE PROGRESS */}

      <div
        className="stats-section"
        onClick={() =>
          navigate(
            '/stats/exercise-progress'
          )
        }
      >

        <div className="stats-section-header">

          <h2>
            💪 Exercise Progress
          </h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>


      {/* MUSCLE GROUPS */}

      <div
        className="stats-section"
        onClick={() =>
          navigate(
            '/stats/muscle-groups'
          )
        }
      >

        <div className="stats-section-header">

          <h2>
            🥧 Muscle Groups
          </h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>


      {/* AVERAGE STATISTICS */}

      <div
        className="stats-section"
        onClick={() =>
          navigate(
            '/stats/averages'
          )
        }
      >

        <div className="stats-section-header">

          <h2>
            📈 Average Statistics
          </h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>


      {/* TRAINING CALENDAR */}

      <div
        className="stats-section"
        onClick={() =>
          navigate(
            '/stats/calendar'
          )
        }
      >

        <div className="stats-section-header">

          <h2>
            🗓 Training Calendar
          </h2>

          <span className="stats-section-arrow">
            ›
          </span>

        </div>

      </div>

    </div>
  )
}

export default Stats

