export type LevelInfo = {
  level: number
  totalXP: number
  currentLevelXP: number
  nextLevelXP: number
  progress: number
}


/*
 * Level 1 benötigt 1000 XP.
 *
 * Jedes weitere Level benötigt 10 % mehr
 * XP als das vorherige.
 *
 * Level 1 → 1000 XP
 * Level 2 → 1100 XP
 * Level 3 → 1210 XP
 * Level 4 → 1331 XP
 */

function getXPForLevel(level: number): number {

  if (level <= 1) {
    return 1000
  }

  return Math.round(
    1000 * Math.pow(1.1, level - 1)
  )
}


/*
 * Berechnet das aktuelle Level
 * anhand der gesamten XP.
 */

export function calculateLevel(
  totalXP: number
): LevelInfo {

  let level = 1
  let xpUsed = 0

  while (true) {

    const xpNeeded =
      getXPForLevel(level)

    if (
      totalXP <
      xpUsed + xpNeeded
    ) {
      break
    }

    xpUsed += xpNeeded
    level++
  }


  const currentLevelXP =
    totalXP - xpUsed

  const nextLevelXP =
    getXPForLevel(level)


  const progress =
    Math.min(
      (currentLevelXP / nextLevelXP) * 100,
      100
    )


  return {
    level,
    totalXP,
    currentLevelXP,
    nextLevelXP,
    progress
  }
}


/*
 * Holt die gesamte XP aus
 * der trainingHistory.
 */

export function calculateTotalXP(
  trainings: any[]
): number {

  return trainings.reduce(
    (total, training) => {

      return total +
        (Number(training.xp) || 0)

    },
    0
  )
}