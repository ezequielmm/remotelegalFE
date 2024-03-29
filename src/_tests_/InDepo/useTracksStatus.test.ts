import { renderHook, act } from "@testing-library/react-hooks";
import useTracksStatus from "../../hooks/InDepo/useTracksStatus";
import state from "../mocks/state";
import buildTrack, { TRACK_TYPE } from "../mocks/videoTrack";
import wrapper, { wrapperWithOverrideState } from "../mocks/wrapper";

jest.mock("react-router", () => ({
    ...(jest.requireActual("react-router") as any),
    useParams: () => ({ depositionID: "test1234", breakroomID: "testBreakroom1234" }),
}));

beforeEach(() => {
    localStorage.clear();
});

test("when audio is toggled for the first time, the value changes to false", () => {
    const { result } = renderHook(
        () => useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)]),
        {
            wrapper: (children: any) =>
                wrapperWithOverrideState(children, { room: { ...state.state.room, publishedAudioTrackStatus: null } }),
        }
    );

    expect(result.current.isAudioEnabled).toBe(true);

    act(() => {
        result.current.setAudioEnabled(false);
    });
    expect(result.current.isAudioEnabled).toBe(false);
});

test("when audio is toggled again, the value changes back to true", () => {
    const { result } = renderHook(
        () => useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)]),
        {
            wrapper: (children: any) =>
                wrapperWithOverrideState(children, { room: { ...state.state.room, publishedAudioTrackStatus: null } }),
        }
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
    const { result } = renderHook(
        () => useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)]),
        { wrapper }
    );

    expect(result.current.isCameraEnabled).toBe(true);

    act(() => {
        result.current.setCameraEnabled(false);
    });
    expect(result.current.isCameraEnabled).toBe(false);
});

test("when values are toggled, the values are saved in localStorage", () => {
    const { result } = renderHook(
        () => useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)]),
        {
            wrapper: (children: any) =>
                wrapperWithOverrideState(children, {
                    room: { ...state.state.room, initialCameraStatus: null, publishedAudioTrackStatus: null },
                }),
        }
    );
    act(() => {
        result.current.setCameraEnabled(false);
        result.current.setAudioEnabled(false);
    });
    const savedValues = JSON.parse(localStorage.getItem("test1234"));
    expect(savedValues).toStrictEqual({ isCameraEnabled: false, isAudioEnabled: false });
});

test("sets initial state from localStorage", async () => {
    localStorage.setItem(
        "test1234",
        JSON.stringify({
            isCameraEnabled: false,
            isAudioEnabled: false,
        })
    );
    const { result, waitFor } = renderHook(
        () => useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)]),
        {
            wrapper: (children: any) =>
                wrapperWithOverrideState(children, {
                    room: { ...state.state.room, initialCameraStatus: null, publishedAudioTrackStatus: null },
                }),
        }
    );

    await waitFor(() => {
        expect(result.current.isAudioEnabled).toBe(false);
        expect(result.current.isCameraEnabled).toBe(false);
    });
});

test("when audio is toggled again, the value changes back to true", () => {
    const { result } = renderHook(
        () => useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)]),
        {
            wrapper: (children: any) =>
                wrapperWithOverrideState(children, { room: { ...state.state.room, initialCameraStatus: true } }),
        }
    );

    expect(result.current.isCameraEnabled).toBe(true);

    act(() => {
        result.current.setCameraEnabled(false);
    });

    expect(result.current.isCameraEnabled).toBe(false);

    act(() => {
        result.current.setCameraEnabled(true);
    });
    expect(result.current.isCameraEnabled).toBe(true);
});

test("if initial camera status is true, the cameraEnabled status starts with true", () => {
    const { result } = renderHook(
        () => useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)]),
        {
            wrapper: (children: any) =>
                wrapperWithOverrideState(children, { room: { ...state.state.room, initialCameraStatus: true } }),
        }
    );
    expect(result.current.isCameraEnabled).toBe(true);
});

test("if initial camera status is false, the cameraEnabled status starts with false", () => {
    const { result } = renderHook(
        () => useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)]),
        {
            wrapper: (children: any) =>
                wrapperWithOverrideState(children, { room: { ...state.state.room, initialCameraStatus: false } }),
        }
    );
    expect(result.current.isCameraEnabled).toBe(false);
});

test("if published audio status is true, the audioEnabled status turns to true", () => {
    const { result } = renderHook(
        () => useTracksStatus([buildTrack(TRACK_TYPE.audio, true)], [buildTrack(TRACK_TYPE.video, true)]),
        {
            wrapper: (children: any) =>
                wrapperWithOverrideState(children, { room: { ...state.state.room, publishedAudioTrackStatus: true } }),
        }
    );
    expect(result.current.isAudioEnabled).toBe(true);
});
