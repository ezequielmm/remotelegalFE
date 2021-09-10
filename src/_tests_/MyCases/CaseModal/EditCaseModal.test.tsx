import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import "mutationobserver-shim";
import * as CONSTANTS from "../../constants/cases";
import * as AUTH from "../../mocks/Auth";
import renderWithGlobalContext from "../../utils/renderWithGlobalContext";
import getMockDeps from "../../utils/getMockDeps";
import EditCaseModal from "../../../routes/MyCases/CaseModal/EditCaseModal";

let customDeps;

describe("CaseModel", () => {
    beforeEach(() => {
        jest.resetModules();
        customDeps = getMockDeps();
    });

    it("should validate inputs on blur on empty field and the button should be disabled", async () => {
        renderWithGlobalContext(
            <EditCaseModal handleClose={jest.fn} currentCase={CONSTANTS.getOneCase()[0]} fetchCases={jest.fn} open />
        );
        const caseNameInput = screen.getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
        fireEvent.change(caseNameInput, { target: { value: "" } });
        const button = screen.getByTestId(CONSTANTS.EDIT_CASE_BUTTON);
        expect(button).toBeDisabled();
        fireEvent.change(caseNameInput, { target: { value: "" } });
        fireEvent.focus(caseNameInput);
        fireEvent.blur(caseNameInput);

        await waitFor(() => screen.getByText(CONSTANTS.CASE_NAME_ERROR_MESSAGE));
        fireEvent.change(caseNameInput, { target: { value: "test1" } });
        expect(screen.queryByText(CONSTANTS.CASE_NAME_ERROR_MESSAGE)).toBeFalsy();
        expect(button).toBeEnabled();
    });

    it("should call edit and fetch with the right parameters", async () => {
        AUTH.VALID_WITH_REFRESH();
        customDeps.apiService.editCase = jest.fn().mockResolvedValue({});
        const fetchCases = jest.fn();
        const handleClose = jest.fn();
        renderWithGlobalContext(
            <EditCaseModal
                handleClose={handleClose}
                currentCase={CONSTANTS.getOneCase()[0]}
                fetchCases={fetchCases}
                open
            />,
            customDeps
        );
        const button = screen.getByTestId(CONSTANTS.EDIT_CASE_BUTTON);
        const caseNameInput = screen.getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
        const caseNumberInput = screen.getByPlaceholderText(CONSTANTS.CASE_NUMBER_PLACEHOLDER);
        fireEvent.change(caseNameInput, { target: { value: "test1" } });
        fireEvent.change(caseNumberInput, { target: { value: "test1" } });
        fireEvent.click(button);
        await waitFor(() => screen.getByText(CONSTANTS.EDIT_CASE_CONFIRM_TITLE));
        const editButton = screen.getByTestId("confirm_edit_case");
        fireEvent.click(editButton);

        await waitFor(() => {
            expect(customDeps.apiService.editCase).toHaveBeenCalledTimes(1);
            expect(customDeps.apiService.editCase).toHaveBeenCalledWith({
                caseObj: { caseNumber: "test1", name: "test1" },
                id: "646661736466",
            });

            expect(screen.getByText(CONSTANTS.EDIT_CASE_SUCCESSFUL)).toBeInTheDocument();
            expect(fetchCases).toHaveBeenCalled();
            expect(handleClose).toHaveBeenCalled();
        });
    });

    it("should display an error when fetch fails", async () => {
        AUTH.VALID_WITH_REFRESH();
        customDeps.apiService.editCase = jest.fn().mockRejectedValue(400);
        const fetchCases = jest.fn();
        const handleClose = jest.fn();
        renderWithGlobalContext(
            <EditCaseModal
                handleClose={handleClose}
                currentCase={CONSTANTS.getOneCase()[0]}
                fetchCases={fetchCases}
                open
            />,
            customDeps
        );
        const button = screen.getByTestId(CONSTANTS.EDIT_CASE_BUTTON);
        const caseNameInput = screen.getByPlaceholderText(CONSTANTS.CASE_NAME_PLACEHOLDER);
        const caseNumberInput = screen.getByPlaceholderText(CONSTANTS.CASE_NUMBER_PLACEHOLDER);
        fireEvent.change(caseNameInput, { target: { value: "test1" } });
        fireEvent.change(caseNumberInput, { target: { value: "test1" } });
        fireEvent.click(button);
        await waitFor(() => screen.getByText(CONSTANTS.EDIT_CASE_CONFIRM_TITLE));
        const editButton = screen.getByTestId("confirm_edit_case");
        fireEvent.click(editButton);
        await waitFor(() => screen.getByText(CONSTANTS.NETWORK_ERROR));
    });

    it("should update error status when modal closes", async () => {
        AUTH.VALID_WITH_REFRESH();
        customDeps.apiService.editCase = jest.fn().mockRejectedValue(400);
        const fetchCases = jest.fn();
        const handleClose = jest.fn();
        renderWithGlobalContext(
            <EditCaseModal
                handleClose={handleClose}
                currentCase={CONSTANTS.getOneCase()[0]}
                fetchCases={fetchCases}
                open
            />,
            customDeps
        );

        const saveButton = screen.getByTestId(CONSTANTS.EDIT_CASE_BUTTON);
        fireEvent.click(saveButton);
        await waitFor(() => screen.getByText(CONSTANTS.EDIT_CASE_CONFIRM_TITLE));
        const confirmButton = screen.getByTestId(CONSTANTS.EDIT_CASE_CONFIRM_BUTTON_ID);
        fireEvent.click(confirmButton);
        await waitFor(() => screen.getByText(CONSTANTS.NETWORK_ERROR));
        const cancelButton = screen.getByTestId(CONSTANTS.EDIT_CASE_CANCEL_BUTTON_ID);
        fireEvent.click(cancelButton);

        customDeps.apiService.editCase = jest.fn().mockRejectedValue(null);
        await waitFor(() => screen.getByText(CONSTANTS.EDIT_CASE_TITLE));
        const saveButton2 = screen.getByTestId(CONSTANTS.EDIT_CASE_BUTTON);
        fireEvent.click(saveButton2);
        await waitFor(() => screen.getByText(CONSTANTS.EDIT_CASE_CONFIRM_TITLE));

        expect(screen.queryByText(CONSTANTS.NETWORK_ERROR)).not.toBeInTheDocument();
    });
});
