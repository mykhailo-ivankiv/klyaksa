import Animation from "./Animation.js";
import Spot from "./Spot.js";

const imgArray = ["images/img1.jpg", "images/img2.jpg", "images/img3.jpg"].map(
  elemSrc => {
    const img = new Image();
    img.src = elemSrc;
    return img;
  }
);

const spots = [];
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const drawSpot = ({ clientX, clientY }) => {
  const pattern = ctx.createPattern(
    imgArray.shift(imgArray.push(imgArray[0])),
    "no-repeat"
  );

  const initObj = {
    center: { x: clientX, y: clientY },
    fillStyle: ["#ffffff", pattern]
  };

  const spot = new Spot(initObj, ctx);
  spot.animate();
  spots.push(spot);
  if (spots.length >= 7) {
    spots[0].stopAnimate();
    spots.shift();
  }
};

function setCanvasSize() {
  canvas.setAttribute("height", canvas.offsetHeight);
  canvas.setAttribute("width", canvas.offsetWidth);
}

setCanvasSize();
window.addEventListener("resize", setCanvasSize, false);

ctx.lineWidth = 4;
ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

Animation.subscribe(() =>
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
);

canvas.addEventListener("click", drawSpot, false);
