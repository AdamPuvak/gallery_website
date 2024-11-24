
const map = L.map('map').setView([48.1472, 17.1048], 12);
const modalMap = document.getElementById("modalMap");
const closeBtn2 = document.getElementsByClassName("close2")[0];
const showRouteButton = document.getElementById("showRouteButton");
let routingControl;
const routeLengthElement = document.getElementById('routeLength');


function createMap() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    createMarkers();
}

function createMarkers() {
    photoList.forEach(photo => {
        const marker = L.marker([photo.latitude, photo.longitude]).addTo(map);
        marker.bindPopup(`<b>${photo.title}</b>`);

        marker.on('click', function () {
            showLocationPhotos(photo.latitude, photo.longitude);
        });
    });
}

function showLocationPhotos(latitude, longitude) {
    const modalMapContent = document.getElementById("modalMapContent");
    const photosAtLocation = photoList.filter(photo => photo.latitude === latitude && photo.longitude === longitude);

    modalMapContent.innerHTML = '';

    const titleElement = document.createElement("h3");
    titleElement.textContent = photosAtLocation[0].title;
    modalMapContent.appendChild(titleElement);

    photosAtLocation.forEach(photo => {
        const container = document.createElement("div");

        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.title;
        img.width = 200;

        const description = document.createElement("p");
        description.innerText = photo.description;

        const date = document.createElement("p");
        date.innerText = photo.date;

        container.appendChild(img);
        container.appendChild(description);
        container.appendChild(date);

        modalMapContent.appendChild(container);
    });
    modalMap.style.display = "block";
}

function showRoute() {
    const routeCoordinates = photoList
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(photo => [photo.latitude, photo.longitude]);
    console.log(routeCoordinates);
    routingControl = L.Routing.control({
        waypoints: routeCoordinates,
        routeWhileDragging: true,
        lineOptions: {
            styles: [{ color: 'blue', opacity: 1, weight: 5 }]
        },
    }).addTo(map);

    routingControl.on('routesfound', function (event) {
        const route = event.routes[0];
        const routeLengthInMeters = route.summary.totalDistance;

        const routeLengthInKilometers = routeLengthInMeters / 1000;

        routeLengthElement.textContent = `Dĺžka trasy: ${routeLengthInKilometers.toFixed(2)} km`;
    });

    updateButtonColor();
}
function removeRoute() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
        updateButtonColor();
    }
    routeLengthElement.textContent = ``;
}
function updateButtonColor() {
    showRouteButton.style.backgroundColor = routingControl ? '#123499' : 'grey';
}


document.addEventListener("DOMContentLoaded", function () {

    if(closeBtn2) {
        closeBtn2.addEventListener("click", function () {
            modalMap.style.display = "none";
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === modalMap) {
            modalMap.style.display = "none";
        }
    });

    if (showRouteButton) {
        showRouteButton.addEventListener("click", function () {
            if (routingControl) {
                removeRoute();
            } else {
                showRoute();
            }
        });
    }

});