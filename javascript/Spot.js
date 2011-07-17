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
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#2559dc";

    vectors_.forEach (function(elem, i){
      var currentPoint =  vectors_[i].endPoint();
      var prevPoint    = (vectors_[i-1] || vectors_[vectors_.length-1]).endPoint();
      var nextPoint    = (vectors_[i+1] || vectors_[0]).endPoint();

      var startPoint   = Geometry.getMiddlePoint(currentPoint,prevPoint);
      var endPoint     = Geometry.getMiddlePoint(currentPoint,nextPoint);

      ctx.beginPath ();
        ctx.moveTo (startPoint.x+4,startPoint.y);
        ctx.arc (startPoint.x,startPoint.y, 4, 0 , 2*Math.PI, true)
        ctx.fill ();

        ctx.moveTo (currentPoint.x,currentPoint.y);
        ctx.lineTo (nextPoint.x,nextPoint.y);
        ctx.lineTo (this_.center.x,this_.center.y);
        ctx.stroke ();
      ctx.closePath ();
    })

    ctx.restore();
  }

  this.draw = function (){

    ctx.beginPath ();

    vectors_.forEach (function(elem, i){
      var currentPoint =  vectors_[i].endPoint();
      var prevPoint    = (vectors_[i-1] || vectors_[vectors_.length-1]).endPoint();
      var nextPoint    = (vectors_[i+1] || vectors_[0]).endPoint();

      var startPoint   = Geometry.getMiddlePoint(currentPoint,prevPoint);
      var endPoint     = Geometry.getMiddlePoint(currentPoint,nextPoint);

      if (i == 0 ){ctx.moveTo (startPoint.x,startPoint.y);}
      ctx.quadraticCurveTo (currentPoint.x, currentPoint.y, endPoint.x, endPoint.y);
    })

    stylize_();
    ctx.closePath();
  }

  function stylize_ (){
    ctx.save();
    ctx.lineWidth = this_.lineWidth;

    if (this_.fill) {
      ctx.fillStyle = this_.fillStyle;
      ctx.fill();
    }

    if (this_.stroke) {
        ctx.strokeStyle = this_.strokeStyle;
        ctx.stroke();
    }
    ctx.restore();
  }

  this.reverseAnimation = function (){
    growthParams_.forEach(function(el,i){
      growthParams_[i]*=-1;
    });
  }

  function updateGrowParams_ (){
    vectors_.forEach (function (vector, i){
        if (this_.radiusMax && vector.height() > this_.radiusMax) { growthParams_[i] = -1;}
        else if (this_.radiusMin && vector.height() < this_.radiusMin) {growthParams_[i] = 1;}
    })
  }

  function getVectorSum_(){
    var vectorSum = 0;
    vectors_.forEach(function(vector){
      vectorSum += Math.pow(vector.height(),this_.growthFactor)
    });
    return vectorSum;
  }

  function updateVectors_(){
    updateGrowParams_ ();

    vectors_.forEach(function(vector,i){
      vectors_[i].height (
         vectors_[i].height() +
         (Math.random() * Math.pow(vector.height(),this_.growthFactor) * this_.snotsCount * 5 / getVectorSum_()) * growthParams_[i]
      )
    })
  }

  function drawNextStep_(){
    updateVectors_();
    this_.draw ();
//    this_.drawSkeleton();
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

    angle_ = 2*Math.PI/this_.snotsCount;
    for (var i = 0 ; i< this_.snotsCount; i++){
      growthParams_[i] =  1;
      vectors_[i] = new Vector;
      vectors_[i].startPoint(this_.center);
      vectors_[i].angle(angle_*i);
      vectors_[i].height((Math.random()+0.5) * this_.radius);
    };
  };

  var this_ = this, angle_=[], growthParams_=[], vectors_=[];
  this.init(initObj);

}

Spot.prototype = SpotConfig;