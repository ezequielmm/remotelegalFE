const { modifiedVariables } = require("../src/constants/styles/theme");

module.exports = {
    typescript: {
        reactDocgen: "react-docgen",
    },
    stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        {
            name: "@storybook/preset-create-react-app",
            options: {
                craOverrides: {
                    fileLoaderExcludes: ["less"],
                },
            },
        },
        {
            name: "@storybook/preset-ant-design",
            options: {
                lessOptions: {
                    modifyVars: modifiedVariables,
                },
            },
        },
    ],
};
