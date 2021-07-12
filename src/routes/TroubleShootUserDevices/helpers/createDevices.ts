import { MediaStreamConstraints, SelectedOptions, StreamOption } from "../../../hooks/useUserTracks";
import * as CONSTANTS from "../../../constants/TroubleShootUserDevices";

export type Device = {
    deviceId: {
        exact: string;
    };
};

const createDevices = (errors: { video: boolean; audio: boolean }, selectedOptions: SelectedOptions) => {
    const videoInput = selectedOptions.videoinput as StreamOption;
    const audioInput = selectedOptions.audioinput as StreamOption;
    const speakers = selectedOptions.audiooutput as StreamOption;
    const devices = {
        video:
            errors.video || CONSTANTS.INVALID_VALUES.includes(videoInput.value)
                ? false
                : {
                      ...MediaStreamConstraints.videoinput,
                      deviceId: {
                          exact: videoInput.value,
                      },
                  },
        audio:
            errors.audio || CONSTANTS.INVALID_VALUES.includes(audioInput.value)
                ? false
                : {
                      ...MediaStreamConstraints.audioinput,
                      deviceId: {
                          exact: audioInput.value,
                      },
                  },
        speakers: CONSTANTS.INVALID_VALUES.includes(speakers.value) ? false : speakers.value,
    };
    return devices;
};
export default createDevices;
