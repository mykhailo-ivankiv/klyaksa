/**
 *
 * @autor Mykhailo Ivankiv [neformal.lviv@gmail.com]
 * Date: 07.07 /2011
 * Time: 6:21 PM
 * Brief description of functionality.
 */

var Spot = function (e){

  this.draw = function (){

    ctx.beginPath ();

    vectors.forEach(function(elem, i){
      var j = i;
      var currentPoint=Geometry.getVectorPosition (vectors[j],angle*j,spot.center);

      j = (i-1) < 0 ? snots.n-1 : i-1 ;
      var prevPoint =Geometry.getVectorPosition (vectors[j],angle*j,spot.center);

      j = (i+1)> snots.n-1 ? 0 :i+1 ;
      var nextPoint=Geometry.getVectorPosition (vectors[j],angle*j,spot.center);

      var startPoint = Geometry.getMiddlePoint(currentPoint,prevPoint);
      var endPoint = Geometry.getMiddlePoint(currentPoint,nextPoint);
      var controlPoint = currentPoint;

      ctx.moveTo (startPoint.x,startPoint.y);
      ctx.quadraticCurveTo (controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)
    })
    ctx.stroke();
    ctx.closePath();
  }

  this.stopAnimate = function (){
    if (animationTimeout) window.clearTimeout(animationTimeout);
  }

  function updateGrowParams_ (){
    vectors.forEach(function (element, i){
        if (snots.max && element > snots.max) { growthParams_[i] = -1;}
        else if (snots.min && element < snots.min) {growthParams_[i] = 1;}
    })
  }

  function getVectorSum_(){
    var vectorSum = 0;
    vectors.forEach(function(element){ vectorSum += Math.pow(element,spot.growthFactor)});
    return vectorSum;
  }

  function updateVectors_(){
    updateGrowParams_ ();

    vectors.forEach(function(vector,i){
      vectors[i] += (Math.random()*Math.pow(vector,spot.growthFactor) * snots.n * 5 / getVectorSum_()) * growthParams_[i]
    })

  }

  this.animate = function (){
    updateVectors_()
    ctx.clearRect (0,0,canvas.offsetWidth,canvas.offsetHeight);
    this_.draw ()
    animationTimeout = window.setTimeout(this_.animate, animationTime);
  }

  var this_ = this,
      animationTimeout = null;
      spot = {
        radius : 150,     // Start radius of spot.
        center : {        // Coordinates of spot center.
          x : e.clientX,
          y : e.clientY
        },
        growthFactor : 1.2
      },

      snots = {
        n : 20,     // Number of snots.
        max : 300, // Max snot value.
        min : 100  // Min snot value.
      },
      angle = 2*Math.PI/snots.n,
      animationTime = 50,
      growthParams_ = [];

      for (var i = 0 ; i< snots.n; i++){growthParams_[i] =  1;};

  var vectors = [];
  for (var i = 0 ; i < snots.n; i++ ){vectors[i] = (Math.random()+0.5) * spot.radius;};
}