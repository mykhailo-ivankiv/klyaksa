/**
 *
 * @autor Mykhailo Ivankiv [neformal.lviv@gmail.com]
 * Date: 05.07 /2011
 * Time: 3:06 PM
 * Brief description of functionality.
 */
function drawSpot(e) {
  if (window.mySpot) mySpot.stopAnimate();
  window.mySpot = new Spot (e);
  mySpot.animate();
}

var canvas = document.getElementById('canvas');
    canvas.setAttribute('height', canvas.offsetHeight);
    canvas.setAttribute('width', canvas.offsetWidth);

var ctx = canvas.getContext('2d');
    ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";


canvas.addEventListener('click',drawSpot, false);

var imgArray = ['images/img1.jpg','images/img2.jpg','images/img3.jpg']
    imgArray.forEach(function(elem,i){
      imgArray[i]=new Image();
      imgArray[i].src=elem;
    });
