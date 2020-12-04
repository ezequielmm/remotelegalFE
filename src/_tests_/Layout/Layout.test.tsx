import React from "react";
import { render } from "@testing-library/react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import userEvent from "@testing-library/user-event";
import { theme } from "../../constants/styles/theme";
import Layout from "../../components/Layout";

const Dashboard = () => {
    return <div>DASHBOARD</div>;
};

const Deposition = () => {
    return <div>DEPOSITION</div>;
};

const menuRoutes = [{ title: "MENU", routes: [{ path: "/dashboard", name: "Dashboard" }] }];

test("expect click on menu option to redirect me to dashboard", async () => {
    const { getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Layout menuRoutes={menuRoutes}>
                        <Route exact path="/dashboard" component={Dashboard} />
                    </Layout>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
    const menuOption = getByText("Dashboard");
    userEvent.click(menuOption);
    expect(getByText("DASHBOARD")).toBeInTheDocument();
});

test("click on schedule deposition takes me to deposition", async () => {
    const { getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/deposition/new" component={Deposition} />
                    <Layout menuRoutes={menuRoutes}>
                        <Route exact path="/dashboard" component={Dashboard} />
                    </Layout>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByText("Schedule deposition");
    userEvent.click(button);
    expect(getByText("DEPOSITION")).toBeInTheDocument();
});
