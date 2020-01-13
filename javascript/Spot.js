import SpotConfig from "./SpotConfig.js";
import {
  getVectorBasedOnPolarCoordinate,
  getVectorHeight,
  changeVectorHeight
} from "./vector.js";
import Animation from "./Animation.js";
import { getMiddlePoint } from "./geometry.js";

class Spot {
  constructor(initObj, ctx) {
    this.ctx = ctx;

    Object.assign(this, SpotConfig, initObj);

    const angle = (2 * Math.PI) / this.snotsCount;
    this.growthParams = new Array(this.snotsCount).fill(1);
    this.vectors = new Array(this.snotsCount).fill().map((_, i) => {
      const vector = getVectorBasedOnPolarCoordinate(
        this.center,
        angle * i,
        (Math.random() + 0.5) * this.radius
      );

      return vector;
    });
  }

  stopAnimate = () => {}; //TODO: fix it
  animate = () => {
    this.stopAnimate = Animation.subscribe(this.drawNextStep);
  };

  updateVectors() {
    this.updateGrowParams();

    this.vectors = this.vectors.map((vector, i) => {
      const height = getVectorHeight(vector);
      const vectorSum = this.vectors.reduce(
        (sum, vector) => sum + getVectorHeight(vector) ** this.growthFactor,
        0
      );
      const growthParam = this.growthParams[i];

      const diff =
        ((Math.random() * height ** this.growthFactor * this.snotsCount * 5) /
          vectorSum) *
        growthParam;

      return changeVectorHeight(vector, height + diff);
    });
  }

  updateGrowParams() {
    this.vectors.forEach((vector, i) => {
      const height = getVectorHeight(vector);
      if (this.radiusMax && height > this.radiusMax) {
        this.growthParams[i] = -1;
        return;
      }
      if (this.radiusMin && height < this.radiusMin) {
        this.growthParams[i] = 1;
        return;
      }
    });
  }

  drawNextStep = () => {
    this.updateVectors();
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
  ctx.beginPath();

  vectors.forEach((vector, i) => {
    const currentPoint = vector.end;
    const prevPoint = (vectors[i - 1] || vectors[vectors.length - 1]).end;
    const nextPoint = (vectors[i + 1] || vectors[0]).end;

    const startPoint = getMiddlePoint(currentPoint, prevPoint);
    const endPoint = getMiddlePoint(currentPoint, nextPoint);

    if (i == 0) ctx.moveTo(startPoint.x, startPoint.y);

    ctx.quadraticCurveTo(
      currentPoint.x,
      currentPoint.y,
      endPoint.x,
      endPoint.y
    );
  });

  ctx.save();

  const { lineWidth, fill, fillStyle, stroke, strokeStyle } = styleProps;

  ctx.lineWidth = lineWidth;

  if (fill) {
    if (fillStyle instanceof Array) {
      fillStyle.forEach(element => {
        ctx.fillStyle = element;
        ctx.fill();
      });
    } else {
      ctx.fillStyle = fillStyle;
      ctx.fill();
    }
  }

  if (stroke) {
    if (strokeStyle instanceof Array) {
      strokeStyle.forEach(element => {
        ctx.strokeStyle = element;
        ctx.stroke();
      });
    } else {
      ctx.strokeStyle = strokeStyle;
      ctx.stroke();
    }
  }
  ctx.restore();
  ctx.closePath();
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
