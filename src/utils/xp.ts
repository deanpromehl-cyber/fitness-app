export type TrainingSet = {
  set: number
  weight: string
  reps: string
}

export type TrainingExercise = {
  id: number
  name: string
  sets: TrainingSet[]
}

export type Training = {
  id: number
  workoutId: number
  workoutName: string
  duration: number
  date: string
  exercises: TrainingExercise[]
}


/* =========================
   GEWICHT BERECHNEN
========================= */

export function calculateTotalWeight(
  training: Training
): number {

  return training.exercises.reduce(
    (exerciseTotal, exercise) => {

      return exerciseTotal +
        exercise.sets.reduce(
          (setTotal, set) => {

            const weight =
              Number(set.weight) || 0

            const reps =
              Number(set.reps) || 0

            return setTotal + getEffectiveSetWeight(exercise.name, weight) * reps

          },
          0
        )

    },
    0
  )
}


/* =========================
   SATZ-ANZAHL
========================= */

export function calculateSetXP(
  training: Training
): number {

  const totalSets =
    training.exercises.reduce(
      (total, exercise) =>
        total + exercise.sets.length,
      0
    )

  return totalSets * 10
}


/* =========================
   GEWICHT-XP
========================= */

export function calculateWeightXP(
  training: Training
): number {

  const totalWeight =
    calculateTotalWeight(training)

  return (totalWeight / 100) * 10
}


/* =========================
   ZEIT-XP
========================= */

export function calculateTimeXP(
  training: Training
): number {

  /*
   * Alle vollen 10 Minuten geben 10 XP.
   *
   * 9 Minuten  -> 0 XP
   * 10 Minuten -> 10 XP
   * 19 Minuten -> 10 XP
   * 20 Minuten -> 20 XP
   */

  const fullTenMinutes =
    Math.floor(training.duration / 600)

  return fullTenMinutes * 10
}


/* =========================
   BISHERIGER PR
========================= */

function getPreviousBestWeight(
  exerciseName: string,
  previousTrainings: Training[]
): number {

  let bestWeight = 0

  previousTrainings.forEach(training => {

    training.exercises.forEach(exercise => {

      if (
        exercise.name !== exerciseName
      ) {
        return
      }

      exercise.sets.forEach(set => {

        const weight =
          Number(set.weight) || 0

        if (weight > bestWeight) {
          bestWeight = weight
        }

      })

    })

  })

  return bestWeight
}


/* =========================
   PR-XP
========================= */

export function calculatePRXP(
  training: Training,
  previousTrainings: Training[]
): number {

  let newPRs = 0

  /*
   * Ein PR zählt nur, wenn das eingetragene
   * Gewicht höher ist als der bisherige Bestwert.
   */

  const checkedExercises =
    new Set<string>()


  training.exercises.forEach(exercise => {

    /*
     * Leere / temporäre Übungen ignorieren.
     */

    if (!exercise.name) {
      return
    }


    /*
     * Eine Übung wird nur einmal als PR geprüft.
     * Dadurch gibt es bei mehreren neuen Sätzen
     * derselben Übung nicht mehrfach 50 XP.
     */

    if (
      checkedExercises.has(exercise.name)
    ) {
      return
    }

    checkedExercises.add(exercise.name)


    const previousBest =
      getPreviousBestWeight(
        exercise.name,
        previousTrainings
      )


    const currentBest =
      Math.max(
        ...exercise.sets.map(
          set =>
            Number(set.weight) || 0
        ),
        0
      )


    if (
      currentBest > previousBest
    ) {

      newPRs++

    }

  })


  return newPRs * 50
}


/* =========================
   GESAMTE XP
========================= */

export function calculateTrainingXP(
  training: Training,
  previousTrainings: Training[]
) {

  const setXP =
    calculateSetXP(training)

  const weightXP =
    calculateWeightXP(training)

  const timeXP =
    calculateTimeXP(training)

  const prXP =
    calculatePRXP(
      training,
      previousTrainings
    )


  const totalXP =
    setXP +
    weightXP +
    timeXP +
    prXP


  return {
    setXP,
    weightXP,
    timeXP,
    prXP,
    totalXP
  }
}
import { getEffectiveSetWeight } from './bodyweight'
