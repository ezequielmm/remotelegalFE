import { renderHook, act } from "@testing-library/react-hooks";
import useTracksStatus from "../../hooks/VideoChat/useTracksStatus";
import buildTrack, { TRACK_TYPE } from "../mocks/videoTrack";

test("when audio is toggled for the first time, the value changes to false", () => {
    const { result } = renderHook(() =>
        useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)])
    );

    expect(result.current.isAudioEnabled).toBe(true);

    act(() => {
        result.current.setAudioEnabled(false);
    });
    expect(result.current.isAudioEnabled).toBe(false);
});

test("when audio is toggled again, the value changes back to true", () => {
    const { result } = renderHook(() =>
        useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)])
    );

    expect(result.current.isAudioEnabled).toBe(true);

    act(() => {
        result.current.setAudioEnabled(false);
    });

    expect(result.current.isAudioEnabled).toBe(false);

    act(() => {
        result.current.setAudioEnabled(true);
    });
    expect(result.current.isAudioEnabled).toBe(true);
});

test("when video is toggled for the first time, the value changes to false", () => {
    const { result } = renderHook(() =>
        useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)])
    );

    expect(result.current.cameraEnabled).toBe(true);

    act(() => {
        result.current.setCameraEnabled(false);
    });
    expect(result.current.cameraEnabled).toBe(false);
});

test("when audio is toggled again, the value changes back to true", () => {
    const { result } = renderHook(() =>
        useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)])
    );

    expect(result.current.cameraEnabled).toBe(true);

    act(() => {
        result.current.setCameraEnabled(false);
    });

    expect(result.current.cameraEnabled).toBe(false);

    act(() => {
        result.current.setCameraEnabled(true);
    });
    expect(result.current.cameraEnabled).toBe(true);
});
