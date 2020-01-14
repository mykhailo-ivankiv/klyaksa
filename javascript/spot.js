import {
  getVectorBasedOnPolarCoordinate,
  getVectorHeight,
  changeVectorHeight,
  getMiddlePoint
} from "./vector.js";

function* updateSpot(vectors, config) {
  let growthParams = new Array(vectors.length).fill(1);

  while (true) {
    yield vectors;

    vectors = vectors.map((vector, i, vectors) => {
      const vectorSum = vectors.reduce(
        (sum, vector) => sum + getVectorHeight(vector) ** config.growthFactor,
        0
      );
      const height = getVectorHeight(vector);

      // prettier-ignore
      growthParams[i] =
        config.maxRadius && height > config.maxRadius ? -1
      : config.minRadius && height < config.minRadius ? 1
      : growthParams[i];

      const diff =
        Math.random() *
        growthParams[i] *
        height ** config.growthFactor *
        (1 / vectorSum) *
        config.numberOfSnots *
        config.speed;

      return changeVectorHeight(vector, height + diff);
    });
  }
}

export const getSpot = (
  center,
  config = {
    radius: 50,
    maxRadius: 300,
    minRadius: 200,
    numberOfSnots: 20,
    growthFactor: 0.5,
    speed: 5
  }
) => {
  const angle = (2 * Math.PI) / config.numberOfSnots;

  let vectors = new Array(config.numberOfSnots)
    .fill()
    .map((_, i) =>
      getVectorBasedOnPolarCoordinate(
        center,
        angle * i,
        (Math.random() + 0.5) * config.radius
      )
    );

  return updateSpot(vectors, config);
};

export const getSpotShape = vectors =>
  [...vectors, vectors[0]].reduce(
    ([path, prevPoint, isStart], { end: currentPoint }) => {
      const middlePoint = getMiddlePoint(prevPoint, currentPoint);

      if (isStart) {
        path.moveTo(middlePoint.x, middlePoint.y);
      } else {
        path.quadraticCurveTo(
          prevPoint.x,
          prevPoint.y,
          middlePoint.x,
          middlePoint.y
        );
      }

      return [path, currentPoint];
    },
    [new Path2D(), vectors[vectors.length - 1].end, true]
  )[0];

export const getSkeletonShapes = vectors =>
  vectors.reduce(
    ([circlePath, linePath, prevPoint], { end: currentPoint }, i) => {
      const middlePoint = getMiddlePoint(prevPoint, currentPoint);

      circlePath.moveTo(middlePoint.x + 4, middlePoint.y);
      circlePath.arc(middlePoint.x, middlePoint.y, 4, 0, 2 * Math.PI, true);

      linePath.moveTo(prevPoint.x, prevPoint.y);
      linePath.lineTo(currentPoint.x, currentPoint.y);
      linePath.lineTo(vectors[i].start.x, vectors[i].start.y);

      return [circlePath, linePath, currentPoint];
    },
    [new Path2D(), new Path2D(), vectors[vectors.length - 1].end]
  );
