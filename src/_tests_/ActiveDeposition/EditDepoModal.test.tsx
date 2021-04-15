import { waitForDomChange, fireEvent, waitForElement, act } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import moment from "moment-timezone";
import * as CONSTANTS from "../../constants/activeDepositionDetails";
import * as TEST_CONSTANTS from "../constants/activeDepositionDetails";
import { getDepositionWithOverrideValues } from "../constants/depositions";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import ActiveDepositionDetails from "../../routes/ActiveDepoDetails";

const customDeps = getMockDeps();

describe("Tests Edit Deposition Modal", () => {
    test("Shows toast when submitting", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_EDIT_DEPOSITION_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate, endDate: null });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.editDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const { getAllByTestId, getAllByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("pending");
        userEvent.click(options[2]);
        const confirmed = await waitForElement(() => getAllByText("Confirmed"));
        userEvent.click(confirmed[1]);
        fireEvent.click(getByTestId("false NO"));
        fireEvent.click(
            getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_REMOVE_FILE_TEST_ID)
        );
        expect(getByTestId("caption_input")).toBeInTheDocument();
        const file = new File(["file"], "file.pdf", { type: "application/pdf" });
        await act(async () => {
            await fireEvent.change(
                getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_UPLOAD_COMPONENT_DATA_TEST_ID),
                {
                    target: { files: [file] },
                }
            );
        });
        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_JOB), {
            target: { value: TEST_CONSTANTS.EXPECTED_EDIT_DEPOSITION_BODY.job },
        });

        fireEvent.change(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DETAILS), {
            target: { value: TEST_CONSTANTS.EXPECTED_EDIT_DEPOSITION_BODY.details },
        });
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        await waitForElement(() => getAllByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_SUCCESS_TOAST));
        expect(customDeps.apiService.editDeposition).toHaveBeenCalledWith(
            fullDeposition.id,
            { ...TEST_CONSTANTS.EXPECTED_EDIT_DEPOSITION_BODY, endDate: null },
            file,
            true
        );
    });
    test("validates that file is a not a PDF file", async () => {
        const fullDeposition = getDepositionWithOverrideValues();
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.editDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const { getAllByTestId, getByTestId, getByText } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        fireEvent.click(
            getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CAPTION_BUTTON_REMOVE_FILE_TEST_ID)
        );
        expect(getByTestId("caption_input")).toBeInTheDocument();
        const file = new File(["file"], "file.png", { type: "application/image" });
        await act(async () => {
            await fireEvent.change(
                getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_UPLOAD_COMPONENT_DATA_TEST_ID),
                {
                    target: { files: [file] },
                }
            );
        });

        expect(getByText(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_FILE_ERROR_MESSAGE)).toBeInTheDocument();
    });
    test("Shows error toast if fetch fails", async () => {
        const fullDeposition = getDepositionWithOverrideValues();
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.editDeposition = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        const { getAllByTestId, getAllByText, getByTestId } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        userEvent.click(getByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID));
        await waitForDomChange();
        await waitForElement(() => getAllByText(CONSTANTS.NETWORK_ERROR));
    });
    test("Show an invalid time label when the date is before startDate", async () => {
        const startDate = moment().add(1, "d").format(CONSTANTS.FORMAT_DATE);
        const newDate = moment().format(CONSTANTS.FORMAT_DATE);
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByTestId, queryByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const startDateInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DATE);
        await act(async () => {
            userEvent.click(startDateInput);
            await fireEvent.change(startDateInput, {
                target: { value: newDate },
            });
            await fireEvent.keyDown(startDateInput, { key: "enter", keyCode: 13 });
        });
        expect(queryByTestId(CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_START_TIME_TEST_ID)).toBeInTheDocument();
    });
    test("Show an invalid end time label when the end time is before start time", async () => {
        const { startDate } = getDepositionWithOverrideValues();
        const startTime = moment(startDate).add(10, "h").format(CONSTANTS.TIME_FORMAT);
        const endTime = moment(startDate).format(CONSTANTS.TIME_FORMAT);
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByTestId, queryByTestId, getAllByRole } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const startTimeInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_START_TIME_TEST_ID);
        const endTimeInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_END_TIME_TEST_ID);
        expect(startTimeInput).toBeInTheDocument();
        expect(endTimeInput).toBeInTheDocument();

        await act(async () => {
            userEvent.click(startTimeInput);
            await fireEvent.change(startTimeInput, {
                target: { value: startTime },
            });
        });
        await act(async () => {
            userEvent.click(endTimeInput);
            await fireEvent.change(endTimeInput, {
                target: { value: endTime },
            });
        });
        await act(async () => {
            const okButtonStartTimeInput = getAllByRole("button", { name: /ok/i })[0];
            userEvent.click(okButtonStartTimeInput);
            fireEvent.blur(startTimeInput);
        });
        await act(async () => {
            const okButtonEndTimeInput = getAllByRole("button", { name: /ok/i })[0];
            userEvent.click(okButtonEndTimeInput);
            fireEvent.blur(endTimeInput);
        });
        expect(queryByTestId(CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_END_TIME_TEST_ID)).toBeInTheDocument();
    });
    test("Submit button should be disabled with invalid date is entered ", async () => {
        const startDate = moment().add(1, "d").format(CONSTANTS.FORMAT_DATE);
        const newDate = moment().format(CONSTANTS.FORMAT_DATE);
        const fullDeposition = getDepositionWithOverrideValues({ startDate });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        const { getAllByTestId, queryByTestId } = renderWithGlobalContext(<ActiveDepositionDetails />, customDeps);
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const startDateInput = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_DATA_TEST_ID_DATE);
        await act(async () => {
            userEvent.click(startDateInput);
            await fireEvent.change(startDateInput, {
                target: { value: newDate },
            });
            await fireEvent.keyDown(startDateInput, { key: "enter", keyCode: 13 });
        });
        const submitButton = queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_CONFIRM_BUTTON_TEST_ID);
        expect(submitButton).toBeDisabled();
    });
});
