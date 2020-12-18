import { useEffect, useRef, useState } from "react";
import {
    AudioTrack,
    DataTrack,
    LocalDataTrack,
    LocalParticipant,
    RemoteDataTrack,
    RemoteParticipant,
    RemoteVideoTrack,
    VideoTrack,
} from "twilio-video";
import trackpubsToTracks from "../../helpers/trackPubsToTracks";

const useParticipantTracks = (participant: LocalParticipant | RemoteParticipant) => {
    const [dataTracks, setDataTracks] = useState<DataTrack[]>([]);
    const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([]);
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
    const audioRef = useRef<HTMLAudioElement & AudioTrack>();
    const videoRef = useRef<HTMLVideoElement & VideoTrack>();

    const trackSubscribed = (track: AudioTrack | VideoTrack | LocalDataTrack | RemoteDataTrack) => {
        if (track.kind === "video") {
            videoRef.current.style.display = "block";
            return setVideoTracks((video) => [...video, track]);
        }
        if (track.kind === "audio") {
            return setAudioTracks((audio) => [...audio, track]);
        }
        return setDataTracks((data) => [...data, track]);
    };

    const trackUnsubscribed = (
        track: AudioTrack | LocalDataTrack | RemoteDataTrack | VideoTrack | RemoteVideoTrack
    ) => {
        if (track.kind === "video") {
            videoRef.current.style.display = track.name === videoRef.current.name ? "none" : "block";
            return setVideoTracks((video) => video.filter((v) => v !== track));
        }
        if (track.kind === "audio") {
            return setAudioTracks((audio) => audio.filter((a) => a !== track));
        }

        return setDataTracks((data) => data.filter((dt) => dt !== track));
    };

    useEffect(() => {
        if (!participant) {
            return;
        }
        setVideoTracks(trackpubsToTracks(participant.videoTracks));
        setAudioTracks(trackpubsToTracks(participant.audioTracks));
        setDataTracks(trackpubsToTracks(participant.dataTracks));
        participant.on("trackSubscribed", trackSubscribed);
        participant.on("trackUnsubscribed", trackUnsubscribed);

        // eslint-disable-next-line consistent-return
        return () => participant?.removeAllListeners();
    }, [participant]);

    useEffect(() => {
        const videoTrack = videoTracks[0];

        if (videoTrack) {
            if (videoRef.current) {
                videoRef.current.name = videoTrack.name;
            }
            videoTrack.attach(videoRef.current);
        }
        return () => videoTrack?.detach();
    }, [videoTracks, participant]);

    useEffect(() => {
        const audioTrack = audioTracks[0];
        if (audioTrack) {
            audioTrack.attach(audioRef.current);
        }

        return () => audioTrack?.detach();
    }, [audioTracks]);
    return { videoRef, audioRef, dataTracks, audioTracks, videoTracks };
};
export default useParticipantTracks;
