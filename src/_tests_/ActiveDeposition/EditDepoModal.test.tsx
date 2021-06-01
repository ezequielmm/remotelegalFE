import { waitForDomChange, fireEvent, waitForElement, act } from "@testing-library/react";
import React from "react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import * as CONSTANTS from "../../constants/activeDepositionDetails";
import * as TEST_CONSTANTS from "../constants/activeDepositionDetails";
import { getDepositionWithOverrideValues } from "../constants/depositions";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import ActiveDepositionDetails from "../../routes/ActiveDepoDetails";
import { TimeZones, mapTimeZone } from "../../models/general";
import getModalTextContent from "../../routes/ActiveDepoDetails/helpers/getModalTextContent";
import { Status } from "../../components/StatusPill/StatusPill";

dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);
const customDeps = getMockDeps();

describe("Tests Edit Deposition Modal", () => {
    test("Shows toast when submitting", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_DEPOSITION_BODY;
        const fullDeposition = getDepositionWithOverrideValues({ startDate, endDate: null, status: "Pending" });
        customDeps.apiService.fetchDeposition = jest.fn().mockImplementation(async () => {
            return fullDeposition;
        });
        customDeps.apiService.editDeposition = jest.fn().mockImplementation(async () => {
            return {};
        });
        const modalText = getModalTextContent(Status.confirmed, fullDeposition);
        const { getAllByTestId, getAllByText, getByTestId, getByText } = renderWithGlobalContext(
            <ActiveDepositionDetails />,
            customDeps
        );
        await waitForDomChange();
        const editButton = getAllByTestId(CONSTANTS.DEPOSITION_CARD_DETAILS_EDIT_BUTTON_DATA_TEST_ID);
        fireEvent.click(editButton[0]);
        const options = getAllByText("Pending");
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
        expect(getByText(modalText.cancelButton)).toBeInTheDocument();
        expect(getByText(modalText.confirmButton)).toBeInTheDocument();
        expect(getByText(modalText.message)).toBeInTheDocument();
        expect(getByText(modalText.title)).toBeInTheDocument();
        fireEvent.click(getByText(modalText.confirmButton));
        await waitForDomChange();
        await waitForElement(() => getAllByText(CONSTANTS.DEPOSITION_DETAILS_CHANGE_TO_CONFIRM_EMAIL_SENT_TO_ALL));
        expect(customDeps.apiService.editDeposition).toHaveBeenCalledWith(
            fullDeposition.id,
            {
                ...TEST_CONSTANTS.EXPECTED_EDIT_DEPOSITION_BODY,
                endDate: null,
                startDate: dayjs(startDate).tz(mapTimeZone[TimeZones.ET]),
            },
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
    test("Show an invalid end time label when the end time is before start time", async () => {
        const startDate = new Date(new Date().getTime() + 30 * 60000);
        const endTime = dayjs(startDate).tz(mapTimeZone[TimeZones.ET]).subtract(15, "m").format(CONSTANTS.TIME_FORMAT);
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
            userEvent.click(endTimeInput);
            await fireEvent.change(endTimeInput, {
                target: { value: endTime },
            });
        });
        await act(async () => {
            const okButtonEndTimeInput = getAllByRole("button", { name: /ok/i })[0];
            userEvent.click(okButtonEndTimeInput);
            fireEvent.blur(endTimeInput);
        });
        expect(queryByTestId(CONSTANTS.DEPOSITIONS_DETAILS_EDIT_MODAL_INVALID_END_TIME_TEST_ID)).toBeInTheDocument();
    });

    test("Show an invalid start time label when the start is before start time", async () => {
        const { startDate } = TEST_CONSTANTS.EXPECTED_DEPOSITION_BODY;
        const startTime = dayjs(startDate).tz(mapTimeZone[TimeZones.ET]).add(6, "m").format(CONSTANTS.TIME_FORMAT);
        const endTime = dayjs(startDate).tz(mapTimeZone[TimeZones.ET]).format(CONSTANTS.TIME_FORMAT);
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
        expect(
            queryByTestId(CONSTANTS.DEPOSITION_DETAILS_EDIT_DEPOSITION_MODAL_START_TIME_TEST_ID)
        ).toBeInTheDocument();
    });
});
