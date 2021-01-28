import React from "react";
import { act } from "react-dom/test-utils";
import RealTime from "../../routes/InDepo/RealTime";
import { rootReducer } from "../../state/GlobalState";
import {
    getTranscription,
    getTranscriptionsWithPause,
    getTranscriptionsWithPaused,
    timeZone,
    transcriptionTimeESTFormatted,
} from "../mocks/transcription";
import getMockDeps from "../utils/getMockDeps";
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
        const { queryByTestId } = renderWithGlobalContext(<RealTime visible timeZone={timeZone} />, getMockDeps(), {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    transcriptions: [],
                },
            },
        });
        act(() => expect(queryByTestId("transcription_text")).toBeFalsy());
        act(() => expect(queryByTestId("transcription_title")).toBeFalsy());
    });

    test("shows transcriptions when transcriptions list is not empty", async () => {
        const { queryByTestId } = renderWithGlobalContext(<RealTime visible timeZone={timeZone} />, getMockDeps(), {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    transcriptions: [transcription],
                },
            },
        });
        act(() => expect(queryByTestId("transcription_text")).toBeTruthy());
        act(() => expect(queryByTestId("transcription_title")).toBeTruthy());
    });

    test("shows transcriptions with pause message", async () => {
        const { queryByTestId } = renderWithGlobalContext(<RealTime visible timeZone={timeZone} />, getMockDeps(), {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    transcriptions: getTranscriptionsWithPause(),
                },
            },
        });
        act(() => expect(queryByTestId("transcription_paused")).toBeTruthy());
    });
    test("shows transcriptions with paused message", async () => {
        const { queryByTestId } = renderWithGlobalContext(<RealTime visible timeZone={timeZone} />, getMockDeps(), {
            ...rootReducer,
            initialState: {
                room: {
                    ...rootReducer.initialState.room,
                    transcriptions: getTranscriptionsWithPaused(),
                },
            },
        });
        act(() => expect(queryByTestId("transcription_currently_paused")).toBeTruthy());
    });
});
