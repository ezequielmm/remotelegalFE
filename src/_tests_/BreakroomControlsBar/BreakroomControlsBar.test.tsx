import { fireEvent } from "@testing-library/react";
import React from "react";
import ControlsBar from "../../components/ControlsBar";
import BreakroomControlsBar from "../../components/BreakroomControlsBar";
import getParticipant from "../mocks/participant";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

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

beforeEach(() => {
    props = {
        isRecording: false,
        togglerRecording: jest.fn(),
        togglerExhibits: jest.fn(),
        togglerRealTime: jest.fn(),
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

test("Confirm modal exists when end button is clicked", async () => {
    const { findByTestId, queryByTestId } = renderWithGlobalContext(<BreakroomControlsBar {...props} />);
    fireEvent.click(await findByTestId("end"));
    expect(queryByTestId("modalconfirm")).toBeInTheDocument();
});

test("unlock icon should be exists when is not locked", async () => {
    const { queryByTestId, queryByText } = renderWithGlobalContext(<BreakroomControlsBar {...props} />);
    expect(queryByTestId("lock_breakroom")).toBeInTheDocument();
    expect(queryByText("Unlock.svg")).toBeInTheDocument();
});

test("lock icon should be exists when is locked", async () => {
    const { queryByTestId, queryByText } = renderWithGlobalContext(<BreakroomControlsBar {...props} isLocked />);
    expect(queryByTestId("lock_breakroom")).toBeInTheDocument();
    expect(queryByText("Lock.svg")).toBeInTheDocument();
});
