
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

{/* Brust */}
<option value="bench_press">Bankdrücken</option>
<option value="incline_bench_press">Schrägbankdrücken</option>
<option value="dumbbell_bench_press">Kurzhantel-Bankdrücken</option>
<option value="cable_fly">Kabel-Flys</option>

{/* Beine */}
<option value="squat">Kniebeugen</option>
<option value="leg_press">Beinpresse</option>
<option value="leg_extension">Beinstrecker</option>
<option value="leg_curl">Beinbeuger</option>
<option value="lunges">Ausfallschritte</option>
<option value="calf_raise">Wadenheben</option>

{/* Rücken */}
<option value="deadlift">Kreuzheben</option>
<option value="lat_pulldown">Latzug</option>
<option value="pull_up">Klimmzüge</option>
<option value="barbell_row">Langhantelrudern</option>
<option value="seated_cable_row">Kabelrudern</option>

{/* Schultern */}
<option value="shoulder_press">Schulterdrücken</option>
<option value="lateral_raise">Seitheben</option>
<option value="front_raise">Frontheben</option>
<option value="reverse_fly">Reverse Flys</option>

{/* Bizeps */}
<option value="bicep_curl">Bizepscurls</option>
<option value="hammer_curl">Hammercurls</option>
<option value="preacher_curl">Preacher Curls</option>

{/* Trizeps */}
<option value="tricep_pushdown">Trizepsdrücken</option>
<option value="skull_crusher">French Press</option>
<option value="overhead_tricep_extension">
  Overhead Trizepsdrücken
</option>

{/* Bauch */}
<option value="crunch">Crunches</option>
<option value="cable_crunch">Kabel-Crunches</option>
<option value="hanging_leg_raise">
  Hanging Leg Raises
</option>
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