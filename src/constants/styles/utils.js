const { fonts } = require("./fonts");

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        for (const side in defaultRadius) {
            radius[side] = radius[side] || defaultRadius[side];
        }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
}

function getREM(unit) {
    return `${unit}rem`;
}

function getEM(unit) {
    return `${unit}em`;
}

function getPX(unit, baseUnit = 16) {
    return `${baseUnit * unit}px`;
}

function getWeightNumber(weight) {
    let numberWeight = 400;

    switch (weight) {
        case "light":
            numberWeight = fonts.fontWeights.light;
            break;

        case "regular":
            numberWeight = fonts.fontWeights.regular;
            break;

        case "bold":
            numberWeight = fonts.fontWeights.bold;
            break;

        default:
            numberWeight = fonts.fontWeights.regular;
            break;
    }

    return numberWeight;
}

function isValidHex(hex) {
    return /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);
}

function getChunksFromString(st, chunkSize) {
    return st.match(new RegExp(`.{${chunkSize}}`, "g"));
}

function convertHexUnitTo256(hexStr) {
    return parseInt(hexStr.repeat(2 / hexStr.length), 16);
}

function getAlphafloat(a, alpha) {
    if (typeof a !== "undefined") {
        return a / 255;
    }
    if (typeof alpha !== "number" || alpha < 0 || alpha > 1) {
        return 1;
    }
    return alpha;
}

function hexToRGBA(hex, alpha) {
    if (!isValidHex(hex)) {
        return "Invalid HEX";
    }
    const chunkSize = Math.floor((hex.length - 1) / 3);
    const hexArr = getChunksFromString(hex.slice(1), chunkSize);
    const result = hexArr.map(convertHexUnitTo256);
    // No deconstrucction was used because craco less plugin does't like it (breaks build)
    return `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${getAlphafloat(result[3], alpha)})`;
}

module.exports = { getREM, getPX, getEM, getWeightNumber, hexToRGBA, roundRect };
