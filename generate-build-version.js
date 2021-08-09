const fs = require("fs");
const latestHash = require("./latest.json");

const hash = latestHash.version;

const hashData = {
    version: hash,
};

const jsonContent = JSON.stringify(hashData);

// eslint-disable-next-line func-names
// eslint-disable-next-line consistent-return
fs.writeFile("./public/meta.json", jsonContent, "utf8", (err) => {
    if (err) {
        console.log("An error occured while writing JSON Object to meta.json");
        return console.log(err);
    }

    console.log("meta.json file has been saved with latest version number");
});
