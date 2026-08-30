import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'


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


function StatsCalendar() {

  const navigate = useNavigate()

  const [trainings, setTrainings] = useState<Training[]>([])

  const [currentDate, setCurrentDate] =
    useState(new Date())

  const [selectedDate, setSelectedDate] =
    useState<string | null>(null)


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

      const parsed =
        JSON.parse(savedTrainings)

      if (Array.isArray(parsed)) {
        setTrainings(parsed)
      }

    } catch {

      setTrainings([])

    }

  }, [])


  /* =========================
     MONATSDATEN
  ========================= */

  const year =
    currentDate.getFullYear()

  const month =
    currentDate.getMonth()


  const monthName =
    currentDate.toLocaleDateString(
      'de-DE',
      {
        month: 'long',
        year: 'numeric'
      }
    )


  /* =========================
     TAGE DES MONATS
  ========================= */

  const calendarDays = useMemo(() => {

    const firstDay =
      new Date(
        year,
        month,
        1
      )


    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate()


    /*
     * JS:
     * Sonntag = 0
     * Montag = 1
     *
     * Wir wollen Montag als ersten Tag.
     */

    const firstWeekday =
      (firstDay.getDay() + 6) % 7


    const days: (number | null)[] = []


    /* Leere Felder vor dem 1. */

    for (
      let i = 0;
      i < firstWeekday;
      i++
    ) {

      days.push(null)

    }


    /* Tage des Monats */

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {

      days.push(day)

    }


    return days

  }, [year, month])


  /* =========================
     DATUM FORMATIEREN
  ========================= */

  function getDateKey(
    day: number
  ) {

    const date =
      new Date(
        year,
        month,
        day
      )


    return (
      `${date.getFullYear()}-` +
      `${String(
        date.getMonth() + 1
      ).padStart(2, '0')}-` +
      `${String(
        date.getDate()
      ).padStart(2, '0')}`
    )

  }


  /* =========================
     TRAININGS EINES TAGES
  ========================= */

  function getTrainingsForDay(
    day: number
  ) {

    return trainings.filter(
      training => {

        const date =
          new Date(training.date)


        return (
          date.getFullYear() === year &&
          date.getMonth() === month &&
          date.getDate() === day
        )

      }
    )

  }


  /* =========================
     VORHERIGER MONAT
  ========================= */

  function previousMonth() {

    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    )

    setSelectedDate(null)

  }


  /* =========================
     NÄCHSTER MONAT
  ========================= */

  function nextMonth() {

    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    )

    setSelectedDate(null)

  }


  /* =========================
     HEUTE
  ========================= */

  function goToToday() {

    const today = new Date()

    setCurrentDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    )

    setSelectedDate(
      `${today.getFullYear()}-` +
      `${String(
        today.getMonth() + 1
      ).padStart(2, '0')}-` +
      `${String(
        today.getDate()
      ).padStart(2, '0')}`
    )

  }


  /* =========================
     IST HEUTE?
  ========================= */

  function isToday(
    day: number
  ) {

    const today =
      new Date()


    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    )

  }


  /* =========================
     AUSGEWÄHLTER TAG
  ========================= */

  const selectedTrainings =
    selectedDate
      ? trainings.filter(
          training => {

            const date =
              new Date(
                training.date
              )


            const key =
              `${date.getFullYear()}-` +
              `${String(
                date.getMonth() + 1
              ).padStart(2, '0')}-` +
              `${String(
                date.getDate()
              ).padStart(2, '0')}`


            return key === selectedDate

          }
        )
      : []


  /* =========================
     AUSGEWÄHLTES DATUM TEXT
  ========================= */

  function getSelectedDateText() {

    if (!selectedDate) {
      return ''
    }


    const date =
      new Date(
        `${selectedDate}T12:00:00`
      )


    return date.toLocaleDateString(
      'de-DE',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }
    )

  }


  return (
    <div className="stats-calendar-page">

      <button
        className="stats-back-button"
        onClick={() => navigate('/stats')}
      >
        ← Zurück
      </button>

      {/* =========================
          HEADER
      ========================= */}

      <div className="stats-calendar-header">
        <h1>
          Training Calendar
        </h1>

      </div>


      {/* =========================
          MONTH NAVIGATION
      ========================= */}

      <div className="calendar-month-header">

        <button
          className="calendar-month-button"
          onClick={previousMonth}
        >
          ‹
        </button>


        <span className="calendar-month-title">
          {monthName}
        </span>


        <button
          className="calendar-month-button"
          onClick={nextMonth}
        >
          ›
        </button>

      </div>


      {/* =========================
          TODAY BUTTON
      ========================= */}

      <button
        className="calendar-today-button"
        onClick={goToToday}
      >
        Heute
      </button>


      {/* =========================
          CALENDAR
      ========================= */}

      <div className="training-calendar">


        {/* WOCHENTAGE */}

        <div className="calendar-weekdays">

          <span>Mo</span>
          <span>Di</span>
          <span>Mi</span>
          <span>Do</span>
          <span>Fr</span>
          <span>Sa</span>
          <span>So</span>

        </div>


        {/* TAGE */}

        <div className="calendar-grid">

          {calendarDays.map(
            (day, index) => {

              if (day === null) {

                return (
                  <div
                    key={`empty-${index}`}
                    className="calendar-day empty"
                  />
                )

              }


              const dayTrainings =
                getTrainingsForDay(day)


              const hasTraining =
                dayTrainings.length > 0


              const dateKey =
                getDateKey(day)


              const selected =
                selectedDate === dateKey


              return (
                <button
                  key={day}
                  className={`
                    calendar-day
                    ${hasTraining ? 'has-training' : ''}
                    ${isToday(day) ? 'today' : ''}
                    ${selected ? 'selected' : ''}
                  `}
                  onClick={() =>
                    setSelectedDate(
                      dateKey
                    )
                  }
                >

                  <span className="calendar-day-number">
                    {day}
                  </span>


                  {hasTraining && (

                    <span className="calendar-training-dot">
                      {dayTrainings.length}
                    </span>

                  )}

                </button>
              )

            }
          )}

        </div>

      </div>


      {/* =========================
          AUSGEWÄHLTER TAG
      ========================= */}

      {selectedDate && (

        <div className="calendar-selected-day">

          <h2>
            {getSelectedDateText()}
          </h2>


          {selectedTrainings.length === 0 ? (

            <div className="calendar-no-training">
              Kein Training an diesem Tag
            </div>

          ) : (

            <div className="calendar-training-list">

              {selectedTrainings.map(
                training => (

                  <button
                    key={training.id}
                    className="calendar-training-card"
                    onClick={() =>
                      navigate(
                        `/stats/history/${training.id}`
                      )
                    }
                  >

                    <div className="calendar-training-info">

                      <strong>
                        {training.workoutName}
                      </strong>


                      <span>
                        {formatDuration(
                          training.duration
                        )}
                      </span>

                    </div>


                    <span className="calendar-training-arrow">
                      ›
                    </span>

                  </button>

                )
              )}

            </div>

          )}

        </div>

      )}

    </div>
  )
}


/* =========================
   ZEIT FORMATIEREN
========================= */

function formatDuration(
  seconds: number
) {

  const hours =
    Math.floor(
      seconds / 3600
    )


  const minutes =
    Math.floor(
      (seconds % 3600) / 60
    )


  if (hours > 0) {

    return `${hours}h ${minutes}min`

  }


  return `${minutes} min`

}


export default StatsCalendar
