export type MuscleGroup =
  | 'chest'
  | 'abs'
  | 'back'
  | 'arms'
  | 'legs'


export const exerciseMuscleGroups: Record<
  string,
  MuscleGroup
> = {

  // =========================
  // BRUST
  // =========================

  bench_press: 'chest',
  incline_bench_press: 'chest',
  dumbbell_bench_press: 'chest',
  cable_fly: 'chest',


  // =========================
  // RÜCKEN
  // =========================

  deadlift: 'back',
  lat_pulldown: 'back',
  pull_up: 'back',
  barbell_row: 'back',
  seated_cable_row: 'back',


  // =========================
  // BEINE
  // =========================

  squat: 'legs',
  leg_press: 'legs',
  leg_extension: 'legs',
  leg_curl: 'legs',
  lunges: 'legs',
  calf_raise: 'legs',


  // =========================
  // ARME
  // =========================

  bicep_curl: 'arms',
  hammer_curl: 'arms',
  preacher_curl: 'arms',

  tricep_pushdown: 'arms',
  skull_crusher: 'arms',
  overhead_tricep_extension: 'arms',


  // =========================
  // BAUCH
  // =========================

  crunch: 'abs',
  cable_crunch: 'abs',
  hanging_leg_raise: 'abs',


  // =========================
  // SCHULTERN
  // =========================

  shoulder_press: 'arms',
  lateral_raise: 'arms',
  front_raise: 'arms',
  reverse_fly: 'arms'

}