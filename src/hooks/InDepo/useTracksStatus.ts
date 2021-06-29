import { useContext, useEffect, useState } from "react";
import { LocalAudioTrack, LocalVideoTrack } from "twilio-video";
import { GlobalStateContext } from "../../state/GlobalState";

const useVideoStatus = (audioTracks: LocalAudioTrack[], videoTracks: LocalVideoTrack[]) => {
    const { state } = useContext(GlobalStateContext);
    const { initialCameraStatus } = state.room;
    const cameraStatus = initialCameraStatus !== null ? initialCameraStatus : true;
    const [isAudioEnabled, setAudioEnabled] = useState(true);
    const [isCameraEnabled, setCameraEnabled] = useState(cameraStatus);

    useEffect(() => {
        audioTracks.forEach((audioTrack) =>
            !isAudioEnabled && audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable()
        );
    }, [isAudioEnabled, audioTracks]);

    useEffect(() => {
        videoTracks.forEach((videoTrack) =>
            !isCameraEnabled && videoTrack.isEnabled ? videoTrack.disable() : videoTrack.enable()
        );
    }, [isCameraEnabled, videoTracks]);

    return { isAudioEnabled, isCameraEnabled, setAudioEnabled, setCameraEnabled };
};
export default useVideoStatus;
