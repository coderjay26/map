function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in meters
}

function findNearestCoordinate(point, coordinates) {
    var minDistance = Number.MAX_VALUE;
    var nearestCoordinate = null;

    for (var i = 0; i < coordinates.length; i++) {
        var coordinate = coordinates[i];
        var distance = haversine(point[0], point[1], coordinate[0], coordinate[1]);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCoordinate = coordinate;
        }
    }

    return nearestCoordinate;
}


var route = [];

        function addCoordinates(routes) {   
            var coordinatesArray = JSON.parse('[' + routes + ']');
            if (Array.isArray(routes) && coordinatesArray.length > 0) {
                route = routes;
            }
            return calculateTotalDistance()
        }

        function calculateDistance(coord1, coord2) {
            var lat1 = coord1[0];
            var lon1 = coord1[1];
            var lat2 = coord2[0];
            var lon2 = coord2[1];

            var R = 6371e3; 
            var φ1 = lat1 * Math.PI / 180;
            var φ2 = lat2 * Math.PI / 180;
            var Δφ = (lat2 - lat1) * Math.PI / 180;
            var Δλ = (lon2 - lon1) * Math.PI / 180;

            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            var distance = R * c;
            return distance;
        }

        function calculateTotalDistance() {
            var totalDistance = 0;
            for (var i = 0; i < route.length - 1; i++) {
                var distance = calculateDistance(route[i], route[i + 1]);
                totalDistance += distance;
            }

            return totalDistance.toFixed(2);
        }

