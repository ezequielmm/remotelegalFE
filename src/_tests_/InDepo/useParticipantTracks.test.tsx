import { renderHook } from "@testing-library/react-hooks";
import Icon from "@rl/prp-components-library/src/components/Icon";
import changeSpeakers from "../../helpers/changeSpeakers";
import useParticipantTracks from "../../hooks/InDepo/useParticipantTracks";
import getParticipant from "../mocks/participant";
import * as TESTS_CONSTANTS from "../constants/InDepo";
import { ReactComponent as UnmuteIcon } from "../../assets/in-depo/Unmute.svg";
import wrapper, { wrapperWithOverrideState } from "../mocks/wrapper";
import state from "../mocks/state";
import trackpubsToTracks from "../../helpers/trackPubsToTracks";

let mockAlertContext;

jest.mock("../../hooks/useFloatingAlertContext", () => ({
    __esModule: true,
    default: () => mockAlertContext,
}));

jest.mock("../../helpers/changeSpeakers", () => ({
    __esModule: true,
    default: jest.fn(),
}));
const mockEnumerateDevices = jest.fn();
Object.defineProperty(global.navigator, "mediaDevices", {
    writable: true,
    value: {
        enumerateDevices: mockEnumerateDevices,
    },
});

let participant;

beforeEach(() => {
    localStorage.clear();
    participant = getParticipant();
    mockAlertContext = jest.fn();
    navigator.mediaDevices.ondevicechange = undefined;
});

test("It restarts tracks with a wireless device if the device changes", async () => {
    localStorage.setItem("selectedDevices", JSON.stringify({}));
    const expectedLocalStorageItem = {
        microphoneForBE: {
            name: "wireless",
        },
        audio: {
            label: "wireless",
            deviceId: {
                exact: "test2",
            },
            groupId: "test2",
        },
    };
    mockEnumerateDevices.mockResolvedValueOnce([
        {
            kind: "audioinput",
            groupId: "test1",
            label: "normal device",
            deviceId: "test1",
        },
    ]);
    const { waitFor } = renderHook(() => useParticipantTracks(participant, true), {
        wrapper: (children: any) =>
            wrapperWithOverrideState(children, { room: { ...state.state.room, newSpeaker: "test1234" } }),
    });
    await waitFor(() => expect(mockEnumerateDevices).toHaveBeenCalled());
    mockEnumerateDevices.mockResolvedValueOnce([
        {
            kind: "audioinput",
            groupId: "test1",
            label: "normal device",
            deviceId: "test1",
        },
        {
            kind: "audioinput",
            groupId: "test2",
            label: "wireless",
            deviceId: "test2",
        },
    ]);
    await navigator.mediaDevices.ondevicechange(null);
    await waitFor(() => {
        expect(trackpubsToTracks(participant.audioTracks)[0].restart).toHaveBeenCalledWith({
            deviceId: "test2",
        });
        expect(mockAlertContext).toHaveBeenCalledWith({
            message: `wireless connected`,
            type: "info",
            duration: 3,
            dataTestId: "new_microphone_connected",
            icon: <Icon icon={UnmuteIcon} />,
        });
        expect(JSON.parse(localStorage.getItem("selectedDevices"))).toEqual(expectedLocalStorageItem);
    });
});

test("It restarts tracks with the default device if the device changes and there´s no wireless available", async () => {
    localStorage.setItem("selectedDevices", JSON.stringify({}));
    const expectedLocalStorageItem = {
        microphoneForBE: {
            name: "normal_device",
        },
        audio: {
            label: "normal_device",
            deviceId: {
                exact: "test2",
            },
            groupId: "test2",
        },
    };

    mockEnumerateDevices.mockResolvedValueOnce([
        {
            kind: "audioinput",
            groupId: "test1",
            label: "normal device",
            deviceId: "test1",
        },
        {
            kind: "audioinput",
            groupId: "test2",
            label: "wireless",
            deviceId: "test2",
        },
    ]);

    mockEnumerateDevices.mockResolvedValueOnce([
        {
            kind: "audioinput",
            groupId: "test2",
            label: "normal_device",
            deviceId: "test2",
        },
    ]);
    const { waitFor } = renderHook(() => useParticipantTracks(participant, true), {
        wrapper: (children: any) =>
            wrapperWithOverrideState(children, { room: { ...state.state.room, newSpeaker: "test1234" } }),
    });
    await navigator.mediaDevices.ondevicechange(null);
    await waitFor(() => {
        expect(trackpubsToTracks(participant.audioTracks)[0].restart).toHaveBeenCalledWith({
            deviceId: "test2",
        });
        expect(mockAlertContext).toHaveBeenCalledWith({
            message: `normal_device connected`,
            type: "info",
            duration: 3,
            dataTestId: "new_microphone_connected",
            icon: <Icon icon={UnmuteIcon} />,
        });
        expect(JSON.parse(localStorage.getItem("selectedDevices"))).toEqual(expectedLocalStorageItem);
    });
});

test("It doesn´t restart device if the device is the same", async () => {
    mockEnumerateDevices.mockResolvedValue([
        {
            kind: "audioinput",
            groupId: "test2",
            label: "wireless",
            deviceId: "test2",
        },
    ]);
    const { waitFor } = renderHook(() => useParticipantTracks(participant, true), {
        wrapper: (children: any) =>
            wrapperWithOverrideState(children, { room: { ...state.state.room, newSpeaker: "test1234" } }),
    });
    await navigator.mediaDevices.ondevicechange(null);
    await navigator.mediaDevices.ondevicechange(null);
    await waitFor(() => {
        expect(trackpubsToTracks(participant.audioTracks)[0].restart).toHaveBeenCalledTimes(1);
        expect(mockAlertContext).toHaveBeenCalledTimes(1);
    });
});

test("It doesn´t call getUserDevices or assign a value to device change if participant is not local", async () => {
    const { waitFor } = renderHook(() => useParticipantTracks(participant), {
        wrapper: (children: any) =>
            wrapperWithOverrideState(children, { room: { ...state.state.room, newSpeaker: "test1234" } }),
    });
    await waitFor(() => {
        expect(navigator.mediaDevices.ondevicechange).toEqual(undefined);
    });
});

test("Tracks have the correct length", () => {
    const { result } = renderHook(() => useParticipantTracks(participant), {
        wrapper: (children: any) =>
            wrapperWithOverrideState(children, { room: { ...state.state.room, newSpeaker: "test1234" } }),
    });
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
    const { result } = renderHook(() => useParticipantTracks(participant), {
        wrapper: (children: any) =>
            wrapperWithOverrideState(children, { room: { ...state.state.room, newSpeaker: "test1234" } }),
    });
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
