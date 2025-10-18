const NORMAL = atob("aGV5b0B6YWNraS5kZXY="); // no no silly robots
const ALT_TEXT = NORMAL.replace("@", " [at] ").replace(".", " [dot] ");

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
    return `hsl(${randInt(0, 360)} ${randInt(55, 95)}% ${randInt(25, 70)}%)`;
}

function drawEmailCaptcha(text) {
    const measureCanvas = document.createElement("canvas");
    const mctx = measureCanvas.getContext("2d");
    const padding = 14;
    const minWidth = 280;
    const maxWidth = 1200;
    const baseSpacing = 18;
    const perCharBuffer = 20;
    const maxExtraSpacing = 20;
    const minFontSize = 12;
    const maxFontSize = 56;
    let charFonts = [];
    let charWidths = [];
    let charSpacings = [];

    function measureFonts() {
        charWidths = [];
        charSpacings = [];
        let total = padding * 2;
        for (let i = 0; i < text.length; i++) {
            const fs = Math.max(minFontSize, Math.floor(charFonts[i]));
            mctx.font = `${fs}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
            const metrics = mctx.measureText(text[i]);
            const w = Math.max(metrics.width, fs * 0.5);
            const extraSpacing = baseSpacing + rand(-6, maxExtraSpacing) + perCharBuffer;
            charWidths.push(w);
            charSpacings.push(extraSpacing);
            total += w + extraSpacing;
        }
        return Math.ceil(Math.max(minWidth, total));
    }

    for (let i = 0; i < text.length; i++) {
        charFonts[i] = randInt(24, maxFontSize);
    }

    let requiredWidth = measureFonts();
    let attempts = 0;
    while (requiredWidth > maxWidth && attempts < 8) { // squeeze
        const scale = maxWidth / requiredWidth;
        for (let i = 0; i < charFonts.length; i++) {
            charFonts[i] = Math.max(minFontSize, Math.floor(charFonts[i] * scale));
        }
        requiredWidth = measureFonts();
        attempts++;
    }

    const extraPad = randInt(4, 12);
    const canvasWidth = Math.min(maxWidth, Math.max(minWidth, requiredWidth + extraPad));
    const maxFs = Math.max(...charFonts);
    const canvasHeight = Math.max(48, Math.ceil(maxFs * 1.6) + padding);
    const c = document.createElement("canvas");
    c.width = canvasWidth;
    c.height = canvasHeight;
    const ctx = c.getContext("2d", {
        alpha: true
    });

    const g = ctx.createLinearGradient(0, 0, c.width, c.height);
    g.addColorStop(0, randRgba());
    g.addColorStop(1, randRgba());
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);

    for (let i = 0; i < 180; i++) {
        ctx.fillStyle = randRgba();
        const w = rand(1, 2);
        const h = rand(1, 2);
        ctx.fillRect(rand(0, c.width), rand(0, c.height), w, h);
    }

    let x = padding;
    const centerY = c.height / 2;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const fs = Math.max(minFontSize, Math.floor(charFonts[i]));
        ctx.font = `${fs}px "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
        const w = charWidths[i];
        const spacing = charSpacings[i];
        const angle = rand(-0.75, 0.75);
        const color = randHsl();

        ctx.save();
        const ox = x + w / 2;
        ctx.translate(ox, centerY + rand(-6, 6));
        ctx.rotate(angle);
        ctx.fillStyle = color;
        ctx.shadowColor = `rgba(0,0,0,${rand(0.25, 0.5)})`;
        ctx.shadowBlur = rand(2, 6);
        ctx.fillText(ch, -w / 2, 0);
        ctx.lineWidth = rand(1, 2);
        ctx.strokeStyle = randRgba();
        ctx.strokeText(ch, -w / 2, 0);
        ctx.restore();

        x += w + spacing;
        if (x > c.width - padding) {
            x = c.width - padding - (fs * 0.5);
        }
    }

    const lineCount = randInt(5, 10);
    for (let i = 0; i < lineCount; i++) {
        ctx.beginPath();
        ctx.moveTo(rand(0, c.width * 0.05), rand(0, c.height));
        ctx.quadraticCurveTo(rand(0, c.width), rand(0, c.height), rand(c.width * 0.6, c.width), rand(0, c.height));
        ctx.strokeStyle = randRgba(rand(0.1, 0.5));
        ctx.lineWidth = rand(0.6, 2.5);
        ctx.stroke();
    }

    for (let i = 0; i < Math.floor(c.width * 0.6); i++) {
        ctx.fillStyle = randRgba(rand(0.25, 0.75));
        const sx = rand(0, c.width);
        const sy = rand(0, c.height);
        const sw = rand(0.6, 2.2);
        const sh = rand(0.6, 2.2);
        ctx.fillRect(sx, sy, sw, sh);
    }

    const stripeCount = randInt(3, 15);
    ctx.globalCompositeOperation = "overlay";
    for (let i = 0; i < stripeCount; i++) {
        ctx.fillStyle = `rgba(255,255,255,${rand(0.05, 0.1)})`;
        const y = (i / stripeCount) * c.height + rand(-2, 2);
        ctx.fillRect(0, y, c.width, rand(1, 2));
    }
    ctx.globalCompositeOperation = "source-over";

    return c;
}

document.addEventListener("DOMContentLoaded", () => {
    const footer = document.querySelector("footer .container") || document.querySelector("footer") || document.body;
    if (!footer) return;

    const wrap = document.createElement("div");
    wrap.className = "email-captcha-wrapper";

    const canvas = drawEmailCaptcha(NORMAL);
    const img = document.createElement("img");
    img.className = "email-captcha-img";
    img.src = canvas.toDataURL("image/png");
    img.alt = ALT_TEXT;

    wrap.appendChild(img);
    footer.appendChild(wrap);
});