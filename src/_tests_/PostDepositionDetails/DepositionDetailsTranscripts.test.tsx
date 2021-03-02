import { waitForElement } from "@testing-library/react";
import React from "react";
import { wait } from "../../helpers/wait";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as SIGN_UP_CONSTANTS from "../constants/signUp";
import DepositionDetailsTranscript from "../../routes/DepositionDetails/DepositionDetailsTranscript/DepositionDetailsTranscript";
import * as CONSTANTS from "../../constants/depositionDetails";
import getMockDeps from "../utils/getMockDeps";

const customDeps = getMockDeps();

describe("Deposition Details Transcripts", () => {
    it("show a title with CONSTANTS.DETAILS_TRANSCRIPT_TITLE constant", async () => {
        const { getByTestId } = renderWithGlobalContext(<DepositionDetailsTranscript />);
        expect(await waitForElement(() => expect(getByTestId("Transcript")))).toBeTruthy();
    });
    it("hide UPLOAD button if user is not admin", () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUserNotAdmin());
        const { queryByText } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        expect(queryByText(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_UPLOAD)).toBeFalsy();
    });
    it("show UPLOAD button if user is admin", () => {
        customDeps.apiService.currentUser = jest.fn().mockResolvedValue(SIGN_UP_CONSTANTS.getUser1());
        const { queryByText } = renderWithGlobalContext(<DepositionDetailsTranscript />, customDeps);
        expect(queryByText(CONSTANTS.DETAILS_TRANSCRIPT_BUTTON_UPLOAD)).toBeFalsy();
    });
});
