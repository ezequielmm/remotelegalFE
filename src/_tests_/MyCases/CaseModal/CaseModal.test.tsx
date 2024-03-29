import React from "react";
import { waitForElement, fireEvent, waitForDomChange } from "@testing-library/react";
import "mutationobserver-shim";
import Modal from "../../../routes/MyCases/CaseModal";
import * as CONSTANTS from "../../constants/cases";
import * as AUTH from "../../mocks/Auth";
import renderWithGlobalContext from "../../utils/renderWithGlobalContext";
import getMockDeps from "../../utils/getMockDeps";

let customDeps;

beforeEach(() => {
    customDeps = getMockDeps();
});

describe("CaseModel", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it("should validate inputs on blur on the first load and the button should be disabled", async () => {
        const { getByPlaceholderText, getByText, queryByText, getByTestId } = renderWithGlobalContext(
            <Modal handleClose={jest.fn} fetchCases={jest.fn} open />
        );
        const button = getByTestId(CONSTANTS.ADD_CASE_BUTTON);
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

    it("should call fetch with the right parameters", async () => {
        AUTH.VALID_WITH_REFRESH();

        const fetchCases = jest.fn();
        const handleClose = jest.fn();
        const { deps, getByPlaceholderText, getByText, getByTestId } = renderWithGlobalContext(
            <Modal handleClose={handleClose} fetchCases={fetchCases} open />
        );
        const button = getByTestId(CONSTANTS.ADD_CASE_BUTTON);
        const caseNameInput = getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
        const caseNumberInput = getByPlaceholderText(CONSTANTS.CASE_NUMBER_PLACEHOLDER);
        fireEvent.change(caseNameInput, { target: { value: "test1" } });
        fireEvent.change(caseNumberInput, { target: { value: "test1" } });
        fireEvent.click(button);
        await waitForDomChange();
        expect(deps.apiService.createCase).toHaveBeenCalledTimes(1);
        expect(deps.apiService.createCase).toHaveBeenCalledWith({ name: "test1", caseNumber: "test1" });
        await waitForElement(() => getByText(CONSTANTS.NEW_CASE_COLLABORATORS_SUCCESFUL));
        await waitForElement(() => getByText(CONSTANTS.NEW_CASE_SUCCESFUL));
        await waitForElement(() => getByTestId("new_case_button"));
        fireEvent.click(getByTestId("new_case_button"));
        expect(fetchCases).toHaveBeenCalled();
        expect(handleClose).toHaveBeenCalled();
    });

    it("should display an error when fetch fails", async () => {
        AUTH.VALID_WITH_REFRESH();
        customDeps.apiService.createCase = jest.fn().mockRejectedValue(400);
        const fetchCases = jest.fn();
        const handleClose = jest.fn();
        const { getByPlaceholderText, getByText, getByTestId } = renderWithGlobalContext(
            <Modal handleClose={handleClose} fetchCases={fetchCases} open />,
            customDeps
        );
        const button = getByTestId(CONSTANTS.ADD_CASE_BUTTON);
        const caseNameInput = getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
        const caseNumberInput = getByPlaceholderText(CONSTANTS.CASE_NUMBER_PLACEHOLDER);
        fireEvent.change(caseNameInput, { target: { value: "test1" } });
        fireEvent.change(caseNumberInput, { target: { value: "test1" } });
        fireEvent.click(button);
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
    });
});
