import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  achievements,
  type Achievement
} from '../utils/achievements'

import {
  getUnlockedAchievements
} from '../utils/achievementManager'


function TrophyShowcase() {

  const navigate = useNavigate()

  const [selectedIds, setSelectedIds] =
    useState<string[]>([])


  useEffect(() => {

    function loadSelectedAchievements() {

      const saved =
        localStorage.getItem('selectedAchievements')

      if (!saved) {
        setSelectedIds([])
        return
      }

      try {

        const parsed =
          JSON.parse(saved)

        if (Array.isArray(parsed)) {
          setSelectedIds(parsed)
        } else {
          setSelectedIds([])
        }

      } catch {

        setSelectedIds([])

      }

    }


    loadSelectedAchievements()


    window.addEventListener(
      'trainingCompleted',
      loadSelectedAchievements
    )


    return () => {

      window.removeEventListener(
        'trainingCompleted',
        loadSelectedAchievements
      )

    }

  }, [])


  const unlocked =
    getUnlockedAchievements()


  const unlockedIds =
    new Set(
      unlocked.map(
        achievement => achievement.id
      )
    )


  /*
   * Nur ausgewählte UND bereits
   * freigeschaltete Achievements nehmen
   */

  const selectedAchievements: Achievement[] =
    selectedIds
      .map(id =>
        achievements.find(
          achievement =>
            achievement.id === id
        )
      )
      .filter(
        (achievement): achievement is Achievement =>
          achievement !== undefined &&
          unlockedIds.has(achievement.id)
      )
      .slice(0, 3)


  return (

    <div
      className="trophy-showcase"
      onClick={() => navigate('/achievements')}
    >

      {selectedAchievements.length === 0 ? (

        <div className="trophy-empty">

          <span className="trophy-empty-icon">
            🏆
          </span>

          <span className="trophy-empty-text">
            Trophäen
          </span>

        </div>

      ) : (

        <div className="trophy-list">

          {selectedAchievements.map(
            (achievement) => (

              <div
                className="trophy-item"
                key={achievement.id}
              >

                <div className="trophy-badge">

                  {achievement.badge}

                </div>

                <span className="trophy-name">

                  {achievement.name}

                </span>

              </div>

            )
          )}

        </div>

      )}

    </div>

  )
}


export default TrophyShowcase