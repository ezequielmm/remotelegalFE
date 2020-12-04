import { renderHook } from "@testing-library/react-hooks";
import useParticipantTracks from "../../hooks/InDepo/useParticipantTracks";
import getParticipant from "../mocks/participant";

const participant = getParticipant("test1");

test("Tracks have the correct length", () => {
    const { result } = renderHook(() => useParticipantTracks(participant));
    expect(result.current.videoTracks).toHaveLength(1);
    expect(result.current.audioTracks).toHaveLength(1);
    expect(result.current.dataTracks).toHaveLength(1);
});

test("No tracks are returned if the participant is null", () => {
    const { result } = renderHook(() => useParticipantTracks(null));
    expect(result.current.videoTracks).toHaveLength(0);
    expect(result.current.audioTracks).toHaveLength(0);
    expect(result.current.dataTracks).toHaveLength(0);
});

test("Attach method is called for video and audio track", () => {
    const { result } = renderHook(() => useParticipantTracks(participant));
    expect(result.current.videoTracks[0].attach).toBeCalledWith(result.current.videoRef.current);
    expect(result.current.audioTracks[0].attach).toBeCalledWith(result.current.audioRef.current);
});

test("Detach method is called for video and audio track", () => {
    const { result, rerender } = renderHook(() => useParticipantTracks(participant));
    rerender();
    expect(result.current.videoTracks[0].detach).toBeCalled();
    expect(result.current.audioTracks[0].detach).toBeCalled();
});
