import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../src/constants/styles/theme";
import "../src/assets/less/global.less";

export const decorators = [
    (Story) => (
        <ThemeProvider theme={theme}>
            <Story />
        </ThemeProvider>
    ),
];

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
};
