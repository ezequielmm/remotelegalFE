import React from "react";
import { render, waitForElement } from "@testing-library/react";
import { Router, Route, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import * as AUTH from "../mocks/Auth";
import Authenticator from "../../components/authenticator/authenticator";

const Dashboard = () => {
    return <div>Log In Successfully</div>;
};

const Main = () => {
    return <div>Main</div>;
};

test("Won´t let you into the dashboard unless authenticated", async () => {
    const history = createMemoryHistory();
    AUTH.NOT_VALID();

    const { queryByText, getByText } = render(
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={Main} />
                <Authenticator>
                    <Route exact path="/dashboard" component={Dashboard} />
                </Authenticator>
            </Switch>
        </Router>
    );
    history.push("/dashboard");
    expect(queryByText("Log In Successfully")).toBeFalsy();
    await waitForElement(() => getByText("Main"));
});

test("lets you into the dashboard when authenticated", async () => {
    const history = createMemoryHistory();
    AUTH.VALID();
    const { getByText } = render(
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={Main} />
                <Authenticator>
                    <Route exact path="/dashboard" component={Dashboard} />
                </Authenticator>
            </Switch>
        </Router>
    );
    history.push("/dashboard");
    await waitForElement(() => getByText("Log In Successfully"));
});
