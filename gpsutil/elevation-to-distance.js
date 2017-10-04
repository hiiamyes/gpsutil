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

let points = parsedGPX.gpx.trk.trkseg.trkpt;
points = points.map((point, i) => {
  if (i === 0) {
    point.distanceFromPrePoint = 0;
    point.distance = 0;
    return point;
  }
  const coord1 = { latitude: +points[i].lat, longitude: +points[i].lon };
  const coord2 = {
    latitude: +points[i - 1].lat,
    longitude: +points[i - 1].lon
  };
  const distanceFromPrePoint = +geo.vincentySync(coord1, coord2);
  point.distanceFromPrePoint = distanceFromPrePoint;
  point.distance = points[i - 1].distance + distanceFromPrePoint;
  return point;
});

console.log(points);

// log.info("distance (haversine): ", (distanceHaversine / 1000).toFixed(1), "km");
// log.info("distance (vincenty): ", (distanceVincenty / 1000).toFixed(1), "km");
// log.info("time: ", numeral(time / 1000).format("00:00:00"));
