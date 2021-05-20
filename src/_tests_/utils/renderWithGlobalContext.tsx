import { render } from "@testing-library/react";
import React from "react";
import { Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { createMemoryHistory } from "history";
import { theme } from "../../constants/styles/theme";
import { Deps, IGlobalReducer } from "../../models/general";
import { GlobalState, rootReducer as globalReducer } from "../../state/GlobalState";
import getMockDeps from "./getMockDeps";
import { ThemeMode } from "../../types/ThemeType";
import { FloatingAlertContextProvider } from "../../contexts/FloatingAlertContext";

export default (
    children: JSX.Element,
    deps: Deps = getMockDeps(),
    rootReducer: IGlobalReducer = globalReducer,
    customHistory?
) => {
    const history = createMemoryHistory();
    const renderAPI = render(
        <ThemeProvider theme={{ ...theme, mode: ThemeMode[theme.mode] }}>
            <FloatingAlertContextProvider>
                <Router history={customHistory || history}>
                    <GlobalState deps={deps} rootReducer={rootReducer}>
                        {children}
                    </GlobalState>
                </Router>
            </FloatingAlertContextProvider>
        </ThemeProvider>
    );
    return { ...renderAPI, mockReducer: rootReducer, deps };
};
