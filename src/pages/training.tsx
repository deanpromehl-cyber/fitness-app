
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


function Training() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [workout, setWorkout] = useState<any>(null)
  const [openExercise, setOpenExercise] = useState<number | null>(null)
  const [exerciseSets, setExerciseSets] = useState<Record<number, number>>({})
  const [elapsedTime, setElapsedTime] = useState(0)
  const [setData, setSetData] = useState<
  Record<number, Record<number, { weight: string; reps: string }>>
>({})

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

  useEffect(() => {
  const timer = setInterval(() => {
    setElapsedTime((time) => time + 1)
  }, 1000)

  return () => clearInterval(timer)
}, [])

  if (!workout) {
    return <p>Workout nicht gefunden.</p>
  }

  function toggleExercise(exerciseId: number) {

    if (openExercise === exerciseId) {
      setOpenExercise(null)
    } else {
      setOpenExercise(exerciseId)
    }

  }

  function updateSetData(
  exerciseId: number,
  setIndex: number,
  field: 'weight' | 'reps',
  value: string
) {
  setSetData((previous) => ({
    ...previous,
    [exerciseId]: {
      ...previous[exerciseId],
      [setIndex]: {
        ...previous[exerciseId]?.[setIndex],
        [field]: value
      }
    }
  }))
}



  function getExerciseName(name: string) {
  const exerciseNames: Record<string, string> = {
    bench_press: 'Bankdrücken',
    squat: 'Kniebeugen',
    deadlift: 'Kreuzheben',
    shoulder_press: 'Schulterdrücken',
    lat_pulldown: 'Latzug',
    barbell_row: 'Langhantelrudern',
    bicep_curl: 'Bizepscurls',
    tricep_pushdown: 'Trizepsdrücken'
  }

  return exerciseNames[name] ?? name
}

function addExercise() {

  const newExercise = {
    id: Date.now(),
    name: '',
    sets: 3,
    temporary: true
  }

  setWorkout((previous: any) => ({
    ...previous,
    exercises: [
      ...previous.exercises,
      newExercise
    ]
  }))
}

function removeExercise(exerciseId: number) {

  setWorkout((previous: any) => ({
    ...previous,
    exercises: previous.exercises.filter(
      (exercise: any) => exercise.id !== exerciseId
    )
  }))

  setOpenExercise(null)
}

function finishTraining() {

     const confirmed = window.confirm(
    'Möchtest du das Training wirklich beenden?'
  )

  if (!confirmed) {
    return
  }


  const savedTrainings = localStorage.getItem('trainingHistory')

  const trainingHistory = savedTrainings
    ? JSON.parse(savedTrainings)
    : []

  const completedExercises = workout.exercises.map((exercise: any) => {

    const numberOfSets =
      exerciseSets[exercise.id] ?? exercise.sets

    const sets = Array.from(
      { length: numberOfSets },
      (_, index) => ({
        set: index + 1,
        weight: setData[exercise.id]?.[index]?.weight ?? '',
        reps: setData[exercise.id]?.[index]?.reps ?? ''
      })
    )

    return {
      id: exercise.id,
      name: exercise.name,
      sets
    }
  })

  const training = {
    id: Date.now(),
    workoutId: workout.id,
    workoutName: workout.name,
    duration: elapsedTime,
    date: new Date().toISOString(),
    exercises: completedExercises
  }

  trainingHistory.push(training)

  localStorage.setItem(
    'trainingHistory',
    JSON.stringify(trainingHistory)
  )

  navigate('/')
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}




  return (
    <div className="training-page">

      <div className="training-top">

         <h1>{workout.name}</h1>

        <span className="training-timer">
            {formatTime(elapsedTime)}
         </span>

        </div>

      <div className="training-exercises">

        {workout.exercises.map((exercise: any) => (

          <div
            className="training-card"
            key={exercise.id}
          >

            <div
              className="training-card-header"
              onClick={() => toggleExercise(exercise.id)}
            >

              <h2>{getExerciseName(exercise.name)}</h2>

              <button
  type="button"
  className="remove-training-exercise"
  onClick={(e) => {
    e.stopPropagation()
    removeExercise(exercise.id)
  }}
>
  ×
</button>

              <div className="training-card-right">

                <span>
                {exerciseSets[exercise.id] ?? exercise.sets} Sätze
                </span>

                <span className="training-arrow">
                  {openExercise === exercise.id ? '⌄' : '›'}
                </span>

              </div>

            </div>

            {openExercise === exercise.id && (



              <div className="training-card-content">


{exercise.temporary && (

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
    <option value="bench_press">Bankdrücken</option>
    <option value="squat">Kniebeugen</option>
    <option value="deadlift">Kreuzheben</option>
    <option value="shoulder_press">Schulterdrücken</option>
    <option value="lat_pulldown">Latzug</option>
    <option value="barbell_row">Langhantelrudern</option>
    <option value="bicep_curl">Bizepscurls</option>
    <option value="tricep_pushdown">Trizepsdrücken</option>
  </select>

)}
                

  <div className="set-header">
    <span>Satz</span>
    <span>Gewicht</span>
    <span>Wdh</span>
  </div>



{Array.from(
  {
    length: exerciseSets[exercise.id] ?? exercise.sets
  },
  (_, index) => (
    <div className="set-row" key={index}>

      <span className="set-number">
        {index + 1}.
      </span>

      <input
  type="number"
  placeholder="kg"
  value={setData[exercise.id]?.[index]?.weight ?? ''}
  onChange={(e) =>
    updateSetData(
      exercise.id,
      index,
      'weight',
      e.target.value
    )
  }
/>

      <input
  type="number"
  placeholder="Wdh"
  value={setData[exercise.id]?.[index]?.reps ?? ''}
  onChange={(e) =>
    updateSetData(
      exercise.id,
      index,
      'reps',
      e.target.value
    )
  }
/>

    </div>
  )
)}

<div className="set-controls">

  <button
    type="button"
    onClick={() => {
      const currentSets =
        exerciseSets[exercise.id] ?? exercise.sets

      if (currentSets > 1) {
        setExerciseSets({
          ...exerciseSets,
          [exercise.id]: currentSets - 1
        })
      }
    }}
  >
    −
  </button>

  <span>Satz</span>

  <button
    type="button"
    onClick={() => {
      const currentSets =
        exerciseSets[exercise.id] ?? exercise.sets

      setExerciseSets({
        ...exerciseSets,
        [exercise.id]: currentSets + 1
      })
    }}
  >
    +
  </button>
  

</div>

</div>

            )}

          </div>

        ))}

        <button
  type="button"
  className="add-training-exercise"
  onClick={addExercise}
>
  + Übung hinzufügen
</button>
<button
  className="finish-training"
  onClick={finishTraining}
>
  Training beenden
</button>


      </div>

    </div>
  )
}

export default Training

