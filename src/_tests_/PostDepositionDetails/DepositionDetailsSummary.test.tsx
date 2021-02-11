import { fireEvent, waitForDomChange, waitForElement } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { wait } from "../../helpers/wait";
import DepositionDetailsSummary from "../../routes/DepositionDetails/DepositionDetailsSummary/DepositionDetailsSummary";
import * as TRANSCRIPTIONS_MOCKS from "../mocks/transcription";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ depositionID: "test1234" }),
}));

const customDeps = getMockDeps();

describe("DepositionDetailsSummary -> RealTime", () => {
    it("shows spinner while transcriptions are being loaded", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockImplementation(async () => {
            await wait(100);
            return [];
        });
        const { getByTestId, queryByTestId } = renderWithGlobalContext(<DepositionDetailsSummary />, customDeps);
        expect(await waitForElement(() => expect(getByTestId("spinner")))).toBeTruthy();
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("spinner")).toBeFalsy());
    });
    it("shows transcriptions when joinDeposition returns a transcriptions list not empty", async () => {
        const { queryByTestId } = renderWithGlobalContext(<DepositionDetailsSummary />);
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("transcription_text")).toBeTruthy());
        act(() => expect(queryByTestId("transcription_title")).toBeTruthy());
    });
    it("shows transcriptions with pause", async () => {
        const { queryByTestId } = renderWithGlobalContext(<DepositionDetailsSummary />);
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("transcription_paused")).toBeTruthy());
    });

    it("shows no transcriptions when when joinDeposition returns a transcriptions empty", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        const { queryByTestId } = renderWithGlobalContext(<DepositionDetailsSummary />, customDeps);
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("transcription_text")).toBeFalsy());
        act(() => expect(queryByTestId("transcription_title")).toBeFalsy());
    });
});
