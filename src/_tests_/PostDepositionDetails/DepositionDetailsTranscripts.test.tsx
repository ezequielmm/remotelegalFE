import { waitForElement, waitForDomChange, fireEvent, act } from "@testing-library/react";
import React from "react";
import uploadService from "../../services/UploadService";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as SIGN_UP_CONSTANTS from "../constants/signUp";
import * as TEST_CONSTANTS from "../constants/depositionDetails";
import DepositionDetailsTranscript from "../../routes/DepositionDetails/DepositionDetailsTranscript/DepositionDetailsTranscript";
import * as CONSTANTS from "../../constants/depositionDetails";
import getMockDeps from "../utils/getMockDeps";
import { getTranscriptFileList, getTranscriptFileListOnlyOne } from "../mocks/transcriptsFileList";
import downloadFile from "../../helpers/downloadFile";
import { wait } from "../../helpers/wait";
import "mutationobserver-shim";
import { rootReducer } from "../../state/GlobalState";

jest.mock("../../helpers/downloadFile", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("../../services/UploadService");

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ depositionID: "depoId" }),
}));

let customDeps;
beforeEach(() => {
    customDeps = getMockDeps();
    const uploadServiceMock = uploadService as jest.Mock;
    uploadServiceMock.mockImplementation((_, __, func) => {
        func({
            loaded: 1,
            total: 1,
        });
    });
});

describe("Deposition Details Transcripts", () => {
    it("show a title with CONSTANTS.DETAILS_TRANSCRIPT_TITLE constant", async () => {
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsTranscript />);
        expect(await waitForElement(() => expect(getByTestId("Transcript")))).toBeTruthy();
    });
    it("show UPLOAD button if user is admin", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByText } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                signalR: { signalR: null },
            },
        });
        await waitForDomChange();
        expect(queryByText(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_UPLOAD)).toBeTruthy();
    });
    it("show progress bar on uploading file", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        customDeps.apiService.getTokenSet = jest.fn().mockResolvedValue("");
        const { getByTestId, queryByText, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsTranscript />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                    signalR: { signalR: null },
                },
            }
        );
        const file = new File(["file"], "file.pdf", { type: "application/x-pdf" });

        await waitForDomChange();

        expect(queryByText(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_UPLOAD)).toBeTruthy();

        await act(async () => {
            await fireEvent.change(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_UPLOAD_BUTTON_TEST_ID), {
                target: { files: [file] },
            });
        });

        expect(queryByTestId(CONSTANTS.DETAILS_TRANSCRIPT_UPLOAD_PROGRESS_BAR_TEST_ID)).toBeInTheDocument();
    });

    it("show progress bar error on big files", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        customDeps.apiService.getTokenSet = jest.fn().mockResolvedValue("");
        const { getByTestId, queryByText, getByText } = renderWithGlobalContext(
            <DepositionDetailsTranscript />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                    signalR: { signalR: null },
                },
            }
        );
        const file = new File(["file"], "file.pdf", { type: "application/x-pdf" });
        Object.defineProperty(file, "size", { value: CONSTANTS.DEPOSITION_DETAILS_SUMMARY_FILE_SIZE_LIMIT + 1 });
        await waitForDomChange();
        expect(queryByText(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_UPLOAD)).toBeTruthy();
        act(() => {
            fireEvent.change(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_UPLOAD_BUTTON_TEST_ID), {
                target: { files: [file] },
            });
        });
        await waitForDomChange();
        getByText(CONSTANTS.DETAILS_EXHIBIT_FILE_EXCEEDS_LIMIT);
    });

    it("hide UPLOAD button if user is not admin", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUserNotAdmin());
        const { queryByText } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        await waitForDomChange();
        expect(queryByText(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_UPLOAD)).toBeFalsy();
    });
    it("show DELETE button only if user is admin and file is a transcription", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const mockDataTestId = `${getTranscriptFileListOnlyOne[0].id}_delete_icon`;
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                signalR: { signalR: null },
            },
        });
        await waitForDomChange();
        expect(getByTestId(mockDataTestId)).toBeTruthy();
    });
    it("shows transcript button disabled if no transcript is selected", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        await waitForDomChange();
        expect(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID)).toBeDisabled();
    });
    it("shows transcript button enabled if a transcript is selected", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByTestId, getAllByRole } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        await waitForDomChange();
        fireEvent.click(getAllByRole("checkbox")[0]);
        expect(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID)).toBeEnabled();
    });
    it("calls download file with the proper params when clicking download", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByTestId, getAllByRole } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        await waitForDomChange();
        fireEvent.click(getAllByRole("checkbox")[0]);
        fireEvent.click(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID));
        await wait(200);
        expect(customDeps.apiService.getDocumentsUrlList).toHaveBeenCalledWith(
            TEST_CONSTANTS.DEPOSITION_DETAILS_TRANSCRIPT_DOWNLOAD_RESPONSE_BODY
        );
        expect(downloadFile).toHaveBeenCalledWith(TEST_CONSTANTS.DEPOSITION_DETAILS_TRANSCRIPT_DOWNLOAD_FILE_URL);
    });
    it("shows error toast if download fails", async () => {
        customDeps.apiService.getDocumentsUrlList = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { getByTestId, getAllByRole, getByText } = renderWithGlobalContext(
            <DepositionDetailsTranscript />,
            customDeps
        );
        await waitForDomChange();
        fireEvent.click(getAllByRole("checkbox")[0]);
        fireEvent.click(getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_TEST_ID));
        await wait(200);
        expect(customDeps.apiService.getDocumentsUrlList).toHaveBeenCalledWith(
            TEST_CONSTANTS.DEPOSITION_DETAILS_TRANSCRIPT_DOWNLOAD_RESPONSE_BODY
        );
        expect(getByText(CONSTANTS.NETWORK_ERROR)).toBeInTheDocument();
    });
    it("hide Notify Parties button if user is not admin", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUserNotAdmin());
        const { queryByText } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        await waitForDomChange();
        expect(queryByText(CONSTANTS.DETAILS_TRANSCRIPT_NOTIFY_BUTTON_TEST_ID)).toBeFalsy();
    });
    it("show Notify Parties button if user is admin", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByTestId } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                signalR: { signalR: null },
            },
        });
        await waitForDomChange();
        expect(queryByTestId(CONSTANTS.DETAILS_TRANSCRIPT_NOTIFY_BUTTON_TEST_ID)).toBeTruthy();
    });
    it("The notify parties button shouldn't be disabled when only one record is in the list", async () => {
        const { queryByTestId } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                signalR: { signalR: null },
            },
        });
        await waitForDomChange();
        const notifyButton = queryByTestId(CONSTANTS.DETAILS_TRANSCRIPT_NOTIFY_BUTTON_TEST_ID);
        expect(notifyButton).not.toBeDisabled();
    });
    it("calls download file with the proper params when clicking download", async () => {
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps, {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name", isAdmin: true } },
                signalR: { signalR: null },
            },
        });
        await waitForDomChange();
        const notifyButton = getByTestId(CONSTANTS.DETAILS_TRANSCRIPT_NOTIFY_BUTTON_TEST_ID);
        fireEvent.click(notifyButton);
        await wait(200);
        expect(customDeps.apiService.notifyParties).toHaveBeenCalledWith(
            TEST_CONSTANTS.DEPOSITION_DETAILS_TRANSCRIPT_DOWNLOAD_RESPONSE_BODY.depositionID
        );
    });
    it("doesn´t show delete button if user is admin and file is not a transcription", async () => {
        const transcriptionWordFile = getTranscriptFileList()[0];
        transcriptionWordFile.documentType = "WordTranscript";
        customDeps.apiService.fetchTranscriptsFiles = jest.fn().mockResolvedValue([transcriptionWordFile]);
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const mockDataTestId = `${getTranscriptFileListOnlyOne[0].id}_delete_icon`;
        const { queryByTestId } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        await waitForDomChange();
        expect(queryByTestId(mockDataTestId)).toBeFalsy();
    });
});
