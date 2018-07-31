require("dotenv").config();
var moment = require("moment");
var request = require("request");
var fs = require("fs");

module.exports = (function (callback) {
    // 'use strict';
    console.log("hi");
    request.get({
        url: `https://api.internationalshowtimes.com/v4/showtimes/?location=40.5431598,-74.36320490000003&distance=10&all_fields=true`,
        headers: { 'X-API-Key': process.env.ISHOWTIMES_KEY }
    }, function (err, res, body) {
        if (err) throw err;
        var showtimes = JSON.parse(body).showtimes;
        var timeNow = moment().format();
        var movieList = [];
        showtimes = showtimes.filter(time => time.start_at.includes("2018-07-31") && (time.start_at > timeNow));
        showtimes = showtimes.map(time => {
            if(!movieList.includes(time.cinema_movie_title)) movieList.push(time.cinema_movie_title);
            return {
                // minutes_until_show: moment.duration((time.start_at).diff(timeNow)),
                showtime_utc: time.start_at,
                showtime_en: moment(time.start_at).tz("America/New_York").format("hh:mm a"),
                booking_link: time.booking_link,
                movie_name: time.cinema_movie_title
            }
        })
        console.log(showtimes)
        fs.writeFile("./showtimes.json", JSON.stringify(showtimes), function () { })
        console.log(moment(showtimes[0].start_at).tz("America/New_York").format("hh:mm a"), timeNow)
    });
})();