/**
 *
 * @autor Mykhailo Ivankiv [neformal.lviv@gmail.com]
 * Date: 08.07 /2011
 * Time: 2:03 PM
 * Brief description of functionality.
 */
var Animation = function(){

  EventMachine.apply(this);

  var this_= this;

  var animationTimeout_ = null,
      animationTime_ = 40,
      animations = [];

  this.start = function(){
    this_.trigger('animate');
    animationTimeout_ = window.setTimeout(this_.start,animationTime_);
  };

  this.stop = function(){
    window.clearTimeout(animationTimeout_);
  };

  this.addFunction = function (fn){
    this.bind ('animate',fn);
  }
  this.removeFunction = function(fn){
    this.unbind ('animate',fn);
  }
};
Animation = new Animation();
Animation.start();
