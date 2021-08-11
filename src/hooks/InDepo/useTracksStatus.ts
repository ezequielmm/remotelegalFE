import { useContext, useEffect, useState } from "react";
import { LocalAudioTrack, LocalVideoTrack } from "twilio-video";
import { GlobalStateContext } from "../../state/GlobalState";

const useVideoStatus = (audioTracks: LocalAudioTrack[], videoTracks: LocalVideoTrack[]) => {
    const { state } = useContext(GlobalStateContext);
    const { initialCameraStatus, publishedAudioTrackStatus } = state.room;
    const [isAudioEnabled, setAudioEnabled] = useState(true);
    const [isCameraEnabled, setCameraEnabled] = useState(true);

    useEffect(() => {
        audioTracks.forEach((audioTrack) =>
            !isAudioEnabled && audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable()
        );
    }, [isAudioEnabled, audioTracks]);

    useEffect(() => {
        if (publishedAudioTrackStatus !== null) {
            setAudioEnabled(publishedAudioTrackStatus);
        }
    }, [publishedAudioTrackStatus]);

    useEffect(() => {
        if (initialCameraStatus !== null) {
            setCameraEnabled(initialCameraStatus);
        }
    }, [initialCameraStatus]);

    useEffect(() => {
        videoTracks.forEach((videoTrack) =>
            !isCameraEnabled && videoTrack.isEnabled ? videoTrack.disable() : videoTrack.enable()
        );
    }, [isCameraEnabled, videoTracks]);

    return { isAudioEnabled, isCameraEnabled, setAudioEnabled, setCameraEnabled };
};
export default useVideoStatus;
