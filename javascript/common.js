/**
 *
 * @autor Mykhailo Ivankiv [neformal.lviv@gmail.com]
 * Date: 05.07 /2011
 * Time: 3:06 PM
 * Brief description of functionality.
 */
function drawSpot(e) {

  var ptrn = ctx.createPattern(imgArray.shift(imgArray.push (imgArray[0])),'no-repeat');
  window.spots = window.spots || [];

  var initObj = {
        center : {x : e.clientX, y : e.clientY},
        fillStyle: ["#ffffff",ptrn]
      }

  if (spots.length < 7) {
    spots.push(new Spot (initObj));
    spots[spots.length-1].animate();
  } else {
    spots[0].stopAnimate();
    spots[0].init (initObj);
    spots[0].animate();
    spots.shift(spots.push (spots[0]));
  }
}

var ctx = new Canvas (document.getElementById('canvas'));
    ctx.lineWidth = 4;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";

Animation.addFunction(ctx.clear);

ctx.addEventListener('click',drawSpot, false);

var imgArray = ['images/img1.jpg','images/img2.jpg','images/img3.jpg']
    imgArray.forEach(function(elem,i){
      imgArray[i]=new Image();
      imgArray[i].src=elem;
    });

function vectorsIntersect (p1,p2,p3,p4){
  function direction_ (pi,pj,pk){
    return (pk.x - pi.x)*(pj.y - pi.y) - (pj.x - pi.x)*(pk.y - pi.y);
  }
  function onSegment_ (pi,pj,pk){
    if ( ( Math.min(pi.x, pj.x) <= pk.x && pk.x <= Math.max(pi.x,pj.x) ) &&
         ( Math.min(pi.y, pj.y) <= pk.y && pk.y <= Math.max(pi.y,pj.y) )
       )
    return true;
    return false;
  }

  var d1 = direction_ (p3,p4,p1);
  var d2 = direction_ (p3,p4,p2);
  var d3 = direction_ (p1,p2,p3);
  var d4 = direction_ (p1,p2,p4);

//  console.log(d1, '**' , d2, '**' , d3, '**' , d4);
  if (( (d1>0 && d2<0) || (d1<0 && d2>0) ) &&
      ( (d3>0 && d4<0) || (d3<0 && d4>0) ))   return true;
  else if ( d1 ==0 && onSegment_ (p3,p4,p1) ) return true;
  else if ( d2 ==0 && onSegment_ (p3,p4,p2) ) return true;
  else if ( d3 ==0 && onSegment_ (p1,p2,p3) ) return true;
  else if ( d4 ==0 && onSegment_ (p1,p2,p4) ) return true;
  else return false;
}


function spotsIntersect (){
  var intersectedVectors = [];
  if (!window.spots) return;
  for (var i = 0; i < spots.length; i++){ // Spots
    for (var j = i+1; j< spots.length; j++){

      for (var k = 0; k < spots[i].vectors.length; k++){ //Vectors
        for (var p = 0; p < spots[j].vectors.length; p++){

            var f = {}
                f.currentPoint =  spots[i].vectors[k].endPoint();
//                f.prevPoint    = (spots[i].vectors[k-1] || spots[i].vectors[spots[i].vectors.length-1]).endPoint();
                f.nextPoint    = (spots[i].vectors[k+1] || spots[i].vectors[0]).endPoint();
            var s ={}
                s.currentPoint =  spots[j].vectors[p].endPoint();
//                s.prevPoint    = (spots[j].vectors[p-1] || spots[j].vectors[spots[j].vectors.length-1]).endPoint();
                s.nextPoint    = (spots[j].vectors[p+1] || spots[j].vectors[0]).endPoint();

          if (vectorsIntersect(f.currentPoint,
                               f.nextPoint,
                               s.currentPoint,
                               s.nextPoint
                              )
          ){
            var vectorF = new Vector();
                vectorF.startPoint (f.currentPoint);
                vectorF.endPoint   (f.nextPoint   );

            var vectorS = new Vector();
                vectorS.startPoint (s.currentPoint);
                vectorS.endPoint   (s.nextPoint    );

            ctx.save();
            ctx.strokeStyle = "red";
            vectorS.draw();
            vectorF.draw();
            ctx.restore();
            intersectedVectors.push([spots[j].vectors[p], spots[i].vectors[k]])
          }
        }
      }
    }
  }
//  console.log (intersectedVectors);
}

Animation.addFunction(spotsIntersect);