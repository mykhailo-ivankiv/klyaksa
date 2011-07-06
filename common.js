/**
 *
 * @autor Mykhailo Ivankiv [neformal.lviv@gmail.com]
 * Date: 05.07 /2011
 * Time: 3:06 PM
 * Brief description of functionality.
 */
var canvas = document.getElementById('canvas');

canvas.setAttribute('height', canvas.offsetHeight);
canvas.setAttribute('width', canvas.offsetWidth);

var ctx = canvas.getContext('2d');

  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

function drawLine (e){
  ctx.moveTo(e.clientX, e.clientY);
  var entPointX=e.clientX,
      entPointY=e.clientY;

  function continueDrawLine (e){
    ctx.beginPath();
    ctx.moveTo(entPointX,entPointY)
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.closePath();

    entPointX=e.clientX;
    entPointY=e.clientY;
  }
  canvas.removeEventListener('click',drawLine,false);
  canvas.addEventListener('click',continueDrawLine, false);

}

function drawCircle(e) {
  ctx.beginPath();
  ctx.arc(e.clientX, e.clientY, 50 , 0 , 2*Math.PI, true);
  ctx.fill();
  ctx.beginPath();
}
//canvas.addEventListener('click',drawCircle, false);
//canvas.addEventListener('click',drawLine, false);


function drawSpot(e) {
  var n = 30 //number of vectors
      radius = 150, // start radius of spot
      x0 = e.clientX, y0=e.clientY, //coordinates of circle center
      angle = 2*Math.PI/n
      ;

  //ctx.arc (x0,y0,radius,0,Math.PI*2,true);

  var vectors = [];
  for (var i = 0 ; i<n; i++ ){
    vectors[i] = (Math.random()+0.5);
  }

  function animateSpot (){
    ctx.clearRect (0,0,canvas.offsetWidth,canvas.offsetHeight);
    ctx.beginPath();
    
    var d = radius * vectors[0];
    var x = x0 + Math.cos(angle*0)*d, //coordinates of vector x end point
        y = y0 + Math.sin(angle*0)*d,  //coordinates of vector Y end point
        xPrev = x,
        yPrev = y;
    var xStart = x, yStart = y,centerPoint = null;

    
    for (var i = 1 ; i<n; i++ ){
  //        ctx.moveTo(x0,y0);
  //        ctx.lineTo(x,y);

          d = radius * vectors[i];

          x = x0 + Math.cos(angle*i)*d; //coordinates of vector x end point
          y = y0 + Math.sin(angle*i)*d;  //coordinates of vector Y end point
      
//      ctx.lineTo(x,y);
      //ctx.moveTo(xPrev,yPrev);


      if (centerPoint){
        ctx.moveTo(centerPoint.x,centerPoint.y);
        centerPoint = {
          x : Math.min (xPrev,x) + Math.abs((xPrev-x)/2),
          y : Math.min (yPrev,y) + Math.abs((yPrev-y)/2)
        };
        ctx.quadraticCurveTo(xPrev,yPrev,centerPoint.x,centerPoint.y);
      }else {
        centerPoint = {
          x : Math.min (xPrev,x) + Math.abs((xPrev-x)/2),
          y : Math.min (yPrev,y) + Math.abs((yPrev-y)/2)
        }
        var startCenter = {
          x : Math.min (xPrev,x) + Math.abs((xPrev-x)/2),
          y : Math.min (yPrev,y) + Math.abs((yPrev-y)/2)
        }
      }
/*
      ctx.moveTo(centerPoint.x,centerPoint.y);
      ctx.arc(centerPoint.x,centerPoint.y, 2 , 0 , 2*Math.PI, true);
*/
      xPrev = x, yPrev = y;
    };


    //ctx.moveTo(x0,y0);
    //ctx.lineTo(x,y);

    ctx.moveTo(centerPoint.x,centerPoint.y);
    centerPoint = {
      x : Math.min (xPrev,xStart) + Math.abs((xPrev-xStart)/2),
      y : Math.min (yPrev,yStart) + Math.abs((yPrev-yStart)/2)
    };
    ctx.quadraticCurveTo(xPrev,yPrev,centerPoint.x,centerPoint.y);
    ctx.quadraticCurveTo(xStart,yStart,startCenter.x,startCenter.y);

/*
    ctx.moveTo(centerPoint.x,centerPoint.y);
    ctx.arc(centerPoint.x,centerPoint.y, 2 , 0 , 2*Math.PI, true);
*/
    ctx.stroke();
    ctx.fill();

    ctx.closePath();

    
    radius += 10;

    //window.setTimeout(animateSpot, 100)
  }

  animateSpot();
}

canvas.addEventListener('click',drawSpot, false);
