import { renderHook } from "@testing-library/react-hooks";
import useParticipantTracks from "../../hooks/VideoChat/useParticipantTracks";
import participant from "../mocks/participant";

test("Tracks have the correct length", () => {
    const { result } = renderHook(() => useParticipantTracks(participant));
    expect(result.current.videoTracks.length).toBe(1);
    expect(result.current.audioTracks.length).toBe(1);
    expect(result.current.dataTracks.length).toBe(1);
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
