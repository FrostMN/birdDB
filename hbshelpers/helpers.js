var moment = require('moment');

function formatDate(date) {
    m = moment.utc(date);
    return m.parseZone().format('ddd, MMM Do YYYY, h:mm a' );
}

function formatLatitude(lat) {
    if (lat < 0) {
        return lat + "° S";
    } else if (lat > 0) {
        return lat + "° N";
    } else {
        return lat + "°";
    }
}

function formatLongitude(long) {
    if (long < 0) {
        return long + "° W";
    } else if (long > 0) {
        return long + "° E";
    } else {
        return long + "°";
    }
}

function length(array) {
    return array.length;
}




module.exports = {
    formatDate: formatDate,
    length: length,
    formatLongitude: formatLongitude,
    formatLatitude: formatLatitude,
};
