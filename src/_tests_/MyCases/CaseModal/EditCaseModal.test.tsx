import React from "react";
import { waitForElement, fireEvent, waitForDomChange } from "@testing-library/react";
import "mutationobserver-shim";
import * as CONSTANTS from "../../constants/cases";
import * as AUTH from "../../mocks/Auth";
import renderWithGlobalContext from "../../utils/renderWithGlobalContext";
import ENV from "../../../constants/env";
import getMockDeps from "../../utils/getMockDeps";
import EditCaseModal from "../../../routes/MyCases/CaseModal/EditCaseModal";

const customDeps = getMockDeps();

describe("CaseModel", () => {
    beforeEach(() => {
        jest.resetModules();
        ENV.AUTH.REGION = "eu-east-1";
        ENV.AUTH.USER_POOL_ID = "us-east-1_Testa1eI";
        ENV.AUTH.USER_POOLWEBCLIENTID = "720vhm6a065testm1hsps6vgtr";
        ENV.API.URL = "http://localhost:5000";
    });

    it("should validate inputs on blur on empty field and the button should be disabled", async () => {
        const { getByPlaceholderText, getByText, queryByText, getByTestId } = renderWithGlobalContext(
            <EditCaseModal handleClose={jest.fn} currentCase={CONSTANTS.getOneCase()[0]} fetchCases={jest.fn} open />
        );
        const caseNameInput = getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
        fireEvent.change(caseNameInput, { target: { value: "" } });
        const button = getByTestId(CONSTANTS.EDIT_CASE_BUTTON);
        expect(button).toBeDisabled();
        fireEvent.change(caseNameInput, { target: { value: "" } });
        fireEvent.focus(caseNameInput);
        fireEvent.blur(caseNameInput);
        await waitForElement(() => getByText(CONSTANTS.CASE_NAME_ERROR_MESSAGE));
        fireEvent.change(caseNameInput, { target: { value: "test1" } });
        expect(queryByText(CONSTANTS.CASE_NAME_ERROR_MESSAGE)).toBeFalsy();
        expect(button).toBeEnabled();
    });

    it("should call edit and fetch with the right parameters", async () => {
        AUTH.VALID_WITH_REFRESH();
        customDeps.apiService.editCase = jest.fn().mockResolvedValue({});
        const fetchCases = jest.fn();
        const handleClose = jest.fn();
        const { getByPlaceholderText, getByText, getByTestId } = renderWithGlobalContext(
            <EditCaseModal
                handleClose={handleClose}
                currentCase={CONSTANTS.getOneCase()[0]}
                fetchCases={fetchCases}
                open
            />,
            customDeps
        );
        const button = getByTestId(CONSTANTS.EDIT_CASE_BUTTON);
        const caseNameInput = getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
        const caseNumberInput = getByPlaceholderText(CONSTANTS.CASE_NUMBER_PLACEHOLDER);
        fireEvent.change(caseNameInput, { target: { value: "test1" } });
        fireEvent.change(caseNumberInput, { target: { value: "test1" } });
        fireEvent.click(button);
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.EDIT_CASE_CONFIRM_TITLE));
        const editButton = getByTestId("confirm_edit_case");
        fireEvent.click(editButton);
        await waitForDomChange();

        expect(customDeps.apiService.editCase).toHaveBeenCalledTimes(1);
        expect(customDeps.apiService.editCase).toHaveBeenCalledWith({
            caseObj: { caseNumber: "test1", name: "test1" },
            id: "646661736466",
        });
        await waitForDomChange();
        expect(getByText(CONSTANTS.EDIT_CASE_SUCCESSFUL)).toBeInTheDocument();

        expect(fetchCases).toHaveBeenCalled();
        expect(handleClose).toHaveBeenCalled();
    });

    it("should display an error when fetch fails", async () => {
        AUTH.VALID_WITH_REFRESH();
        customDeps.apiService.editCase = jest.fn().mockRejectedValue(400);
        const fetchCases = jest.fn();
        const handleClose = jest.fn();
        const { getByPlaceholderText, getByText, getByTestId } = renderWithGlobalContext(
            <EditCaseModal
                handleClose={handleClose}
                currentCase={CONSTANTS.getOneCase()[0]}
                fetchCases={fetchCases}
                open
            />,
            customDeps
        );
        const button = getByTestId(CONSTANTS.EDIT_CASE_BUTTON);
        const caseNameInput = getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
        const caseNumberInput = getByPlaceholderText(CONSTANTS.CASE_NUMBER_PLACEHOLDER);
        fireEvent.change(caseNameInput, { target: { value: "test1" } });
        fireEvent.change(caseNumberInput, { target: { value: "test1" } });
        fireEvent.click(button);
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.EDIT_CASE_CONFIRM_TITLE));
        const editButton = getByTestId("confirm_edit_case");
        fireEvent.click(editButton);
        await waitForDomChange();
        await waitForElement(() => getByText(CONSTANTS.NETWORK_ERROR));
    });
});
