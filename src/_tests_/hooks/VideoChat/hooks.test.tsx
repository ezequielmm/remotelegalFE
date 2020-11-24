import { renderHook, act } from "@testing-library/react-hooks";
import { EventEmitter } from "events";
import { LocalParticipant } from "twilio-video";
import { useVideoStatus } from "../../../hooks/VideoChat/hooks";

const videoTracksMocks = new Map();
videoTracksMocks.set("item1", { track: { kind: "video", enable: jest.fn() } });

const audioTracksMocks = new Map();
audioTracksMocks.set("item2", { track: { kind: "audio", enable: jest.fn() } });

class MockRoom extends EventEmitter {
    state = "connected";
    disconnect = jest.fn();

    localParticipant = {
        publishTrack: jest.fn(),
        videoTracks: videoTracksMocks,
        audioTracks: audioTracksMocks,
        on: jest.fn(),
    };
}

const mockRoom = new MockRoom();

test("when toggle audio isMuted should be changed", () => {
    const { result } = renderHook(() => useVideoStatus(mockRoom.localParticipant, true));
    expect(result.current.isAudioEnabled).toBe(true);
    act(() => {
        result.current.toggleAudio();
    });
    expect(result.current.isAudioEnabled).toBe(false);
});

test("when toggle audio isMuted should be changed", () => {
    const { result } = renderHook(() => useVideoStatus(mockRoom.localParticipant, true));
    expect(result.current.cameraEnabled).toBe(true);
    act(() => {
        result.current.toggleVideo();
    });
    expect(result.current.cameraEnabled).toBe(false);
});
