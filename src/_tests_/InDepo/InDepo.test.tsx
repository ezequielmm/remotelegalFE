import React from "react";
import { createMemoryHistory } from "history";
import { Route } from "react-router-dom";
import { waitForElement, waitForDomChange, fireEvent } from "@testing-library/react";
import InDepo from "../../routes/InDepo";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";
import * as MODULE_CONSTANTS from "../../constants/inDepo";
import * as TESTS_CONSTANTS from "../constants/InDepo";

const customDeps = getMockDeps();
const history = createMemoryHistory();
// TODO: Find a better way to mock Twilio (eg, adding it to DI system)
jest.mock("twilio-video", () => ({
    ...jest.requireActual("twilio-video"),
    LocalDataTrack: function dataTrack() {
        return { send: jest.fn() };
    },

    createLocalTracks: async () => [],

    connect: async () => ({
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
            identity: "test1234",
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
            identity: "test1234",
            removeAllListeners: jest.fn(),
        }),
    }),
}));

beforeEach(() => {
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
});

test("Error screen is shown when fetch fails", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockRejectedValue({});
    const { getByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        undefined,
        history
    );
    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForElement(() => {
        getByText(MODULE_CONSTANTS.FETCH_ERROR_RESULT_BODY);
        getByText(MODULE_CONSTANTS.FETCH_ERROR_RESULT_BUTTON);
        return getByText(MODULE_CONSTANTS.FETCH_ERROR_RESULT_TITLE);
    });
});

test("Spinner is shown on mount", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockRejectedValue({});
    const { getByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        undefined,
        history
    );
    const spinner = getByTestId("spinner");
    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    expect(spinner).toBeInTheDocument();
    await waitForDomChange();
});

test("VideoConference is shown if fetch is successful", async () => {
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
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    const { getByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    await waitForElement(() => getByTestId("videoconference"));
});

test("Off the record is shown by default", async () => {
    customDeps.apiService.joinDeposition = jest.fn().mockResolvedValue(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK);
    const { getByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        customDeps,
        undefined,
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
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.TEST_ROUTE);
    await waitForDomChange();
    const recordButton = getByTestId("record");
    fireEvent.click(recordButton);
    await waitForDomChange();
    expect(getByText(TESTS_CONSTANTS.ON_PILL)).toBeInTheDocument();
});
