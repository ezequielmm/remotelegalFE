import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import useRecording from "../../hooks/InDepo/useRecording";
import state from "../mocks/state";
import actions from "../../state/InDepo/InDepoActions";
import * as CONSTANTS from "../mocks/transcription";
import { defineProviderValues } from "../../state/GlobalState";
import getMockDeps from "../utils/getMockDeps";
import { wait } from "../../helpers/wait";
import { TranscriptionsContext } from "../../state/Transcriptions/TranscriptionsContext";

jest.mock("react-router", () => ({
    ...(jest.requireActual("react-router") as any),
    useParams: () => ({
        useParams: jest.fn(),
    }),
}));

let overridenWrapper;
let addNewTranscriptionMock;
let mockDeps;

beforeEach(() => {
    const { dispatch } = state;
    mockDeps = getMockDeps();
    addNewTranscriptionMock = jest.fn();
    overridenWrapper = ({ children }: { children: React.ReactNode }) => (
        <TranscriptionsContext.Provider
            value={
                {
                    addNewTranscription: addNewTranscriptionMock,
                } as any
            }
        >
            {defineProviderValues(state.state, dispatch, mockDeps, children)}
        </TranscriptionsContext.Provider>
    );
});

describe("useRecording", () => {
    test("It calls setIsRecording with true after the API service responds and the dataTrack with the right JSON", async () => {
        const { result, waitFor } = renderHook(() => useRecording(true), { wrapper: overridenWrapper });
        result.current.startPauseRecording();
        await waitFor(() => {
            expect(state.dispatch).toHaveBeenCalledWith(actions.setIsRecording(true));
            expect(state.state.room.dataTrack.send).toHaveBeenCalledWith(
                JSON.stringify({ module: "recordDepo", value: CONSTANTS.getRecordResponse(true), recording: true })
            );
            expect(addNewTranscriptionMock).toHaveBeenCalledWith(CONSTANTS.getRecordResponse(true), true);
        });
    });

    test("It calls setIsRecording with false after the API service responds and the dataTrack with the right JSON", async () => {
        mockDeps.apiService.recordDeposition = jest.fn().mockResolvedValue(CONSTANTS.getRecordResponse(false));
        const { result, waitFor } = renderHook(() => useRecording(false), { wrapper: overridenWrapper });
        result.current.startPauseRecording();
        await waitFor(() => {
            expect(state.dispatch).toHaveBeenCalledWith(actions.setIsRecording(false));
            expect(state.state.room.dataTrack.send).toHaveBeenCalledWith(
                JSON.stringify({ module: "recordDepo", value: CONSTANTS.getRecordResponse(false), recording: false })
            );
            expect(addNewTranscriptionMock).toHaveBeenCalledWith(CONSTANTS.getRecordResponse(false), false);
        });
    });

    test("It calls has loading in true for a second after calling startPauseRecoding", async () => {
        const { result, waitForNextUpdate } = renderHook(() => useRecording(false), { wrapper: overridenWrapper });
        result.current.startPauseRecording();
        await waitForNextUpdate();
        expect(result.current.loadingStartPauseRecording).toBeTruthy();
        await wait(1000);
        expect(result.current.loadingStartPauseRecording).toBeFalsy();
    });
});
