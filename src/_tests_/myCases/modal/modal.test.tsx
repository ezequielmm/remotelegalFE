import React from "react";
import { render, waitForElement, fireEvent, waitForDomChange } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Modal from "../../../routes/myCases/components/CaseModal";
import { theme } from "../../../constants/styles/theme";
import * as CONSTANTS from "./constants/constants";
import * as AUTH from "../../mocks/Auth";

beforeEach(() => {
    jest.resetModules();
    process.env.REACT_APP_Auth_region = "eu-east-1";
    process.env.REACT_APP_Auth_userPoolId = "us-east-1_Testa1eI";
    process.env.REACT_APP_Auth_userPoolWebClientId = "720vhm6a065testm1hsps6vgtr";
    process.env.REACT_APP_BASE_BE_URL = "http://localhost:5000";
});

test("Inputs are validated onBlur on first load and the button is disabled", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
        <ThemeProvider theme={theme}>
            <Modal handleClose={jest.fn} fetchCases={jest.fn} open />
        </ThemeProvider>
    );
    const button = getByText(CONSTANTS.ADD_CASE_BUTTON);
    expect(button).toBeDisabled();
    const caseNameInput = getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
    fireEvent.change(caseNameInput, { target: { value: "" } });
    fireEvent.focus(caseNameInput);
    fireEvent.blur(caseNameInput);
    await waitForElement(() => getByText(CONSTANTS.CASE_NAME_ERROR_MESSAGE));
    fireEvent.change(caseNameInput, { target: { value: "test1" } });
    expect(queryByText(CONSTANTS.CASE_NAME_ERROR_MESSAGE)).toBeFalsy();
    expect(button).toBeEnabled();
});

test("fetch is called with the right parameters", async () => {
    AUTH.VALID();
    global.fetch = jest
        .fn()
        .mockImplementation(() =>
            Promise.resolve({ ok: true, json: () => ({}), headers: { get: () => "application/json" } })
        );
    const fetchCases = jest.fn();
    const handleClose = jest.fn();
    const { getByPlaceholderText, getByText, getByTestId } = render(
        <ThemeProvider theme={theme}>
            <Modal handleClose={handleClose} fetchCases={fetchCases} open />
        </ThemeProvider>
    );
    const button = getByText(CONSTANTS.ADD_CASE_BUTTON);
    const caseNameInput = getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
    const caseNumberInput = getByPlaceholderText(CONSTANTS.CASE_NUMBER_PLACEHOLDER);
    fireEvent.change(caseNameInput, { target: { value: "test1" } });
    fireEvent.change(caseNumberInput, { target: { value: "test1" } });
    fireEvent.click(button);
    await waitForDomChange();
    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BASE_BE_URL}/api/Cases`, {
        body: '{"name":"test1","caseNumber":"test1"}',
        headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: "Bearer test1" },
        method: "POST",
    });
    await waitForElement(() => getByText(CONSTANTS.NEW_CASE_COLLABORATORS_SUCCESFUL));
    await waitForElement(() => getByText(CONSTANTS.NEW_CASE_SUCCESFUL));
    await waitForElement(() => getByTestId("new_case_button"));
    fireEvent.click(getByTestId("new_case_button"));
    expect(fetchCases).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
});

test("Error is shown when fetch fails", async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.reject(Error("Error")));
    const fetchCases = jest.fn();
    const handleClose = jest.fn();
    const { getByPlaceholderText, getByText } = render(
        <ThemeProvider theme={theme}>
            <Modal handleClose={handleClose} fetchCases={fetchCases} open />
        </ThemeProvider>
    );
    const button = getByText(CONSTANTS.ADD_CASE_BUTTON);
    const caseNameInput = getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
    const caseNumberInput = getByPlaceholderText(CONSTANTS.CASE_NUMBER_PLACEHOLDER);
    fireEvent.change(caseNameInput, { target: { value: "test1" } });
    fireEvent.change(caseNumberInput, { target: { value: "test1" } });
    fireEvent.click(button);
    await waitForDomChange();
    await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
});
