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

    this_.vectors.forEach (function(elem, i){
      var currentPoint =  this_.vectors[i].endPoint();
      var prevPoint    = (this_.vectors[i-1] || this_.vectors[this_.vectors.length-1]).endPoint();
      var nextPoint    = (this_.vectors[i+1] || this_.vectors[0]).endPoint();

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

    this_.vectors.forEach (function(elem, i){
      var currentPoint =  this_.vectors[i].endPoint();
      var prevPoint    = (this_.vectors[i-1] || this_.vectors[this_.vectors.length-1]).endPoint();
      var nextPoint    = (this_.vectors[i+1] || this_.vectors[0]).endPoint();

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
    this_.vectors.forEach (function (vector, i){
        if (this_.radiusMax && vector.height() > this_.radiusMax) { growthParams_[i] = -1;}
        else if (this_.radiusMin && vector.height() < this_.radiusMin) {growthParams_[i] = 1;}
    })
  }

  function getVectorSum_(){
    var vectorSum = 0;
    this_.vectors.forEach(function(vector){
      vectorSum += Math.pow(vector.height(),this_.growthFactor)
    });
    return vectorSum;
  }

  function updateVectors_(){
    updateGrowParams_ ();

    this_.vectors.forEach(function(vector,i){
      this_.vectors[i].height (
         this_.vectors[i].height() +
         (Math.random() * Math.pow(vector.height(),this_.growthFactor) * this_.snotsCount * 5 / getVectorSum_()) * growthParams_[i]
      )
    })
  }

  function drawNextStep_(){
    updateVectors_();
    this_.draw ();
    this_.drawSkeleton();
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
      this_.vectors[i] = new Vector;
      this_.vectors[i].startPoint(this_.center);
      this_.vectors[i].angle(angle_*i);
      this_.vectors[i].height((Math.random()+0.5) * this_.radius);
    };
  };

  var this_ = this, angle_=[], growthParams_=[];
  this_.vectors=[];
  this.init(initObj);

}

Spot.prototype = SpotConfig;