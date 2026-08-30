import {
  achievements,
  type Achievement
} from './achievements'

import {
  exerciseMuscleGroups,
  type MuscleGroup
} from './muscles'


export interface UnlockedAchievement {
  id: string
  unlockedAt: string
}


// ==========================================
// FREIGESCHALTETE ACHIEVEMENTS LADEN
// ==========================================

export function getUnlockedAchievements(): UnlockedAchievement[] {

  const saved =
    localStorage.getItem('unlockedAchievements')

  if (!saved) {
    return []
  }

  try {
    return JSON.parse(saved)
  } catch {
    return []
  }

}


// ==========================================
// ACHIEVEMENTS SPEICHERN
// ==========================================

function saveUnlockedAchievements(
  unlocked: UnlockedAchievement[]
) {

  localStorage.setItem(
    'unlockedAchievements',
    JSON.stringify(unlocked)
  )

}


// ==========================================
// TRAININGSDATEN BERECHNEN
// ==========================================

function getTrainingStats(
  trainings: any[]
) {

  let totalWeight = 0
  let totalTime = 0

  let pushups = 0
  let pullups = 0
  let dips = 0


  const muscleWeight: Record<
    MuscleGroup,
    number
  > = {

    chest: 0,
    abs: 0,
    back: 0,
    arms: 0,
    legs: 0

  }


  for (const training of trainings) {

    totalTime +=
      Number(training.duration ?? 0)


    for (const exercise of training.exercises ?? []) {

      const muscle =
        exerciseMuscleGroups[exercise.name]


      for (const set of exercise.sets ?? []) {

        const weight =
          Number(set.weight) || 0

        const reps =
          Number(set.reps) || 0


        const volume =
          weight * reps


        // Gesamtgewicht
        totalWeight += volume


        // Muskelgruppe
        if (muscle) {

          muscleWeight[muscle] += volume

        }


        // Push-Ups
        if (
          exercise.name === 'push_up' ||
          exercise.name === 'pushups'
        ) {

          pushups += reps

        }


        // Pull-Ups
        if (
          exercise.name === 'pull_up' ||
          exercise.name === 'pullups'
        ) {

          pullups += reps

        }


        // Dips
        if (
          exercise.name === 'dip' ||
          exercise.name === 'dips'
        ) {

          dips += reps

        }

      }

    }

  }


  return {

    workoutCount:
      trainings.length,

    totalWeight,

    totalTime,

    pushups,

    pullups,

    dips,

    muscleWeight

  }

}


// ==========================================
// AKTUELLEN ACHIEVEMENT-WERT BERECHNEN
// ==========================================

export function getAchievementProgress(
  achievement: Achievement,
  trainingHistory: any[]
): number {

  const stats =
    getTrainingStats(
      trainingHistory
    )


  switch (
    achievement.category
  ) {

    case 'pushups':
      return stats.pushups


    case 'pullups':
      return stats.pullups


    case 'dips':
      return stats.dips


    case 'workouts':
      return stats.workoutCount


    case 'weight':
      return stats.totalWeight / 1000


    case 'time':
      return stats.totalTime / 3600


    case 'chest':
      return stats.muscleWeight.chest / 1000


    case 'abs':
      return stats.muscleWeight.abs / 1000


    case 'back':
      return stats.muscleWeight.back / 1000


    case 'arms':
      return stats.muscleWeight.arms / 1000


    case 'legs':
      return stats.muscleWeight.legs / 1000


    default:
      return 0

  }

}


// ==========================================
// ACHIEVEMENTS PRÜFEN
// ==========================================

export function checkAchievements(
  trainingHistory: any[]
): Achievement[] {

  const unlocked =
    getUnlockedAchievements()


  const unlockedIds =
    new Set(
      unlocked.map(
        achievement =>
          achievement.id
      )
    )


  const newlyUnlocked:
    Achievement[] = []


  for (
    const achievement
    of achievements
  ) {

    if (
      unlockedIds.has(
        achievement.id
      )
    ) {

      continue

    }


    const progress =
      getAchievementProgress(
        achievement,
        trainingHistory
      )


    if (
      progress >=
      achievement.requirement
    ) {

      newlyUnlocked.push(
        achievement
      )


      unlocked.push({

        id:
          achievement.id,

        unlockedAt:
          new Date().toISOString()

      })

    }

  }


  saveUnlockedAchievements(
    unlocked
  )


  return newlyUnlocked

}