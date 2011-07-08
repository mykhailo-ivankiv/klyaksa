/**
 *
 * @autor Mykhailo Ivankiv [neformal.lviv@gmail.com]
 * Date: 05.07 /2011
 * Time: 3:06 PM
 * Brief description of functionality.
 */
function drawSpot(e) {

  var ptrn = ctx.createPattern(imgArray.shift(imgArray.push (imgArray[0])),'no-repeat');

  var initObj = {};
      initObj.spot = { center : {x : e.clientX, y : e.clientY}};
      initObj.style = {fillStyle: ["#ffffff",ptrn]}

  window.spots = window.spots || [];
  if (spots.length < 10) {
    spots.push(new Spot (initObj));
  } else {
    spots[0].init (initObj);
    spots.shift(spots.push (spots[0]));
  }
  spots[spots.length-1].animate();
}

var canvas = document.getElementById('canvas');
    canvas.setAttribute('height', canvas.offsetHeight);
    canvas.setAttribute('width', canvas.offsetWidth);

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
