import React from "react";
import { render, waitForDomChange, fireEvent, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Amplify from "aws-amplify";
import * as ERRORS from "../../routes/signup/constants/errors";
import SignUp from "../../routes/signup/signup";
import { theme } from "../../constants/styles/theme";
import * as CONSTANTS from "./constants/constants";

beforeEach(() => {
    jest.resetModules();
    process.env.REACT_APP_Auth_region = "eu-east-1";
    process.env.REACT_APP_Auth_userPoolId = "us-east-1_Testa1eI";
    process.env.REACT_APP_Auth_userPoolWebClientId = "720vhm6a065testm1hsps6vgtr";
    process.env.REACT_APP_BASE_BE_URL = "http://localhost:5000";

    Amplify.configure({
        Auth: {
            region: process.env.REACT_APP_Auth_region,
            userPoolId: process.env.REACT_APP_Auth_userPoolId,
            userPoolWebClientId: process.env.REACT_APP_Auth_userPoolWebClientId,
        },
    });
});

test("Inputs are validated onBlur on first load and the button is disabled", async () => {
    const { getByPlaceholderText, queryByText, getByRole } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByRole("button", { name: /Create account/i });
    expect(button).toBeDisabled();
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    const nameInput = getByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER);
    const lastNameInput = getByPlaceholderText(CONSTANTS.LAST_NAME_PLACEHOLDER);
    const confirmPasswordInput = getByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.focus(emailInput);
    fireEvent.focus(passwordInput);
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);
    await waitForDomChange();
    expect(queryByText(ERRORS.EMPTY_EMAIL_ERROR)).toBeTruthy();
    expect(queryByText(ERRORS.PASSWORD_ERROR)).toBeTruthy();
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.change(lastNameInput, { target: { value: "" } });
    expect(queryByText(ERRORS.LAST_NAME_ERROR)).toBeFalsy();
    expect(queryByText(ERRORS.FIRST_NAME_ERROR)).toBeFalsy();
    fireEvent.focus(nameInput);
    fireEvent.focus(lastNameInput);
    fireEvent.blur(nameInput);
    fireEvent.blur(lastNameInput);
    expect(queryByText(ERRORS.LAST_NAME_ERROR)).toBeTruthy();
    expect(queryByText(ERRORS.FIRST_NAME_ERROR)).toBeTruthy();
    fireEvent.change(confirmPasswordInput, { target: { value: "123" } });
    expect(queryByText(ERRORS.CONFIRM_PASSWORD_ERROR)).toBeFalsy();
    fireEvent.focus(confirmPasswordInput);
    fireEvent.blur(confirmPasswordInput);
    expect(queryByText(ERRORS.CONFIRM_PASSWORD_ERROR)).toBeTruthy();
});

test("Inputs are validated onChange", async () => {
    const { getByPlaceholderText, queryByText, getByRole } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByRole("button", { name: /Create account/i });
    expect(button).toBeDisabled();
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    const nameInput = getByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER);
    const lastNameInput = getByPlaceholderText(CONSTANTS.LAST_NAME_PLACEHOLDER);
    const confirmPasswordInput = getByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
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
    expect(queryByText(ERRORS.PASSWORD_ERROR)).toBeTruthy();
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);
    expect(queryByText(ERRORS.FIRST_NAME_ERROR)).toBeTruthy();
    fireEvent.change(lastNameInput, { target: { value: "" } });
    fireEvent.focus(lastNameInput);
    fireEvent.blur(lastNameInput);
    expect(queryByText(ERRORS.LAST_NAME_ERROR)).toBeTruthy();
    fireEvent.change(confirmPasswordInput, { target: { value: "aaa" } });
    fireEvent.focus(confirmPasswordInput);
    fireEvent.blur(confirmPasswordInput);
    expect(queryByText(ERRORS.CONFIRM_PASSWORD_ERROR)).toBeTruthy();
});

test("Password validation message doesn´t appear with a valid password", async () => {
    const { getByPlaceholderText, queryByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        </ThemeProvider>
    );
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    fireEvent.change(passwordInput, { target: { value: "Asdefgt1!" } });
    fireEvent.focus(passwordInput);
    fireEvent.blur(passwordInput);
    await waitForDomChange();
    expect(queryByText(ERRORS.PASSWORD_ERROR)).toBeFalsy();
});

test("Password confirmation validation works properly", async () => {
    const { getByPlaceholderText, queryByText, getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        </ThemeProvider>
    );
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    const confirmPasswordInput = getByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
    fireEvent.change(passwordInput, { target: { value: "aaa" } });
    fireEvent.focus(passwordInput);
    fireEvent.blur(passwordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: "aa" } });
    fireEvent.focus(confirmPasswordInput);
    fireEvent.blur(confirmPasswordInput);
    await waitForElement(() => getByText(ERRORS.CONFIRM_PASSWORD_ERROR));
    fireEvent.change(passwordInput, { target: { value: "aa" } });
    expect(queryByText(ERRORS.CONFIRM_PASSWORD_ERROR)).toBeFalsy();
});

test("Phone validation works properly", async () => {
    const { getByPlaceholderText, queryByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        </ThemeProvider>
    );
    const phoneInput = getByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER);
    fireEvent.change(phoneInput, { target: { value: "" } });
    fireEvent.focus(phoneInput);
    fireEvent.blur(phoneInput);
    expect(queryByText(ERRORS.PHONE_ERROR)).toBeFalsy();
    fireEvent.change(phoneInput, { target: { value: "12345" } });
    expect(queryByText(ERRORS.PHONE_ERROR)).toBeTruthy();
    fireEvent.change(phoneInput, { target: { value: "4444444444" } });
    await waitForDomChange();
    expect(queryByText(ERRORS.PHONE_ERROR)).toBeFalsy();
});

test("Code sent screen shows when fetch works properly", async () => {
    global.fetch = jest
        .fn()
        .mockImplementation(() =>
            Promise.resolve({ ok: true, json: () => ({}), headers: { get: () => "application/json" } })
        );

    const { getByPlaceholderText, getByText, container } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByText("Create account");
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    const nameInput = getByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER);
    const lastNameInput = getByPlaceholderText(CONSTANTS.LAST_NAME_PLACEHOLDER);
    const confirmPasswordInput = getByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
    const phoneInput = getByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER);
    const checkBoxInput = container.getElementsByClassName("ant-checkbox-wrapper")[0];
    fireEvent.focus(phoneInput);
    fireEvent.change(phoneInput, { target: { value: "4444444444" } });
    fireEvent.blur(phoneInput);
    fireEvent.focus(emailInput);
    fireEvent.change(emailInput, { target: { value: "test@test1.com" } });
    fireEvent.blur(emailInput);
    fireEvent.focus(nameInput);
    fireEvent.change(nameInput, { target: { value: "test" } });
    fireEvent.blur(nameInput);
    fireEvent.focus(lastNameInput);
    fireEvent.change(lastNameInput, { target: { value: "test1" } });
    fireEvent.blur(lastNameInput);
    fireEvent.focus(confirmPasswordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: "Asdfgh1!" } });
    fireEvent.blur(confirmPasswordInput);
    fireEvent.change(passwordInput, { target: { value: "Asdfgh1!" } });
    fireEvent.blur(passwordInput);
    fireEvent.click(checkBoxInput);
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BASE_BE_URL}/api/Users`, {
        body:
            '{"firstName":"test","lastName":"test1","phoneNumber":"4444444444","password":"Asdfgh1!","emailAddress":"test@test1.com"}',
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        method: "POST",
    });
    await waitForElement(() => getByText("Check your mailbox"));
    expect(getByText("test@test1.com")).toBeInTheDocument();
    expect(getByText("Didn’t get the email?")).toBeInTheDocument();
    expect(getByText("Click here to resend it")).toBeInTheDocument();
});

test("Error shows when fetch fails", async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.reject(Error("")));

    const { getByPlaceholderText, getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByText("Create account");
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    const nameInput = getByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER);
    const lastNameInput = getByPlaceholderText(CONSTANTS.LAST_NAME_PLACEHOLDER);
    const confirmPasswordInput = getByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
    const phoneInput = getByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER);
    const checkBoxInput = getByText(CONSTANTS.CHECKBOX_INPUT);
    fireEvent.focus(phoneInput);
    fireEvent.change(phoneInput, { target: { value: "4444444444" } });
    fireEvent.blur(phoneInput);
    fireEvent.focus(emailInput);
    fireEvent.change(emailInput, { target: { value: "test@test1.com" } });
    fireEvent.blur(emailInput);
    fireEvent.focus(nameInput);
    fireEvent.change(nameInput, { target: { value: "test" } });
    fireEvent.blur(nameInput);
    fireEvent.focus(lastNameInput);
    fireEvent.change(lastNameInput, { target: { value: "test1" } });
    fireEvent.blur(lastNameInput);
    fireEvent.focus(confirmPasswordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: "Asdfgh1!" } });
    fireEvent.blur(confirmPasswordInput);
    fireEvent.change(passwordInput, { target: { value: "Asdfgh1!" } });
    fireEvent.blur(passwordInput);
    userEvent.click(checkBoxInput);
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BASE_BE_URL}/api/Users`, {
        body:
            '{"firstName":"test","lastName":"test1","phoneNumber":"4444444444","password":"Asdfgh1!","emailAddress":"test@test1.com"}',
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        method: "POST",
    });
    await waitForElement(() => getByText(ERRORS.NETWORK_ERROR));
});

test("Code error shows when fetch fails", async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ status: 409, headers: { get: () => "" } }));

    const { getByPlaceholderText, getByText } = render(
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>
        </ThemeProvider>
    );
    const button = getByText("Create account");
    const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
    const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
    const nameInput = getByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER);
    const lastNameInput = getByPlaceholderText(CONSTANTS.LAST_NAME_PLACEHOLDER);
    const confirmPasswordInput = getByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
    const phoneInput = getByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER);
    const checkBoxInput = getByText(CONSTANTS.CHECKBOX_INPUT);
    fireEvent.focus(phoneInput);
    fireEvent.change(phoneInput, { target: { value: "4444444444" } });
    fireEvent.blur(phoneInput);
    fireEvent.focus(emailInput);
    fireEvent.change(emailInput, { target: { value: "test@test1.com" } });
    fireEvent.blur(emailInput);
    fireEvent.focus(nameInput);
    fireEvent.change(nameInput, { target: { value: "test" } });
    fireEvent.blur(nameInput);
    fireEvent.focus(lastNameInput);
    fireEvent.change(lastNameInput, { target: { value: "test1" } });
    fireEvent.blur(lastNameInput);
    fireEvent.focus(confirmPasswordInput);
    fireEvent.change(confirmPasswordInput, { target: { value: "Asdfgh1!" } });
    fireEvent.blur(confirmPasswordInput);
    fireEvent.change(passwordInput, { target: { value: "Asdfgh1!" } });
    fireEvent.blur(passwordInput);
    userEvent.click(checkBoxInput);
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BASE_BE_URL}/api/Users`, {
        body:
            '{"firstName":"test","lastName":"test1","phoneNumber":"4444444444","password":"Asdfgh1!","emailAddress":"test@test1.com"}',
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        method: "POST",
    });
    await waitForElement(() => getByText(ERRORS.WAITING_FOR_CODE));
});
