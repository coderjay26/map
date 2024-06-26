var pathPolyline;
var markerGrieve;
var markerUser;
//8.537422, 123.372504

//8.535098, 123.370551
var polylines = [];

var user = [8.534408, 123.368267];
var gr = [8.535230, 123.372276];

async function updatePathIfUserAvailable() {
    const userLocation = await getUserLocation();
    if (userLocation) {
        const nearestCoordinate = findNearestCoordinate(userLocation, coordinatess);

        const nearestGCoordnate = findNearestCoordinate(grieve, coordinatess);

        var usrNode = getNodeNameByValue(nodes, nearestCoordinate);
        var grieves = getNodeNameByValue(nodes, nearestGCoordnate)

        let { distance, previous } = dijkstra(graph, usrNode, grieves);

        let path = await getShortestPath(previous, grieves);

        console.log(userLocation)
        var nearestPath = path.map(node => nodes[node]);

        var pathCoordinates = [userLocation, nearestCoordinate, ...nearestPath, nearestGCoordnate, grieve]
var totalDistance = 0;
        for (var i = 0; i < pathCoordinates.length - 1; i++) {
            var distances = calculateDistance(pathCoordinates[i], pathCoordinates[i + 1]);
            totalDistance += distances;
    }
    
        if (pathPolyline) {
            map.removeLayer(pathPolyline);
            map.removeLayer(markerGrieve);
            map.removeLayer(markerUser);
            polylines.forEach(function (item) {
                map.removeLayer(item)
            });
        }
        var customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: '<div class="text_marker"><div style="color: red; font-weight: bold; font-size:20px;">'+totalDistance.toFixed(1)+' meter/s</div></div>', 
            iconSize: [100, 100], // Size of the icon
            iconAnchor: [0, 0] // Position of the text within the icon
        });
        var textMarker = L.marker(grieve, { icon: customIcon }).addTo(map);
        polylines.push(customIcon);
        polylines.push(textMarker);
        markerUser = L.circle(userLocation).addTo(map);
        markerUser.bindPopup("You")
        markerGrieve = L.marker(grieve).addTo(map);
        markerGrieve.bindPopup("Grieve").openPopup();
       
        pathPolyline = L.polyline(pathCoordinates, { color: 'blue' }).addTo(map);

        map.fitBounds(markerUser.getBounds());
    }
}


function getUserLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            position => {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                resolve([latitude.toFixed(6), longitude.toFixed(6)]);
            },
            error => {
                console.error("Error getting location: ", error);
                resolve(null);
            }
        );
    });
}

function calculateDistance(coord1, coord2) {
    var lat1 = coord1[0];
    var lon1 = coord1[1];
    var lat2 = coord2[0];
    var lon2 = coord2[1];

    var R = 6371e3; // Earth radius in meters
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

function getNodeNameByValue(nodes, targetValue) {
    for (var nodeName in nodes) {
        var nodeValue = nodes[nodeName];
        if (nodeValue[0] === targetValue[0] && nodeValue[1] === targetValue[1]) {
            return nodeName;
        }
    }
    return null; // Return null if no matching node is found
}

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

    if (coordinates) {
        for (var i = 0; i < coordinates.length; i++) {
            var coordinate = coordinates[i];
            if (coordinate) {
                var distance = haversine(point[0], point[1], coordinate[0], coordinate[1]);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestCoordinate = coordinate;
                }
            }
        }
    }

    return nearestCoordinate;
}


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

function dijkstra(graph, source, destination) {
    let distance = {};
    let previous = {};
    for (let node in graph) {
        distance[node] = Infinity;
        previous[node] = undefined;
    }
    distance[source] = 0;

    let unvisited = new Set(Object.keys(graph));

    while (unvisited.size > 0) {
        let closestNode = getClosestNode(distance, unvisited);
        unvisited.delete(closestNode);

        for (let neighbor in graph[closestNode]) {
            let distanceFromSource = graph[closestNode][neighbor] + distance[closestNode];
            if (distanceFromSource < distance[neighbor]) {
                distance[neighbor] = distanceFromSource;
                previous[neighbor] = closestNode;
            }
        }
    }

    return { distance, previous };
}

function getClosestNode(distance, unvisited) {
    return Array.from(unvisited).reduce((closestNode, node) =>
        distance[node] < distance[closestNode] ? node : closestNode
    );
}

function getShortestPath(previous, destination) {
    let path = [destination];
    let current = destination;
    while (previous[current]) {
        current = previous[current];
        path.unshift(current);
    }
    return path;
}


var coordinatess = [
    [8.534804, 123.372156], [8.534829, 123.372110], [8.534854, 123.372064], [8.534879, 123.372018], [8.534904, 123.371972], [8.534929, 123.371927], [8.534954, 123.371881], [8.534979, 123.371835], [8.535004, 123.371789], [8.535029, 123.371743], [8.535055, 123.371697], [8.535080, 123.371651], [8.535105, 123.371605], [8.535130, 123.371559], [8.535155, 123.371513], [8.535180, 123.371468], [8.535205, 123.371422], [8.535230, 123.371376], [8.535255, 123.371330], [8.535280, 123.371284],

    [8.535327, 123.371305], [8.535374, 123.371326], [8.535421, 123.371347], [8.535468, 123.371368], [8.535515, 123.371389], [8.535562, 123.371410], [8.535608, 123.371431], [8.535655, 123.371452], [8.535702, 123.371473], [8.535749, 123.371494], [8.535796, 123.371515], [8.535843, 123.371536], [8.535890, 123.371557], [8.535937, 123.371579], [8.535984, 123.371600], [8.536031, 123.371621], [8.536078, 123.371642], [8.536125, 123.371663], [8.536172, 123.371684], [8.536218, 123.371705], [8.536265, 123.371726], [8.536312, 123.371747], [8.536359, 123.371768], [8.536406, 123.371789], [8.536453, 123.371810], [8.536500, 123.371831],

    [8.536481, 123.371878], [8.536462, 123.371925], [8.536443, 123.371972], [8.536424, 123.372019], [8.536405, 123.372066], [8.536386, 123.372113], [8.536367, 123.372159], [8.536348, 123.372206], [8.536329, 123.372253], [8.536310, 123.372300], [8.536291, 123.372347], [8.536272, 123.372394], [8.536253, 123.372441], [8.536234, 123.372488], [8.536215, 123.372535], [8.536196, 123.372582], [8.536177, 123.372629], [8.536158, 123.372675], [8.536139, 123.372722], [8.536120, 123.372769], [8.536101, 123.372816], [8.536082, 123.372863], [8.536063, 123.372910], [8.536044, 123.372957],
    
    [8.536546, 123.371855], [8.536591, 123.371879], [8.536637, 123.371903], [8.536682, 123.371928], [8.536727, 123.371952], [8.536773, 123.371976], [8.536819, 123.372000], [8.536864, 123.372024], [8.536910, 123.372048], [8.536955, 123.372072], [8.537000, 123.372097], [8.537046, 123.372121], [8.537092, 123.372145], [8.537137, 123.372169], [8.537183, 123.372193], [8.537228, 123.372217], [8.537274, 123.372241], [8.537319, 123.372266], [8.537365, 123.372290], [8.537410, 123.372314], [8.537456, 123.372338], [8.537501, 123.372362], [8.537547, 123.372386], [8.537592, 123.372410], [8.537638, 123.372435], [8.537683, 123.372459], [8.537729, 123.372483], [8.537774, 123.372507],

    [8.537755, 123.372553], [8.537736, 123.372600], [8.537717, 123.372646], [8.537698, 123.372693], [8.537680, 123.372739], [8.537661, 123.372786], [8.537642, 123.372832], [8.537623, 123.372879], [8.537604, 123.372925],

    [8.537554, 123.372931], [8.537504, 123.372937], [8.537454, 123.372943], [8.537405, 123.372949], [8.537355, 123.372955], [8.537305, 123.372961], [8.537255, 123.372967], [8.537205, 123.372973], [8.537156, 123.372979], [8.537106, 123.372985], [8.537056, 123.372991], [8.537006, 123.372997], [8.536956, 123.373003], [8.536906, 123.373009], [8.536856, 123.373015], [8.536807, 123.373021], [8.536757, 123.373027], [8.536707, 123.373033],

    [8.536654, 123.373063], [8.536601, 123.373092],

    [8.536550, 123.373080], [8.536499, 123.373069], [8.536448, 123.373057], [8.536397, 123.373045], [8.536346, 123.373033], [8.536294, 123.373022], [8.536243, 123.373010], [8.536192, 123.372998], [8.536141, 123.372986], [8.536090, 123.372975], [8.536039, 123.372963],

    [8.535986, 123.372947], [8.535933, 123.372931], [8.535880, 123.372915], [8.535827, 123.372899], [8.535773, 123.372882], [8.535720, 123.372866], [8.535667, 123.372850], [8.535614, 123.372834], [8.535561, 123.372818],

    [8.535523, 123.372785], [8.535485, 123.372752], [8.535447, 123.372719], [8.535410, 123.372686], [8.535372, 123.372653], [8.535334, 123.372619], [8.535296, 123.372586], [8.535258, 123.372553], [8.535220, 123.372520], [8.535182, 123.372487], [8.535145, 123.372454], [8.535107, 123.372421], [8.535069, 123.372388], [8.535031, 123.372355], [8.534993, 123.372321], [8.534955, 123.372288], [8.534918, 123.372255], [8.534880, 123.372222], [8.534842, 123.372189]
];

let nodes = {};

for (let i = 0; i < coordinatess.length; i++) {
    nodes[i + 1] = coordinatess[i];
}

let graph = {
    '1': { '165': 5, '2': 5 },
    '2': { '1': 5, '3': 5 },
    '3': { '2': 5, '4': 5 },
    '4': { '3': 5, '5': 5 },
    '5': { '4': 5, '6': 5 },
    '6': { '5': 5, '7': 5 },
    '7': { '6': 5, '8': 5 },
    '8': { '7': 5, '9': 5 },
    '9': { '8': 5, '10': 5 },
    '10': { '9': 5, '11': 5 },
    '11': { '10': 5, '12': 5 },
    '12': { '11': 5, '13': 5 },
    '13': { '12': 5, '14': 5 },
    '14': { '13': 5, '15': 5 },
    '15': { '14': 5, '16': 5 },
    '16': { '15': 5, '17': 5 },
    '17': { '16': 5, '18': 5 },
    '18': { '17': 5, '19': 5 },
    '19': { '18': 5, '20': 5 },
    '20': { '19': 5, '21': 5 },
    '21': { '20': 5, '22': 5 },
    '22': { '21': 5, '23': 5 },
    '23': { '22': 5, '24': 5 },
    '24': { '23': 5, '25': 5 },
    '25': { '24': 5, '26': 5 },
    '26': { '25': 5, '27': 5 },
    '27': { '26': 5, '28': 5 },
    '28': { '27': 5, '29': 5 },
    '29': { '28': 5, '30': 5 },
    '30': { '29': 5, '31': 5 },
    '31': { '30': 5, '32': 5 },
    '32': { '31': 5, '33': 5 },
    '33': { '32': 5, '34': 5 },
    '34': { '33': 5, '35': 5 },
    '35': { '34': 5, '36': 5 },
    '36': { '35': 5, '37': 5 },
    '37': { '36': 5, '38': 5 },
    '38': { '37': 5, '39': 5 },
    '39': { '38': 5, '40': 5 },
    '40': { '39': 5, '41': 5 },
    '41': { '40': 5, '42': 5 },
    '42': { '41': 5, '43': 5 },
    '43': { '42': 5, '44': 5 },
    '44': { '43': 5, '45': 5 },
    '45': { '44': 5, '46': 5 },
    '46': { '45': 5, '47': 5, '71': 5 },
    '47': { '48': 5, '46': 5 },
    '48': { '47': 5, '49': 5 },
    '49': { '48': 5, '50': 5 },
    '50': { '49': 5, '51': 5 },
    '51': { '50': 5, '52': 5 },
    '52': { '51': 5, '53': 5 },
    '53': { '52': 5, '54': 5 },
    '54': { '53': 5, '55': 5 },
    '55': { '54': 5, '56': 5 },
    '56': { '55': 5, '57': 5 },
    '57': { '56': 5, '58': 5 },
    '58': { '57': 5, '59': 5 },
    '59': { '58': 5, '60': 5 },
    '60': { '59': 5, '61': 5 },
    '61': { '60': 5, '62': 5 },
    '62': { '61': 5, '63': 5 },
    '63': { '62': 5, '64': 5 },
    '64': { '63': 5, '65': 5 },
    '65': { '64': 5, '66': 5 },
    '66': { '65': 5, '67': 5 },
    '67': { '66': 5, '68': 5 },
    '68': { '67': 5, '69': 5 },
    '69': { '68': 5, '138': 5 },
    '70': { '71': 5, '46': 5 },
    '71': { '46': 5, '72': 5 },
    '72': { '71': 5, '73': 5 },
    '73': { '72': 5, '74': 5 },
    '74': { '73': 5, '75': 5 },
    '75': { '74': 5, '76': 5 },
    '76': { '75': 5, '77': 5 },
    '77': { '76': 5, '78': 5 },
    '78': { '77': 5, '79': 5 },
    '79': { '78': 5, '80': 5 },
    '80': { '79': 5, '81': 5 },
    '81': { '80': 5, '82': 5 },
    '82': { '81': 5, '83': 5 },
    '83': { '82': 5, '84': 5 },
    '84': { '83': 5, '85': 5 },
    '85': { '84': 5, '86': 5 },
    '86': { '85': 5, '87': 5 },
    '87': { '86': 5, '88': 5 },
    '88': { '87': 5, '89': 5 },
    '89': { '88': 5, '90': 5 },
    '90': { '89': 5, '91': 5 },
    '91': { '90': 5, '92': 5 },
    '92': { '91': 5, '93': 5 },
    '93': { '92': 5, '94': 5 },
    '94': { '93': 5, '95': 5 },
    '95': { '94': 5, '96': 5 },
    '96': { '95': 5, '97': 5 },
    '97': { '96': 5, '98': 5 },
    '98': { '97': 5, '99': 5 },
    '99': { '98': 5, '100': 5 },
    '100': { '101': 5, '99': 5 },
    '101': { '100': 5, '102': 5 },
    '102': { '101': 5, '103': 5 },
    '103': { '102': 5, '104': 5 },
    '104': { '103': 5, '105': 5 },
    '105': { '104': 5, '106': 5 },
    '106': { '105': 5, '107': 5 },
    '107': { '106': 5, '108': 5 },
    '108': { '107': 5, '109': 5 },
    '109': { '108': 5, '110': 5 },
    '110': { '109': 5, '111': 5 },
    '111': { '110': 5, '112': 5 },
    '112': { '111': 5, '113': 5 },
    '113': { '112': 5, '114': 5 },
    '114': { '113': 5, '115': 5 },
    '115': { '114': 5, '116': 5 },
    '116': { '115': 5, '117': 5 },
    '117': { '116': 5, '118': 5 },
    '118': { '117': 5, '119': 5 },
    '119': { '118': 5, '120': 5 },
    '120': { '119': 5, '121': 5 },
    '121': { '120': 5, '122': 5 },
    '122': { '121': 5, '123': 5 },
    '123': { '122': 5, '124': 5 },
    '124': { '123': 5, '125': 5 },
    '125': { '124': 5, '126': 5 },
    '126': { '125': 5, '127': 5 },
    '127': { '126': 5, '128': 5 },
    '128': { '127': 5, '129': 5 },
    '129': { '128': 5, '130': 5 },
    '130': { '129': 5, '131': 5 },
    '131': { '130': 5, '132': 5 },
    '132': { '131': 5, '133': 5 },
    '133': { '132': 5, '134': 5 },
    '134': { '133': 5, '135': 5 },
    '135': { '134': 5, '136': 5 },
    '136': { '135': 5, '137': 5 },
    '137': { '136': 5, '138': 5, '69': 5 },
    '138': { '137': 5, '139': 5 },
    '139': { '138': 5, '140': 5 },
    '140': { '139': 5, '141': 5 },
    '141': { '140': 5, '142': 5 },
    '142': { '141': 5, '143': 5 },
    '143': { '142': 5, '144': 5 },
    '144': { '143': 5, '145': 5 },
    '145': { '144': 5, '146': 5 },
    '146': { '145': 5, '147': 5 },
    '147': { '146': 5, '148': 5 },
    '148': { '147': 5, '149': 5 },
    '149': { '148': 5, '150': 5 },
    '150': { '149': 5, '151': 5 },
    '151': { '150': 5, '152': 5 },
    '152': { '151': 5, '153': 5 },
    '153': { '152': 5, '154': 5 },
    '154': { '153': 5, '155': 5 },
    '155': { '154': 5, '156': 5 },
    '156': { '155': 5, '157': 5 },
    '157': { '156': 5, '158': 5 },
    '158': { '157': 5, '159': 5 },
    '159': { '158': 5, '160': 5 },
    '160': { '159': 5, '161': 5 },
    '161': { '160': 5, '162': 5 },
    '162': { '161': 5, '163': 5 },
    '163': { '162': 5, '164': 5 },
    '164': { '163': 5, '165': 5 },
    '165': { '164': 5, '1': 5 }
};

setInterval(updatePathIfUserAvailable, 3000); // 3000 milliseconds = 3 seconds