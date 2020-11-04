import React from "react";
import Amplify, { Auth } from "aws-amplify";
import { render, waitForDomChange, fireEvent, waitForElement } from "@testing-library/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "../../constants/styles/theme";
import * as ERRORS from "../../routes/login/constants/errors";
import * as CONSTANTS from "../constants/login";
import Login from "../../routes/login/login";
import * as AUTH from "../mocks/Auth";

Amplify.configure({
    Auth: CONSTANTS.AMPLIFY_CONFIG,
});

const Dashboard = () => {
    return <div>Login Successfully</div>;
};

test("Inputs are validated onBlur on first load and the button is disabled", async () => {
    const { getByPlaceholderText, queryByText, getByRole } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByRole("button", { name: /Log In/i });
    expect(button).toBeDisabled();
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    expect(queryByText(ERRORS.EMPTY_PASSWORD_ERROR)).toBeFalsy();
    expect(queryByText(ERRORS.EMPTY_EMAIL_ERROR)).toBeFalsy();
    fireEvent.focus(emailInput);
    fireEvent.focus(passwordInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    await waitForDomChange();
    expect(queryByText(ERRORS.EMPTY_PASSWORD_ERROR)).toBeTruthy();
    expect(queryByText(ERRORS.EMPTY_EMAIL_ERROR)).toBeTruthy();
});

test("Correct error message shows when invalid email is entered", async () => {
    const { getByPlaceholderText, queryByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </ThemeProvider>
    );
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    fireEvent.change(emailInput, { target: { value: "test1" } });
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);
    await waitForDomChange();
    expect(queryByText(ERRORS.INVALID_EMAIL_ERROR)).toBeTruthy();
});

test("Inputs are validated onchange", async () => {
    const { getByPlaceholderText, queryByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </ThemeProvider>
    );
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    fireEvent.change(emailInput, { target: { value: "test1" } });
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);
    await waitForDomChange();
    expect(queryByText(ERRORS.INVALID_EMAIL_ERROR)).toBeTruthy();
    fireEvent.change(emailInput, { target: { value: "" } });
    expect(queryByText(ERRORS.EMPTY_EMAIL_ERROR)).toBeTruthy();
    fireEvent.change(passwordInput, { target: { value: "aaaa" } });
    fireEvent.focus(passwordInput);
    fireEvent.blur(passwordInput);
    expect(queryByText(ERRORS.EMPTY_PASSWORD_ERROR)).toBeFalsy();
    fireEvent.change(passwordInput, { target: { value: "" } });
    expect(queryByText(ERRORS.EMPTY_PASSWORD_ERROR)).toBeTruthy();
});

test("Button is enabled after inputs are validated", async () => {
    const { getByPlaceholderText, getByRole } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByRole("button", { name: /Log In/i });
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    fireEvent.change(emailInput, { target: { value: "test1@gmail.com" } });
    await waitForDomChange();
    fireEvent.change(passwordInput, { target: { value: "aaaa" } });
    expect(button).toBeEnabled();
});

test("Auth is called with the right parameters", async () => {
    Auth.signIn = jest.fn().mockImplementation(() => {
        return new Promise(() => {
            return "";
        });
    });
    const { getByPlaceholderText, getByRole } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByRole("button", { name: /Log In/i });
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    fireEvent.change(emailInput, { target: { value: "test1@gmail.com" } });
    await waitForDomChange();
    fireEvent.change(passwordInput, { target: { value: "aaaa" } });
    fireEvent.click(button);
    await waitForDomChange();
    expect(button).toBeDisabled();
    expect(Auth.signIn).toHaveBeenCalledWith("test1@gmail.com", "aaaa");
});

test("Shows correct error message when credentials are invalid", async () => {
    const AWSErrorMessage = "Incorrect username or password.";
    const errorMessage = ERRORS.AWS_ERRORS[AWSErrorMessage];
    Auth.signIn = jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ message: AWSErrorMessage });
        });
    });
    const { getByPlaceholderText, getByRole, getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByRole("button", { name: /Log In/i });
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    fireEvent.change(emailInput, { target: { value: "test1@gmail.com" } });
    await waitForDomChange();
    fireEvent.change(passwordInput, { target: { value: "aaaa" } });
    fireEvent.click(button);
    await waitForDomChange();
    expect(getByText(errorMessage)).toBeInTheDocument();
});

test("Shows correct error message when confirmation is pending", async () => {
    const AWSErrorMessage = "User is not confirmed.";
    const errorMessage = ERRORS.AWS_ERRORS[AWSErrorMessage];
    Auth.signIn = jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ message: AWSErrorMessage });
        });
    });
    const { getByPlaceholderText, getByRole, getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByRole("button", { name: /Log In/i });
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    fireEvent.change(emailInput, { target: { value: "test1@gmail.com" } });
    await waitForDomChange();
    fireEvent.change(passwordInput, { target: { value: "aaaa" } });
    fireEvent.click(button);
    await waitForDomChange();
    expect(getByText(errorMessage)).toBeInTheDocument();
});

test("Shows correct error message when there´s a network error", async () => {
    Auth.signIn = jest.fn().mockImplementation(() => {
        return new Promise((_, reject) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ message: "Unknown" });
        });
    });
    const { getByPlaceholderText, getByRole, getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByRole("button", { name: /Log In/i });
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    fireEvent.change(emailInput, { target: { value: "test1@gmail.com" } });
    await waitForDomChange();
    fireEvent.change(passwordInput, { target: { value: "aaaa" } });
    fireEvent.click(button);
    await waitForDomChange();
    expect(getByText(ERRORS.NETWORK_ERROR)).toBeInTheDocument();
});

test("Redirects when user is signed in on load", async () => {
    AUTH.VALID();

    const { getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Login />
                <Switch>
                    <Route exact path="/dashboard" component={Dashboard} />
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );

    await waitForElement(() => getByText("Login Successfully"));
});

test("Redirects when successful sign in", async () => {
    AUTH.VALID();
    const { getByPlaceholderText, getByRole, getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Login />
                <Switch>
                    <Route exact path="/dashboard" component={Dashboard} />
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByRole("button", { name: /Log In/i });
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    fireEvent.change(emailInput, { target: { value: "test1@gmail.com" } });
    await waitForDomChange();
    fireEvent.change(passwordInput, { target: { value: "aaaa" } });
    fireEvent.click(button);
    await waitForElement(() => getByText("Login Successfully"));
});
