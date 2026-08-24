import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

function Workouts() {


  const navigate = useNavigate()

  const [workouts, setWorkouts] = useState<any[]>([])

useEffect(() => {
  const savedWorkouts = localStorage.getItem('workouts')

  if (savedWorkouts) {
    setWorkouts(JSON.parse(savedWorkouts))
  }
}, [])

  return (
    <div className="workouts">

      <h1>Workouts</h1>

      <button className="create-workout" onClick={() => navigate('/create-workout')}>
        + Workout erstellen
      </button>

      <h2 className="h2">Meine Workouts</h2>

     {workouts.map((workout) => (
  <div className="workout-card" key={workout.id}>

    <h3>{workout.name}</h3>

    <small>
      {workout.exercises.length} Übungen
    </small>

  </div>
))}
    </div>
  )
}

export default Workouts