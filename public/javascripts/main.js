
// changes display of modal to 'block' to show div
function showModal(modalID) {
    var modal = document.getElementById(modalID);
    modal.style.display = "block";
}

// changes display of modal to 'none' to hide div
function closeModal(obj) {
    var element = obj;
    while (element.className != 'modal'){
        element = element.parentNode;
    }
    element.style.display = "none";
}

function initMap() {
    var mpls = {lat: 45.000, lng: -93.000};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: mpls
    });

    var _id = document.getElementById('_id');
    var id = _id.value;


    // var self_url = window.location.href;

    // var domain = self_url.split(":")[1];
    // domain = domain.split("//")[1];

    // var port = self_url.split(":")[2];

    // port = port.split("/")[0];

    // self_url = self_url.split("//")[1];
    var http = "https://afternoon-dusk-56668.herokuapp.com/bird/" + id + "/sightings"

    httpGetAsync(http, function (text) {
        text = text.replace(/&quot;/g, "\"");
        var places = JSON.parse(text);

        for (var i = 0; i < places.length; i++) {
            var marker = new google.maps.Marker({
                position: places[i],
                map: map
            })
        }
    });
}


function printLatLng(lat, lng) {
    console.log(lat);
    console.log(lng);
}

// taken from
// https://stackoverflow.com/questions/247483/http-get-request-in-javascript

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
