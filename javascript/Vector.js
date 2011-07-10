/**
 * Created by JetBrains WebStorm.
 * User: neformal
 * Date: 7/9/11
 * Time: 11:41 PM
 * To change this template use File | Settings | File Templates.
 */
var Vector = function (){
  var height_ = 0,
  angle_ = 0,
  startPoint_ = {x: 0, y:0 },
  endPoint_ = { x:0, y:0 }

  this.height = function(newHeight){
    if (arguments[0] !== undefined){
      height_ = newHeight;
      endPoint_ = {
        x: startPoint_.x + Math.cos(angle_) * height_,
        y: startPoint_.y + Math.sin(angle_) * height_
      }
    } else {
      return height_;
    }
  };

  this.startPoint = function(newStartPoint){
    if (arguments[0] !== undefined){
      startPoint_ = newStartPoint;
      height_ = Math.sqrt(Math.pow(endPoint_.x-startPoint_.x,2)+Math.pow(endPoint_.y-startPoint_.y,2));
      angle_= Math.atan((endPoint_.y-startPoint_.y)/(endPoint_.x - startPoint_.x));
    }else{
      return startPoint_;
    }
  };

  this.endPoint = function(newEndPoint){
    if (arguments[0] !== undefined){
      endPoint_=newEndPoint;
      angle_= Math.atan((endPoint_.y-startPoint_.y)/(endPoint_.x - startPoint_.x));
      height_ = Math.sqrt(Math.pow(endPoint_.x-startPoint_.x,2)+Math.pow(endPoint_.y-startPoint_.y,2));
      console.log(endPoint_.x-startPoint_.x,(endPoint_.y-startPoint_.y),height_);
    }else{
      return endPoint_;
    }
  };

  this.angle = function(newAngle){
    if (arguments[0] !== undefined){
      angle_ = newAngle;
      endPoint_ = {
        x: startPoint_.x + Math.cos(angle_) * height_,
        y: startPoint_.y + Math.sin(angle_) * height_
      }
    } else {
      return angle_;
    }
  };

  this.moveTo = function(newStartPoint){
    startPoint_ = newStartPoint;
    endPoint_ = {
      x: startPoint_.x + Math.cos(angle_) * height_,
      y: startPoint_.y + Math.sin(angle_) * height_
    }
  };

  this.draw = function(){
    ctx.moveTo(startPoint_.x,startPoint_.y);
    ctx.lineTo(endPoint_.x,endPoint_.y);
    ctx.stroke();
  }
}