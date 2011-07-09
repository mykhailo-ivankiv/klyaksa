/**
 *
 * @autor Mykhailo Ivankiv [neformal.lviv@gmail.com]
 * Date: 05.07 /2011
 * Time: 3:06 PM
 * Brief description of functionality.
 */
function drawSpot(e) {

  var ptrn = ctx.createPattern(imgArray.shift(imgArray.push (imgArray[0])),'no-repeat');
  window.spots = window.spots || [];

  var initObj = {
        center : {x : e.clientX, y : e.clientY},
        fillStyle: ["#ffffff",ptrn]
      }

  if (spots.length < 7) {
    spots.push(new Spot (initObj));
    spots[spots.length-1].animate();
  } else {
    spots[0].stopAnimate();
    spots[0].init (initObj);
    spots[0].animate();
    spots.shift(spots.push (spots[0]));
  }
}

function setCanvasSize (){
    canvas.setAttribute('height', canvas.offsetHeight);
    canvas.setAttribute('width', canvas.offsetWidth);
}

var canvas = document.getElementById('canvas');
    setCanvasSize ();
    canvas.addEventListener('resize',setCanvasSize, false);

var ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

Animation.addFunction(function(){
  ctx.clearRect (0,0,canvas.offsetWidth,canvas.offsetHeight);
})

canvas.addEventListener('click',drawSpot, false);

var imgArray = ['images/img1.jpg','images/img2.jpg','images/img3.jpg']
    imgArray.forEach(function(elem,i){
      imgArray[i]=new Image();
      imgArray[i].src=elem;
    });
