import { fireEvent, waitForDomChange, waitForElement } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router";
import * as CONSTANTS from "../../constants/changePassword";
import { PASSWORD_CHANGED, PASSWORD_CHANGE_INVALID_HASH } from "../../constants/login";
import ChangePassword from "../../routes/ChangePassword";
import Login from "../../routes/Login";
import * as TEST_CONSTANTS from "../constants/changePassword";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

delete global.window.location;
global.window = Object.create(window);
global.window.location = {
    ...global.window.location,
    port: "123",
    protocol: "http:",
    hostname: "localhost",
    search: "?verificationHash=hash",
};

const customDeps = getMockDeps();

describe("Reset Password", () => {
    it("expect button to be disabled", async () => {
        const { queryByRole } = renderWithGlobalContext(<ChangePassword />);
        await waitForDomChange();
        const button = queryByRole("button", { name: CONSTANTS.CHANGE_PASSWORD });
        expect(button).toBeDisabled();
    });
    it("expect button to be disabled on wrong formatted passwords", async () => {
        const { queryByPlaceholderText, queryByRole } = renderWithGlobalContext(<ChangePassword />);
        const button = queryByRole("button", { name: CONSTANTS.CHANGE_PASSWORD });
        const passwordInput = queryByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        const confirmPasswordInput = queryByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
        fireEvent.change(passwordInput, { target: { value: TEST_CONSTANTS.WRONG_FORMATTED_PASSWORD } });
        fireEvent.change(confirmPasswordInput, { target: { value: TEST_CONSTANTS.WRONG_CONFIRM_PASSWORD } });
        await waitForDomChange();
        expect(button).toBeDisabled();
    });
    it("expect to trigger error on wrong formatted passwords", async () => {
        const { queryByText, queryByPlaceholderText } = renderWithGlobalContext(<ChangePassword />);
        const passwordInput = queryByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        fireEvent.change(passwordInput, { target: { value: TEST_CONSTANTS.WRONG_FORMATTED_PASSWORD } });
        fireEvent.blur(passwordInput);
        await waitForDomChange();
        const passwordError = queryByText(CONSTANTS.PASSWORD_ERROR);
        expect(passwordError).toBeTruthy();
    });
    it("expect to trigger error on wrong formatted passwords", async () => {
        const { queryByText, queryByPlaceholderText } = renderWithGlobalContext(<ChangePassword />);
        const passwordInput = queryByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        const confirmPasswordInput = queryByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
        fireEvent.change(passwordInput, { target: { value: TEST_CONSTANTS.WELL_FORMATTED_PASSWORD } });
        fireEvent.change(confirmPasswordInput, { target: { value: TEST_CONSTANTS.WRONG_CONFIRM_PASSWORD } });
        fireEvent.blur(confirmPasswordInput);
        await waitForDomChange();
        const confirmPasswordError = queryByText(CONSTANTS.CONFIRM_PASSWORD_ERROR);
        expect(confirmPasswordError).toBeTruthy();
    });
    it("expect button to be enabled on well formatted passwords", async () => {
        const { queryByPlaceholderText, queryByRole } = renderWithGlobalContext(<ChangePassword />);
        const button = queryByRole("button", { name: CONSTANTS.CHANGE_PASSWORD });
        const passwordInput = queryByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        const confirmPasswordInput = queryByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
        fireEvent.change(passwordInput, { target: { value: TEST_CONSTANTS.WELL_FORMATTED_PASSWORD } });
        fireEvent.change(confirmPasswordInput, { target: { value: TEST_CONSTANTS.WELL_FORMATTED_PASSWORD } });
        await waitForDomChange();
        expect(button).toBeEnabled();
    });
    it("expect error message when changePassword fails", async () => {
        customDeps.apiService.changePassword = jest.fn().mockRejectedValue(new Error(""));
        const { queryByPlaceholderText, queryByRole, queryByText } = renderWithGlobalContext(
            <ChangePassword />,
            customDeps
        );
        const button = queryByRole("button", { name: CONSTANTS.CHANGE_PASSWORD });
        const passwordInput = queryByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        const confirmPasswordInput = queryByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
        fireEvent.change(passwordInput, { target: { value: TEST_CONSTANTS.WELL_FORMATTED_PASSWORD } });
        fireEvent.change(confirmPasswordInput, { target: { value: TEST_CONSTANTS.WELL_FORMATTED_PASSWORD } });
        fireEvent.click(button);
        await waitForDomChange();
        expect(queryByText(CONSTANTS.NETWORK_ERROR)).toBeTruthy();
    });
    it("expect redirection to login when submit well formatted passwords", async () => {
        const history = createMemoryHistory();
        const { queryByText, queryByPlaceholderText, queryByRole } = renderWithGlobalContext(
            <Router history={history}>
                <Switch>
                    <Route exact path="/changePassword" component={ChangePassword} />
                    <Route exact path="/" component={Login} />
                </Switch>
            </Router>
        );
        history.push("/changePassword");
        await waitForDomChange();
        const button = queryByRole("button", { name: CONSTANTS.CHANGE_PASSWORD });
        const passwordInput = queryByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        const confirmPasswordInput = queryByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
        fireEvent.change(passwordInput, { target: { value: TEST_CONSTANTS.WELL_FORMATTED_PASSWORD } });
        fireEvent.change(confirmPasswordInput, { target: { value: TEST_CONSTANTS.WELL_FORMATTED_PASSWORD } });
        fireEvent.click(button);
        await waitForDomChange();
        expect(queryByText(PASSWORD_CHANGED)).toBeTruthy();
    });
    it("expect redirection to login when error on verify", async () => {
        customDeps.apiService.verifyPasswordToken = jest.fn().mockRejectedValue(new Error(""));
        const history = createMemoryHistory();
        const { getByText } = renderWithGlobalContext(
            <Router history={history}>
                <Switch>
                    <Route exact path="/changePassword" component={ChangePassword} />
                    <Route exact path="/" component={Login} />
                </Switch>
            </Router>,
            customDeps
        );
        history.push("/changePassword");
        await waitForDomChange();
        const welcome = await waitForElement(() => getByText(PASSWORD_CHANGE_INVALID_HASH));
        expect(welcome).toBeTruthy();
    });
});
