$(document).ready(function() {
    $('#searchbtn').click(function() {
        var name = $('#grieveName').val();
        $.ajax({
            url: '../server/getCoordinate.php',
            type: 'GET',
            data: {name: name},
            success: function(response){
                updatePathIfUserAvailable(response)
            },
            error: function(xhr, status, error) {
                console.error("Error", error)
            }
        });
    });
});
function searchGrieve(coor){
    var distances;
    var grieveArray = coor.split(',').map(parseFloat);
    if(isPoll){
        console.log("sss")
        polylines.forEach(function (item) {
            map.removeLayer(item)
        });
    }
}