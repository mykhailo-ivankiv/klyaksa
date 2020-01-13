import SpotConfig from "./SpotConfig.js";
import {
  getVectorBasedOnPolarCoordinate,
  getVectorHeight,
  changeVectorHeight
} from "./Vector.js";
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

  stylize = () => {
    this.ctx.save();
    this.ctx.lineWidth = this.lineWidth;

    if (this.fill) {
      if (this.fillStyle instanceof Array) {
        this.fillStyle.forEach(element => {
          this.ctx.fillStyle = element;
          this.ctx.fill();
        });
      } else {
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.fill();
      }
    }
    if (this.stroke) {
      if (this.strokeStyle instanceof Array) {
        this.strokeStyle.forEach(function(element) {
          this.ctx.strokeStyle = element;
          this.ctx.stroke();
        });
      } else {
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  };

  draw() {
    this.ctx.beginPath();

    this.vectors.forEach((vector, i) => {
      var currentPoint = vector.end;
      var prevPoint = (
        this.vectors[i - 1] || this.vectors[this.vectors.length - 1]
      ).end;
      var nextPoint = (this.vectors[i + 1] || this.vectors[0]).end;

      var startPoint = getMiddlePoint(currentPoint, prevPoint);
      var endPoint = getMiddlePoint(currentPoint, nextPoint);

      if (i == 0) {
        this.ctx.moveTo(startPoint.x, startPoint.y);
      }
      this.ctx.quadraticCurveTo(
        currentPoint.x,
        currentPoint.y,
        endPoint.x,
        endPoint.y
      );
    });

    this.stylize();
    this.ctx.closePath();
  }

  drawNextStep = () => {
    this.updateVectors();
    this.draw();
    // this.drawSkeleton();
  };

  drawSkeleton() {
    this.ctx.save();

    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.strokeStyle = "#2559dc";

    this.vectors.forEach((elem, i) => {
      var currentPoint = this.vectors[i].end;
      var prevPoint = (
        this.vectors[i - 1] || this.vectors[this.vectors.length - 1]
      ).end;
      var nextPoint = (this.vectors[i + 1] || this.vectors[0]).end;

      var startPoint = getMiddlePoint(currentPoint, prevPoint);
      var endPoint = getMiddlePoint(currentPoint, nextPoint);

      this.ctx.beginPath();
      this.ctx.moveTo(startPoint.x + 4, startPoint.y);
      this.ctx.arc(startPoint.x, startPoint.y, 4, 0, 2 * Math.PI, true);
      this.ctx.fill();

      this.ctx.moveTo(currentPoint.x, currentPoint.y);
      this.ctx.lineTo(nextPoint.x, nextPoint.y);
      this.ctx.lineTo(this.center.x, this.center.y);
      this.ctx.stroke();
      this.ctx.closePath();
    });

    this.ctx.restore();
  }
}

export default Spot;
