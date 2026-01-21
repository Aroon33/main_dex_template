/**
 * ============================================================
 * mockGrowth
 * ============================================================
 *
 * Time-based growth engine for mock data
 * Supports +% and -% growth
 *
 * ============================================================
 */

export function getStepCount(
  startTime: number,
  hoursPerStep: number
) {
  const now = Date.now();
  const diffHours = (now - startTime) / (1000 * 60 * 60);
  return Math.max(0, Math.floor(diffHours / hoursPerStep));
}

export function growValue(
  base: number,
  steps: number,
  percent: number
) {
  const factor = 1 + percent / 100;
  return base * Math.pow(factor, steps);
}

export function clamp(
  value: number,
  min: number
) {
  return Math.max(value, min);
}
