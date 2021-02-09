import React from "react";
import { waitForDomChange, fireEvent, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Amplify from "aws-amplify";
import * as ERRORS from "../../constants/signUp";
import SignUp from "../../routes/SignUp";
import * as CONSTANTS from "../constants/signUp";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import ENV from "../../constants/env";
import getMockDeps from "../utils/getMockDeps";

const customDeps = getMockDeps();

beforeEach(() => {
    jest.resetModules();
    ENV.AUTH.REGION = "eu-east-1";
    ENV.AUTH.USER_POOL_ID = "us-east-1_Testa1eI";
    ENV.AUTH.USER_POOL_WEB_CLIENT_ID = "720vhm6a065testm1hsps6vgtr";
    ENV.API.URL = "http://localhost:5000";

    Amplify.configure({
        Auth: {
            region: ENV.AUTH.REGION,
            userPoolId: ENV.AUTH.USER_POOL_ID,
            userPoolWebClientId: ENV.AUTH.USER_POOL_WEB_CLIENT_ID,
        },
    });
});

describe("SignUp", () => {
    it("should validate inputs on blur on the first load and the button should be disabled", async () => {
        const { getByPlaceholderText, queryByText, getByRole } = renderWithGlobalContext(<SignUp />);
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

    it("should validate inputs onchange", async () => {
        const { getByPlaceholderText, queryByText, getByRole } = renderWithGlobalContext(<SignUp />);
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

    it("shouldn't display the password validation message with a valid password", async () => {
        const { getByPlaceholderText, queryByText } = renderWithGlobalContext(<SignUp />);
        const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        fireEvent.change(passwordInput, { target: { value: "Asdefgt1!" } });
        fireEvent.focus(passwordInput);
        fireEvent.blur(passwordInput);
        await waitForDomChange();
        expect(queryByText(ERRORS.PASSWORD_ERROR)).toBeFalsy();
    });

    it("should display the password confirmation validation with a invalid password", async () => {
        const { getByPlaceholderText, queryByText, getByText } = renderWithGlobalContext(<SignUp />);
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

    it("should do the phone validation properly", async () => {
        const { getByPlaceholderText, queryByText } = renderWithGlobalContext(<SignUp />);
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

    it("should display the Code sent screen when fetch works properly", async () => {
        const { deps, getByPlaceholderText, getByText, container } = renderWithGlobalContext(<SignUp />);
        const button = getByText("Create account");
        const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        const nameInput = getByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER);
        const lastNameInput = getByPlaceholderText(CONSTANTS.LAST_NAME_PLACEHOLDER);
        const confirmPasswordInput = getByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
        const phoneInput = getByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER);
        const checkBoxInput = container.getElementsByClassName("ant-checkbox-wrapper")[0];
        const companyNameInput = getByPlaceholderText(CONSTANTS.COMPANY_NAME_PLACEHOLDER);
        const companyAddressInput = getByPlaceholderText(CONSTANTS.COMPANY_ADDRESS_PLACEHOLDER);
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
        fireEvent.focus(companyNameInput);
        fireEvent.change(companyNameInput, { target: { value: "test" } });
        fireEvent.blur(companyNameInput);
        fireEvent.focus(companyAddressInput);
        fireEvent.change(companyAddressInput, { target: { value: "test" } });
        fireEvent.blur(companyAddressInput);
        fireEvent.click(checkBoxInput);
        expect(button).toBeEnabled();
        fireEvent.click(button);
        expect(deps.apiService.signUp).toHaveBeenCalledWith({
            firstName: "test",
            lastName: "test1",
            phoneNumber: "4444444444",
            password: "Asdfgh1!",
            emailAddress: "test@test1.com",
            companyName: "test",
            companyAddress: "test",
        });
        await waitForElement(() => getByText("Check your mailbox"));
        expect(getByText("test@test1.com")).toBeInTheDocument();
        expect(getByText("Didn’t get the email?")).toBeInTheDocument();
        expect(getByText("Click here to resend it")).toBeInTheDocument();
    });

    it("should display an error when fetch fails", async () => {
        customDeps.apiService.signUp = jest.fn().mockRejectedValue(400);

        const { getByPlaceholderText, getByText } = renderWithGlobalContext(<SignUp />, customDeps);
        const button = getByText("Create account");
        const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        const nameInput = getByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER);
        const lastNameInput = getByPlaceholderText(CONSTANTS.LAST_NAME_PLACEHOLDER);
        const confirmPasswordInput = getByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
        const phoneInput = getByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER);
        const checkBoxInput = getByText(CONSTANTS.CHECKBOX_INPUT);
        const companyNameInput = getByPlaceholderText(CONSTANTS.COMPANY_NAME_PLACEHOLDER);
        const companyAddressInput = getByPlaceholderText(CONSTANTS.COMPANY_ADDRESS_PLACEHOLDER);
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
        fireEvent.focus(companyNameInput);
        fireEvent.change(companyNameInput, { target: { value: "test" } });
        fireEvent.blur(companyNameInput);
        fireEvent.focus(companyAddressInput);
        fireEvent.change(companyAddressInput, { target: { value: "test" } });
        fireEvent.blur(companyAddressInput);
        userEvent.click(checkBoxInput);
        expect(button).toBeEnabled();
        fireEvent.click(button);
        expect(customDeps.apiService.signUp).toHaveBeenCalledWith({
            firstName: "test",
            lastName: "test1",
            phoneNumber: "4444444444",
            password: "Asdfgh1!",
            emailAddress: "test@test1.com",
            companyName: "test",
            companyAddress: "test",
        });
        await waitForElement(() => getByText(ERRORS.NETWORK_ERROR));
    });

    it("it should display Code error when fetch fails", async () => {
        customDeps.apiService.signUp = jest.fn().mockRejectedValue(409);
        const { getByPlaceholderText, getByText } = renderWithGlobalContext(<SignUp />, customDeps);
        const button = getByText("Create account");
        const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        const passwordInput = getByPlaceholderText(CONSTANTS.PASSWORD_PLACEHOLDER);
        const nameInput = getByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER);
        const lastNameInput = getByPlaceholderText(CONSTANTS.LAST_NAME_PLACEHOLDER);
        const confirmPasswordInput = getByPlaceholderText(CONSTANTS.CONFIRM_PASSWORD_PLACEHOLDER);
        const phoneInput = getByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER);
        const checkBoxInput = getByText(CONSTANTS.CHECKBOX_INPUT);
        const companyNameInput = getByPlaceholderText(CONSTANTS.COMPANY_NAME_PLACEHOLDER);
        const companyAddressInput = getByPlaceholderText(CONSTANTS.COMPANY_ADDRESS_PLACEHOLDER);
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
        fireEvent.focus(companyNameInput);
        fireEvent.change(companyNameInput, { target: { value: "test" } });
        fireEvent.blur(companyNameInput);
        fireEvent.focus(companyAddressInput);
        fireEvent.change(companyAddressInput, { target: { value: "test" } });
        fireEvent.blur(companyAddressInput);
        userEvent.click(checkBoxInput);
        expect(button).toBeEnabled();
        fireEvent.click(button);
        expect(customDeps.apiService.signUp).toHaveBeenCalledWith({
            firstName: "test",
            lastName: "test1",
            phoneNumber: "4444444444",
            password: "Asdfgh1!",
            emailAddress: "test@test1.com",
            companyName: "test",
            companyAddress: "test",
        });
        await waitForElement(() => getByText(ERRORS.WAITING_FOR_CODE));
    });
    it("it should pre-fill the email field with the passed email by parameter", async () => {
        customDeps.apiService.signUp = jest.fn().mockRejectedValue(409);
        const { getByPlaceholderText } = renderWithGlobalContext(
            <SignUp location={CONSTANTS.MOCKED_LOCATION} />,
            customDeps
        );
        const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        expect(emailInput.value).toEqual(CONSTANTS.MOCKED_EMAIL);
    });

    it("it should pre-fill the email field with an empty space if haven't any passed email by parameter", async () => {
        customDeps.apiService.signUp = jest.fn().mockRejectedValue(409);
        const { getByPlaceholderText } = renderWithGlobalContext(<SignUp />, customDeps);
        const emailInput = getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        expect(emailInput.value).toEqual("");
    });
});
