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
            numberWeight = 300;
            break;

        case "regular":
            numberWeight = 400;
            break;

        case "bold":
            numberWeight = 700;
            break;

        default:
            numberWeight = 400;
            break;
    }

    return numberWeight;
}

module.exports = { getREM, getPX, getEM, getWeightNumber };
