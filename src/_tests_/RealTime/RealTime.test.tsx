import React from "react";
import { screen, act } from "@testing-library/react";
import { wait } from "../../helpers/wait";
import RealTime from "../../routes/InDepo/RealTime";
import {
    getTranscription,
    getTranscriptionsWithPause,
    getTranscriptionsWithPaused,
    getVeryLongTranscription,
    timeZone,
} from "../mocks/transcription";
import "mutationobserver-shim";
import renderWithGlobalContext from "../utils/renderWithGlobalContext";

window.HTMLElement.prototype.scrollIntoView = jest.fn();

jest.mock("audio-recorder-polyfill", () => {
    return jest.fn().mockImplementation(() => ({
        start: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        stop: jest.fn(),
        stream: { getTracks: () => [{ stop: () => {} }] },
    }));
});

(global.navigator as any).mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(true),
};
const transcription = getTranscription();
describe("RealTime", () => {
    it("shows no transcriptions when transcriptions are empty", async () => {
        renderWithGlobalContext(<RealTime visible transcriptions={[]} timeZone={timeZone} />);
        await wait(100);
        act(() => expect(screen.queryByTestId("transcription_text")).toBeFalsy());
        act(() => expect(screen.queryByTestId("transcription_title")).toBeFalsy());
    });

    test("shows transcriptions when transcriptions list is not empty", async () => {
        renderWithGlobalContext(<RealTime visible transcriptions={[transcription]} timeZone={timeZone} />);
        await wait(100);
        act(() => expect(screen.getByTestId("transcription_text")).toBeTruthy());
        act(() => expect(screen.getByTestId("transcription_title")).toBeTruthy());
    });

    test("shows transcriptions with pause message", async () => {
        renderWithGlobalContext(<RealTime visible transcriptions={getTranscriptionsWithPause()} timeZone={timeZone} />);
        await wait(100);
        act(() => expect(screen.getByTestId("transcription_paused")).toBeTruthy());
    });
    test("shows transcriptions with paused message", async () => {
        renderWithGlobalContext(
            <RealTime visible transcriptions={getTranscriptionsWithPaused()} timeZone={timeZone} />
        );
        await wait(100);
        act(() => expect(screen.getByTestId("transcription_currently_paused")).toBeTruthy());
    });

    test("renders only necessary transcriptions", async () => {
        renderWithGlobalContext(<RealTime visible transcriptions={getVeryLongTranscription()} timeZone={timeZone} />);
        await wait(100);
        act(() => expect(screen.getAllByTestId("transcription_text").length).toBeLessThan(100));
    });
});
