import { fireEvent, waitForDomChange } from "@testing-library/react";
import React from "react";
import ControlsBar from "../../components/ControlsBar";
import { getBreakrooms } from "../mocks/breakroom";
import * as CONSTANTS from "../../constants/inDepo";
import getParticipant from "../mocks/participant";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";
import getMockDeps from "../utils/getMockDeps";

jest.mock("audio-recorder-polyfill", () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
        stream: { getTracks: () => [{ stop: () => {} }] },
    }));
});

let props;
const breakrooms = getBreakrooms();

beforeEach(() => {
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

test("Should not call setParticipantStatus endpoint when click on mute icon by default", async () => {
    const customDeps = getMockDeps();
    customDeps.apiService.setParticipantStatus = jest.fn().mockResolvedValue({});
    const { findByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen realTimeOpen />, customDeps);
    fireEvent.click(await findByTestId("audio"));
    await waitForDomChange();
    expect(customDeps.apiService.setParticipantStatus).not.toBeCalled();
});

test("Call setParticipantStatus endpoint when click on mute icon and isRecording is true", async () => {
    const customDeps = getMockDeps();
    customDeps.apiService.setParticipantStatus = jest.fn().mockResolvedValue({});
    const { findByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen isRecording />,
        customDeps
    );
    fireEvent.click(await findByTestId("audio"));
    await waitForDomChange();
    expect(customDeps.apiService.setParticipantStatus).toBeCalled();
});
