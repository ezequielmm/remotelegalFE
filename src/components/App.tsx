import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Amplify from "aws-amplify";
import "antd/dist/antd.less";
import "../assets/fonts/fontface.less";
import { ThemeProvider } from "styled-components";
import { theme } from "../constants/styles/theme";

import Login from "../routes/login/login";
import Authenticator from "./authenticator/authenticator";

function App() {
    Amplify.configure({
        Auth: {
            region: process.env.REACT_APP_Auth_region,
            userPoolId: process.env.REACT_APP_Auth_userPoolId,
            userPoolWebClientId: process.env.REACT_APP_Auth_userPoolWebClientId,
        },
    });
    // TODO:Dashboard
    const Dashboard = () => {
        return <div>Log In Successfully</div>;
    };

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Authenticator>
                        <Route exact path="/dashboard" component={Dashboard} />
                    </Authenticator>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

export default App;
