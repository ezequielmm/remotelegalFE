import { useEffect, useState } from "react";
import { LocalAudioTrack, LocalVideoTrack } from "twilio-video";

const useVideoStatus = (audioTracks: LocalAudioTrack[], videoTracks: LocalVideoTrack[]) => {
    const [isAudioEnabled, setAudioEnabled] = useState(true);
    const [isCameraEnabled, setCameraEnabled] = useState(true);

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
