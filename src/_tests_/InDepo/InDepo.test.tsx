import { fireEvent, waitFor, waitForDomChange, waitForElement, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import AudioRecorder from "audio-recorder-polyfill";
import React from "react";
import { act } from "react-dom/test-utils";
import { Route, Switch } from "react-router-dom";
import * as rdd from "react-device-detect";

import * as MODULE_CONSTANTS from "../../constants/inDepo";
import InDepo from "../../routes/InDepo";
import * as TRANSCRIPTIONS_MOCKS from "../mocks/transcription";
import * as TESTS_CONSTANTS from "../constants/InDepo";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import { wait } from "../../helpers/wait";
import { rootReducer } from "../../state/GlobalState";
import dataTrackMock from "../mocks/dataTrack";
import getParticipant from "../mocks/participant";
import { currentExhibit } from "../mocks/currentExhibit";
import * as AUTH from "../mocks/Auth";
import { getUserDepoStatusWithParticipantAdmitted } from "../constants/preJoinDepo";
import "mutationobserver-shim";
import { DevicesStatus } from "../../constants/TroubleShootUserDevices";
import ProtectedRoute from "../../components/ProtectedRoute";
import ORIENTATION_STATE from "../../types/orientation";
import { theme } from "../../constants/styles/theme";

jest.mock("@microsoft/signalr");
const mockEnumerateDevices = jest.fn();

jest.mock("@twilio/conversations", () => {
    return jest.fn().mockImplementation(() => ({
        Client: {
            create: jest.fn().mockResolvedValue({
                getConversationByUniqueName: jest.fn().mockResolvedValue({
                    sendMessage: jest.fn(),
                }),
                getMessages: jest.fn().mockResolvedValue({ items: [] }),
                on: jest.fn(),
                off: jest.fn(),
            }),
        },
    }));
});

jest.mock("audio-recorder-polyfill");

(global.navigator as any).mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(true),
    enumerateDevices: mockEnumerateDevices,
};

let customDeps;
const history = createMemoryHistory();

const PreDepoRoute = () => <div>PRE_DEPO</div>;
const WaitingRoomRoute = () => <div>WAITING ROOM</div>;

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

// TODO: Find a better way to mock Twilio (eg, adding it to DI system)
const mockVideoTracks = jest.fn();
const mockAudioTracks = jest.fn();
const mockVideoLogger = jest.fn();
jest.mock("twilio-video", () => ({
    ...(jest.requireActual("twilio-video") as any),
    LocalDataTrack: function dataTrack() {
        return { send: jest.fn() };
    },
    Logger: {
        getLogger: () => mockVideoLogger(),
    },
    createLocalVideoTrack: (args) => mockVideoTracks(args),
    createLocalAudioTrack: (args) => mockAudioTracks(args),
    connect: async () => ({
        on: jest.fn(),
        off: jest.fn(),
        localParticipant: {
            videoTracks: new Map().set("item1", {
                track: {
                    kind: "video",
                    attach: jest.fn(),
                    detach: jest.fn(),
                    isEnabled: true,
                    disable: jest.fn(),
                    enable: jest.fn(),
                },
            }),
            audioTracks: new Map().set("item2", {
                track: {
                    kind: "audio",
                    attach: jest.fn(),
                    detach: jest.fn(),
                    isEnabled: true,
                    disable: jest.fn(),
                    enable: jest.fn(),
                },
            }),
            dataTracks: new Map().set("item3", {
                track: {
                    send: jest.fn(),
                    on: jest.fn(),
                    off: jest.fn(),
                },
            }),
            on: jest.fn(),
            identity: JSON.stringify({
                name: "test1234",
                role: "Attorney",
                email: "test@test.com",
            }),
            removeAllListeners: jest.fn(),
        },
        participants: new Map().set("item1", {
            videoTracks: new Map().set("item1", {
                track: {
                    kind: "video",
                    attach: jest.fn(),
                    detach: jest.fn(),
                    isEnabled: true,
                    disable: jest.fn(),
                    enable: jest.fn(),
                },
            }),
            audioTracks: new Map().set("item2", {
                track: {
                    kind: "audio",
                    attach: jest.fn(),
                    detach: jest.fn(),
                    isEnabled: true,
                    disable: jest.fn(),
                    enable: jest.fn(),
                },
            }),
            dataTracks: new Map().set("item3", {
                track: {
                    send: jest.fn(),
                    on: jest.fn(),
                    off: jest.fn(),
                },
            }),
            on: jest.fn(),
            identity: JSON.stringify({
                name: "test123",
                role: "Witness",
            }),
            removeAllListeners: jest.fn(),
        }),
    }),
}));

let mockWindowOrientation;

jest.mock("../../hooks/useWindowOrientation", () => ({
    __esModule: true,
    default: () => mockWindowOrientation,
}));

beforeEach(() => {
    localStorage.clear();
    AUTH.VALID();
    mockAudioTracks.mockResolvedValue({});
    mockVideoTracks.mockResolvedValue({});
    const recorderMock = AudioRecorder as jest.Mock;
    customDeps = getMockDeps();
    recorderMock.mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
        stream: { getTracks: () => [{ stop: () => {} }] },
    }));
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    customDeps.apiService.checkUserDepoStatus = jest.fn().mockResolvedValue(getUserDepoStatusWithParticipantAdmitted());
    // Mocking Canvas for PDFTron
    const createElement = document.createElement.bind(document);
    document.createElement = (tagName) => {
        if (tagName === "canvas") {
            return {
                getContext: () => ({}),
                measureText: () => ({}),
            };
        }
        return createElement(tagName);
    };

    window.MediaStream = (jest.fn() as any).mockImplementation(() => {});
});

test("spinner is shown on mount", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockImplementation(async () => {
        await wait(500);
        return TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK;
    });
    customDeps.apiService.checkUserDepoStatus = jest.fn().mockImplementation(async () => {
        await wait(500);
        return getUserDepoStatusWithParticipantAdmitted();
    });
    const { queryByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );
    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    expect(queryByTestId("spinner")).toBeInTheDocument();
});

test("Error screen is shown when fetch fails", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockRejectedValue({});
    const { getByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );
    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForElement(() => {
        getByText(MODULE_CONSTANTS.FETCH_ERROR_RESULT_BODY);
        getByText(MODULE_CONSTANTS.FETCH_ERROR_RESULT_BUTTON);
        return getByText(MODULE_CONSTANTS.FETCH_ERROR_RESULT_TITLE);
    });
});

test("VideoConference is shown if fetch is successful", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    const { getByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    await waitForElement(() => getByTestId("videoconference"));
});

test("Logger is not called if option isn´t enabled", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        } as any,
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    expect(mockVideoLogger).not.toHaveBeenCalled();
});

test("Logger is called if option is enabled", async () => {
    customDeps.apiService.getSystemSettings = jest.fn().mockResolvedValue({
        EnableBreakrooms: "enabled",
        EnableRealTimeTab: "enabled",
        EnableLiveTranscriptions: "enabled",
        EnableTwilioLogs: "enabled",
    });
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        } as any,
        history
    );
    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitFor(() => {
        expect(mockVideoLogger).toHaveBeenCalled();
    });
});

test("Off the record is shown when isOnTheRecord is false", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    const { getByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    expect(getByText(TESTS_CONSTANTS.OFF_PILL)).toBeInTheDocument();
});

test("On the record is shown when clicking the record button", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    const { getByText, getByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    const recordButton = getByTestId("record");
    fireEvent.click(recordButton);
    await waitForDomChange();
    expect(getByText(TESTS_CONSTANTS.ON_PILL)).toBeInTheDocument();
});

test("On the record is shown when isOnTheRecord is true", async () => {
    customDeps.apiService.joinDeposition = jest
        .fn()
        .mockResolvedValue({ ...TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK, isOnTheRecord: true });
    const { getByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    expect(getByText(TESTS_CONSTANTS.ON_PILL)).toBeInTheDocument();
});

test("End depo modal shows when clicking End Deposition button", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    const { getByTestId, getByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    const endButton = await waitForElement(() => getByTestId("end"));
    fireEvent.click(endButton);
    await waitForDomChange();
    expect(getByText(TESTS_CONSTANTS.END_DEPO_MODAL_FIRST_TEXT)).toBeInTheDocument();
    expect(getByText(TESTS_CONSTANTS.END_DEPO_MODAL_SECOND_TEXT)).toBeInTheDocument();
    expect(getByText(TESTS_CONSTANTS.CANCEL_BUTTON)).toBeInTheDocument();
    expect(getByText(TESTS_CONSTANTS.CONFIRMATION_BUTTON)).toBeInTheDocument();
});

test("Cancel button on End Depo modal closes the modal", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    const { getByTestId, getByText, queryByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    const endButton = await waitForElement(() => getByTestId("end"));
    fireEvent.click(endButton);
    await waitForDomChange();
    fireEvent.click(getByText(TESTS_CONSTANTS.CANCEL_BUTTON));
    expect(queryByText(TESTS_CONSTANTS.END_DEPO_MODAL_FIRST_TEXT)).toBeFalsy();
    expect(queryByText(TESTS_CONSTANTS.END_DEPO_MODAL_SECOND_TEXT)).toBeFalsy();
});
test("Record button and end deposition are shown", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    const { getByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    await waitForElement(() => getByTestId("end"));
    await waitForElement(() => getByTestId("record"));
});

test("Record button and end deposition are not shown", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    customDeps.apiService.getDepositionPermissions = jest.fn().mockResolvedValue({ permissions: [] });
    const { queryByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    expect(queryByTestId("end")).toBeFalsy();
    expect(queryByTestId("record")).toBeFalsy();
});

test("Redirects to PreDepo if shouldSendToPreDepo is true", async () => {
    customDeps.apiService.joinDeposition = jest
        .fn()
        .mockResolvedValue({ ...TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK, shouldSendToPreDepo: true });
    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />
            <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={PreDepoRoute} />
        </Switch>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    expect(getByText("PRE_DEPO")).toBeInTheDocument();
});

test("Redirects to waiting room if shouldSendToPreDepo is false and isAdmitted is true", async () => {
    customDeps.apiService.joinDeposition = jest
        .fn()
        .mockResolvedValue({ ...TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK, shouldSendToPreDepo: false });
    customDeps.apiService.checkUserDepoStatus = jest
        .fn()
        .mockResolvedValue({ participant: { ...getUserDepoStatusWithParticipantAdmitted(), isAdmitted: false } });
    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />
            <Route exact path={TESTS_CONSTANTS.WAITING_ROUTE} component={WaitingRoomRoute} />
        </Switch>,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    expect(getByText("WAITING ROOM")).toBeInTheDocument();
});

describe("InDepo -> RealTime", () => {
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

    it("shows transcriptions when joinDeposition returns a transcriptions list not empty", async () => {
        const { getByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                    signalR: {
                        signalR: null,
                        signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
                    },
                },
            },
            history
        );
        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitForDomChange();
        fireEvent.click(await waitForElement(() => getByTestId("realtime")));
        await wait(100);
        act(() => expect(getByTestId("transcription_text")).toBeTruthy());
        act(() => expect(getByTestId("transcription_title")).toBeTruthy());
    });
    it("shows transcriptions with pause", async () => {
        const { getByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                    signalR: {
                        signalR: null,
                        signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
                    },
                },
            },
            history
        );
        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitForDomChange();
        fireEvent.click(await waitForElement(() => getByTestId("realtime")));
        await wait(100);
        act(() => expect(getByTestId("transcription_paused")).toBeTruthy());
    });
    it("shows transcriptions with paused", async () => {
        customDeps.apiService.getDepositionEvents = jest
            .fn()
            .mockResolvedValue([TRANSCRIPTIONS_MOCKS.getEvent(17, false)]);
        const { getByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                    signalR: {
                        signalR: null,
                        signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
                    },
                },
            },
            history
        );
        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitForDomChange();
        fireEvent.click(await waitForElement(() => getByTestId("realtime")));
        await wait(100);
        act(() => expect(getByTestId("transcription_currently_paused")).toBeTruthy());
    });

    it("shows no transcriptions when when joinDeposition returns a transcriptions empty", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        const { getByTestId, queryByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                    signalR: {
                        signalR: null,
                        signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
                    },
                },
            },
            history
        );
        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitForDomChange();

        fireEvent.click(await waitForElement(() => getByTestId("realtime")));
        await waitForDomChange();
        act(() => expect(queryByTestId("transcription_text")).toBeFalsy());
        act(() => expect(queryByTestId("transcription_title")).toBeFalsy());
    });

    it("shows no transcriptions when when joinDeposition returns a transcriptions empty", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        const { getByTestId, queryByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                    signalR: {
                        signalR: null,
                        signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
                    },
                },
            },
            history
        );
        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitForDomChange();

        fireEvent.click(await waitForElement(() => getByTestId("realtime")));
        await waitForDomChange();
        act(() => expect(queryByTestId("transcription_text")).toBeFalsy());
        act(() => expect(queryByTestId("transcription_title")).toBeFalsy());
    });
});

describe("inDepo -> Exhibits view with a shared exhibit", () => {
    it("should not display the exhibit section when has not a exhibit shared", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        const { queryByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        systemSettings: {
                            EnableBreakrooms: "enabled",
                            EnableRealTimeTab: "enabled",
                            EnableLiveTranscriptions: "enabled",
                            EnableTwilioLogs: "enabled",
                        },
                        ...rootReducer.initialState.room,
                    },
                    user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                    signalR: {
                        signalR: null,
                        signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
                    },
                },
            },
            history
        );

        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitForDomChange();

        expect(queryByTestId("live_exhibits_tab_active")).not.toBeInTheDocument();
        expect(queryByTestId("view_document_header")).not.toBeInTheDocument();
    });

    it("should display the exhibit section with the live exhibit selected and highlighted when has a exhibit shared", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        const { queryByTestId, queryByText } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        systemSettings: {
                            EnableBreakrooms: "enabled",
                            EnableRealTimeTab: "enabled",
                            EnableLiveTranscriptions: "enabled",
                            EnableTwilioLogs: "enabled",
                        },
                        dataTrack: dataTrackMock,
                        currentRoom: {
                            on: jest.fn(),
                            off: jest.fn(),
                            localParticipant: getParticipant("test"),
                            participants: [],
                        },
                        currentExhibit,
                    },
                    user: { currentUser: null },
                    signalR: {
                        signalR: null,
                        signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
                    },
                },
            },
            history
        );

        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitForDomChange();

        expect(queryByTestId("live_exhibits_tab_active")).toBeInTheDocument();
        expect(queryByTestId("view_document_header")).toBeInTheDocument();
        expect(queryByTestId("live_exhibits_tab")).toHaveAttribute("highlight");
        expect(queryByText("LIVE EXHIBITS")).toBeInTheDocument();
    });

    it("should the mic status be unmuted by default", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        const { queryByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        systemSettings: {
                            EnableBreakrooms: "enabled",
                            EnableRealTimeTab: "enabled",
                            EnableLiveTranscriptions: "enabled",
                            EnableTwilioLogs: "enabled",
                        },
                        dataTrack: dataTrackMock,
                        currentRoom: {
                            on: jest.fn(),
                            off: jest.fn(),
                            localParticipant: getParticipant("test"),
                            participants: [],
                        },
                        currentExhibit,
                    },
                    user: { currentUser: null },
                    signalR: {
                        signalR: null,
                        signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
                    },
                },
            },
            history
        );

        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitForDomChange();

        expect(queryByTestId("unmuted")).toBeInTheDocument();
    });

    it("should the mic status be unmuted if the current participant is unmuted after join to the deposition", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        const { queryByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        dataTrack: dataTrackMock,
                        systemSettings: {
                            EnableBreakrooms: "enabled",
                            EnableRealTimeTab: "enabled",
                            EnableLiveTranscriptions: "enabled",
                            EnableTwilioLogs: "enabled",
                        },
                        currentRoom: {
                            on: jest.fn(),
                            off: jest.fn(),
                            localParticipant: getParticipant("test", "Witness", "test@test.com"),
                            participants: [],
                        },
                        participants: [
                            {
                                email: "test@test.com",
                                isMuted: false,
                            },
                        ],
                        currentExhibit,
                    },
                    user: { currentUser: null },
                    signalR: {
                        signalR: null,
                        signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
                    },
                },
            },
            history
        );

        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitForDomChange();

        expect(queryByTestId("unmuted")).toBeInTheDocument();
    });
    it("should the mic status be muted if the current participant is muted after join to the deposition", async () => {
        customDeps.apiService.getDepositionTranscriptions = jest.fn().mockResolvedValue([]);
        customDeps.apiService.getDepositionEvents = jest.fn().mockResolvedValue([]);
        const { queryByTestId } = renderWithGlobalContext(
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
            customDeps,
            {
                ...rootReducer,
                initialState: {
                    room: {
                        ...rootReducer.initialState.room,
                        systemSettings: {
                            EnableBreakrooms: "enabled",
                            EnableRealTimeTab: "enabled",
                            EnableLiveTranscriptions: "enabled",
                            EnableTwilioLogs: "enabled",
                        },
                        dataTrack: dataTrackMock,
                        currentRoom: {
                            on: jest.fn(),
                            off: jest.fn(),
                            localParticipant: getParticipant("test", "Witness", "test@test.com"),
                            participants: [],
                        },
                        participants: [
                            {
                                email: "test@test.com",
                                isMuted: true,
                            },
                        ],
                        currentExhibit,
                    },
                    user: { currentUser: null },
                    signalR: {
                        signalR: null,
                        signalRConnectionStatus: { isReconnected: false, isReconnecting: false },
                    },
                },
            },
            history
        );

        history.push(TESTS_CONSTANTS.TEST_ROUTE);
        await waitForDomChange();

        expect(queryByTestId("muted")).toBeInTheDocument();
    });
});
it("calls createLocalTracks with the devices if they exist in localStorage", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    localStorage.setItem("selectedDevices", JSON.stringify(TESTS_CONSTANTS.DEVICES_MOCK));
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitFor(() => {
        expect(mockAudioTracks).toHaveBeenCalledWith(TESTS_CONSTANTS.DEVICES_MOCK.audio);
        expect(mockVideoTracks).toHaveBeenCalledWith(TESTS_CONSTANTS.DEVICES_MOCK.video);
    });
});
it("calls sendParticipantDevices with updated devices if they are blocked", async () => {
    mockVideoTracks.mockRejectedValue(Error("Permission denied"));
    mockAudioTracks.mockRejectedValue(Error("Permission denied"));
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    localStorage.setItem("selectedDevices", JSON.stringify(TESTS_CONSTANTS.DEVICES_MOCK));
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } } as any,
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            } as any,
        },
        history
    );
    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitFor(() => {
        expect(customDeps.apiService.sendParticipantDevices).toHaveBeenCalledWith(
            "test1234",
            TESTS_CONSTANTS.FIRST_DEVICES_BODY
        );
        expect(customDeps.apiService.sendParticipantDevices).toHaveBeenCalledWith("test1234", {
            ...TESTS_CONSTANTS.FIRST_DEVICES_BODY,
            camera: {
                name: "",
                status: DevicesStatus.blocked,
            },
        });
        expect(customDeps.apiService.sendParticipantDevices).toHaveBeenCalledWith("test1234", {
            ...TESTS_CONSTANTS.FIRST_DEVICES_BODY,
            microphone: {
                name: "",
            },
        });
    });
});

it("doesn´t call create Tracks if the devices don´t exist in localStorage", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: false } },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitFor(() => {
        expect(mockAudioTracks).not.toHaveBeenCalled();
        expect(mockVideoTracks).not.toHaveBeenCalled();
    });
});

it("should show a toast when SignalR is trying to reconnect", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    localStorage.setItem("selectedDevices", JSON.stringify(TESTS_CONSTANTS.DEVICES_MOCK));
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: true } },
            },
        },
        history
    );

    await waitFor(() => {
        expect(screen.getByTestId(MODULE_CONSTANTS.RECONNECTING_ALERT_MESSAGE_TEST_ID)).toBeInTheDocument();
    });
});

it("calls createLocalAudioTrack with default value if first time if fails", async () => {
    const expectedNewLocalStorageObject = {
        ...TESTS_CONSTANTS.DEVICES_MOCK,
        microphoneForBE: {
            name: "test",
        },
        audio: {
            deviceId: {
                exact: "test",
            },
            groupId: "test",
            label: "test",
        },
    };
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    localStorage.setItem("selectedDevices", JSON.stringify(TESTS_CONSTANTS.DEVICES_MOCK));
    const oldLocalStorageItem = JSON.parse(localStorage.getItem("selectedDevices"));
    mockAudioTracks.mockRejectedValueOnce({ message: "this is a test" });
    mockEnumerateDevices.mockResolvedValue([{ label: "test", deviceId: "test", kind: "audioinput", groupId: "test" }]);
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                },
                user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
                signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: true } },
            },
        },
        history
    );
    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitFor(() => {
        expect(mockAudioTracks).toHaveBeenCalledWith(oldLocalStorageItem.audio);
    });
    mockAudioTracks.mockResolvedValue({});
    await waitFor(() => {
        expect(mockAudioTracks).toHaveBeenCalled();
        expect(JSON.parse(localStorage.getItem("selectedDevices"))).toEqual(expectedNewLocalStorageObject);
    });
});

it("should show Block Firefox Modal if you try to access a depo from Firefox browser", async () => {
    rdd.isFirefox = true;
    renderWithGlobalContext(
        <ProtectedRoute exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
        },
        history
    );

    await waitFor(() => {
        const copyBtn = screen.queryByTestId(TESTS_CONSTANTS.COPY_INVITATION_BUTTON_TEST_ID);
        expect(copyBtn).toBeInTheDocument();
    });
});

it("shouldn't show Block Firefox Modal if you try to access a depo from another browser", async () => {
    rdd.isFirefox = false;
    renderWithGlobalContext(
        <ProtectedRoute exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        {
            ...rootReducer,
        },
        history
    );

    await waitFor(() => {
        const copyBtn = screen.queryByTestId(TESTS_CONSTANTS.COPY_INVITATION_BUTTON_TEST_ID);
        expect(copyBtn).not.toBeInTheDocument();
    });
});

// describe("inDepo -> Block not supported resolutions", () => {
//     it("Should render the WrongOrientationScreen on landscape mode and smaller screens than the lg breakpoint 1024px", async () => {
//         mockWindowOrientation = ORIENTATION_STATE.LANDSCAPE;
//         global.innerWidth = parseInt(theme.default.breakpoints.lg, 10) - 100;
//         customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
//         renderWithGlobalContext(
//             <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
//             customDeps,
//             {
//                 ...rootReducer,
//                 initialState: {
//                     room: {
//                         ...rootReducer.initialState.room,
//                     },
//                     user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
//                     signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: true } },
//                 },
//             },
//             history
//         );

//         history.push(TESTS_CONSTANTS.TEST_ROUTE);
//         await waitFor(() => {
//             expect(screen.getByTestId("deposition_orientation_screen")).toBeInTheDocument();
//         });
//     });

//     it("Should render the WrongOrientationScreen on portrait mode in bigger screens than the sm breakpoint 640px", async () => {
//         mockWindowOrientation = ORIENTATION_STATE.PORTRAIT;
//         global.innerWidth = parseInt(theme.default.breakpoints.sm, 10) + 100;
//         customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
//         renderWithGlobalContext(
//             <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
//             customDeps,
//             {
//                 ...rootReducer,
//                 initialState: {
//                     room: {
//                         ...rootReducer.initialState.room,
//                     },
//                     user: { currentUser: { firstName: "First Name", lastName: "Last Name" } },
//                     signalR: { signalR: null, signalRConnectionStatus: { isReconnected: false, isReconnecting: true } },
//                 },
//             },
//             history
//         );

//         history.push(TESTS_CONSTANTS.TEST_ROUTE);
//         await waitFor(() => {
//             expect(screen.getByTestId("deposition_orientation_screen")).toBeInTheDocument();
//         });
//     });
// });
