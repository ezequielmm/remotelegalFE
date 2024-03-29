const baseUnit = 16;

const spacing = {
    baseUnit,
    heightBase: 3,
    spaces: [0, 0.125, 0.25, 0.5, 0.75, 0.875, 1, 1.125, 1.25, 1.5, 1.75, 1.875, 2],
    modalWidth: {
        default: baseUnit * 38,
        small: baseUnit * 25,
        large: baseUnit * 53,
    },
    menuWith: {
        default: 23.5,
    },
};

module.exports = { spacing };
