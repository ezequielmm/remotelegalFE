const CracoLessPlugin = require("craco-less");
const { modifiedVariables } = require("./src/constants/styles/theme");

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
