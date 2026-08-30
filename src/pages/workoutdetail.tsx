import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { exerciseOptions } from '../utils/exercises'

function WorkoutDetail() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [workout, setWorkout] = useState<any>(null)

  useEffect(() => {

    const savedWorkouts = localStorage.getItem('workouts')

    if (savedWorkouts) {

      const workouts = JSON.parse(savedWorkouts)

      const foundWorkout = workouts.find(
        (workout: any) => workout.id.toString() === id
      )

      setWorkout(foundWorkout)
    }

  }, [id])

  function saveChanges() {
  const savedWorkouts = localStorage.getItem('workouts')

  if (!savedWorkouts) {
    return
  }

  const workouts = JSON.parse(savedWorkouts)

  const updatedWorkouts = workouts.map((item: any) =>
    item.id === workout.id
      ? workout
      : item
  )

  localStorage.setItem(
    'workouts',
    JSON.stringify(updatedWorkouts)
  )

  alert('Änderungen gespeichert!')
  navigate('/workouts')
}

function deleteWorkout() {
  const savedWorkouts = localStorage.getItem('workouts')

  if (!savedWorkouts) {
    return
  }

  const workouts = JSON.parse(savedWorkouts)

  const updatedWorkouts = workouts.filter(
    (item: any) => item.id !== workout.id
  )

  localStorage.setItem(
    'workouts',
    JSON.stringify(updatedWorkouts)
  )

  alert('Workout gelöscht!')

  navigate('/workouts')
}

  if (!workout) {
    return <p>Workout nicht gefunden.</p>
  }

  return (
    <div className="workout-detail">

      <input
  type="text"
  value={workout.name}
  onChange={(e) =>
    setWorkout({
      ...workout,
      name: e.target.value
    })
  }
/>

    <input
  className="workout-name-input"
  type="text"
  value={workout.name}
  onChange={(e) =>
    setWorkout({
      ...workout,
      name: e.target.value
    })
  }
/> 

      {workout.exercises.map((exercise: any) => (

  <div
    className="exercise-card"
    key={exercise.id}
  >

    <label>Übung</label>

    <select
      className="exercise-select"
      value={exercise.name}
      onChange={(e) => {

        setWorkout({
          ...workout,
          exercises: workout.exercises.map((item: any) =>
            item.id === exercise.id
              ? {
                  ...item,
                  name: e.target.value
                }
              : item
          )
        })

      }}
    >

      <option value="">Übung auswählen</option>
      {exerciseOptions.map((option) => (
        <option key={option.id} value={option.id}>{option.name}</option>
      ))}

    </select>

  

    <label>Sätze</label>

    <div className="sets-control">

      <button
        type="button"
        onClick={() => {

          setWorkout({
            ...workout,
            exercises: workout.exercises.map((item: any) =>
              item.id === exercise.id
                ? {
                    ...item,
                    sets: Math.max(1, item.sets - 1)
                  }
                : item
            )
          })

        }}
      >
        −
      </button>

  

      <input
        type="number"
        value={exercise.sets}
        readOnly
      />

      <button
        type="button"
        onClick={() => {

          setWorkout({
            ...workout,
            exercises: workout.exercises.map((item: any) =>
              item.id === exercise.id
                ? {
                    ...item,
                    sets: item.sets + 1
                  }
                : item
            )
          })

        }}
      >
        +
      </button>



    </div>

   

  </div>

  

))}


 <button
    className="save-workout"
    onClick={saveChanges}
  >
    Änderungen speichern
  </button>

<button
  className="delete-workout"
  onClick={deleteWorkout}
>
  Workout löschen
</button>

    </div>

    
  )
}

export default WorkoutDetail
