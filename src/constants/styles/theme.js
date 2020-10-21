const { colors } = require("./colors");
const { fonts } = require("./fonts");
const { spacing } = require("./spacing");
const { borders } = require("./borders");
const { getREM, getPX, getEM } = require("./utils");

const theme = {
    colors: {
        primary: colors.gold,
        secondary: colors.deepBlue,
        neutrals: colors.neutrals,
        success: colors.pickleGreen,
        warning: colors.mustardYellow,
        error: colors.chilliRed,
        disabled: colors.cloudGray,
    },
    default: {
        /** Ant Design */
        // Color
        primaryColor: colors.gold[5], // color base
        infoColor: colors.gold[5],
        processingColor: colors.gold[5],
        successColor: colors.pickleGreen[5],
        warningColor: colors.mustardYellow[5],
        errorColor: colors.chilliRed[5],
        highlightColor: colors.chilliRed[5],
        disabledColor: colors.cloudGray[7],
        disabledBg: colors.cloudGray[5],
        // Font
        textColor: colors.neutrals[0],
        textColorInverse: colors.neutrals[5],
        fontFamily: fonts.fontFamily,
        fontSizeBase: fonts.fontSizeBase,
        lineHeightBase: fonts.lineHeightBase,
        typographyTitleFontWeight: fonts.typographyTitleFontWeight,
        typographyTitleMarginTop: fonts.typographyTitleMarginTop,
        typographyTitleMarginBottom: fonts.typographyTitleMarginBottom,
        // Border
        borderRadiusBase: borders.borderRadiusBase,
        // Button
        btnFontWeight: 700,
        btnHeightBase: spacing.heightBase,
        /** Custom */
        secondary: colors.deepBlue[5], // color base
        baseUnit: spacing.baseUnit,
        headerFontFamily: fonts.headerFontFamily,
        fontSizes: fonts.fontSizes,
        spaces: spacing.spaces,
    },
};

/** Override Ant Design variables */
const modifiedVariables = {
    "@text-color": theme.default.textColor,
    "@primary-color": theme.default.primaryColor,
    "@info-color": theme.default.infoColor,
    "@success-color": theme.default.successColor,
    "@processing-color": theme.default.processingColor,
    "@error-color": theme.default.errorColor,
    "@highlight-color": theme.default.highlightColor,
    "@warning-color": theme.default.warningColor,
    "@disabled-color": theme.default.disabledColor,
    "@font-family": theme.default.fontFamily,
    "@font-size-base": getPX(theme.default.fontSizeBase, spacing.baseUnit),
    "@heading-1-size": getREM(theme.default.fontSizes[0]),
    "@heading-2-size": getREM(theme.default.fontSizes[1]),
    "@heading-3-size": getREM(theme.default.fontSizes[2]),
    "@heading-4-size": getREM(theme.default.fontSizes[3]),
    "@heading-5-size": getREM(theme.default.fontSizes[4]),
    "@line-height-base": theme.default.lineHeightBase,
    "@typography-title-font-weight": theme.default.typographyTitleFontWeight,
    "@typography-title-margin-top": getEM(theme.default.typographyTitleMarginTop),
    "@typography-title-margin-bottom": getEM(theme.default.typographyTitleMarginBottom),
    "@border-radius-base": getPX(theme.default.borderRadiusBase, spacing.baseUnit),
    "@btn-font-weight": theme.default.btnFontWeight,
    "@btn-height-base": getREM(theme.default.btnHeightBase),
    "@btn-padding-horizontal-base": getREM(theme.default.spaces[5]),
    "@btn-disable-color": theme.default.disabledColor,
    "@btn-disable-bg": theme.default.disabledBg,
    "@btn-disable-border": theme.default.disabledBg,
};

module.exports = { theme, modifiedVariables };
