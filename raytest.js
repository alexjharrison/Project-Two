var moment = require("moment");

// var now  = "04/09/2013 15:00:00";
// var then = "04/09/2013 14:20:30";
// var diff ;

// // diff=moment(now,"DD/MM/YYYY HH:mm:ss").diff(moment(then,"DD/MM/YYYY HH:mm:ss")).format("HH:mm:ss");
// // console.log(diff)

// var a = moment('2016-06-06T21:03:55');//now
// var b = moment('2016-05-06T20:03:55');

// console.log(a.diff(b, 'minutes')) // 44700
// console.log(a.diff(b, 'hours')) // 745
// console.log(a.diff(b, 'days')) // 31
// console.log(a.diff(b, 'weeks')) // 4

// var now = moment().add(2,"hours").format()
// console.log(now);
var one = "2018-08-02T19:10:00-04:00"
var two = "2018-08-02T18:50:58-04:00"

console.log(moment(one)>moment(two));