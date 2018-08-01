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
var latitude, longitude;


$(() => {
    navigator.geolocation.getCurrentPosition(position=>{
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    })
    setTimeout(post,1000);
    $("#submit").click(function (event) {
        event.preventDefault();
        post();
    })
})

function post() {
    console.log(latitude,longitude);
    $.post("/", {
        location: "123 Fake Street, Willingboro, NJ",
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

}

