var db = require("../models");
require("dotenv").config();
var moment = require("moment");
var request = require("request");
var geocoder = require("geocoder");
var fs = require("fs");

var placeholderData = [
  {
      name: "best movie name",
      rating: "R",
      genre: ["action, adventure"],
      rtRating: "86",
      metaCritic: "70",
      posterImage: "http://via.placeholder.com/300x475",
      description: "Some people do things",
      showtime: "8:30pm",
      theater: "amc multiplex",
      time2Theater: 34,  //minutes to drive to theater
      miles2Theater: 5,  //miles to drive to theater
      gMapsLink: "http://maps.google.com/",
      buyTixLink: "http://amc.com"
  },
  {
      name: "second best movie name",
      rating: "R",
      genre: ["action, adventure"],
      rtRating: "86",
      metaCritic: "70",
      posterImage: "http://via.placeholder.com/300x475",
      description: "Some people do things",
      showtime: "8:30pm",
      theater: "amc multiplex",
      time2Theater: 34,  //minutes to drive to theater
      miles2Theater: 5,  //miles to drive to theater
      gMapsLink: "http://maps.google.com/",
      buyTixLink: "http://amc.com"
  },
  {
      name: "third best movie name",
      rating: "R",
      genre: ["action, adventure"],
      rtRating: "86",
      metaCritic: "70",
      posterImage: "http://via.placeholder.com/300x475",
      description: "Some people do things",
      showtime: "8:30pm",
      theater: "amc multiplex",
      time2Theater: 34,  //minutes to drive to theater
      miles2Theater: 5,  //miles to drive to theater
      gMapsLink: "http://maps.google.com/",
      buyTixLink: "http://amc.com"
  },
  {
      name: "fourth best movie name",
      rating: "R",
      genre: ["action, adventure"],
      rtRating: "86",
      metaCritic: "70",
      posterImage: "http://via.placeholder.com/300x475",
      description: "Some people do things",
      showtime: "8:30pm",
      theater: "amc multiplex",
      time2Theater: 34,  //minutes to drive to theater
      miles2Theater: 5,  //miles to drive to theater
      gMapsLink: "http://maps.google.com/",
      buyTixLink: "http://amc.com"
  },
  {
      name: "fifth best movie name",
      rating: "R",
      genre: ["action, adventure"],
      rtRating: "86",
      metaCritic: "70",
      posterImage: "http://via.placeholder.com/300x475",
      description: "Some people do things",
      showtime: "8:30pm",
      theater: "amc multiplex",
      time2Theater: 34,  //minutes to drive to theater
      miles2Theater: 5,  //miles to drive to theater
      gMapsLink: "http://maps.google.com/",
      buyTixLink: "http://amc.com"
  },
  {
      name: "sixth best movie name",
      rating: "R",
      genre: ["action, adventure"],
      rtRating: "86",
      metaCritic: "70",
      posterImage: "http://via.placeholder.com/300x475",
      description: "Some people do things",
      showtime: "8:30pm",
      theater: "amc multiplex",
      time2Theater: 34,  //minutes to drive to theater
      miles2Theater: 5,  //miles to drive to theater
      gMapsLink: "http://maps.google.com/",
      buyTixLink: "http://amc.com"
  }
];

var iShowtimesData, location, minRT, maxWait, disInclude, maxRating, maxDistance, latitude, longitude, movieList, response;
module.exports = function (app) {


  app.post("/", function (req, res) {
    // db.User.create(req.body).then(function (userdb) {
    //   res.json(userdb);
    // });
    response = res;
    console.log(req.body);
    location = req.body.location;
    minRT = req.body.minRT;
    maxWait = req.body.maxWait;
    disInclude = req.body.disInclude;
    maxRating = req.body.maxRating;
    maxDistance = req.body.maxDistance;
    latitude = req.body.latitude;
    longitude = req.body.longitude;
    if (req.body.location) {
      geocoderer(req.body.location);
    }
    else ishowtimesApiCall();
  });

  function ishowtimesApiCall() {
    request.get({
      url: `https://api.internationalshowtimes.com/v4/showtimes/?location=${latitude},${longitude}&distance=${Math.floor(maxDistance * 1.60934)}&all_fields=true&append=movies,cinemas`,
      headers: { 'X-API-Key': process.env.ISHOWTIMES_KEY }
    }, function (err, res, body) {
      if (err) throw err;
      var showtimes = JSON.parse(body).showtimes;
      var movies = JSON.parse(body).movies;
      var cinemas = JSON.parse(body).cinemas;
      var timeNow = moment().format();
      movieList = movies.map(movie => {
        return {
          id: movie.id,
          title: movie.title,
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
        if (movieList[movieLocation]) {
          return {
            showtime_utc: time.start_at,
            showtime_en: moment(time.start_at).tz("America/New_York").format("hh:mm a"),
            booking_link: time.booking_link,
            movie_name: movieList[movieLocation].title,
            cinema_name: cinemas[cinemaLocation].name,
            address: cinemas[cinemaLocation].location.address.display_text,
            gmaps: `https://www.google.com/maps/dir/?api=1&origin=${latitude}%2C${longitude}&destination=` + cinemas[cinemaLocation].name.replace(/ /g, "+").replace(/,/g, "%2C"),
          }
        }
      }).filter(time => time);
      for (var i = 0; i < movieList.length; i++) {
        omdbCall(movieList[i].title, i);
      }
    });
    var counter = 0;
    function omdbCall(title, i) {
      request.get({
        url: `https://www.omdbapi.com/?t=${title}&y=&plot=short&apikey=${process.env.OMDB_KEY}`
      }, function (err, res, omdbBody) {
        if (err) console.log(err.message);
        omdbBody = JSON.parse(omdbBody);
        counter++;
        movieList[i].rating = omdbBody.Rated;
        if (omdbBody.Genre) movieList[i].genres = omdbBody.Genre.split(", ");
        else movieList[i].genres = [];
        movieList[i].plot = omdbBody.Plot;
        movieList[i].poster = omdbBody.Poster;
        movieList[i].scores = omdbBody.Ratings;
        if (counter === movieList.length) {
          processing();
        }
      })
    }
  }
  function processing() {
    var filteredMovieList = [];
    movieList.forEach(movie => {
      if (maxRating === "N/A")
        filteredMovieList.push(movie);
      else if (maxRating === "R") {
        if (movie.rating !== "N/A")
          filteredMovieList.push(movie);
      }
      else if (maxRating === "PG-13") {
        if (movie.rating !== "N/A" && movie.rating !== "R")
          filteredMovieList.push(movie);
      }
      else if (maxRating === "PG-13") {
        if (movie.rating === "PG-13" || movie.rating === "PG" || movie.rating === "G")
          filteredMovieList.push(movie);
      }
      else if (maxRating === "PG") {
        if (movie.rating === "PG" || movie.rating === "G")
          filteredMovieList.push(movie);
      }
      else if (maxRating === "G") {
        if (movie.rating === "G")
          filteredMovieList.push(movie);
      }
    });
    console.log(filteredMovieList);
    var filterediShowtimesData = iShowtimesData.filter(showtime=>filteredMovieList.title==showtime.movie_name)
    response.json(placeholderData);
  }
  function geocoderer(location){
    console.log(location);
    geocoder.geocode(location, (err, data) => {
      if (err) throw err;
      console.log(data);
      if(data.results===[]) {
        geocoderer(location);
        return;
      }
      latitude = data.results[0].geometry.location.lat;
      longitude = data.results[0].geometry.location.lng;
      ishowtimesApiCall();
    })
  }
};
