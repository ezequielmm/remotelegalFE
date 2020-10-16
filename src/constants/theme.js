const { colors } = require("./colors");

const theme = {
    colors: {
        primary: colors.gold,
        secondary: colors.deepBlue,
    },
    default: {
        /** Ant Design */
        primary: colors.gold[5], // color base
        textColorInverse: colors.white,
        /** Custom */
        secondary: colors.deepBlue[5], // color base
    },
};

/** Override Ant Design variables */
const modifiedVariables = {
    "@primary-color": theme.default.primary,
};

module.exports = { theme, modifiedVariables };
