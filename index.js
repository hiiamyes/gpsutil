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
  fs.readFileSync("./shui-forest.gpx", "utf8")
);

const trail = tj.gpx(gpx);
const coordTimes = trail.features[0].properties.coordTimes;
// console.log("conv: ", trail.features[0].properties.coordTimes.length);
// console.log("conv: ", trail.features[0].geometry.coordinates.length);

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
const target = {
  latitude: 23.6011326,
  longitude: 120.789729
};

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
  // if (+geo.vincentySync(coord1, target) < 20) {
  //   console.log("yes: ", i, coord1, geo.vincentySync(coord2, target));
  // }
}
// var vincentyDist = geo.vincentySync(coord1, coord2);
// console.log('vv: ', vincentyDist)
console.log("td: ", td);
console.log("td: ", tdh);
// console.log("l ", cc.length);
// console.log(util.inspect(converted, false, null))
// console.log('conv: ', convertedWithStyles)
// parseString(fs.readFileSync('./test.gpx', 'utf8'))

const nodes = [
  { lat: 23.6260045, lng: 120.7991155 }, // 仁亭
  { lat: 23.6211228, lng: 120.796533 }, // 鹿屈山登山口
  { lat: 23.5965233, lng: 120.8017566 }, // 岔路
  { lat: 23.5830092, lng: 120.8026576 } // 水漾森林
  // { lat: 23.6156614, lng: 120.7875484 }, // 鹿屈山前鋒
  // { lat: 23.6011326, lng: 120.789729 }, // 鹿屈山
  // { lat: 23.6156614, lng: 120.7875484 }, // 鹿屈山前鋒
  // { lat: 23.6211228, lng: 120.796533 }, // 鹿屈山登山口
  // { lat: 23.6260045, lng: 120.7991155 } // 仁亭
];

// function findStartAndEnd(node, points) {
//   let result = [];
//   const coord2 = { latitude: node.lat, longitude: node.lng };
//   for (var i = 0; i < points.length - 1; i++) {
//     const coord1 = { latitude: points[i][1], longitude: points[i][0] };
//     const d = +geo.vincentySync(coord1, coord2);
//     if (result.length === 0 && d < 20) {
//       result.push({ i, lat: points[i][1], lng: points[i][0] });
//     }
//     if (result.length === 1 && d > 20) {
//       result.push({ i, lat: points[i - 1][1], lng: points[i - 1][0] });
//     }
//   }
//   return result;
// }

// const startAndEnds = nodes.map(n =>
//   findStartAndEnd(n, trail.features[0].geometry.coordinates)
// );

// let times = [];
// for (var i = 0; i < startAndEnds.length - 1; i++) {
//   const endTime = trail.features[0].properties.coordTimes[startAndEnds[i][1].i];
//   const startTime =
//     trail.features[0].properties.coordTimes[startAndEnds[i + 1][0].i];
//   times.push(moment(startTime).diff(moment(endTime), "s"));
// }

function analyize(nodes, points) {
  let result = [];
  let j = 0;
  let coord2 = { latitude: nodes[j].lat, longitude: nodes[j].lng };
  for (var i = 0; i < points.length - 1; i++) {
    const coord1 = { latitude: points[i][1], longitude: points[i][0] };
    const d = +geo.vincentySync(coord1, coord2);
    if (result.length % 2 === 0 && d < 30) {
      console.log(coord1);
      result.push(i);
      continue;
    }
    if (result.length % 2 === 1 && d > 30) {
      console.log(coord1);
      result.push(i);
      if (j < nodes.length - 1) {
        j++;
        coord2 = { latitude: nodes[j].lat, longitude: nodes[j].lng };
      } else {
        break;
      }
    }
  }
  return result;
}

const result = analyize(nodes, trail.features[0].geometry.coordinates);
let timesg = [];
for (var i = 1; i < result.length - 1; i += 2) {
  const endTime = trail.features[0].properties.coordTimes[result[i]];
  const startTime = trail.features[0].properties.coordTimes[result[i + 1]];
  timesg.push(moment(startTime).diff(moment(endTime), "s"));
}
console.log(result);
console.log(timesg.map(t => numeral(t).format("00:00:00")));
