export const ITEM_H = 80;

export function getOpacity(distanceFromActive) {
  if (distanceFromActive === 0) return 1;
  if (distanceFromActive === 1) return 0.38;
  if (distanceFromActive === 2) return 0.2;
  return 0.09;
}

export function getScale(distanceFromActive) {
  if (distanceFromActive === 0) return 1.55;
  if (distanceFromActive === 1) return 1;
  if (distanceFromActive === 2) return 0.88;
  return 0.78;
}
