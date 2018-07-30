
//request from page
var postRequest = {
    location: "123 Fake Street, Willingboro, NJ",
    minRT: 80, //minimum percent score from rotten tomatoes
    maxWait: 60,  //maximum wait in minutes from time to arrive at theater to movie start
    disInclude = [ // array of genres not to include
        "action",
        "adventure",
        "musical"
    ],
    maxRating = "R"  //not to include this rating or above
}

//
var postResponse = {[
    {
        name: "best movie name",
        rating: "R",
        director: "estefan spielbergo",
        stars: ["bobby bob","mary jean"],
        genre: ["action, adventure"],
        rtRating: "86",
        metaCritic: "70",
        posterImage: "www.posters.com/bestMovie.png",
        description: "Some people do things",
        showtime: "8:30pm",
        theater: "amc multiplex",
        time2Theater: 34,  //minutes to drive to theater
        miles2Theater: 5,  //miles to drive to theater
        gMapsLink: "http://maps.google.com/??"
    },
    {
        name: "second best movie name",
        rating: "R",
        director: "estefan spielbergo",
        stars: ["bobby bob","mary jean"],
        genre: ["action, adventure"],
        rtRating: "86",
        metaCritic: "70",
        posterImage: "www.posters.com/bestMovie.png",
        description: "Some people do things",
        showtime: "8:30pm",
        theater: "amc multiplex",
        time2Theater: 34,  //minutes to drive to theater
        miles2Theater: 5,  //miles to drive to theater
        gMapsLink: "http://maps.google.com/??"
    },
    {
        name: "third best movie name",
        rating: "R",
        director: "estefan spielbergo",
        stars: ["bobby bob","mary jean"],
        genre: ["action, adventure"],
        rtRating: "86",
        metaCritic: "70",
        posterImage: "www.posters.com/bestMovie.png",
        description: "Some people do things",
        showtime: "8:30pm",
        theater: "amc multiplex",
        time2Theater: 34,  //minutes to drive to theater
        miles2Theater: 5,  //miles to drive to theater
        gMapsLink: "http://maps.google.com/??"
    },
    {
        name: "fourth best movie name",
        rating: "R",
        director: "estefan spielbergo",
        stars: ["bobby bob","mary jean"],
        genre: ["action, adventure"],
        rtRating: "86",
        metaCritic: "70",
        posterImage: "www.posters.com/bestMovie.png",
        description: "Some people do things",
        showtime: "8:30pm",
        theater: "amc multiplex",
        time2Theater: 34,  //minutes to drive to theater
        miles2Theater: 5,  //miles to drive to theater
        gMapsLink: "http://maps.google.com/??"
    },
    {
        name: "fifth best movie name",
        rating: "R",
        director: "estefan spielbergo",
        stars: ["bobby bob","mary jean"],
        genre: ["action, adventure"],
        rtRating: "86",
        metaCritic: "70",
        posterImage: "www.posters.com/bestMovie.png",
        description: "Some people do things",
        showtime: "8:30pm",
        theater: "amc multiplex",
        time2Theater: 34,  //minutes to drive to theater
        miles2Theater: 5,  //miles to drive to theater
        gMapsLink: "http://maps.google.com/??"
    }
]}