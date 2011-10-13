/**
 *
 * @autor Mykhailo Ivankiv [neformal.lviv@gmail.com]
 * Date: 07.07 /2011
 * Time: 6:21 PM
 * Brief description of functionality.
 */

var Geometry = {
  getMiddlePoint: function (p1,p2){
    return {
      x : (arguments[0].x + arguments[1].x)/2,
      y : (arguments[0].y + arguments[1].y)/2
    }
  },

  getVectorPosition: function (size, angle , center){
    return {
      x: center.x + Math.cos(angle) * size,
      y: center.y + Math.sin(angle) * size
    }
  }
}