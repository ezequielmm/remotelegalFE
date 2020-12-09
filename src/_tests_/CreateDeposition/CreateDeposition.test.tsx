import { fireEvent, waitForElement } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import moment from "moment-timezone";
import "mutationobserver-shim";
import React from "react";
import { act } from "react-dom/test-utils";
import * as TEST_CONSTANTS from "../constants/createDepositions";
import * as CONSTANTS from "../../constants/createDeposition";
import CreateDeposition from "../../routes/CreateDeposition";
import * as CASE_TEST_CONSTANTS from "../constants/cases";
import * as ERRORS_CONSTANTS from "../../constants/errors";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";

global.MutationObserver = window.MutationObserver;
const customDeps = getMockDeps();

describe("CreateDeposition", () => {
    it("shows a case name on the Select of CaseSection when it's selected", async () => {
        const { getByText, getAllByText, queryByText, deps } = renderWithGlobalContext(<CreateDeposition />);
        const caseSelect = await waitForElement(() => getByText(CONSTANTS.CASE_SELECT_PLACEHOLDER));
        expect(caseSelect).toBeEnabled();
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});
        await act(async () => {
            // focus and blur Select to trigger error
            await userEvent.click(caseSelect);
            await userEvent.click(caseSelect);
        });
        expect(queryByText(CONSTANTS.CASE_ERROR)).toBeTruthy();

        await act(async () => {
            // display select menu
            await userEvent.click(caseSelect);
        });

        const caseNames = await waitForElement(() => getAllByText(RegExp(`.${CASE_TEST_CONSTANTS.CASE_NAME}`, "i")));
        expect(caseNames.length).toBe(10);
        await act(async () => {
            // select a case from the menu
            await userEvent.click(caseNames[0]);
        });
        expect(queryByText(CONSTANTS.CASE_SELECT_PLACEHOLDER)).toBeFalsy();
        expect(queryByText(CONSTANTS.CASE_ERROR)).toBeFalsy();
    });

    it("trigger validations when blur/change inputs on WitnessesSection", async () => {
        const { getAllByPlaceholderText, queryByText, getAllByRole } = renderWithGlobalContext(<CreateDeposition />);
        // EMAIL VALIDATIONS
        const emailInput = getAllByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER)[1];
        await act(async () => {
            await fireEvent.change(emailInput, { target: { value: "a" } });
        });
        expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeFalsy();
        await act(async () => {
            await fireEvent.blur(emailInput);
        });
        expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeTruthy();
        await act(async () => {
            await fireEvent.change(emailInput, { target: { value: "a@a.a" } });
        });
        expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeFalsy();
        // PHONE VALIDATIONS
        const phoneInput = getAllByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER)[1];
        await act(async () => {
            await fireEvent.change(phoneInput, { target: { value: "0" } });
        });
        expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeFalsy();
        await act(async () => {
            await fireEvent.blur(phoneInput);
        });
        expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeTruthy();
        await act(async () => {
            await fireEvent.change(phoneInput, { target: { value: "311-222-2222" } });
        });
        expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeFalsy();
        // TIME VALIDATIONS
        const [startInput, endInput] = getAllByPlaceholderText(CONSTANTS.START_PLACEHOLDER);
        // Set start time empty and check for error
        await act(async () => {
            await fireEvent.change(startInput, { target: { value: "" } });
        });
        expect(queryByText(CONSTANTS.REQUIRED_TIME_ERROR)).toBeFalsy();
        await act(async () => {
            await fireEvent.blur(startInput);
        });
        expect(queryByText(CONSTANTS.REQUIRED_TIME_ERROR)).toBeTruthy();
        // Set start time with 12:30 AM and check for error
        await act(async () => {
            await userEvent.click(startInput);
            await fireEvent.change(startInput, { target: { value: "12:30 AM" } });
        });
        await act(async () => {
            const okButton = getAllByRole("button", { name: /ok/i })[0];
            expect(okButton).toBeEnabled();
            await userEvent.click(okButton);
            await fireEvent.keyDown(endInput, { key: "enter", keyCode: 13 });
        });

        // Set start time empty and check for error
        await act(async () => {
            await fireEvent.change(endInput, { target: { value: "12:30 AM" } });
        });
        expect(queryByText(CONSTANTS.INVALID_END_TIME_ERROR)).toBeFalsy();
        await act(async () => {
            await fireEvent.keyDown(endInput, { key: "enter", keyCode: 13 });
            await fireEvent.blur(endInput);
        });
        expect(queryByText(CONSTANTS.INVALID_END_TIME_ERROR)).toBeTruthy();
        // Set start time with 12:30 AM and check for error
        await act(async () => {
            await userEvent.click(endInput);
            await fireEvent.change(endInput, { target: { value: "01:30 AM" } });
        });
        await act(async () => {
            const okButton = getAllByRole("button", { name: /ok/i })[1];
            expect(okButton).toBeEnabled();
            await userEvent.click(okButton);
            await fireEvent.keyDown(endInput, { key: "enter", keyCode: 13 });
        });
        expect(queryByText(CONSTANTS.INVALID_END_TIME_ERROR)).toBeFalsy();
    });

    it("show a file name when file is selected", async () => {
        const { queryByText, getByTestId } = renderWithGlobalContext(<CreateDeposition />);
        const file = new File(["file"], "file.pdf", { type: "application/pdf" });
        const imageInput = await waitForElement(() => getByTestId("upload_button"));

        await act(async () => {
            await fireEvent.change(imageInput, { target: { files: [file] } });
        });

        expect(queryByText("file.pdf")).toBeTruthy();
    });

    it("trigger validations when blur/change inputs on RequesterSection", async () => {
        const { getAllByPlaceholderText, queryByText } = renderWithGlobalContext(<CreateDeposition />);

        // EMAIL VALIDATIONS
        const emailInput = getAllByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER)[1];
        await act(async () => {
            await fireEvent.change(emailInput, { target: { value: "a" } });
        });
        expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeFalsy();
        await act(async () => {
            await fireEvent.blur(emailInput);
        });
        expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeTruthy();
        await act(async () => {
            await fireEvent.change(emailInput, { target: { value: "" } });
        });
        expect(queryByText(CONSTANTS.EMAIL_REQUIRED_ERROR)).toBeTruthy();
        await act(async () => {
            await fireEvent.change(emailInput, { target: { value: "a@a.a" } });
        });
        expect(queryByText(CONSTANTS.EMAIL_ERROR)).toBeFalsy();
        // NAME VALIDATIONS
        const nameInput = getAllByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER)[0];
        await act(async () => {
            await fireEvent.change(nameInput, { target: { value: "" } });
        });
        expect(queryByText(CONSTANTS.NAME_REQUIRED_ERROR)).toBeFalsy();
        await act(async () => {
            await fireEvent.blur(nameInput);
        });
        expect(queryByText(CONSTANTS.NAME_REQUIRED_ERROR)).toBeTruthy();
        await act(async () => {
            await fireEvent.change(nameInput, { target: { value: "name" } });
        });
        expect(queryByText(CONSTANTS.NAME_REQUIRED_ERROR)).toBeFalsy();
        // PHONE VALIDATIONS
        const phoneInput = getAllByPlaceholderText(CONSTANTS.PHONE_PLACEHOLDER)[1];
        await act(async () => {
            await fireEvent.change(phoneInput, { target: { value: "0" } });
        });
        expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeFalsy();
        await act(async () => {
            await fireEvent.blur(phoneInput);
        });
        expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeTruthy();
        await act(async () => {
            await fireEvent.change(phoneInput, { target: { value: "311-222-2222" } });
        });
        expect(queryByText(CONSTANTS.PHONE_ERROR)).toBeFalsy();
    });

    it("create a deposition when click on submit button with all required fields filled and select SCHEDULE NEW DEPOSITION option", async () => {
        const {
            getAllByText,
            getByLabelText,
            getAllByRole,
            getByRole,
            getByPlaceholderText,
            getAllByPlaceholderText,
            getByText,
            getByTestId,
            queryByText,
            deps,
        } = renderWithGlobalContext(<CreateDeposition />);
        const { caseId, requesterName, requesterEmail, depositions } = TEST_CONSTANTS.getDepositions1();
        const scheduleDeposition = await waitForElement(() => getByTestId("create_deposition_button"));
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});
        await act(async () => {
            await userEvent.click(scheduleDeposition);
        });
        expect(deps.apiService.createDepositions).not.toHaveBeenCalled();
        // CASE SELECT
        const caseSelect = await waitForElement(() => getByText(CONSTANTS.CASE_SELECT_PLACEHOLDER));
        await act(async () => {
            await userEvent.click(caseSelect);
        });
        const caseNames = await waitForElement(() => getAllByText(RegExp(`.${CASE_TEST_CONSTANTS.CASE_NAME}`, "i")));
        await act(async () => {
            await userEvent.click(caseNames[0]);
        });
        // DATE FILL
        const dateInput = getByPlaceholderText(CONSTANTS.DATE_PLACEHOLDER);
        await act(async () => {
            await userEvent.click(dateInput);
        });
        await act(async () => {
            await userEvent.click(dateInput);
            await fireEvent.change(dateInput, {
                target: { value: moment(depositions[0].date).format(CONSTANTS.DATE_FORMAT) },
            });
            await fireEvent.keyDown(dateInput, { key: "enter", keyCode: 13 });
        });
        // TIMES FILL
        const [startInput, endInput] = getAllByPlaceholderText(CONSTANTS.START_PLACEHOLDER);
        await act(async () => {
            await userEvent.click(startInput);
            await fireEvent.change(startInput, {
                target: { value: moment(depositions[0].startTime).format(CONSTANTS.TIME_FORMAT) },
            });
        });
        await act(async () => {
            const okButton = getAllByRole("button", { name: /ok/i })[0];
            await userEvent.click(okButton);
        });
        await act(async () => {
            await userEvent.click(endInput);
            await fireEvent.change(endInput, {
                target: { value: moment(depositions[0].endTime).format(CONSTANTS.TIME_FORMAT) },
            });
        });
        await act(async () => {
            const okButton = getAllByRole("button", { name: /ok/i })[1];
            await userEvent.click(okButton);
        });
        // RADIO BUTTON FILL
        const radioButtonOption = getByLabelText("NO");
        await act(async () => {
            await userEvent.click(radioButtonOption);
        });
        // EMAIL FILL
        const emailInput = getAllByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER)[1];
        await act(async () => {
            await fireEvent.change(emailInput, { target: { value: requesterEmail } });
        });
        // NAME FILL
        const nameInput = getAllByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER)[0];
        await act(async () => {
            await fireEvent.change(nameInput, { target: { value: requesterName } });
        });
        await act(async () => {
            await userEvent.click(scheduleDeposition);
        });
        expect(deps.apiService.createDepositions).toHaveBeenCalledWith({
            depositionList: TEST_CONSTANTS.getMappedDepositions1(),
            files: [],
            caseId,
        });
        expect(queryByText(CONSTANTS.SUCCESS_DEPOSITION_TITLE)).toBeTruthy();
        await act(async () => {
            const newDepositionButton = getByRole("button", { name: CONSTANTS.SCHEDULE_NEW_DEPOSITION });
            await userEvent.click(newDepositionButton);
        });
        expect(queryByText(CONSTANTS.SUCCESS_DEPOSITION_TITLE)).toBeFalsy();
    });
    it("create a deposition when click on submit button with all required fields filled and select GO TO MY DEPOSITIONS option", async () => {
        const {
            getAllByText,
            getByLabelText,
            getAllByRole,
            getByRole,
            getByPlaceholderText,
            getAllByPlaceholderText,
            getByText,
            getByTestId,
            deps,
        } = renderWithGlobalContext(<CreateDeposition />);
        const { caseId, requesterName, requesterEmail, depositions } = TEST_CONSTANTS.getDepositions1();
        const scheduleDeposition = await waitForElement(() => getByTestId("create_deposition_button"));
        expect(deps.apiService.fetchCases).toHaveBeenCalledWith({});
        await act(async () => {
            await userEvent.click(scheduleDeposition);
        });
        expect(deps.apiService.createDepositions).not.toHaveBeenCalled();
        // CASE SELECT
        const caseSelect = await waitForElement(() => getByText(CONSTANTS.CASE_SELECT_PLACEHOLDER));
        await act(async () => {
            await userEvent.click(caseSelect);
        });
        const caseNames = await waitForElement(() => getAllByText(RegExp(`.${CASE_TEST_CONSTANTS.CASE_NAME}`, "i")));
        await act(async () => {
            await userEvent.click(caseNames[0]);
        });
        // DATE FILL
        const dateInput = getByPlaceholderText(CONSTANTS.DATE_PLACEHOLDER);
        await act(async () => {
            await userEvent.click(dateInput);
        });
        await act(async () => {
            await userEvent.click(dateInput);
            await fireEvent.change(dateInput, {
                target: { value: moment(depositions[0].date).format(CONSTANTS.DATE_FORMAT) },
            });
            await fireEvent.keyDown(dateInput, { key: "enter", keyCode: 13 });
        });
        // TIMES FILL
        const [startInput, endInput] = getAllByPlaceholderText(CONSTANTS.START_PLACEHOLDER);
        await act(async () => {
            await userEvent.click(startInput);
            await fireEvent.change(startInput, {
                target: { value: moment(depositions[0].startTime).format(CONSTANTS.TIME_FORMAT) },
            });
        });
        await act(async () => {
            const okButton = getAllByRole("button", { name: /ok/i })[0];
            await userEvent.click(okButton);
        });
        await act(async () => {
            await userEvent.click(endInput);
            await fireEvent.change(endInput, {
                target: { value: moment(depositions[0].endTime).format(CONSTANTS.TIME_FORMAT) },
            });
        });
        await act(async () => {
            const okButton = getAllByRole("button", { name: /ok/i })[1];
            await userEvent.click(okButton);
        });
        // RADIO BUTTON FILL
        const radioButtonOption = getByLabelText("NO");
        await act(async () => {
            await userEvent.click(radioButtonOption);
        });
        // EMAIL FILL
        const emailInput = getAllByPlaceholderText(CONSTANTS.EMAIL_PLACEHOLDER)[1];
        await act(async () => {
            await fireEvent.change(emailInput, { target: { value: requesterEmail } });
        });
        // NAME FILL
        const nameInput = getAllByPlaceholderText(CONSTANTS.NAME_PLACEHOLDER)[0];
        await act(async () => {
            await fireEvent.change(nameInput, { target: { value: requesterName } });
        });
        await act(async () => {
            await userEvent.click(scheduleDeposition);
        });
        expect(deps.apiService.createDepositions).toHaveBeenCalledWith({
            depositionList: TEST_CONSTANTS.getMappedDepositions1(),
            files: [],
            caseId,
        });
        await act(async () => {
            const goToDepositionsButton = getByRole("button", { name: CONSTANTS.GO_TO_DEPOSITIONS });
            await userEvent.click(goToDepositionsButton);
        });
        expect(global.window.location.pathname).toBe("/");
    });

    it("shows error and try again button when get an error on fetch", async () => {
        customDeps.apiService.fetchCases = jest.fn().mockImplementation(() => Promise.reject(Error("")));

        const { getByText, getByRole } = renderWithGlobalContext(<CreateDeposition />, customDeps);

        await waitForElement(() => getByText(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_TITLE));
        const refreshButton = getByRole("button", { name: new RegExp(ERRORS_CONSTANTS.FETCH_ERROR_MODAL_BUTTON, "i") });
        expect(customDeps.apiService.fetchCases).toHaveBeenCalledTimes(1);
        await act(async () => {
            await fireEvent.click(refreshButton);
        });
        expect(customDeps.apiService.fetchCases).toHaveBeenCalledTimes(2);
    });
});
