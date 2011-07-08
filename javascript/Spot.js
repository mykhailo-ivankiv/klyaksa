/**
 *
 * @autor Mykhailo Ivankiv [neformal.lviv@gmail.com]
 * Date: 07.07 /2011
 * Time: 6:21 PM
 * Brief description of functionality.
 */

var Spot = function (initObj){

  this.drawSkeleton = function (){
    ctx.save();

    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(256, 256, 256, 1)";

    vectors_.forEach(function(elem, i){
      var j = i;
      var currentPoint=Geometry.getVectorPosition (vectors_[j],angle*j,this.spot.center);

      j = (i-1) < 0 ? this.snots.n-1 : i-1 ;
      var prevPoint =Geometry.getVectorPosition (vectors_[j],angle*j,this.spot.center);

      j = (i+1)> this.snots.n-1 ? 0 :i+1 ;
      var nextPoint=Geometry.getVectorPosition (vectors_[j],angle*j,this.spot.center);

      var startPoint = Geometry.getMiddlePoint(currentPoint,prevPoint);
      var endPoint = Geometry.getMiddlePoint(currentPoint,nextPoint);
      var controlPoint = currentPoint;

      ctx.beginPath ();
      ctx.moveTo (startPoint.x+4,startPoint.y);
      ctx.arc (startPoint.x,startPoint.y, 4, 0 , 2*Math.PI, true)
      ctx.fill();

      ctx.moveTo(currentPoint.x,currentPoint.y);
      ctx.lineTo (nextPoint.x,nextPoint.y);
      ctx.lineTo (this.spot.center.x,this.spot.center.y);
      ctx.stroke();
      ctx.closePath();
    })

    ctx.restore();
  }

  this.draw = function (){

    ctx.beginPath ();

    vectors_.forEach(function(elem, i){
      var j = i;
      var currentPoint=Geometry.getVectorPosition (vectors_[j],angle*j,this_.spot.center);

      j = (i-1) < 0 ? this_.snots.n-1 : i-1 ;
      var prevPoint = Geometry.getVectorPosition (vectors_[j],angle*j,this_.spot.center);

      j = (i+1)> this_.snots.n-1 ? 0 :i+1 ;
      var nextPoint = Geometry.getVectorPosition (vectors_[j],angle*j,this_.spot.center);

      var startPoint = Geometry.getMiddlePoint(currentPoint,prevPoint);
      var endPoint = Geometry.getMiddlePoint(currentPoint,nextPoint);
      var controlPoint = currentPoint;

      if (i == 0 ){ctx.moveTo (startPoint.x,startPoint.y);}
      ctx.quadraticCurveTo (controlPoint.x, controlPoint.y, endPoint.x, endPoint.y)

    })

    stylize_();
    ctx.closePath();
  }

  function stylize_ (){
    ctx.save();
    ctx.lineWidth = this_.style.lineWidth;
    ctx.strokeStyle = this_.style.strokeStyle;

    if (this_.style.fill) {
      if (this_.style.fillStyle instanceof Array){
        this_.style.fillStyle.forEach(function(element){
           ctx.fillStyle = element;
           ctx.fill();
        });
      } else {
        ctx.fillStyle = this_.style.fillStyle;
        ctx.fill();
      }
    }
    if (this_.style.stroke) {
      if (this_.style.strokeStyle instanceof Array){
        this_.style.strokeStyle.forEach(function(element){
           ctx.strokeStyle = element;
           ctx.stroke();
        });
      } else {
        ctx.strokeStyle = this_.style.strokeStyle;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  this.reverseAnimation = function (){
    growthParams_.forEach(function(el,i){
      growthParams_[i]*=-1;
    });
  }

  function updateGrowParams_ (){
    vectors_.forEach(function (element, i){
        if (this_.snots.max && element > this_.snots.max) { growthParams_[i] = -1;}
        else if (this_.snots.min && element < this_.snots.min) {growthParams_[i] = 1;}
    })
  }

  function getVectorSum_(){
    var vectorSum = 0;
    vectors_.forEach(function(element){ vectorSum += Math.pow(element,this_.spot.growthFactor)});
    return vectorSum;
  }

  function updateVectors_(){
    updateGrowParams_ ();

    vectors_.forEach(function(vector,i){
      vectors_[i] += (Math.random()*Math.pow(vector,this_.spot.growthFactor) * this_.snots.n * 5 / getVectorSum_()) * growthParams_[i]
    })
  }

  function drawNextStep_(){
      updateVectors_()
      this_.draw ();
      //this_.drawSkeleton();
    }

  this.stopAnimate = function (){
    Animation.removeFunction (drawNextStep_);
  }

  this.animate = function (){
    Animation.addFunction (drawNextStep_);
  }

  this.spot = {
    radius : 50,     // Start radius of this.spot.
    center : {        // Coordinates of this.spot center.
      x : canvas.offsetWidth/2,
      y : canvas.offsetHeight/2
    },
    growthFactor : 0.5
  };

  this.style = {
    fill : true,
    stroke : true,
    fillStyle : "#cccccc",
    lineWidth : '4',
    strokeStyle :"rgba(0, 0, 0, 1)"
  };

  this.snots = {
    n : 20,     // Number of this.snots.
    max : 300, // Max snot value.
    min : 200  // Min snot value.
  };

  var this_ = this,
      angle = 2*Math.PI/this.snots.n,
      growthParams_ = [];

  for (var i in initObj){
    for (var j in initObj[i]){
      if (this[i]) this[i][j]=initObj[i][j];
    }
  }

  for (var i = 0 ; i< this.snots.n; i++){growthParams_[i] =  1;};


  var vectors_ = [];
  for (var i = 0 ; i < this.snots.n; i++ ){vectors_[i] = (Math.random()+0.5) * this.spot.radius;};
}