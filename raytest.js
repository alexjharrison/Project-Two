var moment = require('moment');
// var now = moment();
moment().format();

var now  = "04/09/2013 15:00:00";
var then = "04/09/2013 14:20:30";
var diff ;

diff = moment.utc(moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")

console.log(diff);

// if (now > date) {
//    // date is past
// } else {
//    // date is future
// }
