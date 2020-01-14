import Animation from "./Animation.js";

import {
  getSpot,
  drawWithStyle,
  getSkeletonShapes,
  getSpotShape
} from "./spot.js";

const spots = [];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const fillPattern = (function* getFillPattern(images) {
  const imgArray = images.map(imgSrc => {
    const img = new Image();
    img.src = imgSrc;
    return img;
  });

  let patternIndex = 0;

  while (1) {
    yield ctx.createPattern(imgArray[patternIndex], "no-repeat");
    patternIndex = (patternIndex + 1) % imgArray.length;
  }
})(["images/img1.jpg", "images/img2.jpg", "images/img3.jpg"], ctx);

const adjustCanvasSize = canvas => {
  canvas.setAttribute("height", canvas.offsetHeight);
  canvas.setAttribute("width", canvas.offsetWidth);
};

adjustCanvasSize(canvas);

Animation.subscribe(() => {
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  spots.map(spot => {
    const [vectors, fillStyle] = spot.next().value;

    const spotStyle = {
      lineWidth: 4,
      fillStyle,
      strokeStyle: "rgba(0, 0, 0, 1)"
    };

    const circlesStyle = { lineWidth: 1, strokeStyle: "#2559dc" };
    const linesStyle = {
      lineWidth: 1,
      strokeStyle: "#2559dc",
      fillStyle: "#FFFFFF"
    };

    const [circles, lines] = getSkeletonShapes(vectors);
    const spotPath = getSpotShape(vectors);

    drawWithStyle(ctx, spotStyle, spotPath);
    drawWithStyle(ctx, circlesStyle, lines);
    drawWithStyle(ctx, linesStyle, circles);
  });
});

window.addEventListener("resize", () => adjustCanvasSize(canvas), false);
canvas.addEventListener(
  "click",
  ({ clientX: x, clientY: y }) => {
    const pattern = fillPattern.next().value;
    const spot = getSpot({ x, y }, ["#ffffff", pattern]);

    spots.push(spot);
    if (spots.length >= 7) {
      spots.shift();
    }
  },
  false
);
