import SpotConfig from "./SpotConfig.js";
import {
  getVectorBasedOnPolarCoordinate,
  getVectorHeight,
  changeVectorHeight,
  getMiddlePoint
} from "./vector.js";
import Animation from "./Animation.js";

class Spot {
  constructor(initObj, ctx) {
    this.ctx = ctx;

    Object.assign(this, SpotConfig, initObj);

    const angle = (2 * Math.PI) / this.snotsCount;
    this.growthParams = new Array(this.snotsCount).fill(1);
    this.vectors = new Array(this.snotsCount)
      .fill()
      .map((_, i) =>
        getVectorBasedOnPolarCoordinate(
          this.center,
          angle * i,
          (Math.random() + 0.5) * this.radius
        )
      );
  }

  stopAnimate = () => {}; //TODO: fix it
  animate = () => {
    this.stopAnimate = Animation.subscribe(this.drawNextStep);
  };

  drawNextStep = () => {
    this.vectors = this.vectors.map((vector, i) => {
      const height = getVectorHeight(vector);
      const vectorSum = this.vectors.reduce(
        (sum, vector) => sum + getVectorHeight(vector) ** this.growthFactor,
        0
      );

      // prettier-ignore
      this.growthParams[i] =
        (this.radiusMax && height > this.radiusMax) ? -1
      : (this.radiusMin && height < this.radiusMin) ? 1
      : this.growthParams[i];

      const diff =
        ((Math.random() * height ** this.growthFactor * this.snotsCount * 5) /
          vectorSum) *
        this.growthParams[i];

      return changeVectorHeight(vector, height + diff);
    });

    drawSpot(this.vectors, this.ctx, {
      lineWidth: this.lineWidth,
      fill: this.fill,
      fillStyle: this.fillStyle,
      stroke: this.stroke,
      strokeStyle: this.strokeStyle
    });

    // drawSkeleton(this.vectors, this.ctx);
  };
}

export const drawSpot = (vectors, ctx, styleProps) => {
  let [path] = [...vectors, vectors[0]].reduce(
    ([path, prevPoint, isStart], vector) => {
      const currentPoint = vector.end;
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
  );

  ctx.save();

  const { lineWidth, fill, fillStyle, stroke, strokeStyle } = styleProps;

  ctx.lineWidth = lineWidth;

  fill &&
    (Array.isArray(fillStyle) ? fillStyle : [fillStyle]).forEach(element => {
      ctx.fillStyle = element;
      ctx.fill(path);
    });

  stroke &&
    (Array.isArray(strokeStyle) ? strokeStyle : [strokeStyle]).forEach(
      element => {
        ctx.strokeStyle = element;
        ctx.stroke(path);
      }
    );
  ctx.restore();
};

export const drawSkeleton = (vectors, ctx) => {
  ctx.save();

  ctx.lineWidth = 1;
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#2559dc";

  vectors.forEach((elem, i) => {
    const currentPoint = vectors[i].end;
    const prevPoint = (vectors[i - 1] || vectors[vectors.length - 1]).end;
    const nextPoint = (vectors[i + 1] || vectors[0]).end;
    const startPoint = getMiddlePoint(currentPoint, prevPoint);

    ctx.beginPath();
    ctx.moveTo(startPoint.x + 4, startPoint.y);
    ctx.arc(startPoint.x, startPoint.y, 4, 0, 2 * Math.PI, true);
    ctx.fill();

    ctx.moveTo(currentPoint.x, currentPoint.y);
    ctx.lineTo(nextPoint.x, nextPoint.y);
    ctx.lineTo(vectors[i].start.x, vectors[i].start.y);
    ctx.stroke();
    ctx.closePath();
  });

  ctx.restore();
};

export default Spot;
