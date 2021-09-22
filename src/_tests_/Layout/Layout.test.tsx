import React from "react";
import { fireEvent, waitFor, screen } from "@testing-library/react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import userEvent from "@testing-library/user-event";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { theme } from "../../constants/styles/theme";
import Layout from "../../components/Layout";
import getMockDeps from "../utils/getMockDeps";
import { rootReducer } from "../../state/GlobalState";
import state from "../mocks/state";
import actions from "../../state/Depositions/DepositionsListActions";

const { dispatch } = state;

const Deposition = () => {
    return <div>DEPOSITION</div>;
};

const NewDeposition = () => {
    return <div>NEW DEPOSITION</div>;
};

const customDeps = getMockDeps();

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
    const button = screen.getByTestId("schedule_deposition");
    userEvent.click(button);
    expect(getByText("NEW DEPOSITION")).toBeInTheDocument();
});

test("should display current user first and last name text", async () => {
    const { getByText } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Layout>
                        <Route exact path="/deposition/new" component={NewDeposition} />
                    </Layout>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                generalUi: { isSiderCollapsed: false },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
            },
        }
    );
    expect(getByText("First Name Last Name")).toBeInTheDocument();
});

test("should not display current user last name before than last name text", async () => {
    const { queryByText } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Layout>
                        <Route exact path="/deposition/new" component={NewDeposition} />
                    </Layout>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                generalUi: { isSiderCollapsed: false },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
            },
        }
    );
    expect(queryByText("Last Name First Name")).not.toBeInTheDocument();
});

test("should not display current user first and last name text when it is null", async () => {
    const { queryByText } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Layout>
                        <Route exact path="/deposition/new" component={NewDeposition} />
                    </Layout>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                generalUi: { isSiderCollapsed: false },
                user: { currentUser: null },
            },
        }
    );
    expect(queryByText("First Name Last Name")).not.toBeInTheDocument();
});

test("should call to clear deposition list filters when click on the my depositions menu item", async () => {
    const { findByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Layout>
                        <Route exact path="/deposition/new" component={NewDeposition} />
                    </Layout>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                generalUi: { isSiderCollapsed: false },
                user: { currentUser: null },
            },
        }
    );
    const myDepoListMenuItem = await findByTestId("my_depositions");
    expect(myDepoListMenuItem).toBeInTheDocument();
    fireEvent.click(myDepoListMenuItem);
    waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(actions.clear());
    });
});

test("should not call to clear deposition list filters when click on the my depositions menu item", async () => {
    const { findByTestId } = renderWithGlobalContext(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Layout>
                        <Route exact path="/deposition/new" component={NewDeposition} />
                    </Layout>
                </Switch>
            </BrowserRouter>
        </ThemeProvider>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                generalUi: { isSiderCollapsed: false },
                user: { currentUser: null },
            },
        }
    );
    const myDepoListMenuItem = await findByTestId("my_cases");
    expect(myDepoListMenuItem).toBeInTheDocument();
    fireEvent.click(myDepoListMenuItem);
    waitFor(() => {
        expect(dispatch).not.toHaveBeenCalledWith(actions.clear());
    });
});
