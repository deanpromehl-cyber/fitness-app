import { exerciseOptions } from './exercises'

export type MuscleGroup =
  | 'chest'
  | 'abs'
  | 'back'
  | 'arms'
  | 'legs'


const achievementGroupByExerciseGroup = {
  chest: 'chest',
  back: 'back',
  legs: 'legs',
  shoulders: 'arms',
  biceps: 'arms',
  triceps: 'arms',
  abs: 'abs',
} as const satisfies Record<(typeof exerciseOptions)[number]['muscleGroup'], MuscleGroup>

export const exerciseMuscleGroups: Record<string, MuscleGroup> = Object.fromEntries(
  exerciseOptions.map(({ id, muscleGroup }) => [
    id,
    achievementGroupByExerciseGroup[muscleGroup],
  ]),
)
