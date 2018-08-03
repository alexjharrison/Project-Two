var db = require("../models");
require("dotenv").config();
var moment = require("moment");
var request = require("request");
var geocoder = require("geocoder");
var fs = require("fs");

var placeholderData = [
  {
      title: "Christopher Robin",
      rating: "PG",
      genre: ["Animation, Adventure, Comedy "],
      rtRating: "80",
      metaCritic: "80",
      posterImage: "https://m.media-amazon.com/images/M/MV5BMjAzOTM2OTAyNF5BMl5BanBnXkFtZTgwNTg5ODg1NTM@._V1_SX750.jpeg",
      description: "A working-class family man, Christopher Robin, encounters his childhood friend Winnie-the-Pooh, who helps him to rediscover the joys of life.",
      showtime: "8:30pm",
      theater: "amc multiplex",
      time2Theater: 34,  //minutes to drive to theater
      miles2Theater: 5,  //miles to drive to theater
      gMapsLink: "http://maps.google.com/",
      buyTixLink: "http://amc.com"
  },
  {
      title: "Teen Titans Go! To the Movies",
      rating: "PG",
      genre: ["Animation, Action, Comedy"],
      rtRating: "86",
      metaCritic: "68",
      posterImage: "https://m.media-amazon.com/images/M/MV5BMjM3NDMwMDE2N15BMl5BanBnXkFtZTgwNDQ1Mjg5NTM@._V1_SX750.jpg",
      description: "A villain's maniacal plan for world domination sidetracks five teenage superheroes who dream of Hollywood stardom.",
      showtime: "8:30pm",
      theater: "amc multiplex",
      time2Theater: 34,  //minutes to drive to theater
      miles2Theater: 5,  //miles to drive to theater
      gMapsLink: "http://maps.google.com/",
      buyTixLink: "http://amc.com"
  },
  {
      title: "The Incredibles 2",
      rating: "PG",
      genre: ["animation, action, adventure"],
      rtRating: "81",
      metaCritic: "80",
      posterImage: "https://m.media-amazon.com/images/M/MV5BMTEzNzY0OTg0NTdeQTJeQWpwZ15BbWU4MDU3OTg3MjUz._V1_SX750.jpg",
      description: "Bob Parr (Mr. Incredible) is left to care for the kids while Helen (Elastigirl) is out saving the world.",
      showtime: "8:30pm",
      theater: "amc multiplex",
      time2Theater: 34,  //minutes to drive to theater
      miles2Theater: 5,  //miles to drive to theater
      gMapsLink: "http://maps.google.com/",
      buyTixLink: "http://amc.com"
  },
  {
      title: "Mission Impossible: Fallout",
      rating: "PG-13",
      genre: ["Action, Adventure, Thriller"],
      rtRating: "86",
      metaCritic: "84",
      posterImage: "https://m.media-amazon.com/images/M/MV5BMTk3NDY5MTU0NV5BMl5BanBnXkFtZTgwNDI3MDE1NTM@._V1_SX750.jpg",
      description: "Ethan Hunt and his IMF team, along with some familiar allies, race against time after a mission gone wrong.",
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
      posterImage: "https://m.media-amazon.com/images/M/MV5BMTk3NDY5MTU0NV5BMl5BanBnXkFtZTgwNDI3MDE1NTM@._V1_SX750.jpg",
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

var iShowtimesData, location, minRT, maxWait, disInclude, maxRating, maxDistance, latitude, longitude, movieList, response, counter, filteredMovieList, filterediShowtimesData, timeText;
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
    counter = 0;
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
        if (movieList[i].poster) movieList[i].poster = movieList[i].poster.replace("300.jpg", "750.jpg");
        movieList[i].scores = omdbBody.Ratings;
        if (counter === movieList.length) {
          processing();
        }
      })
    }
  }
  function processing() {
    filteredMovieList = [];
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



    //get critic score
    var rtScore = filteredMovieList.map(movie => {
      if (movie.scores === [] || !movie.scores)
        return "N/A";
      else {
        var rt, imdb, meta;
        for (var i = 0; i < movie.scores.length; i++) {
          if (movie.scores[i].Source === "Rotten Tomatoes")
            rt = movie.scores[i].Value;
          else if (movie.scores[i].Source === "Internet Movie Database")
            imdb = movie.scores[i].Value;
          else if (movie.scores[i].Source === "Metacritic")
            meta = movie.scores[i].Value;
        }
        if (rt) return parseFloat(rt.replace("%", ""));
        else if (meta) return parseFloat(meta.replace("/100", ""));
        else if (imdb) return parseFloat(imdb.replace("/10", "")) * 10;
        else return "N/A";
      }
    });

    for (var i = 0; i < rtScore.length; i++) {
      filteredMovieList[i].rtScore = rtScore[i];
    }

    filteredMovieList = filteredMovieList.filter((movie, i) => rtScore[i] !== "N/A" && rtScore[i] > minRT);
    rtScore = rtScore.filter((score) => score !== "N/A" && score > minRT);

    //remove showtimes by disqualifiers
    var list = filteredMovieList.map(movie => movie.title);
    filterediShowtimesData = iShowtimesData.filter((showtime, i) => list.includes(showtime.movie_name))

    var theaters = [];
    filterediShowtimesData.forEach(showtime => {
      if (!theaters.includes(showtime.cinema_name))
        theaters.push(showtime.cinema_name);
    });

    counter = 0;
    timeText = [];
    theaters.forEach((theater, i) => {
      distance(theaters, theater, theaters.length, i)
    });



  }

  function distance(theaters, theater, numTheaters, i) {
    var theaterLocation;
    for (var i = 0; i < filterediShowtimesData.length; i++) {
      if (filterediShowtimesData[i].cinema_name === theater)
        theaterLocation = i;
    }
    request.get({
      url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${latitude},${longitude}&destinations=${theater},${filterediShowtimesData[theaterLocation].address}&units=imperial&key=${process.env.GOOGLE_APIKEY}`
    }, function (err, res, maps) {
      if (err) throw err;
      console.log(maps);
      timeText[counter] = (JSON.parse(maps).rows[0].elements[0].duration.text);
      counter++;
      if (counter === numTheaters) {
        timeMath(theaters, timeText)
      }
    });
  }
  function timeMath(theaters, timeText) {
    timeText = timeText.map(time => parseFloat(time.replace(" mins", "")));
    //this is where the madness lives
    ////////////////////////////////////////////////////////////////
    var nowAfterDrive = timeText.map(adjustment => moment().add(adjustment, "minutes").format());

    var eachMovieName = filterediShowtimesData.map(showtime => showtime.movie_name);
    var eachCinema = filterediShowtimesData.map(showtime => showtime.cinema_name);
    var eachUTC = filterediShowtimesData.map(showtime => showtime.showtime_utc);
    console.log(eachMovieName, eachCinema, eachUTC)

    var finalMovieList = [];
    var lowestUTC = [];
    var finalIndex = [];

    for (var i = 0; i < eachUTC.length; i++) {
      if (!finalMovieList.includes(eachMovieName[i])) {
        finalMovieList.push(eachMovieName[i]);
        lowestUTC.push(eachUTC[i]);
        finalIndex.push(i);
      }
      //wat
      else if (eachUTC[i] < lowestUTC[finalMovieList.indexOf(eachMovieName[i])]) {
        finalMovieList[finalMovieList.indexOf(eachMovieName[i])] = eachMovieName[i];
        lowestUTC[finalMovieList.indexOf(eachMovieName[i])] = eachUTC[i];
        finalIndex[finalMovieList.indexOf(eachMovieName[i])] = i;
      }
    }

    //BUBBLE SORTING! Yay!
    var notSorted = false;
    while (!notSorted) {
      notSorted = true;
      var temp;
      for (var i = 0; i < lowestUTC.length - 1; i++) {
        if (lowestUTC[i] > lowestUTC[i + 1]) {
          temp = lowestUTC[i];
          lowestUTC[i] = lowestUTC[i + 1];
          lowestUTC[i + 1] = temp;
          temp = finalIndex[i];
          finalIndex[i] = finalIndex[i + 1];
          finalIndex[i + 1] = temp;
          notSorted = false;
        }
      }
    }

    console.log(movieList, lowestUTC, finalIndex);
    var movieListIndex = [];
    for (var i = 0; i < finalIndex.length; i++) {
      for (var j = 0; j < filteredMovieList.length; j++) {
        console.log(filterediShowtimesData[finalIndex[i]].movie_name, filteredMovieList[j].title)
        if (filterediShowtimesData[finalIndex[i]].movie_name === filteredMovieList[j].title) {
          movieListIndex.push(j)
        }
      }
    }
    console.log(movieListIndex);

    var finalOutput = [];
    for (var i = 0; i < finalIndex.length; i++) {
      console.log("Hi");
      var finalMovieObject = {};
      finalMovieObject.title = filterediShowtimesData[finalIndex[i]].movie_name;
      finalMovieObject.showtime = filterediShowtimesData[finalIndex[i]].showtime_en;
      finalMovieObject.theater = filterediShowtimesData[finalIndex[i]].cinema_name;
      finalMovieObject.gMapsLink = filterediShowtimesData[finalIndex[i]].gmaps;
      finalMovieObject.buyTixLink = filterediShowtimesData[finalIndex[i]].booking_link;

      finalMovieObject.rating = filteredMovieList[movieListIndex[i]].rating;
      finalMovieObject.genre = filteredMovieList[movieListIndex[i]].genres;
      finalMovieObject.description = filteredMovieList[movieListIndex[i]].plot;
      finalMovieObject.rtRating = filteredMovieList[movieListIndex[i]].rtScore;
      finalMovieObject.posterImage = filteredMovieList[movieListIndex[i]].poster;
      console.log(finalMovieObject)

      finalOutput.push(finalMovieObject);
    }

    response.json(finalOutput);
    ///////////////////////////////////////////////////////////////
  }




  function geocoderer(location) {
    geocoder.geocode(location, (err, data) => {
      if (err) {
        geocoder(location);
        return;
      }
      else if (data.results === []) {
        geocoderer(location);
        return;
      }
      else if(!data.results[0]){
        geocoderer(location);
        return;
      }
      latitude = data.results[0].geometry.location.lat;
      longitude = data.results[0].geometry.location.lng;
      ishowtimesApiCall();
    })
  }
};
