import { getSpot, getSkeletonShapes, getSpotShape } from "./spot.js";
import { drawWithStyle } from "./canvas.js";

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

const drawSpot = () => {
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  spots.map(([vectorGenerator, spotStyle]) => {
    const vectors = vectorGenerator.next().value;

    const spotPath = getSpotShape(vectors);
    drawWithStyle(ctx, spotStyle, spotPath);

    // const circlesStyle = { lineWidth: 1, strokeStyle: "#2559dc" };
    // const linesStyle = {
    //   lineWidth: 1,
    //   strokeStyle: "#2559dc",
    //   fillStyle: "#FFFFFF"
    // };
    //
    // const [circles, lines] = getSkeletonShapes(vectors);
    //
    // drawWithStyle(ctx, circlesStyle, lines);
    // drawWithStyle(ctx, linesStyle, circles);
  });
};

const animate = () => {
  drawSpot();
  requestAnimationFrame(animate);
};
animate();

window.addEventListener("resize", () => adjustCanvasSize(canvas));
canvas.addEventListener("click", ({ clientX: x, clientY: y }) => {
  const pattern = fillPattern.next().value;
  const vectorGenerator = getSpot({ x, y });

  spots.push([
    vectorGenerator,
    {
      lineWidth: 4,
      fillStyle: ["#ffffff", pattern],
      strokeStyle: "rgba(0, 0, 0, 1)"
    }
  ]);

  if (spots.length >= 7) spots.shift();
});
