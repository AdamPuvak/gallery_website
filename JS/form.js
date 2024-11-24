
const gallery = document.getElementById("gallery");
var photoList = [];
let thumbnails = [];
const filterInput = document.getElementById("filterInput");

const modal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("close")[0];
const fullImage = document.getElementById("fullImage");

const slideshowButton = document.getElementById("slideshowButton");
let slideshowRunning = false;


function showImageInfo(photo) {
    document.getElementById("imageTitle").innerText = photo.title;
    document.getElementById("imageDescription").innerText = photo.description;
    document.getElementById("imageDate").innerText = photo.date;
    document.getElementById("imageLatitude").innerText = photo.latitude;
    document.getElementById("imageLongitude").innerText = photo.longitude;
}

function plusSlides(n) {
    let currentSlide = 0;

    thumbnails.forEach((thumbnail, index) => {
        if (thumbnail.src === fullImage.src) {
            currentSlide = index;
        }
    });
    currentSlide = (currentSlide + n + thumbnails.length) % thumbnails.length;
    modal.style.display = "block";
    fullImage.src = thumbnails[currentSlide].src;

    showImageInfo(photoList[currentSlide]);
}

function startSlideshow() {
    slideshowRunning = true;
    slideshowButton.innerText = "Zastaviť Slideshow";

    function showNext() {
        if (slideshowRunning) {
            plusSlides(1);
            setTimeout(showNext, 1000);
        } else {
            slideshowButton.innerText = "Spustiť Slideshow";
        }
    }
    showNext();
}

function applyFilter() {
    const filterText = filterInput.value.toLowerCase();

    if (filterText.trim() === "") {
        thumbnails.forEach(thumbnail => {
            thumbnail.style.display = "block";
        });
    } else {
        thumbnails.forEach((thumbnail, index) => {
            const photo = photoList[index];
            const title = photo.title.toLowerCase();
            const description = photo.description.toLowerCase();

            if (title.includes(filterText) || description.includes(filterText)) {
                thumbnail.style.display = "block";
            } else {
                thumbnail.style.display = "none";
            }
        });
    }
}


document.addEventListener("DOMContentLoaded", function () {
    function loadPhotos() {
        return new Promise((resolve, reject) => {
            fetch("JSON/metadata.json")
                .then(response => response.json())
                .then(data => {
                    var photos = data.photos || [];

                    photos.forEach(photo => {
                        var photoObject = {
                            src: "PHOTOS/" + photo.filename,
                            title: photo.title,
                            description: photo.description,
                            date: photo.date,
                            latitude: photo.latitude,
                            longitude: photo.longitude
                        };
                        photoList.push(photoObject);
                    });
                    resolve(photoList);
                })
                .catch(error => reject(error));
        });
    }
    function makeThumbnails() {
        photoList.forEach(photo => {
            const img = document.createElement("img");
            img.src = photo.src;
            img.alt = photo.title;
            img.className = "thumbnail";
            gallery.appendChild(img);

            img.addEventListener("click", function () {
                modal.style.display = "block";
                fullImage.src = img.src;
                showImageInfo(photo);
            });
            thumbnails.push(img);
        });
    }

    if(slideshowButton) {
        slideshowButton.addEventListener("click", function () {
            if (slideshowRunning) {
                slideshowRunning = false;
            } else {
                startSlideshow();
            }
        });
    }
    if(closeBtn) {
        closeBtn.addEventListener("click", function () {
            slideshowRunning = false;
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            slideshowRunning = false;
            modal.style.display = "none";
        }
    });

    if(filterInput) {
        filterInput.addEventListener('input', function(event) {
            applyFilter();
        });
    }

    const mapElement = document.getElementById("map");
    if (!mapElement) {
        loadPhotos().then(() => makeThumbnails());
    } else {
        loadPhotos().then(() => createMap());
    }

});