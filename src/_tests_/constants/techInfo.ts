export const DEPOSITION_PARTICIPANT_MOCK = {
    name: "test",
    id: "1",
    email: "test@gmail.com",
    role: "Witness",
    hasJoined: true,
    isAdmitted: true,
    device: "desktop",
    browser: "Chrome",
    operatingSystem: "Windows",
    ip: "192.158.1.38",
    devices: {
        camera: {
            name: "camera",
            status: "Enabled",
        },
        microphone: {
            name: "Default Camera",
        },
        speakers: {
            name: "Default Speakers",
        },
    },
};
export const DEPOSITION_INFO_MOCK = {
    roomId: "test",
    isVideoRecordingNeeded: true,
    isRecording: true,
    sharingExhibit: "exhibit test",
    participants: [DEPOSITION_PARTICIPANT_MOCK],
};
