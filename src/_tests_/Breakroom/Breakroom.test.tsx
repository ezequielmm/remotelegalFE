import { waitForDomChange, waitForElement } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route } from "react-router-dom";
import * as MODULE_CONSTANTS from "../../constants/inDepo";
import Breakroom from "../../routes/InDepo/Breakroom";
import * as TESTS_CONSTANTS from "../constants/InDepo";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

jest.mock("audio-recorder-polyfill", () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
    }));
});

const customDeps = getMockDeps();
const history = createMemoryHistory();
// TODO: Find a better way to mock Twilio (eg, adding it to DI system)

(global.navigator as any).mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(true),
};

// TODO: Find a better way to mock Twilio (eg, adding it to DI system)
jest.mock("twilio-video", () => ({
    ...jest.requireActual("twilio-video"),
    LocalDataTrack: function dataTrack() {
        return { send: jest.fn() };
    },

    createLocalTracks: async () => [],

    connect: async (token) => {
        if (token === undefined) throw Error();
        return {
            on: jest.fn(),
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
    await waitForDomChange();
    expect(waitForElement(() => getByTestId("videoconference"))).toBeTruthy();
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
