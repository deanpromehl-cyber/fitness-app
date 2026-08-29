
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type MuscleGroup = {
  key: string
  name: string
}

type MuscleData = {
  [key: string]: number
}

function StatsMuscleGroups() {

  const navigate = useNavigate()

  const [muscleData, setMuscleData] = useState<MuscleData>({})


  /*
   * MUSKELGRUPPEN
   */

  const muscleGroups: MuscleGroup[] = [
    {
      key: 'chest',
      name: 'Brust'
    },
    {
      key: 'back',
      name: 'Rücken'
    },
    {
      key: 'legs',
      name: 'Beine'
    },
    {
      key: 'shoulders',
      name: 'Schultern'
    },
    {
      key: 'biceps',
      name: 'Bizeps'
    },
    {
      key: 'triceps',
      name: 'Trizeps'
    },
    {
      key: 'abs',
      name: 'Bauch'
    }
  ]


  /*
   * ÜBUNGEN → MUSKELGRUPPE
   */

  const exerciseMuscleGroups: Record<string, string> = {

    // Brust
    bench_press: 'chest',
    incline_bench_press: 'chest',
    dumbbell_bench_press: 'chest',
    cable_fly: 'chest',

    // Beine
    squat: 'legs',
    leg_press: 'legs',
    leg_extension: 'legs',
    leg_curl: 'legs',
    lunges: 'legs',
    calf_raise: 'legs',

    // Rücken
    deadlift: 'back',
    lat_pulldown: 'back',
    pull_up: 'back',
    barbell_row: 'back',
    seated_cable_row: 'back',

    // Schultern
    shoulder_press: 'shoulders',
    lateral_raise: 'shoulders',
    front_raise: 'shoulders',
    reverse_fly: 'shoulders',

    // Bizeps
    bicep_curl: 'biceps',
    hammer_curl: 'biceps',
    preacher_curl: 'biceps',

    // Trizeps
    tricep_pushdown: 'triceps',
    skull_crusher: 'triceps',
    overhead_tricep_extension: 'triceps',

    // Bauch
    crunch: 'abs',
    cable_crunch: 'abs',
    hanging_leg_raise: 'abs'
  }


  /*
   * TRAININGSDATEN LADEN
   */

  useEffect(() => {

    const savedTrainings =
      localStorage.getItem('trainingHistory')

    if (!savedTrainings) {
      return
    }

    try {

      const trainings = JSON.parse(savedTrainings)

      const counts: MuscleData = {}

      muscleGroups.forEach((muscle) => {
        counts[muscle.key] = 0
      })


      trainings.forEach((training: any) => {

        if (!training.exercises) {
          return
        }

        training.exercises.forEach((exercise: any) => {

          const muscle =
            exerciseMuscleGroups[exercise.name]

          if (!muscle) {
            return
          }

          if (!exercise.sets) {
            return
          }

          counts[muscle] += exercise.sets.length

        })

      })


      setMuscleData(counts)

    } catch (error) {

      console.error(
        'Fehler beim Laden der Trainingsdaten:',
        error
      )

    }

  }, [])


  /*
   * GESAMT
   */

  const totalSets =
    muscleGroups.reduce(
      (sum, muscle) =>
        sum + (muscleData[muscle.key] || 0),
      0
    )


  /*
   * HÖCHSTER WERT
   *
   * Dieser Wert wird zur Skalierung
   * des Radar-Charts benutzt.
   */

  const maxSets =
    Math.max(
      ...muscleGroups.map(
        (muscle) =>
          muscleData[muscle.key] || 0
      ),
      1
    )


  /*
   * RADAR-CHART
   */

  const centerX = 200
  const centerY = 200
  const radius = 130

  const angleStep =
    (Math.PI * 2) /
    muscleGroups.length


  function getPoint(
    index: number,
    value: number
  ) {

    const angle =
      -Math.PI / 2 +
      index * angleStep

    const distance =
      (value / maxSets) *
      radius

    return {
      x:
        centerX +
        Math.cos(angle) *
        distance,

      y:
        centerY +
        Math.sin(angle) *
        distance
    }

  }


  /*
   * ÄUSSERES 100%-NETZ
   */

  const outerPoints =
    muscleGroups
      .map((_, index) => {

        const point =
          getPoint(
            index,
            maxSets
          )

        return `${point.x},${point.y}`

      })
      .join(' ')


  /*
   * 75%, 50%, 25%
   */

  function createGrid(
    percentage: number
  ) {

    const points =
      muscleGroups
        .map((_, index) => {

          const point =
            getPoint(
              index,
              maxSets * percentage
            )

          return `${point.x},${point.y}`

        })
        .join(' ')

    return points

  }


  /*
   * DATENFLÄCHE
   */

  const dataPoints =
    muscleGroups
      .map((muscle, index) => {

        const point =
          getPoint(
            index,
            muscleData[muscle.key] || 0
          )

        return `${point.x},${point.y}`

      })
      .join(' ')


  /*
   * ACHSEN
   */

  const axisLines =
    muscleGroups.map((_, index) => {

      const point =
        getPoint(
          index,
          maxSets
        )

      return (
        <line
          key={index}
          x1={centerX}
          y1={centerY}
          x2={point.x}
          y2={point.y}
          className="muscle-axis"
        />
      )

    })


  /*
   * LABEL POSITIONEN
   */

  function getLabelPosition(
    index: number
  ) {

    const angle =
      -Math.PI / 2 +
      index * angleStep

    const labelRadius =
      radius + 35

    return {
      x:
        centerX +
        Math.cos(angle) *
        labelRadius,

      y:
        centerY +
        Math.sin(angle) *
        labelRadius
    }

  }


  return (

    <div className="stats-page">

      {/* ZURÜCK */}

      <button
        className="stats-back-button"
        onClick={() =>
          navigate('/stats')
        }
      >
        ← Zurück
      </button>


      {/* TITEL */}

      <h1>Muscle Groups</h1>

      


      {totalSets === 0 ? (

        <div className="stats-empty">

          Noch keine Trainingsdaten vorhanden.

        </div>

      ) : (

        <>

          {/* RADAR */}

          <div className="muscle-radar-container">

            <svg
              viewBox="0 0 400 400"
              className="muscle-radar"
            >

              {/* 25% */}

              <polygon
                points={createGrid(0.25)}
                className="muscle-grid"
              />

              {/* 50% */}

              <polygon
                points={createGrid(0.50)}
                className="muscle-grid"
              />

              {/* 75% */}

              <polygon
                points={createGrid(0.75)}
                className="muscle-grid"
              />

              {/* 100% */}

              <polygon
                points={outerPoints}
                className="muscle-grid muscle-grid-outer"
              />


              {/* ACHSEN */}

              {axisLines}


              {/* DATENFLÄCHE */}

              <polygon
                points={dataPoints}
                className="muscle-data-area"
              />


              {/* VERBUNDENE PUNKTE */}

              {muscleGroups.map(
                (muscle, index) => {

                  const point =
                    getPoint(
                      index,
                      muscleData[muscle.key] || 0
                    )

                  return (

                    <circle
                      key={muscle.key}
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      className="muscle-data-point"
                    />

                  )

                }
              )}


              {/* LABELS */}

              {muscleGroups.map(
                (muscle, index) => {

                  const position =
                    getLabelPosition(index)

                  const sets =
                    muscleData[muscle.key] || 0

                  const percentage =
                    totalSets > 0
                      ? Math.round(
                          (sets / totalSets) *
                          100
                        )
                      : 0

                  let textAnchor:
                    'start' |
                    'middle' |
                    'end' = 'middle'

                  if (position.x < 150) {
                    textAnchor = 'end'
                  }

                  if (position.x > 250) {
                    textAnchor = 'start'
                  }

                  return (

                    <g
                      key={muscle.key}
                    >

                      <text
                        x={position.x}
                        y={position.y - 8}
                        textAnchor={textAnchor}
                        className="muscle-label"
                      >
                        {muscle.name}
                      </text>

                      <text
                        x={position.x}
                        y={position.y + 12}
                        textAnchor={textAnchor}
                        className="muscle-label-info"
                      >
                        {sets} Sätze
                      </text>

                      <text
                        x={position.x}
                        y={position.y + 30}
                        textAnchor={textAnchor}
                        className="muscle-label-percent"
                      >
                        {percentage}%
                      </text>

                    </g>

                  )

                }
              )}

            </svg>

          </div>


          {/* ÜBERSICHT */}

          <div className="muscle-overview">

            <div className="muscle-overview-header">

              <h2>Übersicht</h2>

              <span>
                Gesamt: <strong>{totalSets}</strong> Sätze
              </span>

            </div>


            <div className="muscle-overview-list">

              {muscleGroups.map(
                (muscle) => {

                  const sets =
                    muscleData[muscle.key] || 0

                  const percentage =
                    totalSets > 0
                      ? Math.round(
                          (sets / totalSets) *
                          100
                        )
                      : 0

                  const barWidth =
                    totalSets > 0
                      ? (sets / totalSets) * 100
                      : 0

                  return (

                    <div
                      className="muscle-overview-item"
                      key={muscle.key}
                    >

                      <div className="muscle-overview-name">

                        <span className="muscle-dot" />

                        <strong>
                          {muscle.name}
                        </strong>

                      </div>


                      <span className="muscle-overview-sets">
                        {sets} Sätze
                      </span>


                      <span className="muscle-overview-percent">
                        {percentage}%
                      </span>


                      <div className="muscle-progress">

                        <div
                          className="muscle-progress-fill"
                          style={{
                            width:
                              `${barWidth}%`
                          }}
                        />

                      </div>

                    </div>

                  )

                }
              )}

            </div>

          </div>

        </>

      )}

    </div>

  )

}

export default StatsMuscleGroups

