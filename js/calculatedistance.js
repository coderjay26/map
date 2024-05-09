var newdistance = 0;
document.getElementById('distanceForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var coordinatesInput = document.getElementById('coordinates').value;
    var coordinatesArray = coordinatesInput.split('\n').map(function (coord) {
        return coord.trim().split(',').map(function (num) {
            return parseFloat(num);
        });
    });

    if (coordinatesArray.length < 2) {
        document.getElementById('result').innerText = 'Please enter at least two coordinates.';
        return;
    }

    var distance = calculateDistance(coordinatesArray);
    document.getElementById('result').innerText = 'Distance: ' + distance.toFixed(2) + ' meters';
    var currdistance = distance.toFixed(2);
    var total = parseFloat(newdistance) + parseFloat(currdistance);
    document.getElementById('tresult').innerText = 'Total: ' + total.toFixed(2) + ' meters';
    newdistance = total.toFixed(2) + currdistance;
});

function calculateDistance(coordinatesArray) {
    var R = 6371000; // Earth's radius in meters
    var totalDistance = 0;

    for (var i = 0; i < coordinatesArray.length - 1; i++) {
        var lat1 = coordinatesArray[i][0];
        var lon1 = coordinatesArray[i][1];
        var lat2 = coordinatesArray[i + 1][0];
        var lon2 = coordinatesArray[i + 1][1];

        var dLat = deg2rad(lat2 - lat1);
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in meters
        totalDistance += d;
    }

    return totalDistance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}