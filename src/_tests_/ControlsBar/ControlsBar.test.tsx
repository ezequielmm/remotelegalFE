import { fireEvent, waitForDomChange } from "@testing-library/react";
import React from "react";
import Amplify from "aws-amplify";
import ControlsBar from "../../components/ControlsBar";
import { getBreakrooms } from "../mocks/breakroom";
import * as CONSTANTS from "../../constants/inDepo";
import * as TEST_CONSTANTS from "../constants/InDepo";
import getParticipant from "../mocks/participant";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";
import * as AUTH from "../mocks/Auth";
import { AMPLIFY_CONFIG } from "../constants/login";
import getLeaveModalTextContent from "../../components/ControlsBar/helpers/getLeaveModalTextContent";
import { wait } from "../../helpers/wait";

jest.mock("audio-recorder-polyfill", () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
        stream: { getTracks: () => [{ stop: () => {} }] },
    }));
});

Amplify.configure({
    Auth: AMPLIFY_CONFIG,
});

let mockHistoryPush;

let props;
const breakrooms = getBreakrooms();

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}));

beforeEach(() => {
    mockHistoryPush = jest.fn();

    props = {
        breakrooms,
        isRecording: false,
        togglerRecording: jest.fn(),
        togglerExhibits: jest.fn(),
        togglerRealTime: jest.fn(),
        handleJoinBreakroom: jest.fn(),
        localParticipant: getParticipant("test1"),
        exhibitsOpen: false,
        realTimeOpen: false,
        canRecord: false,
        canEnd: false,
    };
});

(global.navigator as any).mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(true),
};

test("Exhibits is opened when exhibits Open is true", async () => {
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen />);
    expect(await findByTestId("exhibits")).toBeInTheDocument();
});

test("Real Time is opened when realTimeOpen is true", async () => {
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} realTimeOpen />);
    expect(await findByTestId("realtime")).toBeInTheDocument();
});

test("Both exhibits and real time are opened when both conditions are true", async () => {
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen realTimeOpen />);
    expect(await findByTestId("exhibits")).toBeInTheDocument();
    expect(await findByTestId("realtime")).toBeInTheDocument();
});

test("Muted icon is toggled when clicking the mute button", async () => {
    const { findByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen />
    );
    fireEvent.click(await findByTestId("audio"));
    expect(await findByTestId("muted")).toBeInTheDocument();
    fireEvent.click(await findByTestId("audio"));
    expect(await findByTestId("unmuted")).toBeInTheDocument();
    expect(queryByTestId("muted")).toBeFalsy();
});

test("Audio icon is toggled to unmuted when the initialAudioEnabled is true", async () => {
    const { findByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen initialAudioEnabled />
    );
    expect(await findByTestId("unmuted")).toBeInTheDocument();
    expect(queryByTestId("muted")).toBeFalsy();
});

test("Audio icon is toggled to muted when the initialAudioEnabled is false", async () => {
    const { findByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen initialAudioEnabled={false} />
    );
    expect(await findByTestId("muted")).toBeInTheDocument();
    expect(queryByTestId("unmuted")).toBeFalsy();
});

test("Camera icon is toggled when clicking the camera button", async () => {
    const { findByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen />
    );
    fireEvent.click(await findByTestId("camera"));
    expect(await findByTestId("camerahidden")).toBeInTheDocument();
    fireEvent.click(await findByTestId("camera"));
    expect(await findByTestId("camerashown")).toBeInTheDocument();
    expect(queryByTestId("camerahidden")).toBeFalsy();
});

test("End depo button doesn´t show if prop is false", () => {
    const { queryByTestId } = renderWithGlobalContext(<ControlsBar {...props} />);
    expect(queryByTestId("end")).toBeFalsy();
});

test("Record button doesn´t show if prop is false", () => {
    const { queryByTestId } = renderWithGlobalContext(<ControlsBar {...props} />);
    expect(queryByTestId("record")).toBeFalsy();
});

test("End depo button shows if prop is true", () => {
    const { queryByTestId } = renderWithGlobalContext(<ControlsBar {...props} canEnd />);
    expect(queryByTestId("end")).toBeTruthy();
});

test("Record button shows if prop is true", () => {
    const { queryByTestId } = renderWithGlobalContext(<ControlsBar {...props} canRecord />);
    expect(queryByTestId("record")).toBeTruthy();
});

test("Show modal when click on JOIN Breakroom if is recording", () => {
    const { queryByTestId, queryAllByTestId, queryByText } = renderWithGlobalContext(
        <ControlsBar {...props} isRecording />
    );
    fireEvent.click(queryByTestId("breakrooms"));
    fireEvent.click(queryAllByTestId("join_breakroom")[0]);
    expect(queryByText(CONSTANTS.BREAKROOM_ON_THE_RECORD_MESSAGE)).toBeTruthy();
});

test("Trigger handleJoinBreakroom when click on JOIN Breakroom if is not recording", () => {
    const { queryByTestId, queryAllByTestId } = renderWithGlobalContext(<ControlsBar {...props} />);
    fireEvent.click(queryByTestId("breakrooms"));
    fireEvent.click(queryAllByTestId("join_breakroom")[0]);
    expect(props.handleJoinBreakroom).toBeCalledWith(breakrooms[0].id);
});

test("Should call setParticipantStatus endpoint with muted in true by default", async () => {
    const customDeps = getMockDeps();
    customDeps.apiService.setParticipantStatus = jest.fn().mockResolvedValue({});
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen />, customDeps);
    fireEvent.click(await findByTestId("audio"));
    await waitForDomChange();
    expect(customDeps.apiService.setParticipantStatus).toHaveBeenCalledWith({ isMuted: true });
});

test("Should call setParticipantStatus endpoint with muted in false when it is already muted", async () => {
    const customDeps = getMockDeps();
    customDeps.apiService.setParticipantStatus = jest.fn().mockResolvedValue({});
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen />, customDeps);
    fireEvent.click(await findByTestId("audio"));
    await waitForDomChange();
    fireEvent.click(await findByTestId("audio"));
    await waitForDomChange();
    expect(customDeps.apiService.setParticipantStatus).toHaveBeenCalledWith({ isMuted: false });
});
test("Shows correct modal text if registered participant is not a witness and redirects to proper route", async () => {
    AUTH.VALID();
    const modalText = getLeaveModalTextContent(false, false);
    const { getByText, getByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} localParticipant={getParticipant("test", "Attorney")} />
    );
    fireEvent.click(getByTestId(CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID));
    await waitForDomChange();
    expect(getByText(modalText.negativeLabel)).toBeInTheDocument();
    expect(getByText(modalText.positiveLabel)).toBeInTheDocument();
    expect(getByText(modalText.title)).toBeInTheDocument();
    expect(getByText(modalText.subTitle)).toBeInTheDocument();
    fireEvent.click(getByText(modalText.positiveLabel));
    await wait(500);
    expect(mockHistoryPush).toHaveBeenCalledWith("/depositions");
});

test("Shows correct modal text if non-registered participant is not a witness and redirects to proper route", async () => {
    AUTH.NOT_VALID();
    const modalText = getLeaveModalTextContent(false, false);
    const { getByText, getByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} localParticipant={getParticipant("test", "Attorney")} />
    );
    fireEvent.click(getByTestId(CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID));
    await waitForDomChange();
    expect(getByText(modalText.negativeLabel)).toBeInTheDocument();
    expect(getByText(modalText.positiveLabel)).toBeInTheDocument();
    expect(getByText(modalText.title)).toBeInTheDocument();
    expect(getByText(modalText.subTitle)).toBeInTheDocument();
    fireEvent.click(getByText(modalText.positiveLabel));
    await wait(500);
    expect(mockHistoryPush).toHaveBeenCalledWith(TEST_CONSTANTS.NON_WITNESS_NON_REGISTERED_EXPECTED_REDIRECT_BODY);
});
test("Shows correct modal text if participant is a non-registered witness and redirects to proper route", async () => {
    AUTH.NOT_VALID();
    const modalText = getLeaveModalTextContent(false, true);
    const { getByText, getByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} localParticipant={getParticipant("test", "Witness")} />
    );
    fireEvent.click(getByTestId(CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID));
    await waitForDomChange();
    expect(getByText(modalText.negativeLabel)).toBeInTheDocument();
    expect(getByText(modalText.positiveLabel)).toBeInTheDocument();
    expect(getByText(modalText.title)).toBeInTheDocument();
    expect(getByText(modalText.subTitle)).toBeInTheDocument();
    fireEvent.click(getByText(modalText.positiveLabel));
    await wait(500);
    expect(mockHistoryPush).toHaveBeenCalledWith(TEST_CONSTANTS.WITNESS_EXPECTED_REDIRECT_BODY);
});
test("Shows correct modal text if participant is registered and witness and redirects to proper route", async () => {
    AUTH.VALID();
    const modalText = getLeaveModalTextContent(false, true);
    const { getByText, getByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} localParticipant={getParticipant("test", "Witness")} />
    );
    fireEvent.click(getByTestId(CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID));
    await waitForDomChange();
    expect(getByText(modalText.negativeLabel)).toBeInTheDocument();
    expect(getByText(modalText.positiveLabel)).toBeInTheDocument();
    expect(getByText(modalText.title)).toBeInTheDocument();
    expect(getByText(modalText.subTitle)).toBeInTheDocument();
    fireEvent.click(getByText(modalText.positiveLabel));
    await wait(500);
    expect(mockHistoryPush).toHaveBeenCalledWith("/depositions");
});

test("Shows correct modal text if participant is a witness and the depo is recording and doesn´t redirect", async () => {
    AUTH.VALID();
    const modalText = getLeaveModalTextContent(true, true);
    const { getByText, getByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} localParticipant={getParticipant("test", "Witness")} isRecording />
    );
    fireEvent.click(getByTestId(CONSTANTS.CONTROLS_BAR_LEAVE_DEPOSITION_BUTTON_TEST_ID));
    await waitForDomChange();
    expect(queryByTestId("confirm_nagative_button")).toBeFalsy();
    expect(getByText(modalText.positiveLabel)).toBeInTheDocument();
    expect(getByText(modalText.title)).toBeInTheDocument();
    expect(getByText(modalText.subTitle)).toBeInTheDocument();
    fireEvent.click(getByText(modalText.positiveLabel));
    await wait(500);
    expect(mockHistoryPush).not.toHaveBeenCalled();
});

test("Shows a locked breakroom item when a breakroom is locked", async () => {
    AUTH.VALID();
    const breakroomsWithOneLocked = getBreakrooms(true);
    const { queryByTestId } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            breakrooms={breakroomsWithOneLocked}
        />
    );
    fireEvent.click(queryByTestId("breakrooms"));
    expect(queryByTestId("breakroom_locked")).toBeInTheDocument();
});

test("Shows a locked breakroom item when a breakroom is locked", async () => {
    AUTH.VALID();
    const breakroomsWithOneLocked = getBreakrooms(true);
    const { queryByTestId } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            breakrooms={breakroomsWithOneLocked}
        />
    );
    fireEvent.click(queryByTestId("breakrooms"));
    expect(queryByTestId("breakroom_locked")).toBeInTheDocument();
});

test("Shows a locked breakroom item when a breakroom is locked and show disabled if canJoinToLockedBreakroom is false", async () => {
    AUTH.VALID();
    const breakroomsWithOneLocked = getBreakrooms(true);
    const { queryByTestId } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            breakrooms={breakroomsWithOneLocked}
        />
    );
    fireEvent.click(queryByTestId("breakrooms"));
    expect(queryByTestId("breakroom_locked")).toBeDisabled();
});

test("Shows a locked breakroom item when a breakroom is locked and show disabled if canJoinToLockedBreakroom is true", async () => {
    AUTH.VALID();
    const breakroomsWithOneLocked = getBreakrooms(true);
    const { queryByTestId } = renderWithGlobalContext(
        <ControlsBar
            {...props}
            localParticipant={getParticipant("test", "Witness")}
            isRecording
            breakrooms={breakroomsWithOneLocked}
            canJoinToLockedBreakroom
        />
    );
    fireEvent.click(queryByTestId("breakrooms"));
    expect(queryByTestId("breakroom_locked")).not.toBeDisabled();
});
