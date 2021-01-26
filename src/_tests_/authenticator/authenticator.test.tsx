import React from "react";
import { render, waitForElement } from "@testing-library/react";
import { Router, Route, Switch } from "react-router-dom";
import { createMemoryHistory } from "history";
import * as AUTH from "../mocks/Auth";
import Authenticator from "../../components/authenticator/authenticator";
import TEMP_TOKEN from "../../constants/ApiService";
import ROUTES_WITH_GUEST_TOKEN from "../../constants/authenticator";

const Dashboard = () => {
    return <div>Log In Successfully</div>;
};

const Deposition = () => {
    return <div>Deposition</div>;
};

const Main = () => {
    return <div>Main</div>;
};

beforeEach(() => {
    localStorage.clear();
});

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

test("if pathname includes deposition/join and you have a token it lets you in", async () => {
    const history = createMemoryHistory();
    AUTH.NOT_VALID();
    localStorage.setItem(TEMP_TOKEN, "test1234");
    const { getByText } = render(
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={Main} />
                <Authenticator routesWithGuestToken={ROUTES_WITH_GUEST_TOKEN}>
                    <Route exact path="/deposition/join/:depositionID" component={Deposition} />
                </Authenticator>
            </Switch>
        </Router>
    );
    history.push("/deposition/join/test123");
    await waitForElement(() => getByText("Deposition"));
});

test("Won´t let you into the deposition/join path if you don´t have a token or a valid auth", async () => {
    const history = createMemoryHistory();
    AUTH.NOT_VALID();
    const { queryByText, getByText } = render(
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={Main} />
                <Authenticator routesWithGuestToken={ROUTES_WITH_GUEST_TOKEN}>
                    <Route exact path="/deposition/join" component={Deposition} />
                </Authenticator>
            </Switch>
        </Router>
    );
    history.push("/deposition");
    expect(queryByText("Deposition")).toBeFalsy();
    await waitForElement(() => getByText("Main"));
});
