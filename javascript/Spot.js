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
      var currentPoint=Geometry.getVectorPosition (vectors_[j],angle_*j,this.center);

      j = (i-1) < 0 ? this.snotsCount-1 : i-1 ;
      var prevPoint =Geometry.getVectorPosition (vectors_[j],angle_*j,this.center);

      j = (i+1)> this.snotsCount-1 ? 0 :i+1 ;
      var nextPoint=Geometry.getVectorPosition (vectors_[j],angle_*j,this.center);

      var startPoint = Geometry.getMiddlePoint(currentPoint,prevPoint);
      var endPoint = Geometry.getMiddlePoint(currentPoint,nextPoint);
      var controlPoint = currentPoint;

      ctx.beginPath ();
      ctx.moveTo (startPoint.x+4,startPoint.y);
      ctx.arc (startPoint.x,startPoint.y, 4, 0 , 2*Math.PI, true)
      ctx.fill();

      ctx.moveTo(currentPoint.x,currentPoint.y);
      ctx.lineTo (nextPoint.x,nextPoint.y);
      ctx.lineTo (this.center.x,this.center.y);
      ctx.stroke();
      ctx.closePath();
    })

    ctx.restore();
  }

  this.draw = function (){

    ctx.beginPath ();

    vectors_.forEach(function(elem, i){
      var j = i;
      var currentPoint=Geometry.getVectorPosition (vectors_[j],angle_*j,this_.center);

      j = (i-1) < 0 ? this_.snotsCount-1 : i-1 ;
      var prevPoint = Geometry.getVectorPosition (vectors_[j],angle_*j,this_.center);

      j = (i+1)> this_.snotsCount-1 ? 0 :i+1 ;
      var nextPoint = Geometry.getVectorPosition (vectors_[j],angle_*j,this_.center);

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
    ctx.lineWidth = this_.lineWidth;

    if (this_.fill) {
      if (this_.fillStyle instanceof Array){
        this_.fillStyle.forEach(function(element){
           ctx.fillStyle = element;
           ctx.fill();
        });
      } else {
        ctx.fillStyle = this_.fillStyle;
        ctx.fill();
      }
    }
    if (this_.stroke) {
      if (this_.strokeStyle instanceof Array){
        this_.strokeStyle.forEach(function(element){
           ctx.strokeStyle = element;
           ctx.stroke();
        });
      } else {
        ctx.strokeStyle = this_.strokeStyle;
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
        if (this_.radiusMax && element > this_.radiusMax) { growthParams_[i] = -1;}
        else if (this_.radiusMin && element < this_.radiusMin) {growthParams_[i] = 1;}
    })
  }

  function getVectorSum_(){
    var vectorSum = 0;
    vectors_.forEach(function(element){ vectorSum += Math.pow(element,this_.growthFactor)});
    return vectorSum;
  }

  function updateVectors_(){
    updateGrowParams_ ();

    vectors_.forEach(function(vector,i){
      vectors_[i] += (Math.random()*Math.pow(vector,this_.growthFactor) * this_.snotsCount * 5 / getVectorSum_()) * growthParams_[i]
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

  this.init = function (initObj){

    for (var i in initObj){
      if (!this_.hasOwnProperty(i)){this_[i]={};}
        this_[i]=initObj[i];
    };

    angle_ = 2*Math.PI/this.snotsCount;
    for (var i = 0 ; i< this_.snotsCount; i++){
      growthParams_[i] =  1;
      vectors_[i] = (Math.random()+0.5) * this_.radius;
    };
  };

  var this_ = this, angle_=[], growthParams_=[], vectors_=[];
  this.init(initObj);

}

Spot.prototype = SpotConfig;