export enum Options {
    overview = "Overview",
}

export type Participant = {
    name: string;
    id: string;
};

export type DepositionInfo = {
    roomId: string;
    recordingType: string;
    isVideoRecordingNeeded: boolean;
    isRecording: boolean;
    sharingExhibit: string;
    participants: Participant[];
};

export type ParticipantInfo = {
    name: string;
    email: string;
    role: string;
    hasJoined: boolean;
    isAdmitted: boolean;
    device: string;
    browser: string;
    operatingSystem: string;
    ip: string;
    devices: {
        camera: {
            name: string;
            status: string;
        };
        microphone: {
            name: string;
        };
        speakers: {
            name: string;
        };
    };
};

export const techInfoOptions = (participants: Participant[]) => [
    {
        title: "GENERAL",
        option: [{ name: Options.overview, dataTestId: Options.overview, id: Options.overview }],
    },
    {
        title: "PARTICIPANTS",
        option: participants,
    },
];

export const TECH_TAB_HEADER = "Check status";
export const TECH_TAB_PILL = "REMOTE LEGAL - SUPPORT";
export const OVERVIEW_HEADER = "Overview";
export const OVERVIEW_SUBHEADER = "Deposition information";
export const OVERVIEW_INFO_HEADERS = {
    ROOM: "ROOM ID",
    RECORDING_TYPE: "RECORDING TYPE",
    ON_THE_RECORD: "ON THE RECORD",
    SHARING_EXHIBIT: "SHARING EXHIBIT",
};
export const YES_TAG = "Yes";
export const NO_TAG = "No";
export const PARTICIPANT_TAB_SUBHEADER = "Participant information";
export const PARTICIPANT_INFO_HEADERS = {
    NAME: "NAME",
    EMAIL: "EMAIL",
    ROLE: "ROLE",
    HAS_JOINED: "HAS JOINED",
    ADMITED: "ADMITTED",
};
export const PARTICIPANT_TAB_GENERAL_SUBHEADER = "General";
export const PARTICIPANT_TAB_SYSTEM_SUBHEADER = "SYSTEM";
export const PARTICIPANT_INFO_SYSTEM_HEADERS = {
    OS: "OS/VERSION",
    DEVICE: "DEVICE",
    BROWSER: "BROWSER/VERSION",
    IP: "IP",
};
export const PARTICIPANT_TAB_DEVICES_SUBHEADER = "DEVICES";
export const PARTICIPANT_INFO_DEVICES_HEADERS = {
    camera: "CAMERA",
    microphone: "MICROPHONE",
    speaker: "SPEAKER",
};
export const VIDEO = "Video";
export const AUDIO = "Audio";
export const NETWORK_ERROR = "There was an error getting the info, please try again";
export const NO_CAMERA_INFO = "No camera detected";
export const NO_MIC_INFO = "No microphone detected";
export const NO_EXHIBIT_INFO = "No exhibit is being shared";
