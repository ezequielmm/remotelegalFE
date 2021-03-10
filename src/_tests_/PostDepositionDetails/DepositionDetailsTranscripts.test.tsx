import { waitForElement, waitForDomChange } from "@testing-library/react";
import React from "react";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as SIGN_UP_CONSTANTS from "../constants/signUp";
import DepositionDetailsTranscript from "../../routes/DepositionDetails/DepositionDetailsTranscript/DepositionDetailsTranscript";
import * as CONSTANTS from "../../constants/depositionDetails";
import getMockDeps from "../utils/getMockDeps";
import { getTranscriptFileListOnlyOne } from "../mocks/transcriptsFileList";

const customDeps = getMockDeps();

describe("Deposition Details Transcripts", () => {
    it("show a title with CONSTANTS.DETAILS_TRANSCRIPT_TITLE constant", async () => {
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsTranscript />);
        expect(await waitForElement(() => expect(getByTestId("Transcript")))).toBeTruthy();
    });
    it("show UPLOAD button if user is admin", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByText } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        await waitForDomChange();
        expect(queryByText(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_UPLOAD)).toBeTruthy();
    });
    it("hide UPLOAD button if user is not admin", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUserNotAdmin());
        const { queryByText } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        await waitForDomChange();
        expect(queryByText(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_UPLOAD)).toBeFalsy();
    });
    it("show DELETE button only if user is admin", async () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const mockDataTestId = `${getTranscriptFileListOnlyOne[0].id}_delete_icon`;
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        await waitForDomChange();
        expect(getByTestId(mockDataTestId)).toBeTruthy();
    });
});
