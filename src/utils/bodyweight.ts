// Approximate share of bodyweight moved in bodyweight exercises.
// Users can still replace the suggested weight in any individual set.
const bodyweightLoadFactors: Record<string, number> = {
  push_up: 0.7,
  wide_push_up: 0.7,
  close_push_up: 0.7,
  deficit_push_up: 0.7,
  archer_push_up: 0.8,
  decline_push_up: 0.75,
  pseudo_planche_push_up: 0.85,
  pike_push_up: 0.7,
  one_arm_push_up: 0.9,
  ring_push_up: 0.75,
  dips: 0.9,
  ring_dips: 0.9,
  straight_bar_dip: 0.9,
  korean_dip: 0.9,
  bench_dips: 0.55,
  pull_up: 1,
  chin_up: 1,
  neutral_pull_up: 1,
  assisted_pull_up: 0.7,
  wide_pull_up: 1,
  close_grip_pull_up: 1,
  archer_pull_up: 1,
  commando_pull_up: 1,
  australian_pull_up: 0.65,
  muscle_up: 1,
  bar_muscle_up: 1,
  ring_muscle_up: 1,
  ring_pull_up: 1,
  one_arm_pull_up: 1,
  squat: 0.7,
  pistol_squat: 0.85,
  lunges: 0.7,
  walking_lunges: 0.7,
  reverse_lunges: 0.7,
  bulgarian_split_squat: 0.8,
  step_up: 0.75,
  jump_squat: 0.7,
  glute_bridge: 0.6,
  single_leg_glute_bridge: 0.75,
  nordic_curl: 0.65,
  calf_raise: 1,
  standing_calf_raise: 1,
  single_leg_calf_raise: 1,
  burpee: 0.7,
  crunch: 0.3,
  sit_up: 0.4,
  hanging_leg_raise: 0.45,
  hanging_knee_raise: 0.35,
  leg_raise: 0.35,
  plank: 0.6,
  side_plank: 0.55,
  mountain_climber: 0.6,
  handstand_push_up: 0.9,
}

export function getBodyweightLoadFactor(exerciseId: string): number | null {
  return bodyweightLoadFactors[exerciseId] ?? null
}

export function getEffectiveSetWeight(exerciseId: string, enteredWeight: number): number {
  const factor = getBodyweightLoadFactor(exerciseId)
  return enteredWeight * (factor ?? 1)
}
