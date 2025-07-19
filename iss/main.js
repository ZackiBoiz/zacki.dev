const BASE_URL = "https://api.wheretheiss.at/v1";
const NORAD_ID = 25544;
const PAST_MAX_POINTS = 600;
const FUTURE_POINTS = 1000;
const UPDATE_INTERVAL = 1000;
const TLE_INTERVAL = 60000;
const ALT_HISTORY_MAX = 60;

const globeViz = document.getElementById("globeViz");
const statusEl = document.getElementById("status");
const togglePast = document.getElementById("togglePast");
const toggleFuture = document.getElementById("toggleFuture");
const speedEl = document.getElementById("speed");
const zoomEl = document.getElementById("zoom");
const resetView = document.getElementById("resetView");
const latEl = document.getElementById("lat");
const lngEl = document.getElementById("lng");
const altEl = document.getElementById("alt");
const velEl = document.getElementById("vel");
const fpEl = document.getElementById("fp");
const visEl = document.getElementById("vis");
const tsEl = document.getElementById("ts");
const altCanvas = document.getElementById("altChart");
const altCtx = altCanvas.getContext("2d");

let satrec = null
let nextPredTime = null;
let pastTrail = [];
let futureTrail = [];
let altHistory = [];

const globe = window.Globe()(globeViz)
    .globeImageUrl("assets/globe.jpg")
    .bumpImageUrl("assets/bump.png")
    .backgroundImageUrl("assets/background.png")
    .showAtmosphere(true).atmosphereColor("lightskyblue").atmosphereAltitude(0.2)
    .pointOfView({
        lat: 0,
        lng: 0,
        altitude: parseFloat(zoomEl.value)
    }, 0)
    .pointsData([]).pointLat(d => d.lat).pointLng(d => d.lng)
    .pointAltitude(0).pointColor(d => d.type === "future" ? "cyan" : "limegreen")
    .pointRadius(0.05).pointsMerge(true)
    .pathsData([]).pathPoints(d => d.coords)
    .pathColor(d => d.type === "future" ? ["cyan", "white"] : ["limegreen", "white"])
    .pathStroke(d => d.type === "future" ? 0.5 : 1).pathDashLength(d => d.type === "future" ? FUTURE_POINTS / 10000 : 1)
    .pathDashGap(d => d.type === "future" ? 0.1 : 0).pathDashInitialGap(0)
    .pathDashAnimateTime(d => d.type === "future" ? 2000 : 0)
    .pathTransitionDuration(0).pathResolution(2);

fetchTLE();
setInterval(fetchTLE, TLE_INTERVAL);
fetchCurrent();
setInterval(fetchCurrent, UPDATE_INTERVAL);

togglePast.addEventListener("change", updateGlobe);
toggleFuture.addEventListener("change", updateGlobe);
zoomEl.addEventListener("input", () => {
    const pov = globe.pointOfView();
    globe.pointOfView({
        lat: pov.lat,
        lng: pov.lng,
        altitude: parseFloat(zoomEl.value)
    }, 0);
});
resetView.addEventListener("click", () => {
    globe.pointOfView({
        lat: 0,
        lng: 0,
        altitude: parseFloat(zoomEl.value)
    }, 1000);
});

function setStatus(color) {
    statusEl.style.background = color;
}

async function fetchTLE() {
    try {
        const res = await fetch(`${BASE_URL}/satellites/${NORAD_ID}/tles`);
        const js = await res.json();
        satrec = satellite.twoline2satrec(js.line1, js.line2);
        computeFutureTrail();
        setStatus("orange");
    } catch (e) {
        console.error(e);
        setStatus("red");
    }
}

async function fetchCurrent() {
    if (!satrec) {
        await fetchTLE();
        if (!satrec) return;
    }
    try {
        const res = await fetch(`${BASE_URL}/satellites/${NORAD_ID}`);
        const cur = await res.json();
        setStatus("limegreen");

        latEl.textContent = cur.latitude.toFixed(6);
        lngEl.textContent = cur.longitude.toFixed(6);
        altEl.textContent = cur.altitude.toFixed(4);
        velEl.textContent = cur.velocity.toFixed(2);
        fpEl.textContent = cur.footprint.toFixed(2);
        visEl.textContent = cur.visibility;
        tsEl.textContent = new Date(cur.timestamp * 1000).toLocaleTimeString();

        altHistory.push(cur.altitude);
        drawAltChart();

        pastTrail.push({
            lat: cur.latitude,
            lng: cur.longitude,
            type: "past"
        });
        if (pastTrail.length > PAST_MAX_POINTS) pastTrail.shift();
        stepFutureTrail();
        updateGlobe();
    } catch (e) {
        console.error(e);
        setStatus("red");
    }
}

function computeFutureTrail() {
    futureTrail = [];
    const now = new Date(),
        step = UPDATE_INTERVAL;
    for (let i = 1; i <= FUTURE_POINTS; i++) {
        const t = new Date(now.getTime() + i * step);
        const eci = satellite.propagate(satrec, t);
        if (!eci.position) continue;
        const gmst = satellite.gstime(t);
        const geo = satellite.eciToGeodetic(eci.position, gmst);
        futureTrail.push({
            lat: satellite.degreesLat(geo.latitude),
            lng: satellite.degreesLong(geo.longitude),
            type: "future"
        });
    }
    nextPredTime = new Date(now.getTime() + (FUTURE_POINTS + 1) * step);
}

function stepFutureTrail() {
    if (!satrec || !nextPredTime) return;
    futureTrail.shift();
    const eci = satellite.propagate(satrec, nextPredTime);
    if (eci.position) {
        const gmst = satellite.gstime(nextPredTime);
        const geo = satellite.eciToGeodetic(eci.position, gmst);
        futureTrail.push({
            lat: satellite.degreesLat(geo.latitude),
            lng: satellite.degreesLong(geo.longitude),
            type: "future"
        });
    }
    nextPredTime = new Date(nextPredTime.getTime() + UPDATE_INTERVAL);
}

function updateGlobe() {
    const pts = [...pastTrail.slice(-1)];
    globe.pointsData(pts);

    const paths = [];
    if (togglePast.checked && pastTrail.length > 1) {
        paths.push({
            type: "past",
            coords: pastTrail.map(d => [d.lat, d.lng])
        });
    }
    if (toggleFuture.checked && futureTrail.length > 1) {
        paths.push({
            type: "future",
            coords: futureTrail.map(d => [d.lat, d.lng])
        });
    }
    globe.pathsData(paths);
}

function drawAltChart() {
    const w = altCanvas.width;
    const h = altCanvas.height;
    altCtx.clearRect(0, 0, w, h);

    const N = altHistory.length;
    if (N < 2) return;

    const max = Math.max(...altHistory);
    const min = Math.min(...altHistory);

    altCtx.beginPath();
    if (max === min) {
        altCtx.moveTo(0, h / 2);
        altCtx.lineTo(w, h / 2);
    } else {
        altHistory.forEach((v, i) => {
            const x = (i / (N - 1)) * w;
            const y = h - ((v - min) / (max - min)) * h;
            i === 0 ? altCtx.moveTo(x, y) : altCtx.lineTo(x, y);
        });
    }

    altCtx.strokeStyle = "#00ff00";
    altCtx.lineWidth = 1.5;
    altCtx.stroke();
}