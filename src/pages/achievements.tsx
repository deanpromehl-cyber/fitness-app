
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  achievements
} from '../utils/achievements'

import {
  getUnlockedAchievements,
  getAchievementProgress
} from '../utils/achievementManager'



function Achievements() {

    const navigate = useNavigate()

  const [unlockedIds, setUnlockedIds] =
    useState<Set<string>>(new Set())

  const [selectedIds, setSelectedIds] =
    useState<string[]>([])

  const [openCategory, setOpenCategory] =
    useState<string | null>(null)

  const [trainingHistory, setTrainingHistory] =
    useState<any[]>([])


  // ==========================================
  // KATEGORIEN
  // ==========================================

  const categoryNames: Record<string, string> = {

    pushups: 'Push Ups',
    pullups: 'Pull Ups',
    dips: 'Dips',
    workouts: 'Workouts',
    weight: 'All Time Gewicht',
    time: 'Time Spent Lifting',
    chest: 'Chest Specialist',
    abs: 'Bauch Specialist',
    back: 'Back Specialist',
    arms: 'Arms Specialist',
    legs: 'Legs Specialist'

  }


  const categoryIcons: Record<string, string> = {

    pushups: '💪',
    pullups: '🧗',
    dips: '🏋️',
    workouts: '🏆',
    weight: '⚖️',
    time: '⏱️',
    chest: '🫀',
    abs: '🔥',
    back: '🔙',
    arms: '💪',
    legs: '🦵'

  }


  // ==========================================
  // ACHIEVEMENTS LADEN
  // ==========================================

  function loadAchievements() {

    const unlocked =
      getUnlockedAchievements()

    setUnlockedIds(
      new Set(
        unlocked.map(
          achievement => achievement.id
        )
      )
    )

  }


  // ==========================================
  // TRAINING HISTORY LADEN
  // ==========================================

  function loadTrainingHistory() {

    const saved =
      localStorage.getItem('trainingHistory')

    if (!saved) {

      setTrainingHistory([])

      return

    }

    try {

      const parsed =
        JSON.parse(saved)

      setTrainingHistory(
        Array.isArray(parsed)
          ? parsed
          : []
      )

    } catch {

      setTrainingHistory([])

    }

  }


  // ==========================================
  // AUSGEWÄHLTE TROPHÄEN LADEN
  // ==========================================

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


  // ==========================================
  // BEIM LADEN
  // ==========================================

  useEffect(() => {

    loadAchievements()
    loadSelectedAchievements()
    loadTrainingHistory()


    const handleTrainingCompleted = () => {

      loadAchievements()
      loadSelectedAchievements()
      loadTrainingHistory()

    }


    window.addEventListener(
      'trainingCompleted',
      handleTrainingCompleted
    )


    return () => {

      window.removeEventListener(
        'trainingCompleted',
        handleTrainingCompleted
      )

    }

  }, [])


  // ==========================================
  // TROPHÄE AUSWÄHLEN
  // ==========================================

  function toggleAchievement(
    achievementId: string
  ) {

    if (
      selectedIds.includes(
        achievementId
      )
    ) {

      const newSelection =
        selectedIds.filter(
          id => id !== achievementId
        )

      setSelectedIds(newSelection)

      localStorage.setItem(
        'selectedAchievements',
        JSON.stringify(newSelection)
      )

      return

    }


    if (
      selectedIds.length >= 3
    ) {

      return

    }


    const newSelection = [
      ...selectedIds,
      achievementId
    ]

    setSelectedIds(newSelection)

    localStorage.setItem(
      'selectedAchievements',
      JSON.stringify(newSelection)
    )

  }


  // ==========================================
  // FORTSCHRITT BERECHNEN
  // ==========================================

  function getProgressData(
    achievement: typeof achievements[number],
    categoryAchievements: typeof achievements
  ) {

    const current =
      getAchievementProgress(
        achievement,
        trainingHistory
      )


    const currentIndex =
      categoryAchievements.findIndex(
        item =>
          item.id === achievement.id
      )


    const isUnlocked =
      unlockedIds.has(
        achievement.id
      )


    // ========================================
    // ERREICHT
    // ========================================

    if (isUnlocked) {

      return {

        percentage: 100,

        current,

        target: achievement.requirement,

        isLast:
          currentIndex ===
          categoryAchievements.length - 1

      }

    }


    // ========================================
    // PRÜFEN OB VORHERIGE TROPHÄE
    // ERREICHT WURDE
    // ========================================

    const previousAchievement =
      categoryAchievements[
        currentIndex - 1
      ]


    if (
      previousAchievement &&
      !unlockedIds.has(
        previousAchievement.id
      )
    ) {

      return {

        percentage: 0,

        current,

        target: achievement.requirement,

        isLast: false

      }

    }


    // ========================================
    // NÄCHSTE TROPHÄE
    // ========================================

    const percentage =
      Math.min(
        100,
        Math.max(
          0,
          (current /
            achievement.requirement) *
            100
        )
      )


    return {

      percentage,

      current,

      target:
        achievement.requirement,

      isLast:
        currentIndex ===
        categoryAchievements.length - 1

    }

  }


  // ==========================================
  // KATEGORIEN ERSTELLEN
  // ==========================================

  const categories =
    Array.from(
      new Set(
        achievements.map(
          achievement =>
            achievement.category
        )
      )
    )


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="achievements-page">

        <button
  type="button"
  className="stats-back-button"
  onClick={() => navigate('/')}
>
  ← Zurück
</button>

      <h1>Trophäen</h1>


      {/* AUSWAHL INFO */}

      <div className="selected-achievements-info">

        <span>
          Ausgewählt: {selectedIds.length} / 3
        </span>

        <small>
          Wähle bis zu 3 Trophäen für deine Startseite.
        </small>

      </div>


      {/* KATEGORIEN */}

      <div className="achievement-categories">

        {categories.map(
          (category) => {

            const categoryAchievements =
              achievements.filter(
                achievement =>
                  achievement.category === category
              )


            const unlockedCount =
              categoryAchievements.filter(
                achievement =>
                  unlockedIds.has(
                    achievement.id
                  )
              ).length


            const isOpen =
              openCategory === category


            return (

              <div
                className={`achievement-category ${
                  isOpen
                    ? 'open'
                    : ''
                }`}
                key={category}
              >


                {/* KATEGORIE HEADER */}

                <button
                  type="button"
                  className="achievement-category-header"
                  onClick={() => {

                    setOpenCategory(
                      isOpen
                        ? null
                        : category
                    )

                  }}
                >

                  <div className="achievement-category-title">

                    <span className="category-icon">

                      {categoryIcons[category] ?? '🏆'}

                    </span>

                    <span>
                      {categoryNames[category] ?? category}
                    </span>

                  </div>


                  <div className="achievement-category-right">

                    <span className="category-count">

                      {unlockedCount}/
                      {categoryAchievements.length}

                    </span>


                    <span className="category-arrow">

                      {isOpen
                        ? '⌄'
                        : '›'}

                    </span>

                  </div>

                </button>


                {/* TROPHÄEN */}

                {isOpen && (

                  <div className="achievement-category-content">

                    {categoryAchievements.map(
                      (achievement) => {

                        const unlocked =
                          unlockedIds.has(
                            achievement.id
                          )


                        const selected =
                          selectedIds.includes(
                            achievement.id
                          )


                        const progress =
                          getProgressData(
                            achievement,
                            categoryAchievements
                          )


                        return (

                          <div
                            className={`achievement-card ${
                              unlocked
                                ? 'unlocked'
                                : 'locked'
                            } ${
                              selected
                                ? 'selected'
                                : ''
                            }`}

                            key={achievement.id}

                            onClick={() => {

                              if (unlocked) {

                                toggleAchievement(
                                  achievement.id
                                )

                              }

                            }}
                          >


                            {/* BADGE */}

                            <div className="achievement-badge">

                              {unlocked
                                ? achievement.badge
                                : '🔒'}

                            </div>


                            {/* INFORMATIONEN */}

                            <div className="achievement-info">

                              <h2>
                                {achievement.name}
                              </h2>


                              <p>
                                {achievement.description}
                              </p>


                              {/* FORTSCHRITT */}

                              <div className="achievement-progress-text">

                                <span>

                                  {progress.isLast &&
                                  progress.percentage >= 100

                                    ? '100 %'

                                    : `${progress.percentage.toFixed(0)} %`
                                  }

                                </span>


                                <span>

                                  {progress.current.toLocaleString(
                                    'de-DE',
                                    {
                                      maximumFractionDigits: 1
                                    }
                                  )}

                                  {' / '}

                                  {progress.target.toLocaleString(
                                    'de-DE'
                                  )}

                                </span>

                              </div>


                              {/* FORTSCHRITTSBALKEN */}

                              <div className="achievement-progress">

                                <div
                                  className="achievement-progress-fill"
                                  style={{
                                    width:
                                      `${progress.percentage}%`
                                  }}
                                />

                              </div>


                              {/* STATUS */}

                              <span className="achievement-status">

                                {unlocked

                                  ? selected
                                    ? '✓ Ausgewählt'
                                    : 'Freigeschaltet'

                                  : progress.percentage > 0
                                    ? 'In Arbeit'
                                    : 'Noch nicht freigeschaltet'}

                              </span>

                            </div>

                          </div>

                        )

                      }
                    )}

                  </div>

                )}

              </div>

            )

          }
        )}

      </div>

    </div>

  )

}


export default Achievements

