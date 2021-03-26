import React from "react";
import { waitForDomChange, fireEvent, act } from "@testing-library/react";
import * as CONSTANTS from "../../constants/inDepo";
import GuestRequests from "../../routes/InDepo/GuestRequests";
import { getParticipant } from "../constants/InDepo";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

let signalREventTriggered;

jest.mock("../../hooks/useSignalR", () => () => ({
    subscribeToGroup: (text, func) => {
        signalREventTriggered = func;
    },
    unsubscribeMethodFromGroup: () => {},
    signalR: true,
}));

test("waitingRoomParticipants should be called with depositionID", async () => {
    const { deps } = renderWithGlobalContext(<GuestRequests depositionID="some-id" />);
    await waitForDomChange();
    expect(deps.apiService.waitingRoomParticipants).toBeCalledWith("some-id");
});

test("should display one notification when waitingRoomParticipants returns a participant", async () => {
    const { findAllByTestId } = renderWithGlobalContext(<GuestRequests depositionID="some-id" />);
    const allowButtons = await findAllByTestId(CONSTANTS.GUEST_REQUESTS_ALLOW_BUTTON_TEST_ID);
    expect(allowButtons).toHaveLength(1);
});

test("should display the allow modal when click on allow button", async () => {
    const { findByText, findAllByTestId } = renderWithGlobalContext(<GuestRequests depositionID="some-id" />);
    const allowButtons = await findAllByTestId(CONSTANTS.GUEST_REQUESTS_ALLOW_BUTTON_TEST_ID);
    fireEvent.click(allowButtons[0]);
    expect(await findByText(CONSTANTS.GUEST_REQUESTS_ALLOW_MODAL_TITLE)).toBeInTheDocument();
});

test("should display one notification when cancel allow modal", async () => {
    const { findByText, findAllByTestId } = renderWithGlobalContext(<GuestRequests depositionID="some-id" />);
    const allowButtons = await findAllByTestId(CONSTANTS.GUEST_REQUESTS_ALLOW_BUTTON_TEST_ID);
    fireEvent.click(allowButtons[0]);
    const cancelAllowButton = await findByText(CONSTANTS.GUEST_REQUESTS_MODAL_NEGATIVE_LABEL);
    fireEvent.click(cancelAllowButton);
    const updatedAllowButtons = await findAllByTestId(CONSTANTS.GUEST_REQUESTS_ALLOW_BUTTON_TEST_ID);
    expect(updatedAllowButtons).toHaveLength(1);
});

test("should display one notification when accept allow modal", async () => {
    const { findByText, findAllByTestId, queryAllByTestId } = renderWithGlobalContext(
        <GuestRequests depositionID="some-id" />
    );
    const allowButtons = await findAllByTestId(CONSTANTS.GUEST_REQUESTS_ALLOW_BUTTON_TEST_ID);
    fireEvent.click(allowButtons[0]);
    const allowButton = await findByText(CONSTANTS.GUEST_REQUESTS_ALLOW_MODAL_POSITIVE_LABEL);
    fireEvent.click(allowButton);
    await waitForDomChange();
    const updatedAllowButtons = queryAllByTestId(CONSTANTS.GUEST_REQUESTS_ALLOW_BUTTON_TEST_ID);
    expect(updatedAllowButtons).toHaveLength(0);
});

test("should display the deny modal when click on deny button", async () => {
    const { findByText, findAllByTestId } = renderWithGlobalContext(<GuestRequests depositionID="some-id" />);
    const denyButtons = await findAllByTestId(CONSTANTS.GUEST_REQUESTS_DENY_BUTTON_TEST_ID);
    fireEvent.click(denyButtons[0]);
    expect(await findByText(CONSTANTS.GUEST_REQUESTS_DENY_MODAL_TITLE)).toBeInTheDocument();
});

test("should display one notification when cancel deny modal", async () => {
    const { findByText, findAllByTestId } = renderWithGlobalContext(<GuestRequests depositionID="some-id" />);
    const denyButtons = await findAllByTestId(CONSTANTS.GUEST_REQUESTS_DENY_BUTTON_TEST_ID);
    fireEvent.click(denyButtons[0]);
    const cancelDenyButton = await findByText(CONSTANTS.GUEST_REQUESTS_MODAL_NEGATIVE_LABEL);
    fireEvent.click(cancelDenyButton);
    const updatedDenyButtons = await findAllByTestId(CONSTANTS.GUEST_REQUESTS_DENY_BUTTON_TEST_ID);
    expect(updatedDenyButtons).toHaveLength(1);
});

test("should display one notification when cancel deny modal", async () => {
    const { findByText, findAllByTestId, queryAllByTestId } = renderWithGlobalContext(
        <GuestRequests depositionID="some-id" />
    );
    const denyButtons = await findAllByTestId(CONSTANTS.GUEST_REQUESTS_DENY_BUTTON_TEST_ID);
    fireEvent.click(denyButtons[0]);
    const denyButton = await findByText(CONSTANTS.GUEST_REQUESTS_DENY_MODAL_POSITIVE_LABEL);
    fireEvent.click(denyButton);
    await waitForDomChange();
    const updatedDenyButtons = queryAllByTestId(CONSTANTS.GUEST_REQUESTS_DENY_BUTTON_TEST_ID);
    expect(updatedDenyButtons).toHaveLength(0);
});

test("should add a notification when signalR message with joinResponse entityType is triggered", async () => {
    const { findByText } = renderWithGlobalContext(<GuestRequests depositionID="some-id" />);
    const newParticipant = getParticipant(1);
    act(() => {
        signalREventTriggered({
            entityType: "joinRequest",
            content: newParticipant,
        });
    });
    const allowButtons = await findByText(`${newParticipant.name}${CONSTANTS.GUEST_REQUESTS_NOTIFICATION_TITLE}`);
    expect(allowButtons).toBeInTheDocument();
});
