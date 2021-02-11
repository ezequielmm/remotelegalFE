import "antd/dist/antd.less";
import Amplify from "aws-amplify";
import { createBrowserHistory } from "history";
import React from "react";
import ReactGA from "react-ga";
import TagManager from "react-gtm-module";
import { Route, Router, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import "../assets/less/global.less";
import { theme } from "../constants/styles/theme";
import Dashboard from "../routes/dashboard/dashboard";
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

function App() {
    const tagManagerId = {
        gtmId: "GTM-TMP4C9Q",
    };
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

    return (
        <ThemeProvider theme={{ ...theme, mode: ThemeMode[theme.mode] }}>
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/verifyUser" component={Login} />
                    <Route exact path="/sign-up" component={SignUp} />
                    <Route exact path="/deposition/pre-join/:depositionID" component={PreJoinDepo} />
                    <Authenticator routesWithGuestToken={ROUTES_WITH_GUEST_TOKEN}>
                        <RouteWithLayout exact path="/dashboard" component={Dashboard} />
                        <RouteWithLayout exact path="/my-cases" component={MyCases} />
                        <RouteWithLayout exact path="/deposition/new" component={CreateDeposition} />
                        <RouteWithLayout exact path="/my-depositions" component={MyDepositions} />
                        <RouteWithLayout exact path="/depositions" component={MyDepositions} />
                        <RouteWithLayout
                            exact
                            path="/deposition/post-depo-details/:depositionID"
                            component={DepositionDetails}
                        />
                        <Route
                            exact
                            path="/deposition/join/:depositionID/breakroom/:breakroomID"
                            component={Breakroom}
                        />
                        <Route exact path="/deposition/end" component={EndDepoScreen} />
                        <Route exact path="/deposition/join/:depositionID" component={InDepo} />
                    </Authenticator>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
