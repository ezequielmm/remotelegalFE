const { fonts } = require("./fonts");

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

module.exports = { getREM, getPX, getEM, getWeightNumber, hexToRGBA };
