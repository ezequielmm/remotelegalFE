const CracoLessPlugin = require("craco-less");
const { modifiedVariables } = require("./src/constants/theme");

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: modifiedVariables,
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
