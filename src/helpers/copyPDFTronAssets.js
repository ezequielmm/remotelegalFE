const fs = require("fs-extra");

const copyPDFTronAssets = async () => {
    try {
        await fs.copy("./node_modules/@pdftron/webviewer/public", "./public/webviewer/lib");
    } catch {
        throw Error("Couldn't copy PDFTron assets");
    }
    return null;
};
copyPDFTronAssets();
