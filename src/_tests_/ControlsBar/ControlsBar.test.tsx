import { fireEvent } from "@testing-library/react";
import React from "react";
import ControlsBar from "../../components/ControlsBar";
import getParticipant from "../mocks/participant";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

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

Object.defineProperty(global.navigator, "mediaDevices", {
    get: () => ({
        getUserMedia: jest.fn().mockResolvedValue(false),
    }),
});

test("Exhibits is opened when exhibits Open is true", async () => {
    const { getByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen />);
    expect(getByTestId("exhibits")).toBeInTheDocument();
});

test("Real Time is opened when realTimeOpen is true", () => {
    const { getByTestId } = renderWithGlobalContext(<ControlsBar {...props} realTimeOpen />);
    expect(getByTestId("realtime")).toBeInTheDocument();
});

test("Both exhibits and real time are opened when both conditions are true", () => {
    const { getByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen realTimeOpen />);
    expect(getByTestId("exhibits")).toBeInTheDocument();
    expect(getByTestId("realtime")).toBeInTheDocument();
});

test("Muted icon is toggled when clicking the mute button", () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen />
    );
    fireEvent.click(getByTestId("audio"));
    expect(getByTestId("muted")).toBeInTheDocument();
    fireEvent.click(getByTestId("audio"));
    expect(getByTestId("unmuted")).toBeInTheDocument();
    expect(queryByTestId("muted")).toBeFalsy();
});

test("Camera icon is toggled when clicking the camera button", () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen />
    );
    fireEvent.click(getByTestId("camera"));
    expect(getByTestId("camerahidden")).toBeInTheDocument();
    fireEvent.click(getByTestId("camera"));
    expect(getByTestId("camerashown")).toBeInTheDocument();
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
