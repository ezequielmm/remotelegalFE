import { MediaStreamConstraints, SelectedOptions, StreamOption } from "../../../hooks/useUserTracks";
import * as CONSTANTS from "../../../constants/TroubleShootUserDevices";

export type Device = {
    deviceId: {
        exact: string;
    };
    label: string;
};
type videoDeviceError = {
    videoinput: {
        name: string;
    };
};
type audioDeviceError = {
    audioinput: {
        name: string;
    };
};
const createDevices = (
    errors: { video: boolean | videoDeviceError; audio: boolean | audioDeviceError },
    selectedOptions: SelectedOptions
) => {
    const cameraError = errors.video as videoDeviceError;

    const videoInput = selectedOptions.videoinput as StreamOption;
    const audioInput = selectedOptions.audioinput as StreamOption;
    const speakers = selectedOptions.audiooutput as StreamOption;

    const devices = {
        videoForBE: {
            status:
                (cameraError &&
                    cameraError?.videoinput?.name === "NotAllowedError" &&
                    CONSTANTS.DevicesStatus.blocked) ||
                (cameraError &&
                    cameraError?.videoinput?.name !== "NotAllowedError" &&
                    CONSTANTS.DevicesStatus.unavailable) ||
                CONSTANTS.DevicesStatus.enabled,
            name: ((errors.video || CONSTANTS.INVALID_VALUES.includes(videoInput.value)) && "") || videoInput.label,
        },
        microphoneForBE: {
            name: ((errors.audio || CONSTANTS.INVALID_VALUES.includes(audioInput.value)) && "") || audioInput.label,
        },
        speakersForBE: {
            name: CONSTANTS.INVALID_VALUES.includes(speakers.value) ? "Default Speakers" : speakers.label,
        },
        video:
            errors.video || CONSTANTS.INVALID_VALUES.includes(videoInput.value)
                ? false
                : {
                      ...MediaStreamConstraints.videoinput,
                      deviceId: {
                          exact: videoInput.value,
                      },
                      label: videoInput.label,
                  },
        audio:
            errors.audio || CONSTANTS.INVALID_VALUES.includes(audioInput.value)
                ? false
                : {
                      ...MediaStreamConstraints.audioinput,
                      deviceId: {
                          exact: audioInput.value,
                      },
                      groupId: audioInput.groupId,
                      label: audioInput.label,
                  },
        speakers: CONSTANTS.INVALID_VALUES.includes(speakers.value) ? false : speakers.value,
    };
    return devices;
};
export default createDevices;
