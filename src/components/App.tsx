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
import Login from "../routes/login/login";
import MyCases from "../routes/myCases/myCases";
import SignUp from "../routes/signup/signup";
import VideoChat from "../routes/videochat/VideoChat/VideoChat";
import Authenticator from "./authenticator/authenticator";
import RouteWithLayout from "./RouteWithLayout/RouteWithLayout";

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
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/verifyUser" component={Login} />
                    <Route exact path="/sign-up" component={SignUp} />
                    <Authenticator>
                        <RouteWithLayout exact path="/dashboard" component={Dashboard} />
                        <RouteWithLayout exact path="/my-cases" component={MyCases} />
                        <Route exact path="/videochat" component={VideoChat} />
                    </Authenticator>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
