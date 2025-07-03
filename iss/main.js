import * as satellite from "https://cdn.jsdelivr.net/npm/satellite.js@4.0.0/dist/satellite.es.js";

const BASE_URL = "https://api.wheretheiss.at";
const ISS_NORAD_ID = 25544;
const MAX_SAVED_POINTS = 1000;
const PREDICTED_POINTS = 5000;
const SATELLITE_DATA_INTERVAL = 2000;
const TLE_DATA_INTERVAL = 60000;

const globeContainer = document.getElementById("globeViz");
const statusIndicator = document.getElementById("statusIndicator");


const world = new Globe(globeContainer)
    .globeImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg")
    .bumpImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png")
    .backgroundImageUrl("//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png")
    .enablePointerInteraction(false)
    .pointsData([])
    .pointLat(d => d.lat)
    .pointLng(d => d.lng)
    .pointAltitude(d => d.type === "predicted" ? 0.001 : d.alt / 10000)
    .pointColor(d => {
        if (d.type === "predicted") return "cyan";

        const len = realTrail.length;
        const idx = realTrail.indexOf(d);
        if (idx === len - 1) return "limegreen";
        const t = idx / (len - 1);
        const r = Math.round(t * 255), b = Math.round((1 - t) * 255);
        return `rgb(${r},0,${b})`;
    })
    .pointRadius(d => d.type === "predicted" ? 0.05 : 0.075);

let realTrail = [];
let predictedTrail = [];
let tleData = null;
let satrec = null;
let nextPredTime = null;

setInterval(getTLEData, TLE_DATA_INTERVAL);
setInterval(getSatelliteData, SATELLITE_DATA_INTERVAL);
getSatelliteData();
setStatus("red");



function setStatus(color) {
    statusIndicator.style.color = color;
    statusIndicator.style.backgroundColor = color;
}

function updateGlobe(realTrail, predictedTrail) {
    world.pointsData([...realTrail, ...predictedTrail]);
}

async function getTLEData() {
    const data = await getSatelliteTLE(ISS_NORAD_ID);
    if (!data) return setStatus("red");

    tleData = data;
    computePredicted(data.line1, data.line2, PREDICTED_POINTS);
    setStatus("orange");
}

async function getSatelliteData() {
    if (!tleData) {
        await getTLEData();
        if (!tleData) return;
    }

    const data = await getSatellitePosition(ISS_NORAD_ID);
    if (!data) {
        predictedTrail.shift();
        updateGlobe(realTrail, predictedTrail);
        return setStatus("red");
    }
    
    setStatus("limegreen");
    appendRealPosition(data);
    stepPrediction();
}

function computePredicted(l1, l2, N) {
    satrec = satellite.twoline2satrec(l1, l2);

    const now = new Date();
    const STEP_S = SATELLITE_DATA_INTERVAL / 1000;

    predictedTrail = [];
    for (let i = 1; i <= N; i++) {
        const t = new Date(now.getTime() + i * STEP_S * 1000);
        const eci = satellite.propagate(satrec, t);
        if (!eci.position) continue;
        const gmst = satellite.gstime(t);
        const geo = satellite.eciToGeodetic(eci.position, gmst);
        predictedTrail.push({
            type: "predicted",
            lat: satellite.degreesLat(geo.latitude),
            lng: satellite.degreesLong(geo.longitude),
            alt: geo.height
        });
    }

    nextPredTime = new Date(now.getTime() + (N + 1) * STEP_S * 1000);
    updateGlobe(realTrail, predictedTrail);
}

function stepPrediction() {
    if (!satrec || !nextPredTime) return;

    predictedTrail.shift();

    const eci = satellite.propagate(satrec, nextPredTime);
    if (eci.position) {
        const gmst = satellite.gstime(nextPredTime);
        const geo = satellite.eciToGeodetic(eci.position, gmst);
        predictedTrail.push({
            type: "predicted",
            lat: satellite.degreesLat(geo.latitude),
            lng: satellite.degreesLong(geo.longitude),
            alt: geo.height
        });
    }

    nextPredTime = new Date(nextPredTime.getTime() + 2 * 1000);
    updateGlobe(realTrail, predictedTrail);
}

function appendRealPosition(pos) {
    realTrail.push({
        type: "real",
        lat: pos.latitude,
        lng: pos.longitude,
        alt: pos.altitude
    });
    if (realTrail.length > MAX_SAVED_POINTS) realTrail.shift();
    updateGlobe(realTrail, predictedTrail);
}

async function getSatellites() {
    try {
        const res = await fetch(`${BASE_URL}/v1/satellites`);
        if (!res.ok) return;
        return await res.json();
    } catch(e) {}
}
async function getSatellitePosition(id) {
    try {
        const res = await fetch(`${BASE_URL}/v1/satellites/${id}`);
        if (!res.ok) return;
        return await res.json();
    } catch(e) {}
}
async function getSatellitePositions(id, timestamps) {
    try {
        const res = await fetch(`${BASE_URL}/v1/satellites/${id}/positions?timestamps=${timestamps.join(",")}`);
        if (!res.ok) return;
        return await res.json();
    } catch(e) {}
}
async function getSatelliteTLE(id, timestamps) {
    try {
        const res = await fetch(`${BASE_URL}/v1/satellites/${id}/tles`);
        if (!res.ok) return;
        return await res.json();
    } catch(e) {}
}
async function getCoordinateData(lat, lng) {
    try {
        const res = await fetch(`${BASE_URL}/v1/coordinates/${lat},${lng}`);
        if (!res.ok) return;
        return await res.json();
    } catch(e) {}
}