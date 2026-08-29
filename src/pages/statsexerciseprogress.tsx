
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function StatsExerciseProgress() {

  const navigate = useNavigate()

  const [exercises, setExercises] = useState<any[]>([])
  const [search, setSearch] = useState('')


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

    const savedTrainings =
      localStorage.getItem('trainingHistory')

    if (!savedTrainings) {
      return
    }

    const trainings = JSON.parse(savedTrainings)

    const exerciseData: Record<string, any> = {}


    trainings.forEach((training: any) => {

      training.exercises.forEach((exercise: any) => {

        if (!exerciseData[exercise.name]) {

          exerciseData[exercise.name] = {
            name: exercise.name,
            firstWeight: 0,
            currentWeight: 0,
            bestWeight: 0,
            totalSets: 0,
            firstDate: training.date,
            lastDate: training.date
          }

        }


        const data = exerciseData[exercise.name]

        let trainingMax = 0


        exercise.sets.forEach((set: any) => {

          const weight = Number(set.weight)

          if (
            isNaN(weight) ||
            weight <= 0
          ) {
            return
          }

          data.totalSets++

          if (weight > data.bestWeight) {
            data.bestWeight = weight
          }

          if (weight > trainingMax) {
            trainingMax = weight
          }

        })


        if (trainingMax > 0) {

          if (data.firstWeight === 0) {
            data.firstWeight = trainingMax
            data.firstDate = training.date
          }

          data.currentWeight = trainingMax
          data.lastDate = training.date

        }

      })

    })


    setExercises(
      Object.values(exerciseData)
    )

  }, [])


  function getGrowth(exercise: any) {

    if (
      !exercise.firstWeight ||
      !exercise.currentWeight
    ) {
      return 0
    }

    return (
      ((exercise.currentWeight -
        exercise.firstWeight) /
        exercise.firstWeight) *
      100
    )

  }


  return (

    <div className="stats-page">

      <button
        className="stats-back-button"
        onClick={() => navigate('/stats')}
      >
        ← Zurück
      </button>


      <h1>💪 Exercise Progress</h1>


      <div className="stats-search">

        <input
          type="text"
          placeholder="Übung suchen..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      <div className="stats-exercise-list">

        {exercises
          .filter((exercise) => {

            const name =
              exerciseNames[exercise.name] ??
              exercise.name

            return name
              .toLowerCase()
              .includes(search.toLowerCase())

          })
          .map((exercise) => {

            const growth =
              getGrowth(exercise)

            return (

              <div
                className="stats-exercise-item"
                key={exercise.name}
                onClick={() =>
  navigate(
    `/stats/exercise-progress/${exercise.name}`
  )
}
              >

                <div className="stats-exercise-left">

                  <h2>
                    {exerciseNames[exercise.name] ??
                      exercise.name}
                  </h2>

                  <span>
                    {exercise.totalSets} Sätze
                  </span>

                </div>


                <div className="stats-exercise-right">

                  <strong>
                    PR {exercise.bestWeight} kg
                  </strong>

                  <span>
                    {growth > 0 ? '+' : ''}
                    {growth.toFixed(1)}%
                  </span>

                </div>


                <span className="stats-exercise-arrow">
                  ›
                </span>

              </div>

            )

          })}

      </div>

    </div>

  )

}

export default StatsExerciseProgress

