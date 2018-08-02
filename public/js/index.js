// ids
/*
pick-title
pick-rating
pick-genre-list
pick-synopsis
pick-time
pick-place
pick-critic-score
pick-audience-score

poster https://stackoverflow.com/questions/253689/switching-a-div-background-image-with-jquery
RT url  https://stackoverflow.com/questions/179713/how-to-change-the-href-for-a-hyperlink-using-jquery
Route finder
*/


var title = "space+jam";
var queryURL = "https://www.omdbapi.com/?t=" + title + "&y=&plot=short&apikey=trilogy";

function post() {
    console.log(latitude,longitude);
    console.log($("#icon_prefix").val())
    $.post("/", {
        location: $("#icon_prefix").val(),
        minRT: 60, //minimum percent score from rotten tomatoes
        maxWait: 60,  //maximum wait in minutes from time to arrive at theater to movie start
        disInclude: [], // array of genres not to include
        maxRating: "R",  //not to include this rating or above
        maxDistance: 10,  //max distance in miles to theater
        latitude: latitude,
        longitude: longitude
    }, function (data, status) {
        console.log(data, status);
    });

$("button").click(function(){
  $.post("/",  {

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
  function(data, status){
    console.log(data, status);
  });
})
