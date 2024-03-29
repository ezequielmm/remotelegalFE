import { MediaStreamConstraints } from "../../hooks/userTracks/useUserTracks";

export const STREAM_MOCK = {
    getTracks: jest.fn().mockReturnValue([
        {
            enabled: true,
            kind: "audio",
            stop: jest.fn(),
        },
        {
            enabled: true,
            kind: "video",
            stop: jest.fn(),
        },
    ]),
};
export const DEVICES_LIST_MOCK = [
    { label: "audioinput_test", kind: "audioinput", deviceId: "audioinput_id", groupId: "1" },
    { label: "audioinput2_test", kind: "audioinput", deviceId: "audioinput2_id", groupId: "2" },
    { label: "audioutput_test", kind: "audiooutput", deviceId: "audiooutput_id", groupId: "3" },
    { label: "audioutput2_test", kind: "audiooutput", deviceId: "audiooutput2_id", groupId: "4" },
    { label: "camera_test", kind: "videoinput", deviceId: "videoinput_id", groupId: "5" },
    { label: "camera2_test", kind: "videoinput", deviceId: "videoinput2_id", groupId: "6" },
];

export const GET_VIDEO_EXPECTED_MOCK = (additional?) => ({
    video: {
        ...MediaStreamConstraints.videoinput,
        ...additional,
    },
});
export const GET_AUDIO_EXPECTED_MOCK = (additional?) => ({
    audio: {
        ...MediaStreamConstraints.audioinput,
        ...additional,
    },
});
export const GET_AUDIO_VIDEO_EXPECTED_MOCK = (additional?) => ({
    audio: {
        ...MediaStreamConstraints.audioinput,
        ...additional,
    },
    video: {
        ...MediaStreamConstraints.videoinput,
        ...additional,
    },
});

export const NON_AVAILABLE_DEVICES_LIST_MOCK = [
    { label: "", kind: "audioinput", deviceId: "" },
    { label: "", kind: "audioinput", deviceId: "" },
    { label: "", kind: "audiooutput", deviceId: "" },
    { label: "", kind: "audiooutput", deviceId: "" },
    { label: "", kind: "videoinput", deviceId: "" },
    { label: "", kind: "videoinput", deviceId: "" },
];
export const EXPECTED_CREATE_AUDIO_TRACK_MOCK_ARGS = {
    deviceId: {
        exact: DEVICES_LIST_MOCK[1].deviceId,
    },
};
export const EXPECTED_CREATE_VIDEO_TRACK_MOCK_ARGS = {
    deviceId: {
        exact: DEVICES_LIST_MOCK[5].deviceId,
    },
};
