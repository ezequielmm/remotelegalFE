import { fireEvent, waitForDomChange, waitForElement } from "@testing-library/react";
import Amplify, { Auth } from "aws-amplify";
import React from "react";
import { Route, Switch } from "react-router-dom";
import * as ERRORS from "../../constants/login";
import Login from "../../routes/Login";
import * as CONSTANTS from "../constants/login";
import * as AUTH from "../mocks/Auth";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

Amplify.configure({
    Auth: CONSTANTS.AMPLIFY_CONFIG,
});

const Dashboard = () => {
    return <div>Login Successfully</div>;
};

describe("Login", () => {
    it("should validate inputs on submit", async () => {
        const { queryByText, getByRole } = renderWithGlobalContext(<Login />);
        const button = getByRole("button", { name: /Log In/i });
        expect(button).toBeEnabled();
        expect(queryByText(ERRORS.EMPTY_PASSWORD_ERROR)).toBeFalsy();
        expect(queryByText(ERRORS.EMPTY_EMAIL_ERROR)).toBeFalsy();
        fireEvent.click(button);
        await waitForDomChange();
        expect(queryByText(ERRORS.EMPTY_PASSWORD_ERROR)).toBeTruthy();
        expect(queryByText(ERRORS.EMPTY_EMAIL_ERROR)).toBeTruthy();
    });

    it("should display the correct error message when invalid email is entered", async () => {
        const { getByPlaceholderText, queryByText, getByRole } = renderWithGlobalContext(<Login />);
        const button = getByRole("button", { name: /Log In/i });
        const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        fireEvent.change(emailInput, { target: { value: "test1" } });
        fireEvent.click(button);
        await waitForDomChange();
        expect(queryByText(ERRORS.INVALID_EMAIL_ERROR)).toBeTruthy();
    });

    it("should display the correct error message when no password is entered", async () => {
        const { getByPlaceholderText, queryByText, getByRole } = renderWithGlobalContext(<Login />);
        const button = getByRole("button", { name: /Log In/i });
        const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        fireEvent.change(passwordInput, { target: { value: "" } });
        fireEvent.click(button);
        await waitForDomChange();
        expect(queryByText(ERRORS.EMPTY_PASSWORD_ERROR)).toBeTruthy();
    });

    it("should remove validation messages on change after submit", async () => {
        const { getByPlaceholderText, queryByText, getByRole } = renderWithGlobalContext(<Login />);
        const button = getByRole("button", { name: /Log In/i });
        const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        fireEvent.change(emailInput, { target: { value: "test1" } });
        fireEvent.click(button);
        await waitForDomChange();
        expect(queryByText(ERRORS.EMPTY_PASSWORD_ERROR)).toBeTruthy();
        expect(queryByText(ERRORS.INVALID_EMAIL_ERROR)).toBeTruthy();
        fireEvent.change(passwordInput, { target: { value: "test123" } });
        fireEvent.change(emailInput, { target: { value: "" } });
        await waitForDomChange();
        expect(queryByText(ERRORS.INVALID_EMAIL_ERROR)).toBeFalsy();
        expect(queryByText(ERRORS.EMPTY_PASSWORD_ERROR)).toBeFalsy();
    });

    it("should call auth with the right parameters and button should be disabled", async () => {
        Auth.signIn = jest.fn().mockImplementation(() => {
            return new Promise(() => {
                return "";
            });
        });
        const { getByPlaceholderText, getByRole } = renderWithGlobalContext(<Login />);
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

    it("should display the correct error message when credentials are invalid", async () => {
        const AWSErrorMessage = "Incorrect username or password.";
        const errorMessage = ERRORS.AWS_ERRORS[AWSErrorMessage];
        Auth.signIn = jest.fn().mockImplementation(() => {
            return new Promise((_, reject) => {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({ message: AWSErrorMessage });
            });
        });
        const { getByPlaceholderText, getByRole, getByText } = renderWithGlobalContext(<Login />);
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

    it("should display the correct error message when confirmation is pending", async () => {
        const AWSErrorMessage = "User is not confirmed.";
        const errorMessage = ERRORS.AWS_ERRORS[AWSErrorMessage];
        Auth.signIn = jest.fn().mockImplementation(() => {
            return new Promise((_, reject) => {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({ message: AWSErrorMessage });
            });
        });
        const { getByPlaceholderText, getByRole, getByText } = renderWithGlobalContext(<Login />);
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

    it("should display the correct error message when there´s a network error", async () => {
        Auth.signIn = jest.fn().mockImplementation(() => {
            return new Promise((_, reject) => {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject({ message: "Unknown" });
            });
        });
        const { getByPlaceholderText, getByRole, getByText } = renderWithGlobalContext(<Login />);
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

    it("should redirect when user is signed in on load", async () => {
        AUTH.VALID_WITH_REFRESH();

        const { getByText } = renderWithGlobalContext(
            <>
                <Login />
                <Switch>
                    <Route exact path="/dashboard" component={Dashboard} />
                </Switch>
            </>
        );

        await waitForElement(() => getByText("Login Successfully"));
    });

    it("should redirect when successful sign in", async () => {
        AUTH.VALID_WITH_REFRESH();
        const { getByPlaceholderText, getByRole, getByText } = renderWithGlobalContext(
            <>
                <Login />
                <Switch>
                    <Route exact path="/dashboard" component={Dashboard} />
                </Switch>
            </>
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
});
