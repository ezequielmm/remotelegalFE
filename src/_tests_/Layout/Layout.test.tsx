import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import userEvent from "@testing-library/user-event";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { theme } from "../../constants/styles/theme";
import Layout from "../../components/Layout";

const Deposition = () => {
    return <div>DEPOSITION</div>;
};

const NewDeposition = () => {
    return <div>NEW DEPOSITION</div>;
};

test("expect click on menu option to redirect me to depositions", async () => {
    const { getByText } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Layout>
                        <Route exact path="/depositions" component={Deposition} />
                    </Layout>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
    const menuOption = getByText("My depositions");
    userEvent.click(menuOption);
    expect(getByText("DEPOSITION")).toBeInTheDocument();
});

test("click on schedule deposition takes me to deposition", async () => {
    const { getByText } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Layout>
                        <Route exact path="/deposition/new" component={NewDeposition} />
                    </Layout>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByText("Schedule deposition");
    userEvent.click(button);
    expect(getByText("NEW DEPOSITION")).toBeInTheDocument();
});
