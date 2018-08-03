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
var userSettings = {
    location: "", //fix later
    maxDis: "10",
    maxRating: "R",
    scoreMin: "75"
}

var latitude, longitude;


$(() => {
    navigator.geolocation.getCurrentPosition(position => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
    })
    setTimeout(post, 3000);
    $("#submit").click(function (event) {
        event.preventDefault();
        // userSettings.location = ($(".workdammit").val())
        var locationion = $("#new-location").val()
        userSettings.scoreMin = ($("#scoreMin").val())
        userSettings.maxDis = ($("#maxDis").val())
        console.log($("#new-location").val());
        console.log($("#scoreMin").val());
        console.log($("#maxDis").val());
        console.log(locationion)
        var rating = document.getElementsByName('group1');
        // getValues(ques1); 
        for (var i = 0, length = rating.length; i < length; i++) {
            if (rating[i].checked) {
                console.log(rating[i].value);
                userSettings.maxRating = rating[i].value;
                break;
            }
        }
        console.log(userSettings);
        post();
        return userSettings;
    })
})

function post() {
    console.log(latitude, longitude);
    console.log($("#icon_prefix").val())
    $.post("/", {
        location: $("#icon_prefix").val(),
        minRT: userSettings.scoreMin, //minimum percent score from rotten tomatoes
        maxRating: userSettings.maxRating,  //not to include this rating or above
        maxDistance: userSettings.maxDis,  //max distance in miles to theater
        latitude: latitude,
        longitude: longitude
    }, function (data, status) {
        console.log(data);
        console.log("This is data 0: " + data[0].title, status);

        // main pick
        $("#pick-title").text(data[0].title);
        $("#pick-rating").text(data[0].rating)
        $("#pick-genre-list").text(data[0].genre)
        $("#pick-synopsis").text(data[0].description)
        $("#pick-time").text(data[0].showtime)
        $("#pick-place").text(data[0].theater)
        $("#pick-critic-score").text(data[0].rtRating + "%")
        $("#pick-audience-score").text(data[0].metaCritic + "%")
        $(".screen").css("background-image", "url(" + data[0].posterImage + ")");
        $("#pick-route-link").attr("href", data[0].gMapsLink);
        $("#pick-tickets-link").attr("href", data[0].buyTixLink);

        // card 1
        $("#op1-title").text(data[1].title);
        $("#op1-rating").text(data[1].rating)
        $("#op1-genres").text(data[1].genre)
        $("#op1-synopsis").text(data[1].description)
        $("#op1-time").text(data[1].showtime)
        $("#op1-place").text(data[1].theater)
        $("#op1-critic-score").text(data[1].rtRating + "%")
        $("#op1-audience-score").text(data[1].metaCritic + "%")
        $("#op1-img").css("background-image", "url(" + data[1].posterImage + ")");
        $("#op1-route").attr("href", data[1].gMapsLink);
        $("#op1-tix").attr("href", data[1].buyTixLink);

        // card 2
        $("#op2-title").text(data[2].title);
        $("#op2-rating").text(data[2].rating)
        $("#op2-genres").text(data[2].genre)
        $("#op2-synopsis").text(data[2].description)
        $("#op2-time").text(data[2].showtime)
        $("#op2-place").text(data[2].theater)
        $("#op2-critic-score").text(data[2].rtRating + "%")
        $("#op2-audience-score").text(data[2].metaCritic + "%")
        $("#op2-img").css("background-image", "url(" + data[2].posterImage + ")");
        $("#op2-route").attr("href", data[2].gMapsLink);
        $("#op2-tix").attr("href", data[2].buyTixLink);

        // card 3
        $("#op3-title").text(data[3].title);
        $("#op3-rating").text(data[3].rating)
        $("#op3-genres").text(data[3].genre)
        $("#op3-synopsis").text(data[3].description)
        $("#op3-time").text(data[3].showtime)
        $("#op3-place").text(data[3].theater)
        $("#op3-critic-score").text(data[3].rtRating + "%")
        $("#op3-audience-score").text(data[3].metaCritic + "%")
        $("#op3-img").css("background-image", "url(" + data[3].posterImage + ")");
        $("#op3-route").attr("href", data[3].gMapsLink);
        $("#op3-tix").attr("href", data[3].buyTixLink);
    })
}


