import { useEffect, useState } from "react";
import { LocalAudioTrack, LocalVideoTrack } from "twilio-video";

const useVideoStatus = (audioTracks: LocalAudioTrack[], videoTracks: LocalVideoTrack[]) => {
    const [isAudioEnabled, setAudioEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);

    useEffect(() => {
        audioTracks.forEach((audioTrack) =>
            !isAudioEnabled && audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable()
        );
    }, [isAudioEnabled, audioTracks]);

    useEffect(() => {
        videoTracks.forEach((videoTrack) =>
            !cameraEnabled && videoTrack.isEnabled ? videoTrack.disable() : videoTrack.enable()
        );
    }, [cameraEnabled, videoTracks]);

    return { isAudioEnabled, cameraEnabled, setAudioEnabled, setCameraEnabled };
};
export default useVideoStatus;
