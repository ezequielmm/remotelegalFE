const { generate } = require("@ant-design/colors");

// Brand pallet
const gold = generate("#C09853");
const deepBlue = generate("#00304E");

const pickleGreen = generate("#8A9A0E");
const mustardYellow = generate("#E7B32A");
const chilliRed = generate("#BD2414");
const cloudGray = generate("#DAE4F1");

// Neutral pallet
const black = "#14232E";
const darkGray = "#0F4877";
const gray = "#A2C3D8";
const lightGray = "#DFE8EE";
const lightestGray = "#F9F9F9";
const white = "#FFFFFF";
const neutrals = [black, darkGray, gray, lightGray, lightestGray, white];

module.exports.colors = { gold, deepBlue, neutrals, pickleGreen, mustardYellow, chilliRed, cloudGray };