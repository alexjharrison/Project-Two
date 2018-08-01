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
$(document).ready(()=>{
    $.post("/",{name:"name"},function(data){
        console.log(data);
    })
})
    
