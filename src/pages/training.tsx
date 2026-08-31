
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  calculateTrainingXP
} from '../utils/xp'

import {
  checkAchievements
} from '../utils/achievementManager'
import { exerciseNames } from '../utils/exercises'
import ExercisePicker from '../components/ExercisePicker'
import { getBodyweightLoadFactor } from '../utils/bodyweight'

/*
const exerciseMuscleGroups: Record<string, string> = {

  // Brust
  bench_press: 'Brust',
  incline_bench_press: 'Brust',
  dumbbell_bench_press: 'Brust',
  cable_fly: 'Brust',

  // Beine
  squat: 'Beine',
  leg_press: 'Beine',
  leg_extension: 'Beine',
  leg_curl: 'Beine',
  lunges: 'Beine',
  calf_raise: 'Waden',

  // Rücken
  deadlift: 'Rücken',
  lat_pulldown: 'Rücken',
  pull_up: 'Rücken',
  barbell_row: 'Rücken',
  seated_cable_row: 'Rücken',

  // Schultern
  shoulder_press: 'Schultern',
  lateral_raise: 'Schultern',
  front_raise: 'Schultern',
  reverse_fly: 'Schultern',

  // Bizeps
  bicep_curl: 'Bizeps',
  hammer_curl: 'Bizeps',
  preacher_curl: 'Bizeps',

  // Trizeps
  tricep_pushdown: 'Trizeps',
  skull_crusher: 'Trizeps',
  overhead_tricep_extension: 'Trizeps',

  // Bauch
  crunch: 'Bauch',
  cable_crunch: 'Bauch',
  hanging_leg_raise: 'Bauch'

}
*/


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
  const [previousSetData, setPreviousSetData] = useState<Record<string, { weight: string; reps: string }>>({})
  const [bodyWeight, setBodyWeight] = useState<number | null>(null)

useEffect(() => {
  const loadBodyWeight = () => {
    try {
      const settings = JSON.parse(localStorage.getItem('profileSettings') || '{}') as { bodyWeight?: number }
      setBodyWeight(settings.bodyWeight && settings.bodyWeight > 0 ? settings.bodyWeight : null)
    } catch {
      setBodyWeight(null)
    }
  }

  loadBodyWeight()
  window.addEventListener('cloudDataLoaded', loadBodyWeight)
  return () => window.removeEventListener('cloudDataLoaded', loadBodyWeight)
}, [])

useEffect(() => {

  if (!workout || !id) {
    return
  }

  const trainingState = {
    workout,
    elapsedTime,
    exerciseSets,
    setData
  }

  localStorage.setItem(
    `activeTraining-${id}`,
    JSON.stringify(trainingState)
  )

}, [workout, elapsedTime, exerciseSets, setData, id])

useEffect(() => {

  const savedTrainings = localStorage.getItem('trainingHistory')
  if (savedTrainings) {
    try {
      const previousTraining = (JSON.parse(savedTrainings) as any[])
        .filter((training) => training.workoutId?.toString() === id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      if (previousTraining) {
        const previousValues: Record<string, { weight: string; reps: string }> = {}
        previousTraining.exercises.forEach((exercise: any) => {
          exercise.sets?.forEach((set: any, index: number) => {
            if (set.weight || set.reps) previousValues[`${exercise.id}:${index}`] = { weight: set.weight ?? '', reps: set.reps ?? '' }
          })
        })
        setPreviousSetData(previousValues)
      }
    } catch {
      setPreviousSetData({})
    }
  }

  const activeTraining = localStorage.getItem(
    `activeTraining-${id}`
  )

  if (activeTraining) {

    const savedState = JSON.parse(activeTraining)

    setWorkout(savedState.workout)
    setElapsedTime(savedState.elapsedTime ?? 0)
    setExerciseSets(savedState.exerciseSets ?? {})
    setSetData(savedState.setData ?? {})

    return
  }

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
  return exerciseNames[name] ?? name
}

function getSuggestedBodyweight(exerciseName: string) {
  return getBodyweightLoadFactor(exerciseName) !== null && bodyWeight ? String(bodyWeight) : ''
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


  /* =========================
     BISHERIGE TRAININGS LADEN
  ========================= */

  const savedTrainings =
    localStorage.getItem('trainingHistory')

  const trainingHistory =
    savedTrainings
      ? JSON.parse(savedTrainings)
      : []


  /* =========================
     TRAINING ERSTELLEN
  ========================= */

  const completedExercises =
    workout.exercises.map(
      (exercise: any) => {

        const numberOfSets =
          exerciseSets[exercise.id] ??
          exercise.sets


        const sets =
          Array.from(
            {
              length: numberOfSets
            },
            (_, index) => ({

              set: index + 1,

              weight:
                setData[
                  exercise.id
                ]?.[index]?.weight ?? getSuggestedBodyweight(exercise.name),

              reps:
                setData[
                  exercise.id
                ]?.[index]?.reps ?? ''

            })
          )


        return {

          id: exercise.id,

          name: exercise.name,

          sets

        }

      }
    )


  const training = {

    id: Date.now(),

    workoutId: workout.id,

    workoutName: workout.name,

    duration: elapsedTime,

    date: new Date().toISOString(),

    exercises: completedExercises

  }


  /* =========================
     XP BERECHNEN
  ========================= */

  const xp = calculateTrainingXP(
    training,
    trainingHistory
  )


  /* =========================
     XP AM TRAINING SPEICHERN
  ========================= */

  const trainingWithXP = {

    ...training,

    xp: xp.totalXP,

    xpDetails: {

      sets: xp.setXP,

      weight: xp.weightXP,

      time: xp.timeXP,

      prs: xp.prXP

    }

  }


  /* =========================
     TRAINING SPEICHERN
  ========================= */

  trainingHistory.push(
    trainingWithXP
  )


  localStorage.setItem(
    'trainingHistory',
    JSON.stringify(
      trainingHistory
    )
  )

  window.dispatchEvent(
  new Event('trainingCompleted')
)


checkAchievements(
  trainingHistory
)


 

  localStorage.removeItem(
    `activeTraining-${id}`
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

  <ExercisePicker
  value={exercise.name}
  onChange={(nextName) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.map((item: any) =>
        item.id === exercise.id
          ? {
              ...item,
              name: nextName
            }
          : item
      )
    })
  }}
/>

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
  placeholder={previousSetData[`${exercise.id}:${index}`]?.weight || 'kg'}
  value={setData[exercise.id]?.[index]?.weight ?? getSuggestedBodyweight(exercise.name)}
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
  placeholder={previousSetData[`${exercise.id}:${index}`]?.reps || 'Wdh'}
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

