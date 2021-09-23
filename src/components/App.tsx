import "antd/dist/antd.less";
import Amplify from "aws-amplify";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga";
import TagManager from "react-gtm-module";
import "@datadog/browser-logs/bundle/datadog-logs";
import watchRTC from "@testrtc/watchrtc-sdk";
import { Route, Router, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "react-query";
import GlobalStyle from "prp-components-library/src/components/GlobalStyle";
import React from "react";
import { theme } from "../constants/styles/theme";
import MockInDepo from "../routes/MockInDepo";
import Login from "../routes/Login";
import SignUp from "../routes/SignUp";
import MyCases from "../routes/MyCases";
import InDepo from "../routes/InDepo";
import Breakroom from "../routes/InDepo/Breakroom";
import Authenticator from "./authenticator/authenticator";
import RouteWithLayout from "./RouteWithLayout/RouteWithLayout";
import CreateDeposition from "../routes/CreateDeposition";
import MyDepositions from "../routes/MyDepositions";
import EndDepoScreen from "../routes/PostDepo/EndDepoScreen";
import ROUTES_WITH_GUEST_TOKEN from "../constants/authenticator";
import { ThemeMode } from "../types/ThemeType";
import PreJoinDepo from "../routes/PreJoinDepo";
import DepositionDetails from "../routes/DepositionDetails";
import ActiveDepositionDetails from "../routes/ActiveDepoDetails";
import ResetPassword from "../routes/ResetPassword";
import ChangePassword from "../routes/ChangePassword";
import WaitingRoom from "../routes/WaitingRoom";
import Help from "../routes/Help";
import { FloatingAlertContextProvider } from "../contexts/FloatingAlertContext";
import TroubleShootUserDevices from "../routes/TroubleShootUserDevices/TroubleShootUserDevices";
import TechInfo from "../routes/TechInfo";
import CacheBuster from "../helpers/cacheBuster";
import withDDContext from "./WithDDContext";

declare global {
    interface Window {
        DD_LOGS: any;
    }
}

function App() {
    const tagManagerId = {
        gtmId: "GTM-TMP4C9Q",
    };

    if (process.env.REACT_APP_ENV !== "localhost" && process.env.REACT_APP_ENV !== "develop") {
        watchRTC.init({
            rtcApiKey: process.env.REACT_APP_RTC_API_KEY,
            rtcRoomId: process.env.REACT_APP_ENV,
        });
    }
    window.DD_LOGS.init({
        clientToken: process.env.REACT_APP_DATADOG_TOKEN,
        site: process.env.REACT_APP_DATADOG_URL,
        forwardErrorsToLogs: true,
        sampleRate: 100,
        env: process.env.REACT_APP_ENV,
        beforeSend: (log) => {
            if (
                log?.status === "error" &&
                (log?.message === "cancelled" ||
                    log?.error?.stack === "cancelled" ||
                    log?.error?.stack === "TypeError: cancelled")
            ) {
                return false;
            }
            return log;
        },
    });

    TagManager.initialize(tagManagerId);

    ReactGA.initialize(tagManagerId.gtmId);

    const history = createBrowserHistory();

    history.listen((location) => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });

    Amplify.configure({
        Auth: {
            region: process.env.REACT_APP_Auth_region,
            userPoolId: process.env.REACT_APP_Auth_userPoolId,
            userPoolWebClientId: process.env.REACT_APP_Auth_userPoolWebClientId,
        },
    });

    const queryClient = new QueryClient();

    return (
        <CacheBuster>
            {({ loading, isLatestVersion, refreshCacheAndReload }) => {
                if (loading) return null;
                if (!isLatestVersion && !loading) {
                    refreshCacheAndReload();
                }
                return (
                    <QueryClientProvider client={queryClient} contextSharing>
                        <ThemeProvider theme={{ ...theme, mode: ThemeMode[theme.mode] }}>
                            <FloatingAlertContextProvider>
                                <GlobalStyle />
                                <Router history={history}>
                                    <Switch>
                                        <Route exact path="/changePassword" component={ChangePassword} />
                                        <Route exact path="/password-recovery" component={ResetPassword} />
                                        <Route exact path="/" component={Login} />
                                        <Route path="/verifyUser" component={Login} />
                                        <Route exact path="/sign-up" component={SignUp} />
                                        <Route
                                            exact
                                            path="/deposition/pre-join/:depositionID"
                                            component={withDDContext(PreJoinDepo)}
                                        />
                                        <Authenticator routesWithGuestToken={ROUTES_WITH_GUEST_TOKEN}>
                                            <Route
                                                exact
                                                path="/deposition/pre-join/troubleshoot-devices/:depositionID"
                                                component={withDDContext(TroubleShootUserDevices)}
                                            />
                                            <Route
                                                exact
                                                path="/deposition/tech_info/:depositionID"
                                                component={withDDContext(TechInfo)}
                                            />
                                            <RouteWithLayout exact path="/my-cases" component={MyCases} />
                                            <RouteWithLayout
                                                exact
                                                path="/deposition/new"
                                                component={CreateDeposition}
                                            />
                                            <RouteWithLayout exact path="/depositions" component={MyDepositions} />
                                            <RouteWithLayout exact path="/help" component={Help} />
                                            <RouteWithLayout
                                                exact
                                                path="/deposition/post-depo-details/:depositionID"
                                                component={withDDContext(DepositionDetails)}
                                            />
                                            <RouteWithLayout
                                                exact
                                                path="/deposition/details/:depositionID"
                                                component={withDDContext(ActiveDepositionDetails)}
                                            />
                                            <Route
                                                exact
                                                path="/deposition/join/:depositionID/breakroom/:breakroomID"
                                                component={withDDContext(Breakroom)}
                                            />
                                            <Route exact path="/deposition/end" component={EndDepoScreen} />
                                            <Route
                                                exact
                                                path="/deposition/join/:depositionID"
                                                component={withDDContext(InDepo)}
                                            />
                                            <Route
                                                exact
                                                path="/deposition/pre/:depositionID"
                                                component={withDDContext(MockInDepo)}
                                            />
                                            <Route
                                                exact
                                                path="/deposition/pre/:depositionID/waiting"
                                                component={withDDContext(WaitingRoom)}
                                            />
                                        </Authenticator>
                                    </Switch>
                                </Router>
                            </FloatingAlertContextProvider>
                        </ThemeProvider>
                    </QueryClientProvider>
                );
            }}
        </CacheBuster>
    );
}

export default React.memo(App);
