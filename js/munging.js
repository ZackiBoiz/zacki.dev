const OFFSET = 42;
const PAYLOAD = [146, 143, 163, 153, 106, 164, 139, 141, 149, 147, 88, 142, 143, 160];
const getTargetText = () => PAYLOAD.map(c => String.fromCharCode(c - OFFSET)).join("");

const TOTAL_SHAPES = randInt(14, 24);
const TARGET_SHAPES = randInt(3, 6);

const getScrambledText = (len) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$*&%";
    return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

function rand(min, max) {
    return Math.random() * (max - min) + min;
}
function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
}
function randRgba(a) {
    return `rgba(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0, 255)}, ${a ? a : Math.random()})`;
}
function randHsl() {
    return `hsl(${randInt(0, 360)} ${randInt(60, 90)}% ${randInt(30, 60)}%)`;
}

function drawGeometry(ctx, type, x, y, size) {
    ctx.beginPath();
    if (type === "circle") {
        ctx.arc(x, y, size, 0, Math.PI * 2);
    } else if (type === "square") {
        ctx.rect(x - size, y - size, size * 2, size * 2);
    } else if (type === "triangle") {
        const h = size * Math.sqrt(3) / 2;
        ctx.moveTo(x, y - size);
        ctx.lineTo(x + h, y + size / 2);
        ctx.lineTo(x - h, y + size / 2);
        ctx.closePath();
    } else if (type === "star") {
        const outerRadius = size * 1.25;
        const innerRadius = outerRadius * 0.4;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / 5;

        ctx.moveTo(x, y - outerRadius);
        for (let i = 0; i < 5; i++) {
            ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
            rot += step;
            ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
            rot += step;
        }
        ctx.closePath();
    }
}

function createCaptchaGame(targetText, totalShapesCount, targetShapesCount) {
    const width = 640;
    const height = 280;
    const spotlightRadius = 40;

    let mouseX = -100;
    let mouseY = -100;
    let isHovering = false;
    let isDecrypted = false;

    const shapeTypes = ["circle", "square", "triangle", "star"];
    const targetType = shapeTypes[randInt(0, shapeTypes.length - 1)];
    const targetNamePlural = targetType + " thingies";

    const shapes = [];
    let targetsSpawned = 0;

    while (shapes.length < totalShapesCount) {
        const sx = randInt(40, width - 40);
        const sy = randInt(40, height - 40);

        if (sx > width / 2 - 160 && sx < width / 2 + 160 && sy > height / 2 - 60 && sy < height / 2 + 60) continue;
        if (shapes.some(s => Math.hypot(s.x - sx, s.y - sy) < 30)) continue;

        let type;
        const remainingSlots = totalShapesCount - shapes.length;
        const remainingTargets = targetShapesCount - targetsSpawned;

        if (remainingTargets > 0 && (Math.random() < (remainingTargets / remainingSlots) || remainingTargets === remainingSlots)) {
            type = targetType;
            targetsSpawned++;
        } else {
            const decoyTypes = shapeTypes.filter(t => t !== targetType);
            type = decoyTypes[randInt(0, decoyTypes.length - 1)];
        }

        shapes.push({
            x: sx,
            y: sy,
            type: type,
            isTarget: type === targetType,
            found: false,
            size: randInt(10, 14)
        });
    }

    function drawObfuscatedText(ctx, text, isScrambled) {
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, "#e2e8f0");
        bgGrad.addColorStop(1, "#edf2f7");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 450; i++) {
            ctx.fillStyle = randRgba(rand(0.1, 0.45));
            ctx.fillRect(rand(0, width), rand(0, height), rand(1, 4), rand(1, 4));
        }

        shapes.forEach(shape => {
            drawGeometry(ctx, shape.type, shape.x, shape.y, shape.size);

            if (shape.found && shape.isTarget) {
                ctx.fillStyle = "#48bb78";
            } else {
                ctx.fillStyle = "#f56565";
            }

            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = "rgba(0,0,0,0.35)";
            ctx.stroke();
        });

        const fontFamilies = ['"Segoe UI"', 'Courier New', 'Georgia', 'Arial', 'Verdana', 'Impact'];
        const minFontSize = 34;
        const maxFontSize = 48;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let totalWidth = 0;
        let charData = [];

        for (let i = 0; i < text.length; i++) {
            const fs = randInt(minFontSize, maxFontSize);
            ctx.font = `bold ${fs}px ${fontFamilies[Math.floor(Math.random() * fontFamilies.length)]}`;
            const w = ctx.measureText(text[i]).width;

            const spacing = rand(1, 5);
            charData.push({ char: text[i], w, spacing, fs, font: fontFamilies[Math.floor(Math.random() * fontFamilies.length)] });
            totalWidth += w + spacing;
        }

        let startX = (width - totalWidth) / 2;
        const centerY = height / 2;
        const waveFreq = rand(0.06, 0.12);
        const waveAmp = 9;

        for (let i = 0; i < charData.length; i++) {
            const cd = charData[i];
            ctx.font = `bold ${cd.fs}px ${cd.font}`;
            const angle = rand(-0.25, 0.25);

            ctx.save();
            const ox = startX + cd.w / 2;
            const yOffset = Math.sin(ox * waveFreq) * waveAmp + rand(-3, 3);

            ctx.translate(ox, centerY + yOffset);
            ctx.rotate(angle);
            ctx.transform(1, rand(-0.1, 0.1), rand(-0.2, 0.2), 1, 0, 0);

            const charGrad = ctx.createLinearGradient(0, -cd.fs / 2, 0, cd.fs / 2);
            if (isScrambled) {
                charGrad.addColorStop(0, "#718096");
                charGrad.addColorStop(1, "#4a5568");
            } else {
                charGrad.addColorStop(0, randHsl());
                charGrad.addColorStop(1, randHsl());
            }

            ctx.fillStyle = charGrad;
            ctx.shadowColor = `rgba(0,0,0,0.45)`;
            ctx.shadowBlur = rand(2, 6);
            ctx.fillText(cd.char, 0, 0);

            ctx.lineWidth = rand(1, 2.5);
            ctx.strokeStyle = "rgba(0,0,0,0.65)";
            ctx.strokeText(cd.char, 0, 0);
            ctx.restore();

            startX += cd.w + cd.spacing;
        }

        const lineCount = randInt(7, 11);
        for (let i = 0; i < lineCount; i++) {
            ctx.beginPath();
            ctx.moveTo(rand(0, width * 0.3), rand(0, height));
            ctx.bezierCurveTo(
                rand(width * 0.2, width * 0.5), rand(0, height),
                rand(width * 0.5, width * 0.8), rand(0, height),
                rand(width * 0.7, width), rand(0, height)
            );
            ctx.strokeStyle = isScrambled ? "rgba(113, 128, 150, 0.5)" : randHsl();
            ctx.lineWidth = rand(1.5, 3.5);
            ctx.stroke();
        }

        for (let i = 0; i < 350; i++) {
            ctx.fillStyle = randRgba(rand(0.35, 0.75));
            ctx.fillRect(rand(0, width), rand(0, height), rand(1, 3), rand(1, 3));
        }
    }

    const offScrambled = document.createElement("canvas");
    offScrambled.width = width; offScrambled.height = height;
    drawObfuscatedText(offScrambled.getContext("2d"), getScrambledText(targetText.length), true);

    const offDecrypted = document.createElement("canvas");
    offDecrypted.width = width; offDecrypted.height = height;
    drawObfuscatedText(offDecrypted.getContext("2d"), targetText, false);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    function draw() {
        ctx.fillStyle = "#1a202c";
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < 250; i++) {
            ctx.fillStyle = randRgba(rand(0.1, 0.4));
            ctx.fillRect(rand(0, width), rand(0, height), rand(1, 3), rand(1, 3));
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `bold 16px "Segoe UI", sans-serif`;

        const foundCount = shapes.filter(s => s.isTarget && s.found).length;
        const remaining = targetShapesCount - foundCount;

        if (isDecrypted) {
            ctx.fillStyle = "#48bb78";
            ctx.fillText("Fine, you win. Here is my email, you beautiful human.", width / 2, 30);
        } else {
            ctx.fillText(`Want my email? Well too bad. Find and click the ${remaining} ${targetNamePlural}.`, width / 2, 30);
        }

        shapes.forEach(shape => {
            if (shape.isTarget && shape.found) {
                ctx.save();
                drawGeometry(ctx, shape.type, shape.x, shape.y, shape.size - 2);
                ctx.fillStyle = "#48bb78";
                ctx.shadowColor = "#48bb78";
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.restore();
            }
        });

        if (!isHovering) return;

        ctx.save();
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, spotlightRadius, 0, Math.PI * 2);
        ctx.clip();

        if (isDecrypted) {
            ctx.drawImage(offDecrypted, 0, 0);
        } else {
            ctx.drawImage(offScrambled, 0, 0);
        }

        const gradient = ctx.createRadialGradient(mouseX, mouseY, spotlightRadius - 20, mouseX, mouseY, spotlightRadius);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(1, "rgba(0,0,0,0.85)");
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.stroke();

        ctx.restore();
    }

    function handleInteraction(x, y) {
        mouseX = x;
        mouseY = y;
        isHovering = true;
        requestAnimationFrame(draw);
    }

    canvas.addEventListener("pointerdown", (e) => {
        if (isDecrypted) return;

        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        shapes.forEach(shape => {
            if (shape.isTarget && !shape.found) {
                const dist = Math.hypot(clickX - shape.x, clickY - shape.y);

                if (dist <= shape.size * 1.25) {
                    shape.found = true;
                }
            }
        });

        if (shapes.filter(s => s.isTarget).every(s => s.found)) {
            isDecrypted = true;
        }

        requestAnimationFrame(draw);
    });

    canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        handleInteraction(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        handleInteraction(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    }, { passive: false });

    canvas.addEventListener("mouseleave", () => { isHovering = false; requestAnimationFrame(draw); });
    canvas.addEventListener("touchend", () => { isHovering = false; requestAnimationFrame(draw); });

    draw();
    return canvas;
}

document.addEventListener("DOMContentLoaded", () => {
    const footer = document.querySelector("footer .container") || document.querySelector("footer") || document.body;
    if (!footer) return;

    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.justifyContent = "center";
    wrap.style.margin = "20px 0";

    const canvas = createCaptchaGame(getTargetText(), TOTAL_SHAPES, TARGET_SHAPES);
    canvas.style.cursor = "crosshair";
    canvas.style.borderRadius = "8px";
    canvas.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    canvas.setAttribute("aria-label", "Want my email? Well too bad. Sorry, chap. You need to interact with the image on this one.");
    canvas.setAttribute("role", "img");

    wrap.appendChild(canvas);
    footer.appendChild(wrap);
});