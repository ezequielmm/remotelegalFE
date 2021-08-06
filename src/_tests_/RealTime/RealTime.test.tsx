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
import { TranscriptionsContext } from "../../state/Transcriptions/TranscriptionsContext";

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
    const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight");
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");

    beforeAll(() => {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", { configurable: true, value: 50 });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", { configurable: true, value: 50 });
    });

    afterAll(() => {
        Object.defineProperty(HTMLElement.prototype, "offsetHeight", originalOffsetHeight);
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", originalOffsetWidth);
    });

    it("shows no transcriptions when transcriptions are empty", async () => {
        renderWithGlobalContext(
            <TranscriptionsContext.Provider value={{ transcriptions: [] } as any}>
                <RealTime timeZone={timeZone} />
            </TranscriptionsContext.Provider>
        );
        await wait(100);
        act(() => expect(screen.queryByTestId("transcription_text")).toBeFalsy());
        act(() => expect(screen.queryByTestId("transcription_title")).toBeFalsy());
    });

    test("shows transcriptions when transcriptions list is not empty", async () => {
        renderWithGlobalContext(
            <TranscriptionsContext.Provider value={{ transcriptions: [transcription] } as any}>
                <RealTime timeZone={timeZone} />
            </TranscriptionsContext.Provider>
        );
        await wait(100);
        act(() => expect(screen.getByTestId("transcription_text")).toBeTruthy());
        act(() => expect(screen.getByTestId("transcription_title")).toBeTruthy());
    });

    test("shows transcriptions with pause message", async () => {
        renderWithGlobalContext(
            <TranscriptionsContext.Provider value={{ transcriptions: getTranscriptionsWithPause() } as any}>
                <RealTime timeZone={timeZone} />
            </TranscriptionsContext.Provider>
        );
        await wait(100);
        act(() => expect(screen.getByTestId("transcription_paused")).toBeTruthy());
    });
    test("shows transcriptions with paused message", async () => {
        renderWithGlobalContext(
            <TranscriptionsContext.Provider value={{ transcriptions: getTranscriptionsWithPaused() } as any}>
                <RealTime timeZone={timeZone} />
            </TranscriptionsContext.Provider>
        );
        await wait(100);
        act(() => expect(screen.getByTestId("transcription_currently_paused")).toBeTruthy());
    });

    test("renders only necessary transcriptions", async () => {
        renderWithGlobalContext(
            <TranscriptionsContext.Provider value={{ transcriptions: getVeryLongTranscription() } as any}>
                <RealTime timeZone={timeZone} />
            </TranscriptionsContext.Provider>
        );
        await wait(100);
        act(() => expect(screen.getAllByTestId("transcription_text").length).toBeLessThan(100));
    });
});
