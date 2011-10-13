/**
 * Created by JetBrains WebStorm.
 * User: neformal
 * Date: 7/16/11
 * Time: 5:06 PM
 * To change this template use File | Settings | File Templates.
 */

/**
 *
 * @param el {Element} canvas DOM element;
 */
var Canvas = function(el){

  var this_ = this;
  this_.container = el;

  this_.height = 0;
  this_.width = 0;

  this.fillStyle   = '' ;
  this.strokeStyle = '' ;

  this.__proto__= this_.container.getContext('2d'); // Extend from native 2d context;

  function setSize_ () {
    this_.height = this_.container.offsetHeight;
    this_.width = this_.container.offsetWidth
    this_.container.setAttribute('height', this_.height);
    this_.container.setAttribute('width', this_.width);
  }

  this.addEventListener = function (event, fn, capturing){
    this.container.addEventListener(event, fn, capturing);
  }

  this.removeEventListener = function (event, fn, capturing){
    this.container.removeEventListener(event, fn, capturing);
  }

  this.fill = function(){
    if (this_.fillStyle instanceof Array){
      this_.fillStyle.forEach (function(element){
        this_.__proto__.fillStyle = element;
        this_.__proto__.fill();
      });
    } else {
      this_.__proto__.fillStyle = this_.fillStyle;
      this.__proto__.fill();
    }
  }

  this.stroke = function(){
    if (this_.strokeStyle instanceof Array){
      this_.strokeStyle.forEach (function(element){
        this_.__proto__.strokeStyle = element;
        this_.__proto__.stroke();
      });
    } else {
      this_.__proto__.strokeStyle = this_.strokeStyle;
      this.__proto__.stroke();
    }
  }

  this.clear = function (){
    this_.clearRect ( 0, 0 , this_.width, this_.height );
  }

  //Init part;
  setSize_ ();
  window.addEventListener('resize',setSize_, false);
}