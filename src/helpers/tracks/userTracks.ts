import { Options, StreamOption } from "../../hooks/userTracks/useUserTracks";

export const listDevices = async () => {
    const initialOptions: Options = {
        videoinput: ["-"],
        audioinput: ["-"],
        audiooutput: ["-"],
    };
    const availableStreams = await navigator.mediaDevices.enumerateDevices();
    availableStreams.forEach((currentStream) => {
        const firstStream = initialOptions[currentStream.kind][0];
        if (firstStream === "-") {
            initialOptions[currentStream.kind][0] = {
                label: currentStream.label,
                kind: currentStream.kind,
                value: currentStream.deviceId,
                groupId: currentStream.groupId,
            };
            return {
                groupId: currentStream.groupId,
                label: currentStream.label,
                kind: currentStream.kind,
                value: currentStream.deviceId,
            };
        }
        initialOptions[currentStream.kind] = [
            ...(initialOptions[currentStream.kind] as StreamOption[]),
            {
                label: currentStream.label,
                value: currentStream.deviceId,
                groupId: currentStream.groupId,
                kind: currentStream.kind,
            },
        ];
        return initialOptions[currentStream.kind];
    });
    return initialOptions;
};

export default {
    listDevices,
}