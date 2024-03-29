import { waitForDomChange, fireEvent, screen } from "@testing-library/react";
import React from "react";
import * as CONSTANTS from "../../constants/resetPassword";
import * as TEST_CONSTANTS from "../constants/resetPassword";
import ResetPassword from "../../routes/ResetPassword";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";
import { wait } from "../../helpers/wait";

const customDeps = getMockDeps();

describe("Reset Password", () => {
    it("expect button to be disabled", async () => {
        const { queryByRole } = renderWithGlobalContext(<ResetPassword />);
        const button = queryByRole("button", { name: CONSTANTS.RESET_PASSWORD });
        expect(button).toBeDisabled();
    });
    it("expect button to be disabled on wrong formatted email", async () => {
        const { queryByPlaceholderText, queryByRole } = renderWithGlobalContext(<ResetPassword />);
        const button = queryByRole("button", { name: CONSTANTS.RESET_PASSWORD });
        const emailInput = queryByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        fireEvent.change(emailInput, { target: { value: TEST_CONSTANTS.WRONG_FORMATTED_EMAIL } });
        expect(button).toBeDisabled();
    });
    it("expect to trigger error on wrong formatted email", async () => {
        const { queryByText, queryByPlaceholderText } = renderWithGlobalContext(<ResetPassword />);
        const emailInput = queryByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        fireEvent.change(emailInput, { target: { value: TEST_CONSTANTS.WRONG_FORMATTED_EMAIL } });
        fireEvent.blur(emailInput);
        const emailError = queryByText(CONSTANTS.INVALID_EMAIL_ERROR);
        expect(emailError).toBeTruthy();
    });
    it("expect button to be enabled on well formatted email", async () => {
        const { queryByPlaceholderText, queryByRole } = renderWithGlobalContext(<ResetPassword />);
        const button = queryByRole("button", { name: CONSTANTS.RESET_PASSWORD });
        const emailInput = queryByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        fireEvent.change(emailInput, { target: { value: TEST_CONSTANTS.WELL_FORMATTED_EMAIL } });
        expect(button).toBeEnabled();
    });
    it("expect success screen when submit well formatted email", async () => {
        const { queryByText, queryByPlaceholderText, queryByRole } = renderWithGlobalContext(<ResetPassword />);
        const button = queryByRole("button", { name: CONSTANTS.RESET_PASSWORD });
        const emailInput = queryByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        fireEvent.change(emailInput, { target: { value: TEST_CONSTANTS.WELL_FORMATTED_EMAIL } });
        fireEvent.click(button);
        await waitForDomChange();
        expect(queryByText(CONSTANTS.CHECK_YOUR_MAILBOX_TEXT)).toBeTruthy();
    });
    it("expect error alert when error on submit", async () => {
        customDeps.apiService.forgotPassword = jest.fn().mockRejectedValue(new Error(""));
        const { queryByText, queryByPlaceholderText, queryByRole } = renderWithGlobalContext(
            <ResetPassword />,
            customDeps
        );
        const button = queryByRole("button", { name: CONSTANTS.RESET_PASSWORD });
        const emailInput = queryByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        fireEvent.change(emailInput, { target: { value: TEST_CONSTANTS.WELL_FORMATTED_EMAIL } });
        fireEvent.click(button);
        await waitForDomChange();
        expect(queryByText(CONSTANTS.NETWORK_ERROR)).toBeTruthy();
    });
    it("expect the form to not be submitted until the user provides a valid email", async () => {
        renderWithGlobalContext(<ResetPassword />);
        const emailInput = screen.getByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER);
        fireEvent.change(emailInput, { target: { value: "" } });
        fireEvent.submit(screen.getAllByTestId(CONSTANTS.RESET_PASSWORD_FORM_ID)[0]);
        await wait(0);
        expect(screen.queryByText(CONSTANTS.CHECK_YOUR_MAILBOX_TEXT)).not.toBeInTheDocument();
    });
});
