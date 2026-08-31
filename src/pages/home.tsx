import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TrophyShowcase from '../components/TrophyShowcase'
import { getEffectiveSetWeight } from '../utils/bodyweight'

function Home() {

  const navigate = useNavigate()

  const [workouts, setWorkouts] = useState<any[]>([])

  const [selectedWorkout, setSelectedWorkout] = useState('')

  const [trainingHistory, setTrainingHistory] = useState<any[]>([])

  useEffect(() => {

    const savedWorkouts = localStorage.getItem('workouts')

    if (savedWorkouts) {

      setWorkouts(JSON.parse(savedWorkouts))

    }

  }, [])

  useEffect(() => {

    const savedTrainings = localStorage.getItem('trainingHistory')

    if (savedTrainings) {

      setTrainingHistory(JSON.parse(savedTrainings))

    }

  }, [])

  const totalWorkouts = trainingHistory.length

const totalLifted = trainingHistory.reduce(
  (total: number, training: any) => {

    return total + training.exercises.reduce(
      (exerciseTotal: number, exercise: any) => {

        return exerciseTotal + exercise.sets.reduce(
          (setTotal: number, set: any) => {

            const weight = Number(set.weight) || 0
            const reps = Number(set.reps) || 0

            return setTotal + getEffectiveSetWeight(exercise.name, weight) * reps

          },
          0
        )

      },
      0
    )

  },
  0
)

const totalTime = trainingHistory.reduce(
  (total: number, training: any) =>
    total + (Number(training.duration) || 0),
  0
)

const totalHours = Math.floor(totalTime / 3600)
const totalMinutes = Math.floor((totalTime % 3600) / 60)

const now = new Date()

const monthlyTrainings = trainingHistory.filter((training: any) => {

  const trainingDate = new Date(training.date)

  return (
    trainingDate.getMonth() === now.getMonth() &&
    trainingDate.getFullYear() === now.getFullYear()
  )

})

const monthlyWorkouts = monthlyTrainings.length

const monthlyLifted = monthlyTrainings.reduce(
  (total: number, training: any) => {

    return total + training.exercises.reduce(
      (exerciseTotal: number, exercise: any) => {

        return exerciseTotal + exercise.sets.reduce(
          (setTotal: number, set: any) => {

            const weight = Number(set.weight) || 0
            const reps = Number(set.reps) || 0

            return setTotal + getEffectiveSetWeight(exercise.name, weight) * reps

          },
          0
        )

      },
      0
    )

  },
  0
)

const monthlyTime = monthlyTrainings.reduce(
  (total: number, training: any) =>
    total + (Number(training.duration) || 0),
  0
)

const monthlyHours = Math.floor(monthlyTime / 3600)

const monthlyMinutes = Math.floor(
  (monthlyTime % 3600) / 60
)

  return (
    <div className="home">
      <div className="homenumbers">

  <p>Workouts: {totalWorkouts}</p>

  <p>
    Lifted: {(totalLifted / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })} t
  </p>

  <p>
    Time: {totalHours} h {totalMinutes} min
  </p>

</div>
    <div className="trophies">

<TrophyShowcase />
    </div>

  <div className="maintraining">

    <button
  className="starttraining"
  onClick={() => {
  if (selectedWorkout) {

    localStorage.removeItem(
      `activeTraining-${selectedWorkout}`
    )

    navigate(`/training/${selectedWorkout}`)
  }
}}
>
  Start Training
</button>

   <select
  className="workout-select"
  value={selectedWorkout}
  onChange={(e) => setSelectedWorkout(e.target.value)}
>
  <option value="">Workout auswählen</option>

  {workouts.map((workout) => (
    <option
      key={workout.id}
      value={workout.id}
    >
      {workout.name}
    </option>
  ))}
</select>



  </div> 


<div className="recent-workouts">

  <h2>Letzte Workouts</h2>

  <div className="workout-history">

    {trainingHistory.length === 0 ? (

      <p className="no-workouts">
        Noch keine Trainings absolviert.
      </p>

    ) : (

      trainingHistory
        .slice()
        .reverse()
        .slice(0, 3)
        .map((training) => {

          const date = new Date(training.date)

          const formattedDate = date.toLocaleDateString('de-DE')

          const hours = Math.floor(training.duration / 3600)
          const minutes = Math.floor((training.duration % 3600) / 60)

          const formattedDuration =
            hours > 0
              ? `${hours} h ${minutes} min`
              : `${minutes} min`

          const totalWeight = training.exercises.reduce(
            (total: number, exercise: any) => {

              return total + exercise.sets.reduce(
                (exerciseTotal: number, set: any) => {

                  const weight = Number(set.weight) || 0
                  const reps = Number(set.reps) || 0

                  return exerciseTotal + getEffectiveSetWeight(exercise.name, weight) * reps

                },
                0
              )

            },
            0
          )

          return (

            <div
              className="workout-history-item"
              key={training.id}
            >

              <div>

                <p className="workout-date">
                  {formattedDate}
                </p>

                <h3>{training.workoutName}</h3>

              </div>

              <div className="workout-stats">

                <span>{formattedDuration}</span>

                <span>
                  {totalWeight.toLocaleString('de-DE')} kg
                </span>

              </div>

            </div>

          )

        })

    )}

  </div>

</div>



<div className="monthly-stats">

  <h2>Dieser Monat</h2>

  <div className="monthly-stats-box">

    <div>
      <span>Workouts</span>
      <strong>{monthlyWorkouts}</strong>
    </div>

    <div>
      <span>Time</span>
      <strong>
        {monthlyHours} h {monthlyMinutes} min
      </strong>
    </div>

    <div>
      <span>Gewicht</span>
      <strong>
        {monthlyLifted.toLocaleString('de-DE')} kg
      </strong>
    </div>

  </div>

</div>








    </div>                      
  )
}

export default Home
