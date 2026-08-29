
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


function StatsPersonalRecords() {

  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const [records, setRecords] = useState<any[]>([])

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

  if (!savedTrainings) {
    return
  }

  const trainings = JSON.parse(savedTrainings)

  const bestRecords: Record<string, any> = {}

  trainings.forEach((training: any) => {

    training.exercises.forEach((exercise: any) => {

      exercise.sets.forEach((set: any) => {

        const weight = Number(set.weight)

        // Leere oder ungültige Gewichte ignorieren
        if (isNaN(weight) || weight <= 0) {
          return
        }

        // Gibt es noch keinen PR für diese Übung
        // oder ist dieses Gewicht höher?
        if (
          !bestRecords[exercise.name] ||
          weight > bestRecords[exercise.name].weight
        ) {

          bestRecords[exercise.name] = {
            name: exercise.name,
            weight: weight,
            reps: Number(set.reps) || 0,
            date: training.date
          }

        }

      })

    })

  })

  setRecords(Object.values(bestRecords))

}, [])




  function formatDate(date: string) {

    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

  }


  return (
    <div className="stats-page">

      <button
        className="stats-back-button"
        onClick={() => navigate('/stats')}
      >
        ← Zurück
      </button>


      <h1>🏆 Personal Records</h1>


      <div className="stats-search">

  <input
    type="text"
    placeholder="Übung suchen..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

</div>


<div className="stats-record-list">

  {records
    .filter((record) => {

      const exerciseName =
        exerciseNames[record.name] ?? record.name

      return exerciseName
        .toLowerCase()
        .includes(search.toLowerCase())

    })
    .map((record) => (

      <div
        className="stats-record-item"
        key={record.name}
      >

        <div className="stats-record-left">

          <h2>
            {exerciseNames[record.name] ?? record.name}
          </h2>

          <span>
            {record.reps > 0
              ? `${record.reps} Wdh`
              : 'Keine Wdh angegeben'}
          </span>

        </div>


        <div className="stats-record-right">

          <strong>
            {record.weight} kg
          </strong>

          <small>
            {formatDate(record.date)}
          </small>

        </div>

      </div>

    ))}

</div>

    </div>
  )
}

export default StatsPersonalRecords

