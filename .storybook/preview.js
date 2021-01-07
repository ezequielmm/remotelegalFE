import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../src/constants/styles/theme";
import { getREM } from "../src/constants/styles/utils";
import styled from "styled-components";
import "../src/assets/less/global.less";
import "./storybook.css";

export const globalTypes = {
    theme: {
        name: "Theme",
        description: "Global theme for components",
        defaultValue: "default",
        toolbar: {
            icon: "chroma",
            items: ["default", "inDepo"],
        },
    },
};

const withThemeProvider = (Story, context) => {
    const selectedTheme = { ...theme, mode: context.globals.theme };

    const BackgroundWrapper = styled.div`
        height: 100%;
        width: 100%;
        position: relative;
        padding: ${getREM(theme.default.spaces[9])};
        background: ${selectedTheme.mode === "inDepo" ? theme.colors.inDepoNeutrals[6] : theme.colors.neutrals[5]};
    `;

    return (
        <ThemeProvider theme={selectedTheme}>
            <BackgroundWrapper>
                <Story {...context} />
            </BackgroundWrapper>
        </ThemeProvider>
    );
};
export const decorators = [withThemeProvider];
