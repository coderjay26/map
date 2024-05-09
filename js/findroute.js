var personIcon = L.icon({
    iconUrl: 'person-icon.png', // Path to the icon image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [5, 35], // Anchor point of the icon, determines marker's location
    popupAnchor: [0, -32] // Popup anchor for the marker
});
var route = [
    [8.535548, 123.372808],
    [8.535617, 123.372754],
    [8.536066, 123.372876],
    [8.536274, 123.372343]
];
var arraysOfCoordinates = {
    "coordinate1": coordinate1,
    "coordinate2": coordinate2,
    "coordinate3": coordinate3,
    "coordinate4": coordinate4,
    "coordinate5": coordinate5,
    "coordinate6": coordinate6,
    "coordinate7": coordinate7,
    "rcoordinate1": rcoordinate1,
    "rcoordinate2": rcoordinate2,
    "rcoordinate3": rcoordinate3,
    "rcoordinate4": rcoordinate4,
    "rcoordinate4_1": rcoordinate4_1,
    "rcoordinate4_2": rcoordinate4_2,
    "rcoordinate5": rcoordinate5,
    "rcoordinate6": rcoordinate6,
    "rcoordinate7": rcoordinate7,
    "rcoordinate8": rcoordinate8,
    "rcoordinate9": rcoordinate9,
    "rcoordinate10": rcoordinate10,
    "rcoordinate10_1_0": rcoordinate10_1_0,
    "rcoordinate10_1": rcoordinate10_1,
    "rcoordinate11": rcoordinate11,
    "rcoordinate12": rcoordinate12,
    "rcoordinate12_1": rcoordinate12_1,
};

function findArrayNameContainingCoordinate(coordinate, arrays) {
    for (var key in arrays) {
        if (isCoordinateInsideArray(coordinate, arrays[key])) {
            return key;
        }
    }
    return null; // Coordinate not found in any array
}

function isCoordinateInsideArray(coordinate, array) {
    for (var i = 0; i < array.length; i++) {
        if (coordinate[0] === array[i][0] && coordinate[1] === array[i][1]) {
            return true;
        }
    }
    return false;
}

const userLoc = (userCurr, nearestLoc) => {
    userPol = []
    userPol.push(userCurr)
    userPol.push(nearestLoc)
    var userMarker = L.marker(userCurr, {icon: personIcon}).addTo(map)
    polylines.push(userMarker);
    var userLocDottedPollyline = L.polyline(userPol, { dashArray: '5, 5', color: 'red', weight: 5 }).addTo(map);
    polylines.push(userLocDottedPollyline)
    return {userMarker, userLocDottedPollyline}
} 


