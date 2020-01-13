import Animation from "./Animation.js";
import Spot from "./Spot.js";

function drawSpot(e) {
  var ptrn = ctx.createPattern(
    imgArray.shift(imgArray.push(imgArray[0])),
    "no-repeat"
  );
  window.spots = window.spots || [];

  var initObj = {
    center: { x: e.clientX, y: e.clientY },
    fillStyle: ["#ffffff", ptrn]
  };

  const spot = new Spot(initObj, ctx);
  spot.animate();
  spots.push(spot);
  if (spots.length >= 7) {
    spots[0].stopAnimate();
    spots.shift();
  }
}

function setCanvasSize() {
  canvas.setAttribute("height", canvas.offsetHeight);
  canvas.setAttribute("width", canvas.offsetWidth);
}

var canvas = document.getElementById("canvas");
setCanvasSize();
window.addEventListener("resize", setCanvasSize, false);

var ctx = canvas.getContext("2d");
ctx.lineWidth = 4;
ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

Animation.subscribe(() =>
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
);

canvas.addEventListener("click", drawSpot, false);

var imgArray = ["images/img1.jpg", "images/img2.jpg", "images/img3.jpg"];
imgArray.forEach(function(elem, i) {
  imgArray[i] = new Image();
  imgArray[i].src = elem;
});
