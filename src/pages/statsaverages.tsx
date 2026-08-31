
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEffectiveSetWeight } from '../utils/bodyweight'



type Period = 'week' | 'month' | 'year' | 'all'

type Training = {
  id: number
  workoutId: number
  workoutName: string
  duration: number
  date: string
  exercises: {
    id: number
    name: string
    sets: {
      set: number
      weight: string
      reps: string
    }[]
  }[]
}

type ChartPoint = {
  label: string
  value: number
}

type DataType = 'workouts' | 'time' | 'weight'


function StatsAverages() {

     const navigate = useNavigate()

  const [period, setPeriod] = useState<Period>('month')
  const [trainings, setTrainings] = useState<Training[]>([])


  /* =========================
     TRAINING HISTORY LADEN
  ========================= */

  useEffect(() => {

    const savedTrainings =
      localStorage.getItem('trainingHistory')

    if (!savedTrainings) {
      return
    }

    try {

      const parsedTrainings =
        JSON.parse(savedTrainings)

      if (Array.isArray(parsedTrainings)) {
        setTrainings(parsedTrainings)
      }

    } catch {

      setTrainings([])

    }

  }, [])


  /* =========================
     CHART DATA
  ========================= */

  const chartData = useMemo(() => {

    const now = new Date()


    /* =========================
       WEEK
       Mo - So
    ========================= */

    if (period === 'week') {

      const start = new Date(now)

      const day =
        start.getDay() || 7

      start.setDate(
        start.getDate() - day + 1
      )

      start.setHours(
        0,
        0,
        0,
        0
      )


      return {
        workouts: createDailyData(
          start,
          7,
          trainings,
          'workouts'
        ),

        time: createDailyData(
          start,
          7,
          trainings,
          'time'
        ),

        weight: createDailyData(
          start,
          7,
          trainings,
          'weight'
        )
      }
    }


    /* =========================
       MONTH
       1–7
       8–14
       15–21
       22–28
       29–31
    ========================= */

    if (period === 'month') {

      const year =
        now.getFullYear()

      const month =
        now.getMonth()


      return {
        workouts: createWeeklyData(
          year,
          month,
          trainings,
          'workouts'
        ),

        time: createWeeklyData(
          year,
          month,
          trainings,
          'time'
        ),

        weight: createWeeklyData(
          year,
          month,
          trainings,
          'weight'
        )
      }
    }


    /* =========================
       YEAR
       Jan - Dez
    ========================= */

    if (period === 'year') {

      const start = new Date(
        now.getFullYear(),
        0,
        1
      )


      return {
        workouts: createMonthlyData(
          start,
          12,
          trainings,
          'workouts'
        ),

        time: createMonthlyData(
          start,
          12,
          trainings,
          'time'
        ),

        weight: createMonthlyData(
          start,
          12,
          trainings,
          'weight'
        )
      }
    }


    /* =========================
       ALL TIME
    ========================= */

    if (trainings.length === 0) {

      return {
        workouts: [],
        time: [],
        weight: []
      }
    }


    const dates = trainings.map(
      training =>
        new Date(training.date)
    )


    const firstDate = new Date(
      Math.min(
        ...dates.map(
          date => date.getTime()
        )
      )
    )


    const start = new Date(
      firstDate.getFullYear(),
      firstDate.getMonth(),
      1
    )


    const currentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )


    const months =
      (
        currentMonth.getFullYear() -
        start.getFullYear()
      ) *
      12 +
      currentMonth.getMonth() -
      start.getMonth() +
      1


    return {
      workouts: createMonthlyData(
        start,
        months,
        trainings,
        'workouts'
      ),

      time: createMonthlyData(
        start,
        months,
        trainings,
        'time'
      ),

      weight: createMonthlyData(
        start,
        months,
        trainings,
        'weight'
      )
    }

  }, [period, trainings])


  /* =========================
     X-ACHSE
  ========================= */

  const xAxisTitle =
    period === 'week'
      ? 'Tag'
      : period === 'month'
        ? 'Woche'
        : 'Monat'


  /* =========================
     PAGE
  ========================= */

  return (
    <div className="stats-averages-page">

<div className="stats-averages-header">

  <button
        className="stats-back-button"
        onClick={() =>
          navigate('/stats')
        }
      >
        ← Zurück
      </button>

  <h1>Average Statistics</h1>

</div>



      {/* ZEITRAUM */}

      <div className="average-period-selector">

        <button
          className={
            period === 'week'
              ? 'active'
              : ''
          }
          onClick={() =>
            setPeriod('week')
          }
        >
          WEEK
        </button>


        <button
          className={
            period === 'month'
              ? 'active'
              : ''
          }
          onClick={() =>
            setPeriod('month')
          }
        >
          MONTH
        </button>


        <button
          className={
            period === 'year'
              ? 'active'
              : ''
          }
          onClick={() =>
            setPeriod('year')
          }
        >
          YEAR
        </button>


        <button
          className={
            period === 'all'
              ? 'active'
              : ''
          }
          onClick={() =>
            setPeriod('all')
          }
        >
          ALL TIME
        </button>

      </div>


      {/* WORKOUTS */}

      <AverageChart
        title="Workouts"
        data={chartData.workouts}
        xAxisTitle={xAxisTitle}
      />


      {/* TIME */}

      <AverageChart
        title="Time"
        data={chartData.time}
        xAxisTitle={xAxisTitle}
      />


      {/* WEIGHT */}

      <AverageChart
        title="Gewicht"
        data={chartData.weight}
        xAxisTitle={xAxisTitle}
        unit="t"
      />

    </div>
  )
}


/* =========================
   GEWICHT BERECHNEN
========================= */

function calculateWeight(
  training: Training
): number {

  return training.exercises.reduce(
    (
      exerciseTotal,
      exercise
    ) => {

      return (
        exerciseTotal +
        exercise.sets.reduce(
          (
            setTotal,
            set
          ) => {

            const weight =
              Number(set.weight) || 0

            const reps =
              Number(set.reps) || 0


            return (
              setTotal +
              getEffectiveSetWeight(exercise.name, weight) * reps
            )

          },
          0
        )
      )

    },
    0
  ) / 1000
}


/* =========================
   TAGESDATEN
========================= */

function createDailyData(
  start: Date,
  count: number,
  trainings: Training[],
  type: DataType
): ChartPoint[] {

  const result: ChartPoint[] = []


  const weekdays = [
    'Mo',
    'Di',
    'Mi',
    'Do',
    'Fr',
    'Sa',
    'So'
  ]


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const date =
      new Date(start)


    date.setDate(
      start.getDate() + i
    )


    const nextDate =
      new Date(date)


    nextDate.setDate(
      date.getDate() + 1
    )


    const dayTrainings =
      trainings.filter(
        training => {

          const trainingDate =
            new Date(training.date)


          return (
            trainingDate >= date &&
            trainingDate < nextDate
          )

        }
      )


    let value = 0


    if (type === 'workouts') {

      value =
        dayTrainings.length
    }


    if (type === 'time') {

      const seconds =
        dayTrainings.reduce(
          (
            total,
            training
          ) =>
            total +
            training.duration,
          0
        )


      value =
        seconds / 3600
    }


    if (type === 'weight') {

      value =
        dayTrainings.reduce(
          (
            total,
            training
          ) =>
            total +
            calculateWeight(
              training
            ),
          0
        )
    }


    result.push({
      label: weekdays[i],
      value
    })

  }


  return result
}


/* =========================
   WOCHEN IM MONAT
========================= */

function createWeeklyData(
  year: number,
  month: number,
  trainings: Training[],
  type: DataType
): ChartPoint[] {

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate()


  const result: ChartPoint[] = []


  for (
    let startDay = 1;
    startDay <= daysInMonth;
    startDay += 7
  ) {

    const endDay =
      Math.min(
        startDay + 6,
        daysInMonth
      )


    const weekStart =
      new Date(
        year,
        month,
        startDay
      )


    weekStart.setHours(
      0,
      0,
      0,
      0
    )


    const weekEnd =
      new Date(
        year,
        month,
        endDay + 1
      )


    weekEnd.setHours(
      0,
      0,
      0,
      0
    )


    const weekTrainings =
      trainings.filter(
        training => {

          const date =
            new Date(training.date)


          return (
            date >= weekStart &&
            date < weekEnd
          )

        }
      )


    let value = 0


    if (type === 'workouts') {

      value =
        weekTrainings.length
    }


    if (type === 'time') {

      const seconds =
        weekTrainings.reduce(
          (
            total,
            training
          ) =>
            total +
            training.duration,
          0
        )


      value =
        seconds / 3600
    }


    if (type === 'weight') {

      value =
        weekTrainings.reduce(
          (
            total,
            training
          ) =>
            total +
            calculateWeight(
              training
            ),
          0
        )
    }


    result.push({
      label:
        `${startDay}–${endDay}`,
      value
    })

  }


  return result
}


/* =========================
   MONATLICHE DATEN
========================= */

function createMonthlyData(
  start: Date,
  count: number,
  trainings: Training[],
  type: DataType
): ChartPoint[] {

  const result: ChartPoint[] = []


  for (
    let i = 0;
    i < count;
    i++
  ) {

    const monthStart =
      new Date(
        start.getFullYear(),
        start.getMonth() + i,
        1
      )


    const monthEnd =
      new Date(
        start.getFullYear(),
        start.getMonth() + i + 1,
        1
      )


    const monthTrainings =
      trainings.filter(
        training => {

          const date =
            new Date(training.date)


          return (
            date >= monthStart &&
            date < monthEnd
          )

        }
      )


    let value = 0


    if (type === 'workouts') {

      value =
        monthTrainings.length
    }


    if (type === 'time') {

      const seconds =
        monthTrainings.reduce(
          (
            total,
            training
          ) =>
            total +
            training.duration,
          0
        )


      value =
        seconds / 3600
    }


    if (type === 'weight') {

      value =
        monthTrainings.reduce(
          (
            total,
            training
          ) =>
            total +
            calculateWeight(
              training
            ),
          0
        )
    }


    result.push({
      label:
        monthStart.toLocaleDateString(
          'de-DE',
          {
            month: 'short'
          }
        ),

      value
    })

  }


  return result
}


/* =========================
   Y-ACHSE SKALIERUNG
========================= */

function getYAxisValues(
  maxValue: number
): number[] {

  if (maxValue <= 0) {
    return [0, 1, 2, 3, 4, 5]
  }


  /*
   * Wir wollen ungefähr
   * 5 sinnvolle Abschnitte.
   */

  const roughStep =
    maxValue / 5


  const magnitude =
    Math.pow(
      10,
      Math.floor(
        Math.log10(roughStep)
      )
    )


  const normalized =
    roughStep / magnitude


  let niceStep: number


  if (normalized <= 1) {

    niceStep = 1 * magnitude

  } else if (normalized <= 2) {

    niceStep = 2 * magnitude

  } else if (normalized <= 5) {

    niceStep = 5 * magnitude

  } else {

    niceStep = 10 * magnitude

  }


  const axisMax =
    Math.ceil(
      maxValue / niceStep
    ) *
    niceStep


  const values: number[] = []


  for (
    let value = 0;
    value <= axisMax;
    value += niceStep
  ) {

    values.push(
      Number(
        value.toFixed(10)
      )
    )

  }


  return values
}


/* =========================
   ZAHLEN FORMATIEREN
========================= */

function formatAxisValue(
  value: number
): string {

  if (value >= 1000) {

    return value.toLocaleString(
      'de-DE',
      {
        maximumFractionDigits: 0
      }
    )

  }


  if (
    value > 0 &&
    value < 10 &&
    !Number.isInteger(value)
  ) {

    return value.toLocaleString(
      'de-DE',
      {
        maximumFractionDigits: 1
      }
    )

  }


  return value.toLocaleString(
    'de-DE',
    {
      maximumFractionDigits: 0
    }
  )
}


/* =========================
   DIAGRAMM
========================= */

function AverageChart({
  title,
  data,
  xAxisTitle,
  unit
}: {
  title: string
  data: ChartPoint[]
  xAxisTitle: string
  unit?: string
}) {

  if (data.length === 0) {

    return (
      <div className="average-chart">

        <h2>
          {title}
        </h2>


        <div className="average-chart-empty">
          Noch keine Trainingsdaten
        </div>

      </div>
    )
  }


  const width = 340
  const height = 210

  /*
   * Links etwas mehr Platz,
   * damit die Y-Werte ins SVG passen.
   */

  const paddingLeft = 42
  const paddingRight = 12
  const paddingTop = 12
  const paddingBottom = 45


  const maxValue =
    Math.max(
      ...data.map(
        point => point.value
      ),
      1
    )


  const yAxisValues =
    getYAxisValues(maxValue)


  const axisMax =
    yAxisValues[
      yAxisValues.length - 1
    ]


  /* =========================
     PUNKTE
  ========================= */

  const points =
    data.map(
      (
        point,
        index
      ) => {

        const x =
          paddingLeft +
          (
            index /
            Math.max(
              data.length - 1,
              1
            )
          ) *
          (
            width -
            paddingLeft -
            paddingRight
          )


        const y =
          height -
          paddingBottom -
          (
            point.value /
            axisMax
          ) *
          (
            height -
            paddingTop -
            paddingBottom
          )


        return {
          x,
          y,
          ...point
        }

      }
    )


  /* =========================
     LINIE
  ========================= */

  const line =
    points
      .map(
        (
          point,
          index
        ) =>
          `${
            index === 0
              ? 'M'
              : 'L'
          } ${point.x} ${point.y}`
      )
      .join(' ')


  return (
    <div className="average-chart">

      <h2>
        {title}
      </h2>


      <div className="average-chart-graph">

        <svg
          className="average-chart-svg"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >

          {/* =========================
              HORIZONTALE HILFSLINIEN
          ========================= */}

          {yAxisValues.map(
            (
              value,
              index
            ) => {

              const y =
                height -
                paddingBottom -
                (
                  value /
                  axisMax
                ) *
                (
                  height -
                  paddingTop -
                  paddingBottom
                )


              return (
                <g key={index}>

                  {/* HILFSLINIE */}

                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={
                      width -
                      paddingRight
                    }
                    y2={y}
                    className="chart-grid-line"
                  />


                  {/* Y-WERT */}

                  <text
                    x={
                      paddingLeft - 7
                    }
                    y={y + 3}
                    textAnchor="end"
                    className="chart-y-label"
                  >
                    {formatAxisValue(value)}{unit ? ` ${unit}` : ''}
                  </text>

                </g>
              )

            }
          )}


          {/* =========================
              X-ACHSE
          ========================= */}

          <line
            x1={paddingLeft}
            y1={
              height -
              paddingBottom
            }
            x2={
              width -
              paddingRight
            }
            y2={
              height -
              paddingBottom
            }
            className="chart-axis"
          />


          {/* =========================
              Y-ACHSE
          ========================= */}

          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={paddingLeft}
            y2={
              height -
              paddingBottom
            }
            className="chart-axis"
          />


          {/* =========================
              LINIE
          ========================= */}

          <path
            d={line}
            className="chart-line"
            fill="none"
          />


          {/* =========================
              PUNKTE
          ========================= */}

          {points.map(
            (
              point,
              index
            ) => (

              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="3"
                className="chart-point"
              />

            )
          )}


          {/* =========================
              X-WERTE
          ========================= */}

          {points.map(
            (
              point,
              index
            ) => (

              <text
                key={`x-${index}`}
                x={point.x}
                y={
                  height -
                  paddingBottom +
                  17
                }
                textAnchor="middle"
                className="chart-x-label"
              >
                {point.label}
              </text>

            )
          )}


          {/* =========================
              X-ACHSE TITEL
          ========================= */}

          <text
            x={
              (
                paddingLeft +
                width -
                paddingRight
              ) / 2
            }
            y={
              height - 5
            }
            textAnchor="middle"
            className="chart-x-title"
          >
            {xAxisTitle}
          </text>

        </svg>

      </div>

    </div>
  )
}


export default StatsAverages

