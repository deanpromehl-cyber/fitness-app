
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateWorkout() {

    const navigate = useNavigate()

  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: '',
      sets: 3
    }
  ])

  const [workoutName, setWorkoutName] = useState('')

  function addExercise() {
    setExercises([
      ...exercises,
      {
        id: Date.now(),
        name: '',
        sets: 3
      }
    ])
  }

  function changeSets(id: number, amount: number) {
  setExercises(
    exercises.map((exercise) =>
      exercise.id === id
        ? {
            ...exercise,
            sets: Math.max(1, exercise.sets + amount)
          }
        : exercise
    )
  )
}

function removeExercise(id: number) {
  setExercises(
    exercises.filter((exercise) => exercise.id !== id)
  )
}

function saveWorkout() {
  const savedWorkouts = localStorage.getItem('workouts')

  const workouts = savedWorkouts
    ? JSON.parse(savedWorkouts)
    : []

  const workout = {
    id: Date.now(),
    name: workoutName,
    exercises: exercises
  }

  workouts.push(workout)

  localStorage.setItem(
    'workouts',
    JSON.stringify(workouts)
  )

  console.log('Workout gespeichert:', workout)

  navigate('/workouts')
}

  return (
    <div className="create-workout-page">

      <h1>Workout erstellen</h1>

      <label>Workout Name</label>

      <input
  type="text"
  placeholder="z.B. Push Day"
  value={workoutName}
  onChange={(e) => setWorkoutName(e.target.value)}
/>

      {exercises.map((exercise) => (
        <div className="exercise-card" key={exercise.id}>

           <button
  type="button"
  className="remove-exercise"
  onClick={() => removeExercise(exercise.id)}
>
  ×
</button> 

          <label>Übung</label>

          <select
  className="exercise-select"
  value={exercise.name}
  onChange={(e) => {
    setExercises(
      exercises.map((item) =>
        item.id === exercise.id
          ? { ...item, name: e.target.value }
          : item
      )
    )
  }}
>
  <option value="">Übung auswählen</option>
  <option value="bench_press">Bankdrücken</option>
  <option value="squat">Kniebeugen</option>
  <option value="deadlift">Kreuzheben</option>
  <option value="shoulder_press">Schulterdrücken</option>
  <option value="lat_pulldown">Latzug</option>
  <option value="barbell_row">Langhantelrudern</option>
  <option value="bicep_curl">Bizepscurls</option>
  <option value="tricep_pushdown">Trizepsdrücken</option>
</select>

          <label>Sätze</label>

          <div className="sets-control">

  <button
    type="button"
    onClick={() => changeSets(exercise.id, -1)}
  >
    −
  </button>

  <input
    type="number"
    value={exercise.sets}
    min={1}
    readOnly
  />

  <button
    type="button"
    onClick={() => changeSets(exercise.id, 1)}
  >
    +
  </button>

</div>

        </div>
      ))}

      <button
        className="add-exercise"
        onClick={addExercise}
      >
        + Übung hinzufügen
      </button>

      <button
  className="save-workout"
  onClick={saveWorkout}
>
  Workout speichern
</button>



    </div>

    
  )
}

export default CreateWorkout