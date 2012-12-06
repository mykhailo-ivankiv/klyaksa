/**
 *
 * @autor Mykhailo Ivankiv [neformal.lviv@gmail.com]
 * Date: 08.07 /2011
 * Time: 2:23 PM
 * Brief description of functionality.
 */
var EventMachine = function(){
  var events = {};
  var eventsOne = {};

  this.bind = function (ev,fn){
    var ev = ev.toLocaleLowerCase();
    ev = (ev.indexOf('on') != 0) ? 'on'+ev : ev;
    events[ev] ? events[ev].push(fn) : (events[ev]=[]).push(fn)
    return this;
  }

  this.one = function (ev,fn){
    var ev = ev.toLocaleLowerCase();
    ev = (ev.indexOf('on') != 0) ? 'on'+ev : ev;
    eventsOne[ev] ? eventsOne[ev].push(fn) : (eventsOne[ev]=[]).push(fn)
    return this;
  }

  this.trigger = function (ev,arg){
    var ev = ev.toLocaleLowerCase();
    ev = (ev.indexOf('on') != 0) ? 'on'+ev : ev;
    for (var i=0; events[ev] && i<events[ev].length;i++) events[ev][i](this,arg)
    for (var i=0; eventsOne[ev] && i<eventsOne[ev].length;i++) eventsOne[ev][i](this,arg);
    delete eventsOne[ev];

    return this;
  }

  this.unbind = function (ev,fn){
    var ev = ev.toLocaleLowerCase();
    ev = (ev.indexOf('on') != 0) ? 'on'+ev : ev;
    if (events[ev])
    for (var i=0; i < events[ev].length ;i++)
    if (events[ev][i].toString() === fn.toString()) {events[ev].splice(i,1); break;}

    if (eventsOne[ev])
    for (var i=0; i < eventsOne[ev].length ;i++)
    if (eventsOne[ev][i].toString() === fn.toString()) {eventsOne[ev].splice(i,1); break;}

    return this;
  }
}