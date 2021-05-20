import React, { createContext, useState, useContext, useCallback } from "react";
import styled, { ThemeProvider } from "styled-components";
import Alert from "../components/Alert";
import { theme } from "../constants/styles/theme";
import { getREM } from "../constants/styles/utils";
import { GlobalStateContext } from "../state/GlobalState";
import { ThemeMode } from "../types/ThemeType";

const FloatingAlertContext = createContext(null);

export interface IFloatingAlertContext {
    children: React.ReactNode;
    parentThemeMode?: ThemeMode | ThemeMode.default;
}

const FloatingAlertWrapper = styled.div`
    position: fixed;
    top: ${getREM(theme.default.spaces[4])};
    left: 50%;
    transform: translate(-50%, 0);
    .ant-alert {
        margin: 0 auto ${getREM(theme.default.spaces[2])};
        width: fit-content;
        animation: showMessage 0.3s ease-out;
    }
    @keyframes showMessage {
        from {
            margin-top: -50px;
            opacity: 0;
        }
        to {
            margin-top: 0;
            opacity: 1;
        }
    }
`;

export default FloatingAlertContext;

export const FloatingAlertContextProvider = ({ children, parentThemeMode }: IFloatingAlertContext) => {
    const [alerts, setAlerts] = useState([]);
    const globalContext = useContext(GlobalStateContext);
    const contextTheme = globalContext ? globalContext.state.generalUi.theme : ThemeMode.default;
    const currentTheme = parentThemeMode ?? contextTheme;

    const addFloatingAlert = useCallback((props) => {
        setAlerts((oldAlerts) => [...oldAlerts, props]);
    }, []);

    return (
        <FloatingAlertContext.Provider value={addFloatingAlert}>
            <>
                {children}
                <ThemeProvider theme={{ ...theme, mode: currentTheme }}>
                    <FloatingAlertWrapper>
                        {alerts.map((alert, index) => {
                            const { message } = alert;
                            const messageId = message.replace(/\s+/g, "-").toLowerCase();
                            const indexval = parseInt(`${index}`, 10);
                            return (
                                <Alert
                                    data-testid={alert.dataTestId}
                                    key={`${messageId}${indexval}`}
                                    fullWidth={false}
                                    {...alert}
                                />
                            );
                        })}
                    </FloatingAlertWrapper>
                </ThemeProvider>
            </>
        </FloatingAlertContext.Provider>
    );
};
