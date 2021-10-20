const CracoLessPlugin = require("craco-less");
const path = require("path");
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
        {
            plugin: {
                overrideWebpackConfig: ({ webpackConfig }) => {
                    const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
                    if (oneOfRule) {
                        const tsxRule = oneOfRule.oneOf.find(
                            (rule) => rule.test && rule.test.toString().includes("ts")
                        );

                        const newIncludePaths = [
                            // relative path to my yarn workspace library
                            path.resolve(__dirname, "node_modules/@rl/prp-components-library/src"),
                        ];
                        if (tsxRule) {
                            if (Array.isArray(tsxRule.include)) {
                                tsxRule.include = [...tsxRule.include, ...newIncludePaths];
                            } else {
                                tsxRule.include = [tsxRule.include, ...newIncludePaths];
                            }
                        }
                    }
                    return webpackConfig;
                },
            },
        },
    ],
};
