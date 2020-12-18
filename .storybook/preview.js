import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../src/constants/styles/theme";
import "../src/assets/less/global.less";
import './storybook.css';

export const decorators = [
    (Story) => (
        <ThemeProvider theme={theme}>
            <Story />
        </ThemeProvider>
    ),
];

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    backgrounds: {
        default: 'default',
        values: [
          {
            name: 'default',
            value: theme.colors.neutrals[5],
          },
          {
            name: 'inDepo',
            value: theme.colors.inDepoNeutrals[6],
          },
        ],
      },
};
