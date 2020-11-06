import React from "react";
import "antd/dist/antd.less";
import "../assets/less/global.less";
import { ThemeProvider } from "styled-components";
import { Router, Route, Switch } from "react-router-dom";
import Amplify from "aws-amplify";
import TagManager from "react-gtm-module";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga";
import { theme } from "../constants/styles/theme";
import Login from "../routes/login/login";
import SignUp from "../routes/signup/signup";
import Layout from "./Layout";
import Authenticator from "./authenticator/authenticator";
import Dashboard from "../routes/dashboard/dashboard";
import VideoChat from "../routes/videochat/VideoChat/VideoChat";

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

    // TODO: MyCases

    const MyCases = () => <Layout>My Cases</Layout>;

    return (
        <ThemeProvider theme={theme}>
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route path="/verifyUser" component={Login} />
                    <Route exact path="/sign-up" component={SignUp} />
                    <Authenticator>
                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/my-cases" component={MyCases} />
                        <Route exact path="/videochat" component={VideoChat} />
                    </Authenticator>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
