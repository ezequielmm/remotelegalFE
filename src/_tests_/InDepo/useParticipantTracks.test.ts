import { renderHook } from "@testing-library/react-hooks";
import changeSpeakers from "../../helpers/changeSpeakers";
import useParticipantTracks from "../../hooks/InDepo/useParticipantTracks";
import getParticipant from "../mocks/participant";
import * as TESTS_CONSTANTS from "../constants/InDepo";
import wrapper, { wrapperWithOverrideState } from "../mocks/wrapper";
import state from "../mocks/state";

jest.mock("../../helpers/changeSpeakers", () => ({
    __esModule: true,
    default: jest.fn(),
}));

let participant;

beforeEach(() => {
    localStorage.clear();
    participant = getParticipant();
});

test("Tracks have the correct length", () => {
    const { result } = renderHook(() => useParticipantTracks(participant), { wrapper });
    expect(result.current.videoTracks).toHaveLength(1);
    expect(result.current.audioTracks).toHaveLength(1);
    expect(result.current.dataTracks).toHaveLength(1);
});
test("No tracks are returned if the participant is null", () => {
    const { result } = renderHook(() => useParticipantTracks(null), { wrapper });
    expect(result.current.videoTracks).toHaveLength(0);
    expect(result.current.audioTracks).toHaveLength(0);
    expect(result.current.dataTracks).toHaveLength(0);
});
test("Attach method is called for video and audio track", () => {
    const { result } = renderHook(() => useParticipantTracks(participant), { wrapper });
    expect(result.current.videoTracks[0].attach).toBeCalledWith(result.current.videoRef.current);
    expect(result.current.audioTracks[0].attach).toBeCalledWith(result.current.audioRef.current);
});
test("Detach method is called for video and audio track", () => {
    const { result, rerender, waitFor } = renderHook(() => useParticipantTracks(participant), { wrapper });
    rerender();
    waitFor(() => {
        expect(result.current.videoTracks[0].detach).toBeCalled();
        expect(result.current.audioTracks[0].detach).toBeCalled();
    });
});
test("If speakers devices exist in localStorage, changeSpeakers is called", async () => {
    const speakers = JSON.stringify(TESTS_CONSTANTS.DEVICES_MOCK);
    localStorage.setItem("selectedDevices", speakers);
    const { result, waitFor } = renderHook(() => useParticipantTracks(participant), { wrapper });
    await waitFor(() => {
        expect(changeSpeakers).toHaveBeenCalledWith(
            result.current.audioRef.current,
            TESTS_CONSTANTS.DEVICES_MOCK.speakers
        );
    });
});
test("change speakers doesn´t get called if devices don´t exist in localStorage", async () => {
    const { waitFor } = renderHook(() => useParticipantTracks(participant), { wrapper });
    await waitFor(() => {
        expect(changeSpeakers).not.toHaveBeenCalled();
    });
});
test("change speakers is called if newSpeaker is present", async () => {
    const { waitFor, result, rerender } = renderHook(() => useParticipantTracks(participant), {
        wrapper: (children: any) =>
            wrapperWithOverrideState(children, { room: { ...state.state.room, newSpeaker: "test1234" } }),
    });
    result.current.audioRef.current = {} as any;
    rerender();
    await waitFor(() => expect(changeSpeakers).toHaveBeenCalledWith(result.current.audioRef.current, "test1234"));
});
