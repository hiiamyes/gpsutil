const pino = require("pino");
var pretty = pino.pretty();
pretty.pipe(process.stdout);
var log = pino(
  {
    name: "app",
    safe: true
  },
  pretty
);
const fs = require("fs");
const _ = require("lodash");
const moment = require("moment");
const numeral = require("numeral");
const fastXmlParser = require("fast-xml-parser");
const geo = require("node-geo-distance");

let parsedGPX = fastXmlParser.parse(
  fs.readFileSync("./shui-yang-forest.gpx", "utf8"),
  {
    attrPrefix: "",
    ignoreNonTextNodeAttr: false
  }
);
// console.log(_.keys(gpx.trk.trkseg));
console.log(parsedGPX.gpx.trk);
// console.log(parsedGPX);
// console.log(gpx.trk.trkseg.trkpt.length);

const points = parsedGPX.gpx.trk.trkseg.trkpt;
let distanceHaversine = 0;
let distanceVincenty = 0;
for (let i = 0; i < points.length - 1; i++) {
  const coord1 = { latitude: +points[i].lat, longitude: +points[i].lon };
  const coord2 = {
    latitude: +points[i + 1].lat,
    longitude: +points[i + 1].lon
  };
  distanceHaversine += +geo.haversineSync(coord1, coord2);
  distanceVincenty += +geo.vincentySync(coord1, coord2);
}
const time = moment(_.last(points).time).diff(points[0].time);

log.info("distance (haversine): ", (distanceHaversine / 1000).toFixed(1), "km");
log.info("distance (vincenty): ", (distanceVincenty / 1000).toFixed(1), "km");
log.info("time: ", numeral(time / 1000).format("00:00:00"));
