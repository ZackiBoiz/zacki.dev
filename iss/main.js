import { scaleSequentialSqrt } from "https://esm.sh/d3-scale";
import { interpolateYlOrRd } from "https://esm.sh/d3-scale-chromatic";

const weightColor = scaleSequentialSqrt(interpolateYlOrRd).domain([0, 1e7]);
const globeContainer = document.getElementById("globeViz");
const statusIndicator = document.getElementById("statusIndicator");

const world = new Globe(globeContainer)
    .globeImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg")
    .bumpImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png")
    .backgroundImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png")
    .hexBinPointWeight("pop")
    .hexAltitude(d => d.sumWeight * 6e-8)
    .hexBinResolution(4)
    .hexTopColor(d => weightColor(d.sumWeight))
    .hexSideColor(d => weightColor(d.sumWeight))
    .hexBinMerge(true)
    .enablePointerInteraction(false)
    .pointsData([])
    .pointLat("lat")
    .pointLng("lng")
    .pointAltitude(p => p.alt / 10000)
    .pointColor(p => {
        const idx = p.i - offset;
        if (idx === futureTrail.length - 1) return "rgb(0, 255, 0)";
        const t = idx / (futureTrail.length - 1);
        const r = Math.round(t * 255), b = Math.round((1 - t) * 255);
        return `rgb(${r}, 0, ${b})`;
    })
    .pointRadius(() => 0.1);

let futureTrail = [];
let offset = 0;
let gotFirstPing = false;

function setStatusIndicator(colorName) {
    statusIndicator.style.backgroundColor = colorName;
    statusIndicator.style.color = colorName;
}

async function fetchISSPosition() {
    try {
        const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
        const data = await res.json();

        return {
            lat: data.latitude,
            lng: data.longitude,
            alt: data.altitude,
            vel: data.velocity,
            timestamp: data.timestamp
        };
    } catch (err) {
        console.error("Failed to fetch ISS data:", err);
        return null;
    }
}

async function generateFuturePoints() {
    const pos = await fetchISSPosition();
    if (!pos) return setStatusIndicator("orange");

    if (!gotFirstPing) {
        gotFirstPing = true;
        setStatusIndicator("limegreen");
    }

    const point = {
        i: offset + futureTrail.length,
        lat: pos.lat,
        lng: pos.lng,
        alt: pos.alt,
        vel: pos.vel
    };

    futureTrail.push(point);

    if (futureTrail.length > 1000) {
        futureTrail.shift();
        offset++;
    }

    world.pointsData([...futureTrail]);
}

setStatusIndicator("orange");
generateFuturePoints();
setInterval(generateFuturePoints, 2000);