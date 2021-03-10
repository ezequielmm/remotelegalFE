import { waitForDomChange, waitForElement } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { wait } from "../../helpers/wait";
import { Roles } from "../../models/participant";
import DepositionDetailsSummary from "../../routes/DepositionDetails/DepositionDetailsSummary/DepositionDetailsSummary";
import { rootReducer } from "../../state/GlobalState";
import {
    getCurrentDepositionNoParticipants,
    getCurrentDepositionOneCourtReporter,
    getCurrentDepositionTwoParticipants,
} from "../mocks/currentDeposition";
import { getTranscriptionsWithOffset } from "../mocks/transcription";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ depositionID: "test1234" }),
}));

const customDeps = getMockDeps();

describe("DepositionDetailsSummary -> RealTime", () => {
    it("shows spinner while transcriptions are being loaded", async () => {
        customDeps.apiService.getDepositionTranscriptionsWithOffsets = jest.fn().mockImplementation(async () => {
            await wait(100);
            return getTranscriptionsWithOffset();
        });
        const { getByTestId, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsSummary setActiveKey={jest.fn()} />,
            customDeps
        );
        expect(await waitForElement(() => expect(getByTestId("spinner")))).toBeTruthy();
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("spinner")).toBeFalsy());
    });
    it("shows transcriptions when joinDeposition returns a transcriptions list not empty", async () => {
        const { queryAllByTestId } = renderWithGlobalContext(<DepositionDetailsSummary setActiveKey={jest.fn()} />);
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryAllByTestId("transcription_text")).toBeTruthy());
        act(() => expect(queryAllByTestId("transcription_title")).toBeTruthy());
    });
    it("shows transcriptions with pause", async () => {
        const { queryByTestId } = renderWithGlobalContext(<DepositionDetailsSummary setActiveKey={jest.fn()} />);
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("transcription_paused")).toBeTruthy());
    });

    it("shows no transcriptions when when joinDeposition returns a transcriptions empty", async () => {
        customDeps.apiService.getDepositionTranscriptionsWithOffsets = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        const { queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsSummary setActiveKey={jest.fn()} />,
            customDeps
        );
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("transcription_text")).toBeFalsy());
        act(() => expect(queryByTestId("transcription_title")).toBeFalsy());
    });
});

describe("DepositionDetailsSummary -> Cards", () => {
    it("shows a card with the court reporter name", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
        const courtReportName = "Joe Doe";
        const { queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsSummary setActiveKey={jest.fn()} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    postDepo: {
                        ...rootReducer.initialState.postDepo,
                        currentDeposition: getCurrentDepositionOneCourtReporter(courtReportName),
                    },
                },
            }
        );
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("court_report_name")).toHaveTextContent(courtReportName));
    });

    it("shows a card with the invited parties count more than zero", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
        const { queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsSummary setActiveKey={jest.fn()} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    postDepo: {
                        ...rootReducer.initialState.postDepo,
                        currentDeposition: getCurrentDepositionTwoParticipants(),
                    },
                },
            }
        );
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("invited_parties_count")).toHaveTextContent("2"));
    });

    it("shows a card with the invited parties count equal to zero", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
        const { queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsSummary setActiveKey={jest.fn()} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    postDepo: {
                        ...rootReducer.initialState.postDepo,
                        currentDeposition: getCurrentDepositionNoParticipants(),
                    },
                },
            }
        );
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("invited_parties_count")).toHaveTextContent("0"));
    });

    it("shows a card with the entered exhibits count more than zero", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([
            {
                name: "File1.pdf",
                displayName: "File1.pdf",
                size: 1000,
                preSignedUrl: "",
                close: false,
            },
        ]);
        const { queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsSummary setActiveKey={jest.fn()} />,
            customDeps
        );
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("entered_exhibits_count")).toBeInTheDocument());
        act(() => expect(queryByTestId("entered_exhibits_count")).toHaveTextContent("1"));
    });

    it("shows a card with the entered exhibits count equal to zero", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getEnteredExhibits = jest.fn().mockResolvedValue([]);
        const { queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsSummary setActiveKey={jest.fn()} />,
            customDeps
        );
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("entered_exhibits_count")).toBeInTheDocument());
        act(() => expect(queryByTestId("entered_exhibits_count")).toHaveTextContent("0"));
    });

    it("shows a card with the entered exhibits count equal to zero when received an error", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getEnteredExhibits = jest.fn().mockRejectedValue(async () => {
            throw Error("Something wrong");
        });
        const { queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsSummary setActiveKey={jest.fn()} />,
            customDeps
        );
        await waitForDomChange();
        await wait(100);
        act(() => expect(queryByTestId("entered_exhibits_count")).toBeInTheDocument());
        act(() => expect(queryByTestId("entered_exhibits_count")).toHaveTextContent("0"));
    });
});
