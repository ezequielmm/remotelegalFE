import React from "react";
import { fireEvent } from "@testing-library/react";
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
    };
});

test("Exhibits is opened when exhibits Open is true", async () => {
    const { getByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen />);
    expect(getByTestId("exhibits")).toBeInTheDocument();
});

test("Real Time is opened when realTimeOpen is true", async () => {
    const { getByTestId } = renderWithGlobalContext(<ControlsBar {...props} realTimeOpen />);
    expect(getByTestId("realtime")).toBeInTheDocument();
});

test("Both exhibits and real time are opened when both conditions are true", async () => {
    const { getByTestId } = renderWithGlobalContext(<ControlsBar {...props} exhibitsOpen realTimeOpen />);
    expect(getByTestId("exhibits")).toBeInTheDocument();
    expect(getByTestId("realtime")).toBeInTheDocument();
});

test("Muted icon is toggled when clicking the mute button", async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen />
    );
    fireEvent.click(getByTestId("audio"));
    expect(getByTestId("muted")).toBeInTheDocument();
    fireEvent.click(getByTestId("audio"));
    expect(getByTestId("unmuted")).toBeInTheDocument();
    expect(queryByTestId("muted")).toBeFalsy();
});

test("Camera icon is toggled when clicking the camera button", async () => {
    const { getByTestId, queryByTestId } = renderWithGlobalContext(
        <ControlsBar {...props} exhibitsOpen realTimeOpen />
    );
    fireEvent.click(getByTestId("camera"));
    expect(getByTestId("camerahidden")).toBeInTheDocument();
    fireEvent.click(getByTestId("camera"));
    expect(getByTestId("camerashown")).toBeInTheDocument();
    expect(queryByTestId("camerahidden")).toBeFalsy();
});
