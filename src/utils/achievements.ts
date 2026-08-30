export type AchievementCategory =
  | 'pushups'
  | 'pullups'
  | 'dips'
  | 'workouts'
  | 'weight'
  | 'time'
  | 'chest'
  | 'abs'
  | 'back'
  | 'arms'
  | 'legs'

export interface Achievement {
  id: string
  category: AchievementCategory
  name: string
  description: string
  requirement: number
  unit: string
  badge: string
}

/* =========================
   PUSH UPS
========================= */

export const pushupAchievements: Achievement[] = [
  { id: 'pushups_1000', category: 'pushups', name: 'Push Up I', description: '1.000 Push Ups', requirement: 1000, unit: 'Wdh', badge: '🥉' },
  { id: 'pushups_2500', category: 'pushups', name: 'Push Up II', description: '2.500 Push Ups', requirement: 2500, unit: 'Wdh', badge: '🥉' },
  { id: 'pushups_5000', category: 'pushups', name: 'Push Up III', description: '5.000 Push Ups', requirement: 5000, unit: 'Wdh', badge: '🥈' },
  { id: 'pushups_10000', category: 'pushups', name: 'Push Up IV', description: '10.000 Push Ups', requirement: 10000, unit: 'Wdh', badge: '🥈' },
  { id: 'pushups_25000', category: 'pushups', name: 'Push Up V', description: '25.000 Push Ups', requirement: 25000, unit: 'Wdh', badge: '🥇' },
  { id: 'pushups_50000', category: 'pushups', name: 'Push Up VI', description: '50.000 Push Ups', requirement: 50000, unit: 'Wdh', badge: '🥇' },
  { id: 'pushups_100000', category: 'pushups', name: 'Push Up VII', description: '100.000 Push Ups', requirement: 100000, unit: 'Wdh', badge: '🏆' },
  { id: 'pushups_250000', category: 'pushups', name: 'Push Up VIII', description: '250.000 Push Ups', requirement: 250000, unit: 'Wdh', badge: '🏆' },
  { id: 'pushups_500000', category: 'pushups', name: 'Push Up IX', description: '500.000 Push Ups', requirement: 500000, unit: 'Wdh', badge: '💎' },
  { id: 'pushups_1000000', category: 'pushups', name: 'Push Up X', description: '1.000.000 Push Ups', requirement: 1000000, unit: 'Wdh', badge: '👑' }
]

/* =========================
   PULL UPS
========================= */

export const pullupAchievements: Achievement[] = [
  { id: 'pullups_1000', category: 'pullups', name: 'Pull Up I', description: '1.000 Pull Ups', requirement: 1000, unit: 'Wdh', badge: '🥉' },
  { id: 'pullups_2500', category: 'pullups', name: 'Pull Up II', description: '2.500 Pull Ups', requirement: 2500, unit: 'Wdh', badge: '🥉' },
  { id: 'pullups_5000', category: 'pullups', name: 'Pull Up III', description: '5.000 Pull Ups', requirement: 5000, unit: 'Wdh', badge: '🥈' },
  { id: 'pullups_10000', category: 'pullups', name: 'Pull Up IV', description: '10.000 Pull Ups', requirement: 10000, unit: 'Wdh', badge: '🥈' },
  { id: 'pullups_25000', category: 'pullups', name: 'Pull Up V', description: '25.000 Pull Ups', requirement: 25000, unit: 'Wdh', badge: '🥇' },
  { id: 'pullups_50000', category: 'pullups', name: 'Pull Up VI', description: '50.000 Pull Ups', requirement: 50000, unit: 'Wdh', badge: '🥇' },
  { id: 'pullups_100000', category: 'pullups', name: 'Pull Up VII', description: '100.000 Pull Ups', requirement: 100000, unit: 'Wdh', badge: '🏆' },
  { id: 'pullups_250000', category: 'pullups', name: 'Pull Up VIII', description: '250.000 Pull Ups', requirement: 250000, unit: 'Wdh', badge: '🏆' },
  { id: 'pullups_500000', category: 'pullups', name: 'Pull Up IX', description: '500.000 Pull Ups', requirement: 500000, unit: 'Wdh', badge: '💎' },
  { id: 'pullups_1000000', category: 'pullups', name: 'Pull Up X', description: '1.000.000 Pull Ups', requirement: 1000000, unit: 'Wdh', badge: '👑' }
]

/* =========================
   DIPS
========================= */

export const dipAchievements: Achievement[] = [
  { id: 'dips_1000', category: 'dips', name: 'Dip I', description: '1.000 Dips', requirement: 1000, unit: 'Wdh', badge: '🥉' },
  { id: 'dips_2500', category: 'dips', name: 'Dip II', description: '2.500 Dips', requirement: 2500, unit: 'Wdh', badge: '🥉' },
  { id: 'dips_5000', category: 'dips', name: 'Dip III', description: '5.000 Dips', requirement: 5000, unit: 'Wdh', badge: '🥈' },
  { id: 'dips_10000', category: 'dips', name: 'Dip IV', description: '10.000 Dips', requirement: 10000, unit: 'Wdh', badge: '🥈' },
  { id: 'dips_25000', category: 'dips', name: 'Dip V', description: '25.000 Dips', requirement: 25000, unit: 'Wdh', badge: '🥇' },
  { id: 'dips_50000', category: 'dips', name: 'Dip VI', description: '50.000 Dips', requirement: 50000, unit: 'Wdh', badge: '🥇' },
  { id: 'dips_100000', category: 'dips', name: 'Dip VII', description: '100.000 Dips', requirement: 100000, unit: 'Wdh', badge: '🏆' },
  { id: 'dips_250000', category: 'dips', name: 'Dip VIII', description: '250.000 Dips', requirement: 250000, unit: 'Wdh', badge: '🏆' },
  { id: 'dips_500000', category: 'dips', name: 'Dip IX', description: '500.000 Dips', requirement: 500000, unit: 'Wdh', badge: '💎' },
  { id: 'dips_1000000', category: 'dips', name: 'Dip X', description: '1.000.000 Dips', requirement: 1000000, unit: 'Wdh', badge: '👑' }
]

/* =========================
   WORKOUTS
========================= */

export const workoutAchievements: Achievement[] = [
  { id: 'workouts_10', category: 'workouts', name: 'Workout I', description: '10 Workouts abgeschlossen', requirement: 10, unit: 'Workouts', badge: '🥉' },
  { id: 'workouts_50', category: 'workouts', name: 'Workout II', description: '50 Workouts abgeschlossen', requirement: 50, unit: 'Workouts', badge: '🥉' },
  { id: 'workouts_100', category: 'workouts', name: 'Workout III', description: '100 Workouts abgeschlossen', requirement: 100, unit: 'Workouts', badge: '🥈' },
  { id: 'workouts_150', category: 'workouts', name: 'Workout IV', description: '150 Workouts abgeschlossen', requirement: 150, unit: 'Workouts', badge: '🥈' },
  { id: 'workouts_200', category: 'workouts', name: 'Workout V', description: '200 Workouts abgeschlossen', requirement: 200, unit: 'Workouts', badge: '🥇' },
  { id: 'workouts_500', category: 'workouts', name: 'Workout VI', description: '500 Workouts abgeschlossen', requirement: 500, unit: 'Workouts', badge: '🥇' },
  { id: 'workouts_1000', category: 'workouts', name: 'Workout VII', description: '1.000 Workouts abgeschlossen', requirement: 1000, unit: 'Workouts', badge: '🏆' },
  { id: 'workouts_1500', category: 'workouts', name: 'Workout VIII', description: '1.500 Workouts abgeschlossen', requirement: 1500, unit: 'Workouts', badge: '🏆' },
  { id: 'workouts_2500', category: 'workouts', name: 'Workout IX', description: '2.500 Workouts abgeschlossen', requirement: 2500, unit: 'Workouts', badge: '💎' },
  { id: 'workouts_5000', category: 'workouts', name: 'Workout X', description: '5.000 Workouts abgeschlossen', requirement: 5000, unit: 'Workouts', badge: '💎' },
  { id: 'workouts_10000', category: 'workouts', name: 'Workout XI', description: '10.000 Workouts abgeschlossen', requirement: 10000, unit: 'Workouts', badge: '👑' }
]

/* =========================
   ALL TIME GEWICHT
========================= */

export const weightAchievements: Achievement[] = [
  { id: 'weight_10t', category: 'weight', name: 'Iron I', description: '10 Tonnen bewegt', requirement: 10, unit: 't', badge: '🥉' },
  { id: 'weight_100t', category: 'weight', name: 'Iron II', description: '100 Tonnen bewegt', requirement: 100, unit: 't', badge: '🥉' },
  { id: 'weight_500t', category: 'weight', name: 'Iron III', description: '500 Tonnen bewegt', requirement: 500, unit: 't', badge: '🥈' },
  { id: 'weight_1000t', category: 'weight', name: 'Iron IV', description: '1.000 Tonnen bewegt', requirement: 1000, unit: 't', badge: '🥈' },
  { id: 'weight_2500t', category: 'weight', name: 'Iron V', description: '2.500 Tonnen bewegt', requirement: 2500, unit: 't', badge: '🥇' },
  { id: 'weight_5000t', category: 'weight', name: 'Iron VI', description: '5.000 Tonnen bewegt', requirement: 5000, unit: 't', badge: '🥇' },
  { id: 'weight_10000t', category: 'weight', name: 'Iron VII', description: '10.000 Tonnen bewegt', requirement: 10000, unit: 't', badge: '🏆' },
  { id: 'weight_25000t', category: 'weight', name: 'Iron VIII', description: '25.000 Tonnen bewegt', requirement: 25000, unit: 't', badge: '🏆' },
  { id: 'weight_50000t', category: 'weight', name: 'Iron IX', description: '50.000 Tonnen bewegt', requirement: 50000, unit: 't', badge: '💎' },
  { id: 'weight_100000t', category: 'weight', name: 'Iron X', description: '100.000 Tonnen bewegt', requirement: 100000, unit: 't', badge: '👑' }
]

/* =========================
   ZEIT
========================= */

export const timeAchievements: Achievement[] = [
  { id: 'time_100h', category: 'time', name: 'Dedication I', description: '100 Stunden trainiert', requirement: 100, unit: 'h', badge: '🥉' },
  { id: 'time_250h', category: 'time', name: 'Dedication II', description: '250 Stunden trainiert', requirement: 250, unit: 'h', badge: '🥉' },
  { id: 'time_500h', category: 'time', name: 'Dedication III', description: '500 Stunden trainiert', requirement: 500, unit: 'h', badge: '🥈' },
  { id: 'time_1000h', category: 'time', name: 'Dedication IV', description: '1.000 Stunden trainiert', requirement: 1000, unit: 'h', badge: '🥈' },
  { id: 'time_2500h', category: 'time', name: 'Dedication V', description: '2.500 Stunden trainiert', requirement: 2500, unit: 'h', badge: '🥇' },
  { id: 'time_5000h', category: 'time', name: 'Dedication VI', description: '5.000 Stunden trainiert', requirement: 5000, unit: 'h', badge: '🏆' },
  { id: 'time_10000h', category: 'time', name: 'Dedication VII', description: '10.000 Stunden trainiert', requirement: 10000, unit: 'h', badge: '👑' }
]

/* =========================
   MUSKELGRUPPEN
========================= */

const muscleRequirements = [
  10,
  50,
  100,
  500,
  1000,
  2500,
  5000,
  10000
]

function createMuscleAchievements(
  category: AchievementCategory,
  muscleName: string
): Achievement[] {

  return muscleRequirements.map((requirement, index) => ({
    id: `${category}_${requirement}t`,
    category,
    name: `${muscleName} Specialist ${index + 1}`,
    description: `${requirement.toLocaleString('de-DE')} Tonnen für ${muscleName}`,
    requirement,
    unit: 't',
    badge:
      index < 2
        ? '🥉'
        : index < 4
          ? '🥈'
          : index < 6
            ? '🥇'
            : index === 6
              ? '🏆'
              : '👑'
  }))
}

export const chestAchievements =
  createMuscleAchievements('chest', 'Chest')

export const absAchievements =
  createMuscleAchievements('abs', 'Abs')

export const backAchievements =
  createMuscleAchievements('back', 'Back')

export const armsAchievements =
  createMuscleAchievements('arms', 'Arms')

export const legsAchievements =
  createMuscleAchievements('legs', 'Legs')

/* =========================
   ALLE ACHIEVEMENTS
========================= */

export const achievements: Achievement[] = [
  ...pushupAchievements,
  ...pullupAchievements,
  ...dipAchievements,
  ...workoutAchievements,
  ...weightAchievements,
  ...timeAchievements,
  ...chestAchievements,
  ...absAchievements,
  ...backAchievements,
  ...armsAchievements,
  ...legsAchievements
]