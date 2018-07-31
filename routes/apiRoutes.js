var db = require("../models");
require("dotenv").config();
var moment = require("moment");
var request = require("request");
var fs = require("fs");

module.exports = function (app) {

  // Create a new example
  app.post("/", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  (function ishowtimesApiCall() {
    console.log("hi");
    request.get({
      url: `https://api.internationalshowtimes.com/v4/showtimes/?location=40.5431598,-74.36320490000003&distance=10&all_fields=true&append=movies,cinemas`,
      headers: { 'X-API-Key': process.env.ISHOWTIMES_KEY }
    }, function (err, res, body) {
      if (err) throw err;
      var showtimes = JSON.parse(body).showtimes;
      var movies = JSON.parse(body).movies;
      var cinemas = JSON.parse(body).cinemas;
      var timeNow = moment().format();

      var movieList = movies.map(movie => {
        return {
          id: movie.id,
          title: movie.title
        }
      })
      showtimes = showtimes.filter(time => time.start_at.includes("2018-07-31") && (time.start_at > timeNow));
      formattedShowtimes = showtimes.map(time => {
        var movieLocation, cinemaLocation;
        for (var i = 0; i < movieList.length; i++) {
          if (movieList[i].id === time.movie_id) movieLocation = i;
        }
        for (var i = 0; i < cinemas.length; i++) {
          if (cinemas[i].id === time.cinema_id) cinemaLocation = i;
        }
        return {
          // minutes_until_show: moment.duration((time.start_at).diff(timeNow)),
          showtime_utc: time.start_at,
          showtime_en: moment(time.start_at).tz("America/New_York").format("hh:mm a"),
          booking_link: time.booking_link,
          movie_name: movieList[movieLocation].title,
          cinema_name: cinemas[cinemaLocation].name,
          address: cinemas[cinemaLocation].location.address.display_text,
          lattitude: cinemas[cinemaLocation].location.lat,
          longitude: cinemas[cinemaLocation].location.lon,
        }
      })
      console.log(formattedShowtimes);
      fs.writeFile("./showtimes.json", JSON.stringify(cinemas[0].location.address), function () { })
      function returnMovie(id, movieList) {
        for (var i = 0; i < movieList.length; i++) {
          if (movieList[i].id === id) return i;
        }
      }
    });
  })();


};
