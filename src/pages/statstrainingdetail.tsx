


import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function StatsHistoryDetail() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [training, setTraining] = useState<any>(null)

  const exerciseNames: Record<string, string> = {
    bench_press: 'Bankdrücken',
    incline_bench_press: 'Schrägbankdrücken',
    dumbbell_bench_press: 'Kurzhantel-Bankdrücken',
    cable_fly: 'Kabel-Flys',

    squat: 'Kniebeugen',
    leg_press: 'Beinpresse',
    leg_extension: 'Beinstrecker',
    leg_curl: 'Beinbeuger',
    lunges: 'Ausfallschritte',
    calf_raise: 'Wadenheben',

    deadlift: 'Kreuzheben',
    lat_pulldown: 'Latzug',
    pull_up: 'Klimmzüge',
    barbell_row: 'Langhantelrudern',
    seated_cable_row: 'Kabelrudern',

    shoulder_press: 'Schulterdrücken',
    lateral_raise: 'Seitheben',
    front_raise: 'Frontheben',
    reverse_fly: 'Reverse Flys',

    bicep_curl: 'Bizepscurls',
    hammer_curl: 'Hammercurls',
    preacher_curl: 'Preacher Curls',

    tricep_pushdown: 'Trizepsdrücken',
    skull_crusher: 'French Press',
    overhead_tricep_extension: 'Overhead Trizepsdrücken',

    crunch: 'Crunches',
    cable_crunch: 'Kabel-Crunches',
    hanging_leg_raise: 'Hanging Leg Raises'
  }

  useEffect(() => {

    const savedTrainings = localStorage.getItem('trainingHistory')

    if (!savedTrainings || !id) {
      return
    }

    const trainings = JSON.parse(savedTrainings)

    const foundTraining = trainings.find(
      (item: any) => item.id.toString() === id
    )

    if (foundTraining) {
      setTraining(foundTraining)
    }

  }, [id])


  function updateWeight(
    exerciseIndex: number,
    setIndex: number,
    value: string
  ) {

    setTraining((previous: any) => {

      const updated = structuredClone(previous)

      updated.exercises[exerciseIndex].sets[setIndex].weight = value

      return updated
    })

  }


  function updateReps(
    exerciseIndex: number,
    setIndex: number,
    value: string
  ) {

    setTraining((previous: any) => {

      const updated = structuredClone(previous)

      updated.exercises[exerciseIndex].sets[setIndex].reps = value

      return updated
    })

  }


  function updateSetCount(
    exerciseIndex: number,
    amount: number
  ) {

    setTraining((previous: any) => {

      const updated = structuredClone(previous)

      const sets = updated.exercises[exerciseIndex].sets

      if (amount > 0) {

        sets.push({
          set: sets.length + 1,
          weight: '',
          reps: ''
        })

      } else if (sets.length > 1) {

        sets.pop()

      }

      sets.forEach((set: any, index: number) => {
        set.set = index + 1
      })

      return updated
    })

  }


  function updateDuration(value: string) {

    const minutes = Number(value)

    setTraining((previous: any) => ({
      ...previous,
      duration: Math.max(0, minutes) * 60
    }))

  }


  function saveChanges() {

    const savedTrainings = localStorage.getItem('trainingHistory')

    if (!savedTrainings || !training) {
      return
    }

    const trainings = JSON.parse(savedTrainings)

    const updatedTrainings = trainings.map((item: any) =>
      item.id === training.id
        ? training
        : item
    )

    localStorage.setItem(
      'trainingHistory',
      JSON.stringify(updatedTrainings)
    )

    navigate('/stats/history')
  }


  if (!training) {
    return (
      <div className="stats-page">

        <button
          className="stats-back-button"
          onClick={() => navigate('/stats/history')}
        >
          ← Zurück
        </button>

        <p className="stats-empty">
          Workout nicht gefunden.
        </p>

      </div>
    )
  }


  const durationMinutes = Math.floor(
    training.duration / 60
  )


  return (
    <div className="stats-page">

      <button
        className="stats-back-button"
        onClick={() => navigate('/stats/history')}
      >
        ← Zurück
      </button>


      <h1>{training.workoutName}</h1>


      {/* TRAININGSZEIT */}

      <div className="stats-edit-duration">

        <label>Trainingszeit</label>

        <div className="stats-number-control">

  <button
    type="button"
    onClick={() =>
      updateDuration(
        (durationMinutes - 1).toString()
      )
    }
  >
    −
  </button>

  <input
    type="number"
    min="0"
    value={durationMinutes}
    onChange={(e) =>
      updateDuration(e.target.value)
    }
  />

  <button
    type="button"
    onClick={() =>
      updateDuration(
        (durationMinutes + 1).toString()
      )
    }
  >
    +
  </button>

  <span>Minuten</span>

</div>

      </div>


      {/* ÜBUNGEN */}

      <div className="stats-edit-exercises">

        {training.exercises.map(
          (exercise: any, exerciseIndex: number) => (

          <div
            className="stats-edit-exercise"
            key={exercise.id}
          >

            <h2>
              {exerciseNames[exercise.name] ?? exercise.name}
            </h2>


            <div className="stats-edit-header">

              <span>Satz</span>
              <span>Gewicht</span>
              <span>Wdh</span>

            </div>


            {exercise.sets.map(
              (set: any, setIndex: number) => (

              <div
                className="stats-edit-set"
                key={setIndex}
              >

                <span className="stats-edit-set-number">
                  {setIndex + 1}.
                </span>


                <input
                  type="number"
                  placeholder="kg"
                  value={set.weight}
                  onChange={(e) =>
                    updateWeight(
                      exerciseIndex,
                      setIndex,
                      e.target.value
                    )
                  }
                />


                <input
                  type="number"
                  placeholder="Wdh"
                  value={set.reps}
                  onChange={(e) =>
                    updateReps(
                      exerciseIndex,
                      setIndex,
                      e.target.value
                    )
                  }
                />

              </div>

            ))}


            {/* SÄTZE ÄNDERN */}

            <div className="stats-edit-set-controls">

              <button
                type="button"
                onClick={() =>
                  updateSetCount(exerciseIndex, -1)
                }
              >
                −
              </button>


              <span>
                {exercise.sets.length} Sätze
              </span>


              <button
                type="button"
                onClick={() =>
                  updateSetCount(exerciseIndex, 1)
                }
              >
                +
              </button>

            </div>

          </div>

        ))}

      </div>


      <button
        className="stats-save-button"
        onClick={saveChanges}
      >
        Änderungen speichern
      </button>

    </div>
  )
}

export default StatsHistoryDetail

