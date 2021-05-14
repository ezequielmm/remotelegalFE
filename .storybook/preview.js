import React from "react";
import { ThemeProvider } from "styled-components";
import { theme } from "../src/constants/styles/theme";
import { getREM } from "../src/constants/styles/utils";
import styled from "styled-components";
import GlobalStyle from "../src/components/GlobalStyle"
import "./storybook.css";
import { ThemeMode } from "../src/types/ThemeType";
import { FloatingAlertContextProvider } from "../src/contexts/FloatingAlertContext";

export const globalTypes = {
    theme: {
        name: "Theme",
        description: "Global theme for components",
        defaultValue: ThemeMode.default,
        toolbar: {
            icon: "chroma",
            items: [ThemeMode.default, ThemeMode.inDepo],
        },
    },
};

const withThemeProvider = (Story, context) => {
    const selectedTheme = { ...theme, mode: ThemeMode[context.globals.theme] };

    const BackgroundWrapper = styled.div`
        height: 100%;
        width: 100%;
        position: relative;
        padding: ${getREM(theme.default.spaces[9])};
        background: ${selectedTheme.mode === ThemeMode.inDepo
            ? theme.colors.inDepoNeutrals[6]
            : theme.colors.neutrals[5]};
    `;

    return (
        <ThemeProvider theme={selectedTheme}>
            <FloatingAlertContextProvider parentThemeMode={selectedTheme.mode}>
                <GlobalStyle />
                <BackgroundWrapper>
                    <Story {...context} />
                </BackgroundWrapper>
            </FloatingAlertContextProvider>
        </ThemeProvider>
    );
};

export const decorators = [withThemeProvider];
