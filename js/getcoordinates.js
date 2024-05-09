function calculateCoordinates() {
    const input = document.getElementById('startEnd').value;
    const [startLat, startLng, endLat, endLng] = input.split(',').map(coord => parseFloat(coord.trim()));

    // Calculate coordinates every 5 meters
    const latDistance = endLat - startLat;
    const lngDistance = endLng - startLng;
    const totalDistance = Math.sqrt(latDistance ** 2 + lngDistance ** 2);
    const numberOfPoints = Math.floor(totalDistance / 0.00005); // 5 meters in degrees
    console.log(totalDistance)
    console.log(latDistance ** 2 + lngDistance ** 2)
    console.log(numberOfPoints)
    const latIncrement = latDistance / numberOfPoints;
    const lngIncrement = lngDistance / numberOfPoints;
    var t = latIncrement + startLat
    t = t + latIncrement
    console.log(latIncrement + startLat)
    console.log(latIncrement + startLat)
    // Generate coordinates list
    const coordinatesList = document.getElementById('coordinatesList');
    coordinatesList.innerHTML = '';
    for (let i = 0; i <= numberOfPoints; i++) {
        const lat = startLat + (latIncrement * i);
        const lng = startLng + (lngIncrement * i);
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.innerText = `[${lat.toFixed(6)}, ${lng.toFixed(6)}],`;
        coordinatesList.appendChild(li);
    }
}

function copyToClipboard() {
    const coordinatesList = document.getElementById('coordinatesList');
    const textToCopy = Array.from(coordinatesList.childNodes).map(node => node.innerText).join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('Coordinates copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy coordinates: ', err);
        });
    } else {
        // Fallback for browsers that do not support the Clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Coordinates copied to clipboard!');
    }
}
