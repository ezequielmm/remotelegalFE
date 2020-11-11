import { useCallback, useEffect, useState } from "react";
import { LocalParticipant } from "twilio-video";

const useVideoStatus = (participant: LocalParticipant) => {
    const [audioTracks, setAudioTracks] = useState([]);
    const [videoTracks, setVideoTracks] = useState([]);
    const [isMuted, setIsMuted] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(false);

    const trackpubsToTracks = (trackMap) =>
        Array.from(trackMap.values())
            // @ts-ignore
            .map((publication) => publication.track)
            .filter((track) => track !== null);

    useEffect(() => {
        setVideoTracks(trackpubsToTracks(participant.videoTracks));
        setAudioTracks(trackpubsToTracks(participant.audioTracks));

        const trackSubscribed = (track) => {
            if (track.kind === "video") {
                setVideoTracks((videoTracks) => [...videoTracks, track]);
            } else if (track.kind === "audio") {
                setAudioTracks((audioTracks) => [...audioTracks, track]);
            }
        };

        const trackUnsubscribed = (track) => {
            if (track.kind === "video") {
                setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
            } else if (track.kind === "audio") {
                setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
            }
        };

        participant.on("trackSubscribed", trackSubscribed);
        participant.on("trackUnsubscribed", trackUnsubscribed);

        return () => {
            setVideoTracks([]);
            setAudioTracks([]);
            participant.removeAllListeners();
        };
    }, [participant]);

    useEffect(() => {
        audioTracks.forEach((audioTrack) => {
            isMuted && audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
        });
    }, [isMuted, audioTracks]);

    useEffect(() => {
        videoTracks.forEach((videoTrack) => {
            cameraEnabled && videoTrack.isEnabled ? videoTrack.disable() : videoTrack.enable();
        });
    }, [cameraEnabled, videoTracks]);

    const toggleAudio = useCallback(() => setIsMuted(!isMuted), [isMuted]);
    const toggleVideo = useCallback(() => setCameraEnabled(!cameraEnabled), [cameraEnabled]);
    return { isMuted, cameraEnabled, toggleAudio, toggleVideo };
};

export default useVideoStatus;
