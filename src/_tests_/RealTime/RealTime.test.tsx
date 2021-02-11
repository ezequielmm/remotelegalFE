import React from "react";
import { act } from "react-dom/test-utils";
import { wait } from "../../helpers/wait";
import RealTime from "../../routes/InDepo/RealTime";
import {
    getTranscription,
    getTranscriptionsWithPause,
    getTranscriptionsWithPaused,
    timeZone,
} from "../mocks/transcription";
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

(global.navigator as any).mediaDevices = {
    getUserMedia: jest.fn().mockResolvedValue(true),
};
const transcription = getTranscription();
describe("RealTime", () => {
    it("shows no transcriptions when transcriptions are empty", async () => {
        const { queryByTestId } = renderWithGlobalContext(<RealTime visible transcriptions={[]} timeZone={timeZone} />);
        await wait(100);
        act(() => expect(queryByTestId("transcription_text")).toBeFalsy());
        act(() => expect(queryByTestId("transcription_title")).toBeFalsy());
    });

    test("shows transcriptions when transcriptions list is not empty", async () => {
        const { getByTestId } = renderWithGlobalContext(
            <RealTime visible transcriptions={[transcription]} timeZone={timeZone} />
        );
        await wait(100);
        act(() => expect(getByTestId("transcription_text")).toBeTruthy());
        act(() => expect(getByTestId("transcription_title")).toBeTruthy());
    });

    test("shows transcriptions with pause message", async () => {
        const { getByTestId } = renderWithGlobalContext(
            <RealTime visible transcriptions={getTranscriptionsWithPause()} timeZone={timeZone} />
        );
        await wait(100);
        act(() => expect(getByTestId("transcription_paused")).toBeTruthy());
    });
    test("shows transcriptions with paused message", async () => {
        const { getByTestId } = renderWithGlobalContext(
            <RealTime visible transcriptions={getTranscriptionsWithPaused()} timeZone={timeZone} />
        );
        await wait(100);
        act(() => expect(getByTestId("transcription_currently_paused")).toBeTruthy());
    });
});
