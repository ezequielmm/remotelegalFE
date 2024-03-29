import { waitForDomChange, waitForElement, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import * as MODULE_CONSTANTS from "../../constants/inDepo";
import Breakroom from "../../routes/InDepo/Breakroom";
import { rootReducer } from "../../state/GlobalState";
import * as TESTS_CONSTANTS from "../constants/InDepo";
import { getBreakrooms } from "../mocks/breakroom";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as CONSTANTS from "../../constants/inDepo";

jest.mock("audio-recorder-polyfill", () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
    }));
});

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
    useParams: () => ({
        breakroomID: "d4403be9-1066-4aed-b1fe-08d8d8ef50e8",
        depositionID: "1",
    }),
}));

let customDeps;
const history = createMemoryHistory();

// TODO: Find a better way to mock Twilio (eg, adding it to DI system)

(global.navigator as any).mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(true),
};

const mockVideoTracks = jest.fn();
const mockAudioTracks = jest.fn();

// TODO: Find a better way to mock Twilio (eg, adding it to DI system)
jest.mock("twilio-video", () => ({
    ...jest.requireActual("twilio-video"),
    LocalDataTrack: function dataTrack() {
        return { send: jest.fn() };
    },

    createLocalVideoTrack: (args) => mockVideoTracks(args),
    createLocalAudioTrack: (args) => mockAudioTracks(args),
    connect: async (token) => {
        if (token === undefined) throw Error();
        return {
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
        };
    },
}));

jest.mock("../../hooks/useSignalR", () => () => ({
    subscribeToGroup: jest.fn(),
    unsubscribeMethodFromGroup: jest.fn(),
    signalR: true,
}));

beforeEach(() => {
    localStorage.clear();
    customDeps = getMockDeps();
});

test("Error screen is shown when fetch fails", async () => {
    customDeps.apiService.joinBreakroom = jest.fn().mockRejectedValue({});
    const { getByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.BREAKROOM_ROUTE} component={Breakroom} />,
        customDeps,
        undefined,
        history
    );
    history.push(TESTS_CONSTANTS.TEST_BREAKROOM_ROUTE);
    await waitForElement(() => {
        getByText(MODULE_CONSTANTS.FETCH_ERROR_RESULT_BODY);
        getByText(MODULE_CONSTANTS.FETCH_ERROR_RESULT_BUTTON);
        return getByText(MODULE_CONSTANTS.FETCH_ERROR_RESULT_TITLE);
    });
});

test("Spinner is shown on mount", async () => {
    customDeps.apiService.joinBreakroom = jest.fn().mockRejectedValue({});
    const { getByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.BREAKROOM_ROUTE} component={Breakroom} />,
        customDeps,
        undefined,
        history
    );
    const spinner = getByTestId("spinner");
    history.push(TESTS_CONSTANTS.TEST_BREAKROOM_ROUTE);
    expect(spinner).toBeInTheDocument();
    await waitForDomChange();
});

test("VideoConference is shown if fetch is successful", async () => {
    customDeps.apiService.joinBreakroom = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_BREAKROOM_MOCK);
    const { getByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.BREAKROOM_ROUTE} component={Breakroom} />,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.TEST_BREAKROOM_ROUTE);
    await waitFor(() => {
        getByTestId("videoconference_breakroom");
    });
});

test("Off the record is shown by default", async () => {
    customDeps.apiService.joinBreakroom = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_BREAKROOM_MOCK);
    const { getByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.BREAKROOM_ROUTE} component={Breakroom} />,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.TEST_BREAKROOM_ROUTE);
    await waitForDomChange();
    expect(getByText(TESTS_CONSTANTS.OFF_PILL)).toBeInTheDocument();
});

test("Should call to lock the break room, with isLock = true when the breakrom is not locked and clicks on the lock button", async () => {
    customDeps.apiService.lockRoom = jest.fn().mockResolvedValue({ isLocked: true });
    const { queryByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.BREAKROOM_ROUTE} component={Breakroom} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "enteredExhibits",
                    breakrooms: getBreakrooms(),
                },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_BREAKROOM_ROUTE);
    await waitForDomChange();
    fireEvent.click(queryByTestId("lock_breakroom"));
    expect(customDeps.apiService.lockRoom).toBeCalledWith({
        depositionID: "test1234",
        breakroomID: ":breakroomID",
        isLock: true,
    });
});

test("Should call to lock the break room, with isLock = false when the breakrom is locked and clicks on the lock button", async () => {
    customDeps.apiService.lockRoom = jest.fn().mockResolvedValue({ isLocked: false });
    const { queryByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.BREAKROOM_ROUTE} component={Breakroom} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "enteredExhibits",
                    breakrooms: getBreakrooms(),
                },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_BREAKROOM_ROUTE);
    await waitForDomChange();
    fireEvent.click(queryByTestId("lock_breakroom"));
    expect(customDeps.apiService.lockRoom).toBeCalledWith({
        depositionID: "test1234",
        breakroomID: ":breakroomID",
        isLock: true,
    });
    fireEvent.click(queryByTestId("lock_breakroom"));
    await waitForDomChange();
    expect(customDeps.apiService.lockRoom).toBeCalledWith({
        depositionID: "test1234",
        breakroomID: ":breakroomID",
        isLock: false,
    });
});

test("Should display an error message when can't lock a room", async () => {
    customDeps.apiService.lockRoom = jest.fn().mockRejectedValue({});
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.BREAKROOM_ROUTE} component={Breakroom} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "enteredExhibits",
                    breakrooms: getBreakrooms(),
                },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_BREAKROOM_ROUTE);
    await waitForDomChange();
    fireEvent.click(queryByTestId("lock_breakroom"));
    await waitForDomChange();
    expect(queryByText(CONSTANTS.BREAKROOM_LOCK_ERROR)).toBeInTheDocument();
});

test("Should display an error message when can't unlock a room", async () => {
    customDeps.apiService.lockRoom = jest.fn().mockRejectedValueOnce({});
    const { queryByTestId, queryByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.BREAKROOM_ROUTE} component={Breakroom} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "enteredExhibits",
                    breakrooms: getBreakrooms(true),
                },
            },
        },
        history
    );

    history.push(TESTS_CONSTANTS.TEST_BREAKROOM_ROUTE);
    await waitForDomChange();
    fireEvent.click(queryByTestId("lock_breakroom"));
    await waitForDomChange();
    expect(queryByText(CONSTANTS.BREAKROOM_LOCK_ERROR)).toBeInTheDocument();
});

test("Create track functions get called with the proper devices if they exist in localStorage", async () => {
    localStorage.setItem("selectedDevices", JSON.stringify(TESTS_CONSTANTS.DEVICES_MOCK));
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.BREAKROOM_ROUTE} component={Breakroom} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "enteredExhibits",
                    breakrooms: getBreakrooms(),
                },
            },
        },
        history
    );
    history.push(TESTS_CONSTANTS.TEST_BREAKROOM_ROUTE);
    await waitFor(() => {
        expect(mockAudioTracks).toHaveBeenCalledWith(TESTS_CONSTANTS.DEVICES_MOCK.audio);
        expect(mockVideoTracks).toHaveBeenCalledWith(TESTS_CONSTANTS.DEVICES_MOCK.video);
    });
});

test("Create track functions are not called if the devices don´t exist in localStorage", async () => {
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.BREAKROOM_ROUTE} component={Breakroom} />,
        customDeps,
        {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    isRecording: true,
                    currentExhibitTabName: "enteredExhibits",
                    breakrooms: getBreakrooms(),
                },
            },
        },
        history
    );
    history.push(TESTS_CONSTANTS.TEST_BREAKROOM_ROUTE);
    await waitFor(() => {
        expect(mockAudioTracks).not.toHaveBeenCalled();
        expect(mockVideoTracks).not.toHaveBeenCalled();
    });
});
