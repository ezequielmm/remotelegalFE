import { act, fireEvent, waitFor, waitForDomChange, waitForElement } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route, Switch } from "react-router-dom";
import * as TESTS_CONSTANTS from "../constants/InDepo";
import * as MODULE_CONSTANTS from "../../constants/inDepo";
import MockInDepo from "../../routes/MockInDepo";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as AUTH from "../mocks/Auth";
import { getUserDepoStatusWithParticipantAdmitted } from "../constants/preJoinDepo";
import getDepositionTime from "../../routes/MockInDepo/helpers/getDepositionTime";
import "mutationobserver-shim";

let signalREventTriggered;
jest.mock("../../hooks/useSignalR", () => () => ({
    subscribeToGroup: (_, func) => {
        signalREventTriggered = func;
    },
    signalR: {
        stop: () => {},
        connectionState: "Connected",
    },
    sendMessage: jest.fn(),
}));
let customDeps;
const history = createMemoryHistory();

const InDepo = () => <div>IN DEPO</div>;
const WaitingRoom = () => <div>WAITING ROOM</div>;
const mockTracks = jest.fn();
jest.mock("twilio-video", () => ({
    ...jest.requireActual("twilio-video"),
    LocalDataTrack: function dataTrack() {
        return { send: jest.fn() };
    },

    createLocalTracks: (args) => mockTracks(args),

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
                role: "Witness",
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

beforeEach(() => {
    localStorage.clear();
    customDeps = getMockDeps();
    mockTracks.mockResolvedValue([]);
    AUTH.VALID();
    customDeps.apiService.joinDeposition = jest
        .fn()
        .mockResolvedValue({ ...TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK, shouldSendToPreDepo: true });
    customDeps.apiService.checkUserDepoStatus = jest.fn().mockResolvedValue(getUserDepoStatusWithParticipantAdmitted());
});

test("Redirects to Depo if getting message from SignalR and user is admitted", async () => {
    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={MockInDepo} />,
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.PRE_ROUTE);
    await waitForDomChange();
    act(() => {
        signalREventTriggered({
            entityType: "deposition",
            action: "start",
        });
    });
    await waitForDomChange();
    expect(getByText("IN DEPO")).toBeInTheDocument();
});

test("Redirects to Waiting Room if getting message from SignalR and user is not admitted", async () => {
    customDeps.apiService.checkUserDepoStatus = jest
        .fn()
        .mockResolvedValue({ participant: { ...getUserDepoStatusWithParticipantAdmitted(), isAdmitted: false } });

    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={MockInDepo} />,
            <Route exact path={TESTS_CONSTANTS.WAITING_ROUTE} component={WaitingRoom} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.PRE_ROUTE);
    await waitForDomChange();

    act(() => {
        signalREventTriggered({
            entityType: "deposition",
            action: "start",
        });
    });
    await waitForDomChange();
    expect(getByText("WAITING ROOM")).toBeInTheDocument();
});

test("Shows toast if depoUserStatus endpoint fails", async () => {
    customDeps.apiService.checkUserDepoStatus = jest.fn().mockImplementation(() => {
        throw Error("something went wrong");
    });

    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={MockInDepo} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.PRE_ROUTE);
    await waitForDomChange();

    act(() => {
        signalREventTriggered({
            entityType: "deposition",
            action: "start",
        });
    });
    await waitForDomChange();
    expect(getByText(MODULE_CONSTANTS.MOCK_DEPO_USER_STATUS_ERROR)).toBeInTheDocument();
});

test("Correct time is shown", async () => {
    const { getByText } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={MockInDepo} />,
        customDeps,
        undefined,
        history
    );
    history.push(TESTS_CONSTANTS.PRE_ROUTE);
    await waitForDomChange();
    await waitForElement(() => getByText(getDepositionTime(TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK.startDate)));
});

test("Breakrooms are disabled", async () => {
    const { getAllByTestId, getByTestId } = renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={MockInDepo} />,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.PRE_ROUTE);
    await waitForDomChange();
    fireEvent.click(getByTestId("breakrooms"));
    await waitForDomChange();
    const breakrooms = getAllByTestId("join_breakroom");
    breakrooms.map((breakroom) => expect(breakroom).toBeDisabled());
});
test("Leaves depo without showing modal", async () => {
    const { queryByText, getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={MockInDepo} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.PRE_ROUTE);
    await waitForDomChange();
    fireEvent.click(getByText("Leave"));
    expect(queryByText("confirm_title")).not.toBeInTheDocument();
});

test("Leaves depo while unathenticated without showing modal", async () => {
    AUTH.NOT_VALID();
    const { queryByText, getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={MockInDepo} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.PRE_ROUTE);
    await waitForDomChange();
    fireEvent.click(getByText("Leave"));
    expect(queryByText("confirm_title")).not.toBeInTheDocument();
});

test("Redirects to Depo if shouldSendToPreDepo is false", async () => {
    customDeps.apiService.joinDeposition = jest
        .fn()
        .mockResolvedValue({ ...TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK, shouldSendToPreDepo: false });
    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={MockInDepo} />,
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );
    history.push(TESTS_CONSTANTS.PRE_ROUTE);
    await waitForDomChange();
    expect(getByText("IN DEPO")).toBeInTheDocument();
});
test("CreateLocalTracks gets called with the proper devices if they exist in localStorage", async () => {
    localStorage.setItem("selectedDevices", JSON.stringify(TESTS_CONSTANTS.DEVICES_MOCK));
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={MockInDepo} />,
        customDeps,
        undefined,
        history
    );
    history.push(TESTS_CONSTANTS.PRE_ROUTE);
    await waitFor(() => {
        expect(mockTracks).toHaveBeenCalledWith({
            audio: TESTS_CONSTANTS.DEVICES_MOCK.audio,
            video: TESTS_CONSTANTS.DEVICES_MOCK.video,
        });
    });
});
test("CreateLocalTracks gets called with true if the devices don´t exist in localStorage", async () => {
    renderWithGlobalContext(
        <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={MockInDepo} />,
        customDeps,
        undefined,
        history
    );
    history.push(TESTS_CONSTANTS.PRE_ROUTE);
    await waitFor(() => {
        expect(mockTracks).toHaveBeenCalledWith({
            audio: true,
            video: true,
        });
    });
});
