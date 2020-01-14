export const getVector = (start, end) => ({ start, end });

export const getVectorBasedOnPolarCoordinate = (start, angle, height) => ({
  start,
  end: {
    x: start.x + Math.cos(angle) * height,
    y: start.y + Math.sin(angle) * height
  }
});

export const getVectorHeight = ({ start, end }) =>
  Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2);

export const getVectorAngle = ({ start, end }) =>
  Math.atan2(end.y - start.y, end.x - start.x);

export const changeVectorHeight = (vector, height) => {
  const { start, end } = vector;
  const angle = getVectorAngle(vector);

  return getVectorBasedOnPolarCoordinate(start, angle, height);
};

export const changeVectorAngle = (vector, angle) =>
  getVectorBasedOnPolarCoordinate(vector.start, angle, getVectorHeight(vector));

export const getMiddlePoint = (a, b) => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2
});
