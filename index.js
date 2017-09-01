const tj = require("@mapbox/togeojson");
const fs = require("fs");
const DOMParser = require("xmldom").DOMParser;
const util = require("util");
const moment = require("moment-timezone");
const _ = require("lodash");
const numeral = require("numeral");
const geo = require("node-geo-distance");

// const parseString = require('xml2js').parseString;

const gpx = new DOMParser().parseFromString(
  fs.readFileSync("./test.gpx", "utf8")
);

const trail = tj.gpx(gpx);
const coordTimes = trail.features[0].properties.coordTimes;
console.log("conv: ", trail.features[0].properties.coordTimes.length);
console.log("conv: ", trail.features[0].geometry.coordinates.length);

const duration = moment(_.last(coordTimes)).diff(
  moment(_.first(coordTimes)),
  "s"
);
console.log(moment(_.last(coordTimes)).format());
console.log(moment(_.first(coordTimes)).format());
console.log("duration: ", numeral(duration).format("00:00:00"));

// const coord1 = trail.features[0].geometry.coordinates.map(c => ({latitude: c[0], longitude: c[1]}))[0]
// const coord2 = trail.features[0].geometry.coordinates.map(c => ({latitude: c[0], longitude: c[1]}))[1]
// console.log('coord1: ', coord1)
// console.log('coord2: ', coord2)
let td = 0;
let tdh = 0;
const cc = trail.features[0].geometry.coordinates;
for (var i = 0; i < cc.length - 1; i++) {
  const coord1 = {
    latitude: cc[i][1],
    longitude: cc[i][0]
  };
  const coord2 = {
    latitude: cc[i + 1][1],
    longitude: cc[i + 1][0]
  };
  tdh += +geo.haversineSync(coord1, coord2);
  td += +geo.vincentySync(coord1, coord2);
}
// var vincentyDist = geo.vincentySync(coord1, coord2);
// console.log('vv: ', vincentyDist)
console.log("td: ", td);
console.log("td: ", tdh);
console.log("l ", cc.length);

// console.log(util.inspect(converted, false, null))

// console.log('conv: ', convertedWithStyles)

// parseString(fs.readFileSync('./test.gpx', 'utf8'))
