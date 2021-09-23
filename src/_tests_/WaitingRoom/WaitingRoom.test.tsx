import { act, waitForDomChange } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route, Switch } from "react-router-dom";
import * as TESTS_CONSTANTS from "../constants/InDepo";
import * as MODULE_CONSTANTS from "../../constants/preJoinDepo";
import getMockDeps from "../utils/getMockDeps";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import * as AUTH from "../mocks/Auth";
import { getUserDepoStatusWithParticipantAdmitted, PARTICIPANT_MOCK } from "../constants/preJoinDepo";
import WaitingRoom from "../../routes/WaitingRoom";

let signalREventTriggered;
jest.mock("../../hooks/useSignalR", () => () => ({
    subscribeToGroup: (_, func) => {
        signalREventTriggered = func;
    },
    signalR: true,
}));
const customDeps = getMockDeps();
const history = createMemoryHistory();

const InDepo = () => <div>IN DEPO</div>;
const PreDepo = () => <div>PRE DEPO</div>;

beforeEach(() => {
    AUTH.VALID();
    customDeps.apiService.joinDeposition = jest
        .fn()
        .mockResolvedValue({ ...TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK, shouldSendToPreDepo: false });
    customDeps.apiService.checkUserDepoStatus = jest
        .fn()
        .mockResolvedValue({ participant: { ...PARTICIPANT_MOCK, isAdmitted: null } });
});

test("Redirects to Depo if user has been admitted", async () => {
    customDeps.apiService.checkUserDepoStatus = jest
        .fn()
        .mockResolvedValue({ participant: { ...getUserDepoStatusWithParticipantAdmitted(), isAdmitted: true } });
    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.WAITING_ROUTE} component={WaitingRoom} />,
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.WAITING_ROUTE);
    await waitForDomChange();
    expect(getByText("IN DEPO")).toBeInTheDocument();
});

test("Redirects to PreDepo if depo has not started", async () => {
    customDeps.apiService.joinDeposition = jest
        .fn()
        .mockResolvedValue({ ...TESTS_CONSTANTS.JOIN_DEPOSITION_MOCK, shouldSendToPreDepo: true });
    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.WAITING_ROUTE} component={WaitingRoom} />,
            <Route exact path={TESTS_CONSTANTS.PRE_ROUTE} component={PreDepo} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.WAITING_ROUTE);
    await waitForDomChange();
    expect(getByText("PRE DEPO")).toBeInTheDocument();
});

test("Shows proper text when isAdmitted is null", async () => {
    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.WAITING_ROUTE} component={WaitingRoom} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );
    history.push(TESTS_CONSTANTS.WAITING_ROUTE);
    await waitForDomChange();
    expect(
        getByText(
            `${getUserDepoStatusWithParticipantAdmitted().participant.name},${MODULE_CONSTANTS.WAITING_ROOM_MESSAGE}`
        )
    ).toBeInTheDocument();
});
test("Shows proper text when isAdmitted is false", async () => {
    customDeps.apiService.checkUserDepoStatus = jest
        .fn()
        .mockResolvedValue({ participant: { ...PARTICIPANT_MOCK, isAdmitted: false } });
    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.WAITING_ROUTE} component={WaitingRoom} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );
    history.push(TESTS_CONSTANTS.WAITING_ROUTE);
    await waitForDomChange();
    expect(getByText(MODULE_CONSTANTS.ACCESS_DENIED_TITLE)).toBeInTheDocument();
    expect(getByText(MODULE_CONSTANTS.ACCESS_DENIED_BUTTON_TEXT)).toBeInTheDocument();
});

test("Redirects to InDepo if signalR sends an admitted message", async () => {
    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.WAITING_ROUTE} component={WaitingRoom} />,
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.WAITING_ROUTE);
    await waitForDomChange();
    act(() => {
        signalREventTriggered({
            entityType: "joinResponse",
            content: {
                isAdmitted: true,
            },
        });
    });

    expect(getByText("IN DEPO")).toBeInTheDocument();
});

test("Shows denied text if signalR sends a non-admitted message", async () => {
    const { getByText } = renderWithGlobalContext(
        <Switch>
            <Route exact path={TESTS_CONSTANTS.WAITING_ROUTE} component={WaitingRoom} />,
            <Route exact path={TESTS_CONSTANTS.ROUTE} component={InDepo} />,
        </Switch>,
        customDeps,
        undefined,
        history
    );

    history.push(TESTS_CONSTANTS.WAITING_ROUTE);
    await waitForDomChange();
    act(() => {
        signalREventTriggered({
            entityType: "joinResponse",
            content: {
                isAdmitted: false,
            },
        });
    });

    expect(getByText(MODULE_CONSTANTS.ACCESS_DENIED_TITLE)).toBeInTheDocument();
    expect(getByText(MODULE_CONSTANTS.ACCESS_DENIED_BUTTON_TEXT)).toBeInTheDocument();
});
