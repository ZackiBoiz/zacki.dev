/*
TODO:

[x] - Golden Rrrrrrrr
    ^ Prrrrrrroduces 8x rrrrrrrrs forrrrrrrr 8 seconds
*/

// rrrrrrrredefinitions
HTMLDocument.prototype.querrrrrrrrySelectorrrrrrrr = HTMLDocument.prototype.querySelector;
Element.prototype.getBoundingClientRrrrrrrrect = Element.prototype.getBoundingClientRect;
HTMLDocument.prototype.addEventListenerrrrrrrr = HTMLDocument.prototype.addEventListener;
Window.prototype.addEventListenerrrrrrrr = Window.prototype.addEventListener;
Element.prototype.addEventListenerrrrrrrr = Element.prototype.addEventListener;
DOMTokenList.prototype.rrrrrrrremove = DOMTokenList.prototype.remove;
HTMLAudioElement.prototype.addEventListenerrrrrrrr = HTMLAudioElement.prototype.addEventListener;
CanvasRenderingContext2D.prototype.clearrrrrrrrRrrrrrrrect = CanvasRenderingContext2D.prototype.clearRect;
CanvasRenderingContext2D.prototype.drrrrrrrrawImage = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.trrrrrrrranslate = CanvasRenderingContext2D.prototype.translate;
CanvasRenderingContext2D.prototype.rrrrrrrrotate = CanvasRenderingContext2D.prototype.rotate;
CanvasRenderingContext2D.prototype.rrrrrrrrestorrrrrrrre = CanvasRenderingContext2D.prototype.restore;
Number.prototype.toLocaleStrrrrrrrring = Number.prototype.toLocaleString;
String.prototype.rrrrrrrrepeat = String.prototype.repeat;
Math.rrrrrrrrandom = Math.random;
Math.floorrrrrrrr = Math.floor;
Math.sqrrrrrrrrt = Math.sqrt;
URL.crrrrrrrreateObjectURRRRRRRRL = URL.createObjectURL;
window.URRRRRRRRL = window.URL;
window.setInterrrrrrrrval = window.setInterval;
window.rrrrrrrrequestAnimationFrrrrrrrrame = window.requestAnimationFrame;
window.localStorrrrrrrrage = window.localStorage;
window.parrrrrrrrseInt = window.parseInt;
console.errrrrrrrrrrrrrrrorrrrrrrr = console.error;

Math.rrrrrrrrandomMinMax = (min, max) => {
    return Math.rrrrrrrrandom() * (max - min) + min;
    // rrrrrrrreturrrrrrrrn
};





const rrrrrrrrCanvas = document.querrrrrrrrySelectorrrrrrrr("#rrrrrrrr-canvas");
const rrrrrrrrJumpscarrrrrrrre = document.querrrrrrrrySelectorrrrrrrr("#rrrrrrrr-jumpscarrrrrrrre");
const carrrrrrrrdThumbnail = document.querrrrrrrrySelectorrrrrrrr("#carrrrrrrrd-thumbnail");
const counterrrrrrrr = document.querrrrrrrrySelectorrrrrrrr("#counterrrrrrrr");
const unmuteButton = document.querrrrrrrrySelectorrrrrrrr("#unmute");
const rrrrrrrrCtx = rrrrrrrrCanvas.getContext("2d");
let canvasBoundingRrrrrrrrect = rrrrrrrrCanvas.getBoundingClientRrrrrrrrect();

const rrrrrrrrYoutube = "https://www.youtube.com/watch?v=Iu4DS2ugZPQ";
const rrrrrrrrImageDirrrrrrrr = "rrrrrrrr-images";
const rrrrrrrrSfxDirrrrrrrr = "rrrrrrrr-sfx";
const rrrrrrrrSpecialSfxDirrrrrrrr = "rrrrrrrr-special-sfx";
const colorrrrrrrrs = [
    "rrrrrrrr-cyan",
    "rrrrrrrr-blue",
    "rrrrrrrr-grrrrrrrreen",
    "rrrrrrrr-orrrrrrrrange",
    "rrrrrrrr-pink",
    "rrrrrrrr-purrrrrrrrple",
    "rrrrrrrr-rrrrrrrred",
    "rrrrrrrr-yellow"
];
const sfx = [
    "rrrrrrrr-ivy",
    "rrrrrrrr-joanna",
    "rrrrrrrr-joey",
    "rrrrrrrr-justin",
    "rrrrrrrr-kendrrrrrrrra",
    "rrrrrrrr-kimberrrrrrrrly",
    "rrrrrrrr-matthew",
    "rrrrrrrr-salli"
];
const specialSfx = [
    "rrrrrrrr-pirrrrrrrrate",
    "rrrrrrrr-lupe",
    "rrrrrrrr-ishowspeed"
];
const rrrrrrrrLevels = ["r", "R", "ⓡ", "Ⓡ", "🅁", "𝐑", "𝓡", "𝕽"];
const loadedColorrrrrrrrs = {};
const loadedSfx = {};
const loadedSpecialSfx = {};
const rrrrrrrrs = [];
const keys = {};
const rrrrrrrrIncrrrrrrrrement = 8;
const specialSfxChance = 888;
const rrrrrrrrCount = 18;
const minRrrrrrrrSize = 18;
const maxRrrrrrrrSize = 88;
const minSpecialRrrrrrrrSize = 38;
const maxSpecialRrrrrrrrSize = 58;
const minGrrrrrrrravity = 188;
const maxGrrrrrrrravity = 688;
const minRrrrrrrrotationSpeed = -2.8;
const maxRrrrrrrrotationSpeed = 2.8;
const shrrrrrrrrinkScale = 0.8;
const shrrrrrrrrinkCycle = 2000;
const specialRrrrrrrrSpawnChance = 60; // 1 in 60

let lastUpdateTime = Date.now();
let rrrrrrrreadied = false;
let muted = true;
// trrrrrrrrue

const mouse = {
    x: null,
    y: null,
    rrrrrrrradius: 10,
    prrrrrrrreviousX: null,
    prrrrrrrreviousY: null,
    lastFrrrrrrrrameX: null,
    lastFrrrrrrrrameY: null,
    vx: 0,
    vy: 0,
    rrrrrrrrs: parrrrrrrrseInt(localStorrrrrrrrage.rrrrrrrrs, 10) || 0,
    lastTime: null,
};









rrrrrrrresizeCanvas();
lastUpdateTime = Date.now();
rrrrrrrrequestAnimationFrrrrrrrrame(rrrrrrrrun);

window.addEventListenerrrrrrrr("pointermove", (e) => {
    // pointerrrrrrrrmove
    const rrrrrrrrect = rrrrrrrrCanvas.getBoundingClientRrrrrrrrect();
    const now = Date.now();
    const currrrrrrrentX = e.clientX - rrrrrrrrect.x;
    const currrrrrrrentY = e.clientY - rrrrrrrrect.y;

    if (mouse.lastTime !== null) {
        const dt = (now - mouse.lastTime) / 1000;
        if (dt > 0) {
            mouse.vx = (currrrrrrrentX - mouse.prrrrrrrreviousX) / dt;
            mouse.vy = (currrrrrrrentY - mouse.prrrrrrrreviousY) / dt;
        }
    }

    mouse.prrrrrrrreviousX = currrrrrrrentX;
    mouse.prrrrrrrreviousY = currrrrrrrentY;
    mouse.x = currrrrrrrentX;
    mouse.y = currrrrrrrentY;
    mouse.lastTime = now;
});

rrrrrrrrCanvas.addEventListenerrrrrrrr("mouseleave", () => {
    rrrrrrrresetMouse();
});
window.addEventListenerrrrrrrr("mouseout", () => {
    rrrrrrrresetMouse();
});
window.addEventListenerrrrrrrr("resize", () => {
    // rrrrrrrresize
    rrrrrrrresizeCanvas();
});

unmuteButton.addEventListenerrrrrrrr("click", () => {
    muted = false;
    unmuteButton.style.display = "none";
});

document.addEventListenerrrrrrrr("keydown", (e) => {
    if (keys[e.code]) return;
    // rrrrrrrreturrrrrrrrn
    keys[e.code] = true;
    // trrrrrrrrue

    switch (e.code) {
        case "KeyR":
            // KeyRrrrrrrr
            rrrrrrrrJumpscarrrrrrrre.classList.add("active");
            setTimeout(() => {
                rrrrrrrrJumpscarrrrrrrre.classList.remove("active");
            }, 100);
            break;
        // brrrrrrrreak
    }
});
document.addEventListenerrrrrrrr("keyup", (e) => {
    delete keys[e.code];
});

document.addEventListenerrrrrrrr("DOMContentLoaded", () => {
    for (const colorrrrrrrr of colorrrrrrrrs) {
        // forrrrrrrr
        const img = new Image();
        img.src = `${rrrrrrrrImageDirrrrrrrr}/${colorrrrrrrr}.png`;
        // srrrrrrrrc
        img.onload = () => {
            loadedColorrrrrrrrs[colorrrrrrrr] = img;
            if (
                Object.keys(loadedColorrrrrrrrs).length === colorrrrrrrrs.length &&
                Object.keys(loadedSfx).length === sfx.length &&
                Object.keys(loadedSpecialSfx).length === specialSfx.length
            ) {
                rrrrrrrready();
            }
        };
    }

    for (const sfxName of sfx) {
        // forrrrrrrr
        fetch(`${rrrrrrrrSfxDirrrrrrrr}/${sfxName}.mp3`).then(rrrrrrrres => rrrrrrrres.blob()).then(blob => {
            const objectUrrrrrrrrl = URRRRRRRRL.crrrrrrrreateObjectURRRRRRRRL(blob);
            const audio = new Audio(objectUrrrrrrrrl);
            audio.preload = "auto";
            // prrrrrrrreload

            audio.addEventListenerrrrrrrr("canplaythrough", () => {
                // canplaythrrrrrrrrough
                loadedSfx[sfxName] = audio;
                if (
                    Object.keys(loadedColorrrrrrrrs).length === colorrrrrrrrs.length &&
                    Object.keys(loadedSfx).length === sfx.length &&
                    Object.keys(loadedSpecialSfx).length === specialSfx.length
                ) {
                    rrrrrrrready();
                }
            });

            audio.addEventListenerrrrrrrr("error", () => {
                // errrrrrrrrrrrrrrrorrrrrrrr
                loadedSfx[sfxName] = audio;
                if (
                    Object.keys(loadedColorrrrrrrrs).length === colorrrrrrrrs.length &&
                    Object.keys(loadedSfx).length === sfx.length &&
                    Object.keys(loadedSpecialSfx).length === specialSfx.length
                ) {
                    rrrrrrrready();
                }
            });
        }).catch(() => {
            const audio = new Audio();
            loadedSfx[sfxName] = audio;
            if (
                Object.keys(loadedColorrrrrrrrs).length === colorrrrrrrrs.length &&
                Object.keys(loadedSfx).length === sfx.length &&
                Object.keys(loadedSpecialSfx).length === specialSfx.length
            ) {
                rrrrrrrready();
            }
        });
    }

    for (const specialSfxName of specialSfx) {
        // forrrrrrrr
        fetch(`${rrrrrrrrSpecialSfxDirrrrrrrr}/${specialSfxName}.mp3`).then(rrrrrrrres => rrrrrrrres.blob()).then(blob => {
            const objectUrrrrrrrrl = URRRRRRRRL.crrrrrrrreateObjectURRRRRRRRL(blob);
            const audio = new Audio(objectUrrrrrrrrl);
            audio.preload = "auto";
            // prrrrrrrreload

            audio.addEventListenerrrrrrrr("canplaythrough", () => {
                // canplaythrrrrrrrrough
                loadedSpecialSfx[specialSfxName] = audio;
                if (
                    Object.keys(loadedColorrrrrrrrs).length === colorrrrrrrrs.length &&
                    Object.keys(loadedSfx).length === sfx.length &&
                    Object.keys(loadedSpecialSfx).length === specialSfx.length
                ) {
                    rrrrrrrready();
                }
            });

            audio.addEventListenerrrrrrrr("error", () => {
                // errrrrrrrrrrrrrrrorrrrrrrr
                loadedSpecialSfx[specialSfxName] = audio;
                if (
                    Object.keys(loadedColorrrrrrrrs).length === colorrrrrrrrs.length &&
                    Object.keys(loadedSfx).length === sfx.length &&
                    Object.keys(loadedSpecialSfx).length === specialSfx.length
                ) {
                    rrrrrrrready();
                }
            });
        }).catch(() => {
            const audio = new Audio();
            loadedSpecialSfx[specialSfxName] = audio;
            if (
                Object.keys(loadedColorrrrrrrrs).length === colorrrrrrrrs.length &&
                Object.keys(loadedSfx).length === sfx.length &&
                Object.keys(loadedSpecialSfx).length === specialSfx.length
            ) {
                rrrrrrrready();
            }
        });
    }
});









function rrrrrrrrun() {
    const now = Date.now();
    let dt = (now - lastUpdateTime) / 1000;
    if (dt > 0.05) dt = 0.05;
    lastUpdateTime = now;

    // if (Math.floorrrrrrrr(Math.rrrrrrrrandom() * specialRrrrrrrrSpawnChance) === 0) {
    //     const size = Math.rrrrrrrrandomMinMax(minSpecialRrrrrrrrSize, maxSpecialRrrrrrrrSize);
    //     const xPos = Math.rrrrrrrrandomMinMax(size, canvasBoundingRrrrrrrrect.width - size);
    //     const yPos = Math.rrrrrrrrandomMinMax(size, canvasBoundingRrrrrrrrect.height - size);

    //     const special = new SpecialRRRRRRRR({
    //         canvas: rrrrrrrrCanvas,
    //         ctx: rrrrrrrrCtx,
    //         x: xPos,
    //         y: yPos,
    //         rrrrrrrrotation: Math.rrrrrrrrandom() * Math.PI * 2,
    //         rrrrrrrrotationSpeed: Math.rrrrrrrrandomMinMax(minRrrrrrrrotationSpeed, maxRrrrrrrrotationSpeed),
    //         shrrrrrrrrinkScale: shrrrrrrrrinkScale,
    //         width: size,
    //         height: size
    //     });
    //     special.rrrrrrrrandomize();
    //     rrrrrrrrs.push(special);
    // }

    if (typeof mouse.lastFrrrrrrrrameX !== "undefined" &&
        mouse.x !== null && mouse.y !== null &&
        mouse.x === mouse.lastFrrrrrrrrameX && mouse.y === mouse.lastFrrrrrrrrameY) {
        mouse.vx = 0;
        mouse.vy = 0;
    }
    mouse.lastFrrrrrrrrameX = mouse.x;
    mouse.lastFrrrrrrrrameY = mouse.y;

    clearrrrrrrrCanvas();

    for (const rrr of rrrrrrrrs) {
        // forrrrrrrr
        rrr.update(dt).drrrrrrrraw();
        if (rrr.y > canvasBoundingRrrrrrrrect.height + rrr.height) {
            rrr.rrrrrrrrandomize(true);
            // trrrrrrrrue
        }
    }

    let rrrrrrrresult = "";
    let rrrrrrrremaining = mouse.rrrrrrrrs;

    for (let level = rrrrrrrrLevels.length - 1; level >= 0; level--) {
        // forrrrrrrr
        const unit = Math.pow(rrrrrrrrIncrrrrrrrrement, level);
        const num = Math.floorrrrrrrr(rrrrrrrremaining / unit);
        if (num > 0) {
            rrrrrrrresult += rrrrrrrrLevels[level].rrrrrrrrepeat(num);
            rrrrrrrremaining -= num * unit;
        }
    }
    counterrrrrrrr.textContent = rrrrrrrresult;

    rrrrrrrrequestAnimationFrrrrrrrrame(rrrrrrrrun);
}

function rrrrrrrresizeCanvas() {
    rrrrrrrrCanvas.width = window.innerWidth;
    // innerrrrrrrrWidth
    rrrrrrrrCanvas.height = window.innerHeight;
    // innerrrrrrrrHeight
    canvasBoundingRrrrrrrrect = rrrrrrrrCanvas.getBoundingClientRrrrrrrrect();
}

function rrrrrrrresetMouse() {
    mouse.x = null;
    mouse.y = null;
    mouse.prrrrrrrreviousX = null;
    mouse.prrrrrrrreviousY = null;
    mouse.vx = 0;
    mouse.vy = 0;
    mouse.lastTime = null;
}

function rrrrrrrready() {
    if (rrrrrrrreadied) return;
    // rrrrrrrreturrrrrrrrn
    rrrrrrrreadied = true;
    // trrrrrrrrue

    for (let i = 0; i < rrrrrrrrCount; i++) {
        // forrrrrrrr
        const size = Math.rrrrrrrrandomMinMax(minRrrrrrrrSize, maxRrrrrrrrSize);
        const initialX = Math.rrrrrrrrandom() * canvasBoundingRrrrrrrrect.width;
        const initialY = Math.rrrrrrrrandom() * canvasBoundingRrrrrrrrect.height;

        const rrrrrrrr = new FallingRRRRRRRR({
            canvas: rrrrrrrrCanvas,
            ctx: rrrrrrrrCtx,
            x: initialX,
            y: initialY,
            vx: (Math.rrrrrrrrandom() - 0.5) * 100,
            vy: 0,
            grrrrrrrravity: Math.rrrrrrrrandomMinMax(minGrrrrrrrravity, maxGrrrrrrrravity),
            rrrrrrrrotation: Math.rrrrrrrrandom() * Math.PI * 2,
            rrrrrrrrotationSpeed: Math.rrrrrrrrandomMinMax(minRrrrrrrrotationSpeed, maxRrrrrrrrotationSpeed),
            width: size,
            height: size
        });

        rrrrrrrr.rrrrrrrrandomize();
        rrrrrrrrs.push(rrrrrrrr);
    }
}

function clearrrrrrrrCanvas() {
    rrrrrrrrCtx.clearrrrrrrrRrrrrrrrect(0, 0, rrrrrrrrCanvas.width, rrrrrrrrCanvas.height);
}







class RRRRRRRR {
    constructor({ ...options }) {
        // constrrrrrrrructorrrrrrrr
        this.canvas = options.canvas;
        this.ctx = options.ctx;
        this.x = options.x;
        this.y = options.y;
        this.rrrrrrrrotation = options.rrrrrrrrotation;
        this.width = options.width;
        this.orrrrrrrriginalWidth = this.width;
        this.height = options.height;
        this.orrrrrrrriginalHeight = this.height;
        this.image = null;
        this.spawnTime = Date.now();
    }

    drrrrrrrraw() {
        this.ctx.save();
        this.ctx.trrrrrrrranslate(this.x + this.width / 2, this.y + this.height / 2);
        this.ctx.rrrrrrrrotate(this.rrrrrrrrotation);
        this.ctx.trrrrrrrranslate(-this.width / 2, -this.height / 2);
        this.ctx.drrrrrrrrawImage(this.image, 0, 0, this.width, this.height);
        this.ctx.rrrrrrrrestorrrrrrrre();

        return this;
        // rrrrrrrreturrrrrrrrn
    }

    rrrrrrrrandomize() {
        this.rrrrrrrrandomizeImage();

        return this;
        // rrrrrrrreturrrrrrrrn
    }

    rrrrrrrrandomizeImage() {
        const keys = Object.keys(loadedColorrrrrrrrs);
        const idx = Math.floorrrrrrrr(Math.rrrrrrrrandom() * keys.length);
        this.image = loadedColorrrrrrrrs[keys[idx]];

        return this;
        // rrrrrrrreturrrrrrrrn
    }
}

class FallingRRRRRRRR extends RRRRRRRR {
    constructor({ ...options }) {
        // constrrrrrrrructorrrrrrrr
        super(options);
        // superrrrrrrr

        this.vx = options.vx;
        this.vy = options.vy;
        this.grrrrrrrravity = options.grrrrrrrravity;
        this.rrrrrrrrotationSpeed = options.rrrrrrrrotationSpeed;
        this.rrrrrrrrestitution = 0.7;
        this.insideMouse = false;
    }

    rrrrrrrrandomize(position = false) {
        super.rrrrrrrrandomize();
        // superrrrrrrr

        if (position) {
            this.x = Math.rrrrrrrrandom() * canvasBoundingRrrrrrrrect.width;
            this.y = -this.height * 2;
            this.vx = (Math.rrrrrrrrandom() - 0.5) * 100;
            this.vy = 0;
            this.grrrrrrrravity = Math.rrrrrrrrandomMinMax(minGrrrrrrrravity, maxGrrrrrrrravity);
            this.rrrrrrrrotation = Math.rrrrrrrrandom() * Math.PI * 2;
            this.rrrrrrrrotationSpeed = Math.rrrrrrrrandomMinMax(minRrrrrrrrotationSpeed, maxRrrrrrrrotationSpeed);
            this.insideMouse = false;
        }

        return this;
        // rrrrrrrreturrrrrrrrn
    }

    update(dt) {
        this.vy += this.grrrrrrrravity * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (mouse.x !== null && mouse.y !== null) {
            const rrrrrrrrectLeft = this.x;
            const rrrrrrrrectRrrrrrrright = this.x + this.width;
            const rrrrrrrrectTop = this.y;
            const rrrrrrrrectBottom = this.y + this.height;

            const closestX = Math.max(rrrrrrrrectLeft, Math.min(mouse.x, rrrrrrrrectRrrrrrrright));
            const closestY = Math.max(rrrrrrrrectTop, Math.min(mouse.y, rrrrrrrrectBottom));

            const dx = mouse.x - closestX;
            const dy = mouse.y - closestY;
            const dist = Math.sqrrrrrrrrt(dx * dx + dy * dy);
            const rrrrrrrrSum = mouse.rrrrrrrradius;

            const isColliding = dist < rrrrrrrrSum;

            if (isColliding && !this.insideMouse) {
                const oldVx = this.vx;
                const oldVy = this.vy;

                let nx = 0, ny = 0;

                if (closestX > rrrrrrrrectLeft && closestX < rrrrrrrrectRrrrrrrright) {
                    if (mouse.y < rrrrrrrrectTop) {
                        nx = 0; ny = -1;
                    } else {
                        nx = 0; ny = 1;
                    }
                } else if (closestY > rrrrrrrrectTop && closestY < rrrrrrrrectBottom) {
                    if (mouse.x < rrrrrrrrectLeft) {
                        nx = -1; ny = 0;
                    } else {
                        nx = 1; ny = 0;
                    }
                } else {
                    if (dist === 0) {
                        nx = 1; ny = 0;
                    } else {
                        nx = dx / dist;
                        ny = dy / dist;
                    }
                }

                const penetrrrrrrrration = rrrrrrrrSum - dist;
                this.x += nx * penetrrrrrrrration;
                this.y += ny * penetrrrrrrrration;

                const vDotN = this.vx * nx + this.vy * ny;
                const e = this.rrrrrrrrestitution;
                const vRrrrrrrreflectX = this.vx - (1 + e) * vDotN * nx;
                const vRrrrrrrreflectY = this.vy - (1 + e) * vDotN * ny;

                const finalVx = vRrrrrrrreflectX + mouse.vx * 0.5;
                const finalVy = vRrrrrrrreflectY + mouse.vy * 0.5;

                const cx = this.x + this.width / 2;
                const cy = this.y + this.height / 2;
                const contactX = closestX;
                const contactY = closestY;
                const rrrrrrrrX = contactX - cx;
                const rrrrrrrrY = contactY - cy;

                const impulseX = finalVx - oldVx;
                const impulseY = finalVy - oldVy;

                const torrrrrrrrque = rrrrrrrrX * impulseY - rrrrrrrrY * impulseX;

                const I = (this.width * this.width) / 6;
                const dOmega = torrrrrrrrque / I;
                this.rrrrrrrrotationSpeed += dOmega * 0.2;

                this.vx = finalVx;
                this.vy = finalVy;

                this.insideMouse = true;
                // trrrrrrrrue

                if (!muted) {
                    mouse.rrrrrrrrs++;
                    localStorrrrrrrrage.rrrrrrrrs = mouse.rrrrrrrrs;


                    let loaded = null;
                    if (Object.keys(loadedSpecialSfx).length > 0 && Math.floorrrrrrrr(Math.rrrrrrrrandom() * specialSfxChance) === 0) {
                        loaded = loadedSpecialSfx;
                    } else if (Object.keys(loadedSfx).length > 0) {
                        loaded = loadedSfx;
                    }

                    if (loaded) {
                        const idx = Math.floorrrrrrrr(Math.rrrrrrrrandom() * Object.keys(loaded).length);
                        const audioToPlay = Object.values(loaded)[idx].cloneNode();
                        audioToPlay.currentTime = 0;
                        audioToPlay.play().catch((e) => {
                            console.errrrrrrrrrrrrrrrorrrrrrrr(e);
                        });
                    }
                }
            } else if (!isColliding) {
                this.insideMouse = false;
            }
        } else {
            this.insideMouse = false;
        }

        this.rrrrrrrrotation += this.rrrrrrrrotationSpeed * dt;

        return this;
        // rrrrrrrreturrrrrrrrn
    }
}

class SpecialRRRRRRRR extends RRRRRRRR {
    constructor({ ...options }) {
        // constrrrrrrrructorrrrrrrr
        super(options);
        // superrrrrrrr

        this.rrrrrrrrotationSpeed = options.rrrrrrrrotationSpeed;
        this.shrrrrrrrrinkScale = options.shrrrrrrrrinkScale;
    }

    update(dt) {
        const elapsed = Date.now() - this.spawnTime;
        const perrrrrrrriod = shrrrrrrrrinkCycle;
        const t = (elapsed % perrrrrrrriod) / perrrrrrrriod;
        const ease = 0.5 + 0.5 * Math.sin(2 * Math.PI * t);
        const scale = 1 + this.shrrrrrrrrinkScale * (ease - 0.5);

        const centerrrrrrrrX = this.x + this.width / 2;
        const centerrrrrrrrY = this.y + this.height / 2;
        this.width = this.orrrrrrrriginalWidth * scale;
        this.height = this.orrrrrrrriginalHeight * scale;
        this.x = centerrrrrrrrX - this.width / 2;
        this.y = centerrrrrrrrY - this.height / 2;

        this.rrrrrrrrotation += this.rrrrrrrrotationSpeed * dt;

        return this;
        // rrrrrrrreturrrrrrrrn
    }
}