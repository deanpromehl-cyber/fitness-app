
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StatsHistory() {

  const navigate = useNavigate()

  const [trainingHistory, setTrainingHistory] = useState<any[]>([])

  useEffect(() => {

  const savedTrainings = localStorage.getItem('trainingHistory')

  console.log('GESPEICHERTE TRAININGS:', savedTrainings)

  if (!savedTrainings) {
    console.log('Keine trainingHistory gefunden.')
    return
  }

  try {

    const parsedTrainings = JSON.parse(savedTrainings)

    console.log('PARSED TRAININGS:', parsedTrainings)
    console.log('ANZAHL TRAININGS:', parsedTrainings.length)

    setTrainingHistory([...parsedTrainings].reverse())

  } catch (error) {

    console.error('Fehler beim Lesen der trainingHistory:', error)

  }

}, [])

  function formatDuration(seconds: number) {

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }

    return `${minutes} min`
  }

  function formatDate(date: string) {

    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="stats-page">

      <button
        className="stats-back-button"
        onClick={() => navigate('/stats')}
      >
        ← Zurück
      </button>

      <h1>Workout History</h1>

      {trainingHistory.length === 0 ? (

        <div className="stats-empty">
          Noch keine Workouts vorhanden.
        </div>

      ) : (

        <div className="stats-workout-history">

          {trainingHistory.map((training) => (

            <div
  className="stats-workout-item"
  key={training.id}
  onClick={() =>
    navigate(`/stats/history/${training.id}`)
  }
>

              <div className="stats-workout-top">

                <h3 className="stats-workout-name">
                  {training.workoutName}
                </h3>

                <span className="stats-workout-date">
                  {formatDate(training.date)}
                </span>

              </div>

              <div className="stats-workout-info">

                <span>
                  {formatDuration(training.duration)}
                </span>

                <span>
                  {training.exercises.length} Übungen
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default StatsHistory

