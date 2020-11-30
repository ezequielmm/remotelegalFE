import { render } from "@testing-library/react";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../constants/styles/theme";
import { Deps, IGlobalReducer } from "../../models/general";
import { GlobalState, rootReducer as globalReducer } from "../../state/GlobalState";
import getMockDeps from "./getMockDeps";

export default (children: JSX.Element, deps: Deps = getMockDeps(), rootReducer: IGlobalReducer = globalReducer) => {
    const renderAPI = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <GlobalState deps={deps} rootReducer={rootReducer}>
                    {children}
                </GlobalState>
            </BrowserRouter>
        </ThemeProvider>
    );
    return { ...renderAPI, mockReducer: rootReducer, deps };
};
