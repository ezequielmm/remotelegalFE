const FontFace = (family, name, weight = 400, style = "normal") => {
    return `
        @font-face {
            font-family: ${family};
            src: url(${name}) format("truetype");
            font-weight: ${weight};
            font-style: ${style};
        }
    `;
};

export default FontFace;
