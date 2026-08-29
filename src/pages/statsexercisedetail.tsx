import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function StatsExerciseDetail() {

const navigate = useNavigate()
const { exerciseName } = useParams()

const [exerciseData, setExerciseData] = useState<any[]>([])
const [exerciseDisplayName, setExerciseDisplayName] = useState('')

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

if (!savedTrainings || !exerciseName) {
  return
}

const trainings = JSON.parse(savedTrainings)

const result: any[] = []

trainings.forEach((training: any) => {

  training.exercises.forEach((exercise: any) => {

    if (exercise.name !== exerciseName) {
      return
    }

    let maxWeight = 0
    let maxReps = 0

    exercise.sets.forEach((set: any) => {

      const weight = Number(set.weight)
      const reps = Number(set.reps)

      if (
        !isNaN(weight) &&
        weight > maxWeight
      ) {
        maxWeight = weight
        maxReps = reps
      }

    })

    if (maxWeight > 0) {

      result.push({
        date: training.date,
        weight: maxWeight,
        reps: maxReps
      })

    }

  })

})


result.sort(
  (a, b) =>
    new Date(a.date).getTime() -
    new Date(b.date).getTime()
)


setExerciseData(result)

setExerciseDisplayName(
  exerciseNames[exerciseName] ?? exerciseName
)


}, [exerciseName])

function formatDate(date: string) {


return new Date(date).toLocaleDateString('de-DE', {
  day: '2-digit',
  month: '2-digit'
})


}

const bestWeight =
exerciseData.length > 0
? Math.max(
...exerciseData.map(
(item) => item.weight
)
)
: 0

const firstWeight =
exerciseData.length > 0
? exerciseData[0].weight
: 0

const currentWeight =
exerciseData.length > 0
? exerciseData[exerciseData.length - 1].weight
: 0

const growth =
firstWeight > 0
? ((currentWeight - firstWeight) /
firstWeight) *
100
: 0

/*

* LINIENDIAGRAMM
  */

function renderChart() {


if (exerciseData.length === 0) {
  return null
}

const width = 360
const height = 210

const paddingLeft = 42
const paddingRight = 15
const paddingTop = 20
const paddingBottom = 35

const chartWidth =
  width - paddingLeft - paddingRight

const chartHeight =
  height - paddingTop - paddingBottom


const weights =
  exerciseData.map(
    (item) => item.weight
  )


const minWeight =
  Math.min(...weights)

const maxWeight =
  Math.max(...weights)


let chartMin = Math.floor(
  minWeight / 5
) * 5

let chartMax = Math.ceil(
  maxWeight / 5
) * 5


if (chartMin === chartMax) {
  chartMin -= 5
  chartMax += 5
}


const range =
  chartMax - chartMin


const getX = (index: number) => {

  if (exerciseData.length === 1) {
    return paddingLeft + chartWidth / 2
  }

  return (
    paddingLeft +
    (index /
      (exerciseData.length - 1)) *
      chartWidth
  )

}


const getY = (weight: number) => {

  return (
    paddingTop +
    chartHeight -
    ((weight - chartMin) /
      range) *
      chartHeight
  )

}


const points =
  exerciseData.map(
    (item, index) => ({
      x: getX(index),
      y: getY(item.weight),
      weight: item.weight,
      date: item.date
    })
  )


const linePoints =
  points
    .map(
      (point) =>
        `${point.x},${point.y}`
    )
    .join(' ')


const gridLines = 4


return (

  <div className="exercise-line-chart">

    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="210"
      preserveAspectRatio="none"
    >

      {/* Horizontale Hilfslinien */}

      {Array.from(
        { length: gridLines + 1 },
        (_, index) => {

          const y =
            paddingTop +
            (index / gridLines) *
              chartHeight

          const value =
            chartMax -
            (index / gridLines) *
              range

          return (

            <g key={index}>

              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#292929"
                strokeWidth="1"
              />

              <text
                x={paddingLeft - 8}
                y={y + 4}
                textAnchor="end"
                fill="#777"
                fontSize="11"
              >
                {Math.round(value)} kg
              </text>

            </g>

          )

        }
      )}


      {/* Linie */}

      {exerciseData.length > 1 && (

        <polyline
          points={linePoints}
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

      )}


      {/* Punkte */}

      {points.map(
        (point, index) => (

        <g key={index}>

          <circle
            cx={point.x}
            cy={point.y}
            r="5"
            fill="#0f0f0f"
            stroke="white"
            strokeWidth="2"
          />

          <text
            x={point.x}
            y={point.y - 10}
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="600"
          >
            {point.weight}
          </text>

        </g>

      ))}


      {/* Datumsbeschriftungen */}

      {points.map(
        (point, index) => {

          /*
           * Bei vielen Trainings werden
           * nicht alle Daten angezeigt,
           * damit sich die Beschriftungen
           * nicht überschneiden.
           */

          const showDate =
            exerciseData.length <= 7 ||
            index === 0 ||
            index === exerciseData.length - 1 ||
            index % 2 === 0

          if (!showDate) {
            return null
          }

          return (

            <text
              key={index}
              x={point.x}
              y={height - 10}
              textAnchor="middle"
              fill="#777"
              fontSize="10"
            >
              {formatDate(point.date)}
            </text>

          )

        }
      )}

    </svg>

  </div>

)


}

return (


<div className="stats-page">

  <button
    className="stats-back-button"
    onClick={() =>
      navigate('/stats/exercise-progress')
    }
  >
    ← Zurück
  </button>


  <h1>
    {exerciseDisplayName}
  </h1>


  {exerciseData.length === 0 ? (

    <div className="stats-empty">
      Noch keine Daten vorhanden.
    </div>

  ) : (

    <>

      {/* ZUSAMMENFASSUNG */}

      <div className="exercise-detail-summary">

        <div>

          <span>
            PR
          </span>

          <strong>
            {bestWeight} kg
          </strong>

        </div>


        <div>

          <span>
            Aktuell
          </span>

          <strong>
            {currentWeight} kg
          </strong>

        </div>


        <div>

          <span>
            Wachstum
          </span>

          <strong>
            {growth > 0 ? '+' : ''}
            {growth.toFixed(1)}%
          </strong>

        </div>

      </div>


      {/* KRAFTVERLAUF */}

      <div className="exercise-progress-chart">

        <h2>
          Kraftverlauf
        </h2>

        {renderChart()}

      </div>


      {/* TRAININGSVERLAUF */}

      <div className="exercise-training-history">

        <h2>
          Trainingsverlauf
        </h2>


        {exerciseData
          .slice()
          .reverse()
          .map((item, index) => (

          <div
            className="exercise-training-item"
            key={index}
          >

            <div>

              <strong>
                {item.weight} kg
              </strong>

              <span>
                {item.reps > 0
                  ? `${item.reps} Wdh`
                  : ''}
              </span>

            </div>


            <small>
              {formatDate(item.date)}
            </small>

          </div>

        ))}

      </div>

    </>

  )}

</div>


)

}

export default StatsExerciseDetail
