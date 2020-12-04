import { useEffect, useRef, useState } from "react";
import {
    AudioTrack,
    DataTrack,
    LocalDataTrack,
    LocalParticipant,
    RemoteDataTrack,
    RemoteParticipant,
    VideoTrack,
} from "twilio-video";
import trackpubsToTracks from "../../helpers/trackPubsToTracks";

const useParticipantTracks = (participant: LocalParticipant | RemoteParticipant) => {
    const [dataTracks, setDataTracks] = useState<DataTrack[]>([]);
    const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([]);
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);

    const videoRef = useRef();
    const audioRef = useRef();

    const trackSubscribed = (track: AudioTrack | VideoTrack | LocalDataTrack | RemoteDataTrack) => {
        if (track.kind === "video") {
            return setVideoTracks((video) => [...video, track]);
        }
        if (track.kind === "audio") {
            return setAudioTracks((audio) => [...audio, track]);
        }
        return setDataTracks((data) => [...data, track]);
    };

    const trackUnsubscribed = (track: AudioTrack | LocalDataTrack | RemoteDataTrack | VideoTrack) => {
        if (track.kind === "video") {
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
            videoTrack.attach(videoRef.current);
        }
        return () => videoTrack?.detach();
    }, [videoTracks]);

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
