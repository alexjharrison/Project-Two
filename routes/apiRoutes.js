var db = require("../models");
require("dotenv").config();
var moment = require("moment");
var request = require("request");
var fs = require("fs");

module.exports = function (app) {
  var iShowtimesData;

  app.post("/", function (req, res) {
    // db.User.create(req.body).then(function (userdb) {
    //   res.json(userdb);
    // });
    console.log(req.body);

    omdbApiCall("Space Jam");
    ishowtimesApiCall();
  });

  function ishowtimesApiCall() {
    request.get({
      url: `https://api.internationalshowtimes.com/v4/showtimes/?location=40.5431598,-74.36320490000003&distance=10&all_fields=true&append=movies,cinemas`,
      headers: { 'X-API-Key': process.env.ISHOWTIMES_KEY }
    }, function (err, res, body) {
      if (err) throw err;
      // console.log(body);
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
      showtimes = showtimes.filter(time => time.start_at.includes(moment().format("YYYY-MM-DD")) && (time.start_at > timeNow));
      iShowtimesData = showtimes.map(time => {
        var movieLocation, cinemaLocation;
        for (var i = 0; i < movieList.length; i++) {
          if (movieList[i].id === time.movie_id) movieLocation = i;
        }
        for (var i = 0; i < cinemas.length; i++) {
          if (cinemas[i].id === time.cinema_id) cinemaLocation = i;
        }
        return {
          showtime_utc: time.start_at,
          showtime_en: moment(time.start_at).tz("America/New_York").format("hh:mm a"),
          booking_link: time.booking_link,
          movie_name: movieList[movieLocation].title,
          cinema_name: cinemas[cinemaLocation].name,
          address: cinemas[cinemaLocation].location.address.display_text,
          gmaps: "https://www.google.com/maps/dir/?api=1&origin=40.5431598%2C-74.36320490000003&destination=" + cinemas[cinemaLocation].name.replace(/ /g, "+").replace(/,/g, "%2C"),
          
        }
      })
      console.log(iShowtimesData)
    });
  }
  function omdbApiCall(movieName) {
    request.get({
      url: `https://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=${process.env.OMDB_KEY}`,
    }, function (err, res, body) {
      console.log(body);
    });
  }


};
