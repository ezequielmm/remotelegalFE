import React from "react";
import { waitForDomChange, waitForElement, fireEvent, waitFor, act } from "@testing-library/react";
import DepositionDetailsEnteredExhibits from "../../routes/DepositionDetails/DepositionDetailsEnteredExhibits/DepositionDetailsEnteredExhibits";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as CONSTANTS from "../../constants/depositionDetails";
import downloadFile from "../../helpers/downloadFile";
import { wait } from "../../helpers/wait";
import enteredExhibitsMock from "../mocks/EnteredExhibits";
import * as TEST_CONSTANTS from "../constants/depositionDetails";
import "mutationobserver-shim";
import fileUrlList from "../mocks/fileUrlList";

jest.mock("../../helpers/downloadFile", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ depositionID: "depoId" }),
}));

let customDeps;

describe("DepositionDetailsEnteredExhibits", () => {
    beforeEach(() => {
        customDeps = getMockDeps();
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue(enteredExhibitsMock);
    });
    it("show a title with DEPOSITION_DETAILS_ENTERED_EXHIBITS_TITLE constant", async () => {
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsEnteredExhibits />, customDeps);
        expect(await waitForElement(() => expect(getByTestId("entered_exhibits_title")))).toBeTruthy();
    });

    it("show a table with entered depositions table", async () => {
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsEnteredExhibits />, customDeps);
        expect(await waitForElement(() => expect(getByTestId("entered_exhibits_table")))).toBeTruthy();
    });
    it("shows entered exhibits download button disabled if no exhibit is selected", async () => {
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsEnteredExhibits />, customDeps);
        await waitForDomChange();
        expect(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID)).toBeDisabled();
    });
    it("shows transcript button enabled if a transcript is selected", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue(enteredExhibitsMock);
        const { getByTestId, getAllByRole } = renderWithGlobalContext(<DepositionDetailsEnteredExhibits />, customDeps);
        await waitForDomChange();
        fireEvent.click(getAllByRole("checkbox")[0]);
        expect(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID)).toBeEnabled();
    });
    it("calls download file with the proper params when clicking download", async () => {
        const { getByTestId, getAllByRole } = renderWithGlobalContext(<DepositionDetailsEnteredExhibits />, customDeps);
        await waitForDomChange();
        fireEvent.click(getAllByRole("checkbox")[0]);
        fireEvent.click(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID));
        await wait(200);
        expect(customDeps.apiService.getDocumentsUrlList).toHaveBeenCalledWith(
            TEST_CONSTANTS.DEPOSITION_DETAILS_EXHIBITS_DOWNLOAD_BODY
        );
        expect(downloadFile).toHaveBeenCalledWith(
            TEST_CONSTANTS.DEPOSITION_DETAILS_TRANSCRIPT_DOWNLOAD_FILE_URL,
            null,
            expect.any(Function)
        );
    });

    it("the download button should be disabled when the download is on progress", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue(enteredExhibitsMock);
        customDeps.apiService.getDocumentsUrlList = jest.fn().mockResolvedValue(fileUrlList);
        const { getByTestId, getAllByTestId, getAllByRole } = renderWithGlobalContext(
            <DepositionDetailsEnteredExhibits />,
            customDeps
        );
        (downloadFile as jest.Mock).mockImplementation(async (fileUrl, fileName, callback) => {
            return callback("pending");
        });
        await waitFor(() => expect(getAllByTestId("entered_exhibit_display_name")).toHaveLength(2));
        act(() => {
            fireEvent.click(getAllByRole("checkbox")[0]);
        });
        await waitFor(() => expect(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID)).toBeEnabled());
        act(() => {
            fireEvent.click(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID));
        });
        await wait(500);
        await waitFor(() => expect(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID)).toBeDisabled());
    });

    it("the download button should be disabled when the download has an error", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue(enteredExhibitsMock);
        customDeps.apiService.getDocumentsUrlList = jest.fn().mockResolvedValue(fileUrlList);
        const { getByTestId, getAllByTestId, getAllByRole } = renderWithGlobalContext(
            <DepositionDetailsEnteredExhibits />,
            customDeps
        );
        (downloadFile as jest.Mock).mockImplementation(async (fileUrl, fileName, callback) => {
            return callback("error");
        });
        await waitFor(() => expect(getAllByTestId("entered_exhibit_display_name")).toHaveLength(2));
        act(() => {
            fireEvent.click(getAllByRole("checkbox")[0]);
        });
        await waitFor(() => expect(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID)).toBeEnabled());
        act(() => {
            fireEvent.click(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID));
        });
        await wait(500);
        await waitFor(() => expect(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID)).toBeDisabled());
    });

    it("the download button should not be disabled when the download is completed", async () => {
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue(enteredExhibitsMock);
        customDeps.apiService.getDocumentsUrlList = jest.fn().mockResolvedValue(fileUrlList);
        const { getByTestId, getAllByTestId, getAllByRole } = renderWithGlobalContext(
            <DepositionDetailsEnteredExhibits />,
            customDeps
        );
        (downloadFile as jest.Mock).mockImplementation(async (fileUrl, fileName, callback) => {
            return callback("completed");
        });
        await waitFor(() => expect(getAllByTestId("entered_exhibit_display_name")).toHaveLength(2));
        act(() => {
            fireEvent.click(getAllByRole("checkbox")[0]);
        });
        await waitFor(() => expect(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID)).toBeEnabled());
        act(() => {
            fireEvent.click(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID));
        });
        await wait(500);
        await waitFor(() => expect(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID)).toBeEnabled());
    });

    it("shows error toast if download fails", async () => {
        customDeps.apiService.getDocumentsUrlList = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        const { getByTestId, getAllByRole, getByText } = renderWithGlobalContext(
            <DepositionDetailsEnteredExhibits />,
            customDeps
        );
        await waitForDomChange();
        fireEvent.click(getAllByRole("checkbox")[0]);
        fireEvent.click(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID));
        await wait(200);
        expect(customDeps.apiService.getDocumentsUrlList).toHaveBeenCalledWith(
            TEST_CONSTANTS.DEPOSITION_DETAILS_EXHIBITS_DOWNLOAD_BODY
        );
        expect(getByText(CONSTANTS.NETWORK_ERROR)).toBeInTheDocument();
    });
});
