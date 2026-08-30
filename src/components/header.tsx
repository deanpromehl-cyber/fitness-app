
import { useEffect, useState } from 'react'

import {
  calculateLevel,
  calculateTotalXP,
  type LevelInfo
} from '../utils/level'


function Header() {

  const [levelInfo, setLevelInfo] =
    useState<LevelInfo>(
      calculateLevel(0)
    )


  function loadLevel() {

    const savedTrainings =
      localStorage.getItem('trainingHistory')


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

  }


  useEffect(() => {

    // Level beim Laden des Headers berechnen
    loadLevel()


    // Auf abgeschlossene Trainings reagieren
    const handleTrainingCompleted = () => {
      loadLevel()
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


  return (
    <header className="header">

      <span className="level">
        Level {levelInfo.level}
      </span>

      <span className="username">
        Username
      </span>

      <span className="date">
  {new Date().toLocaleDateString('de-DE')}
</span>

    </header>
  )
}


export default Header

