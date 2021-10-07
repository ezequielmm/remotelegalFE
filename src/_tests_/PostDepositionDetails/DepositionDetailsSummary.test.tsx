import { waitForDomChange, waitForElement, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";
import { wait } from "../../helpers/wait";
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
import "mutationobserver-shim";
import * as CONSTANTS from "../../constants/depositionDetails";
import { Roles } from "../../models/participant";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ depositionID: "test1234" }),
}));

let customDeps;
beforeEach(() => {
    customDeps = getMockDeps();
});

describe("DepositionDetailsSummary -> RealTime", () => {
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");

    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, value: 50 });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, value: 50 });
    });

    afterAll(() => {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", originalOffsetHeight);
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffsetWidth);
    });

    it("shows spinner while transcriptions are being loaded", async () => {
        customDeps.apiService.getDepositionTranscriptionsWithOffsets = jest.fn().mockImplementation(async () => {
            await wait(100);
            return getTranscriptionsWithOffset();
        });
        const { getByTestId, queryByTestId } = renderWithGlobalContext(
            <DepositionDetailsSummary setActiveKey={jest.fn()} />,
            customDeps
        );
        await waitForElement(() => getByTestId("spinner"));
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

    it("shows no transcriptions when joinDeposition returns a transcriptions empty", async () => {
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
                    user: {
                        currentUser: { ...rootReducer.initialState.user.currentUser, id: "2", isAdmin: true },
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
        customDeps.apiService.fetchParticipants = jest
            .fn()
            .mockResolvedValue(getCurrentDepositionTwoParticipants().participants);
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
                    user: {
                        currentUser: { ...rootReducer.initialState.user.currentUser, id: "2", isAdmin: true },
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
        customDeps.apiService.fetchParticipants = jest.fn().mockResolvedValue([]);
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
                    user: {
                        currentUser: { ...rootReducer.initialState.user.currentUser, id: "2", isAdmin: true },
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

    test.each`
        idUser | isUserAdmin | idCourtReporter | isVideoRecordingNeeded | isHasToAllowDownload | description
        ${"1"} | ${true}     | ${"1"}          | ${true}                | ${true}              | ${"show download recording if user is admin no matter what case 1"}
        ${"2"} | ${true}     | ${"1"}          | ${true}                | ${true}              | ${"show download recording if user is admin no matter what case 2"}
        ${"1"} | ${true}     | ${"1"}          | ${false}               | ${true}              | ${"show download recording if user is admin no matter what case 3"}
        ${"2"} | ${true}     | ${"1"}          | ${false}               | ${true}              | ${"show download recording if user is admin no matter what case 4"}
        ${"1"} | ${false}    | ${"1"}          | ${true}                | ${true}              | ${"show download recording if user is not admin but is court reporter with video recording needed"}
        ${"1"} | ${false}    | ${"1"}          | ${false}               | ${true}              | ${"show download recording if user is not admin but is court reporter with video recording NOT needed"}
        ${"1"} | ${false}    | ${"2"}          | ${true}                | ${true}              | ${"show download recording if user is not admin nor court reporter but video recording is needed"}
        ${"1"} | ${false}    | ${"2"}          | ${false}               | ${false}             | ${"not show download recording if user is not admin nor court reporter and video recording NOT needed"}
    `(
        "it should $description",
        async ({ idUser, isUserAdmin, idCourtReporter, isVideoRecordingNeeded, isHasToAllowDownload }) => {
            customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
            customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
            customDeps.apiService.getEnteredExhibits = jest.fn().mockRejectedValue(async () => {
                throw Error("Something wrong");
            });
            renderWithGlobalContext(<DepositionDetailsSummary setActiveKey={jest.fn()} />, customDeps, {
                ...rootReducer,
                initialState: {
                    postDepo: {
                        ...rootReducer.initialState.postDepo,
                        currentDeposition: {
                            ...getCurrentDepositionNoParticipants(),
                            isVideoRecordingNeeded,
                            participants: [
                                {
                                    email: "email@email.com",
                                    name: "name1",
                                    role: Roles.courtReporter,
                                    phone: "1234",
                                    user: {
                                        id: idCourtReporter,
                                        emailAddress: "email@email.com",
                                        firstName: "name",
                                        lastName: "name",
                                    },
                                },
                            ],
                        },
                    },
                    user: {
                        currentUser: { ...rootReducer.initialState.user.currentUser, id: idUser, isAdmin: isUserAdmin },
                    },
                },
            });
            if (isHasToAllowDownload) {
                await waitFor(() =>
                    expect(
                        screen.getByTestId(CONSTANTS.DEPOSITION_DETAILS_SUMMARY_DOWNLOAD_RECORDING_TITLE)
                    ).toBeInTheDocument()
                );
            } else {
                await waitFor(() =>
                    expect(
                        screen.queryAllByTestId(CONSTANTS.DEPOSITION_DETAILS_SUMMARY_DOWNLOAD_RECORDING_TITLE).length
                    ).toBe(0)
                );
            }
        }
    );
});
