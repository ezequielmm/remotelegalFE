import { useContext, useEffect, useRef, useState } from "react";
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
import changeSpeakers from "../../helpers/changeSpeakers";
import trackpubsToTracks from "../../helpers/trackPubsToTracks";
import { GlobalStateContext } from "../../state/GlobalState";

const useParticipantTracks = (participant: LocalParticipant | RemoteParticipant) => {
    const { state } = useContext(GlobalStateContext);
    const { newSpeaker } = state.room;
    const [dataTracks, setDataTracks] = useState<DataTrack[]>([]);
    const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([]);
    const [videoDisabled, setVideoDisabled] = useState<boolean>(false);
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
    const [netWorkLevel, setNetWorkLevel] = useState<number>(null);
    const audioRef = useRef<HTMLAudioElement & AudioTrack>();
    const videoRef = useRef<HTMLVideoElement & VideoTrack>();

    const trackSubscribed = (track: AudioTrack | VideoTrack | LocalDataTrack | RemoteDataTrack) => {
        if (track.kind === "video") {
            if (videoRef.current) {
                videoRef.current.style.display = "block";
            }
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
            if (videoRef.current) {
                videoRef.current.style.display = track.name === videoRef.current.name ? "none" : "block";
            }
            return setVideoTracks((video) => video.filter((v) => v !== track));
        }
        if (track.kind === "audio") {
            return setAudioTracks((audio) => audio.filter((a) => a !== track));
        }

        return setDataTracks((data) => data.filter((dt) => dt !== track));
    };

    const trackDisabled = (track: AudioTrack | LocalDataTrack | RemoteDataTrack | VideoTrack | RemoteVideoTrack) => {
        if (track.kind === "video") {
            setVideoDisabled(true);
            if (videoRef.current) videoRef.current.style.display = "none";
        }
    };

    const trackEnabled = (track: AudioTrack | LocalDataTrack | RemoteDataTrack | VideoTrack | RemoteVideoTrack) => {
        if (track.kind === "video") {
            setVideoDisabled(false);
            if (videoRef.current) videoRef.current.style.display = "block";
        }
    };

    useEffect(() => {
        if (!participant) {
            return;
        }
        setVideoTracks(trackpubsToTracks(participant.videoTracks));
        setAudioTracks(trackpubsToTracks(participant.audioTracks));
        setDataTracks(trackpubsToTracks(participant.dataTracks));
        participant.on("trackSubscribed", trackSubscribed);
        participant.on("networkQualityLevelChanged", setNetWorkLevel);
        participant.on("trackUnsubscribed", trackUnsubscribed);
        participant.on("trackDisabled", trackDisabled);
        participant.on("trackEnabled", trackEnabled);

        // eslint-disable-next-line consistent-return
        return () => {
            participant?.removeAllListeners();
        };
    }, [participant]);

    useEffect(() => {
        const videoTrack = videoTracks[0];

        if (videoTrack) {
            if (videoRef.current) {
                videoRef.current.name = videoTrack.name;
            }
            videoTrack.attach(videoRef.current);
        }
        return () => {
            videoTrack?.detach();
        };
    }, [videoTracks, participant]);

    useEffect(() => {
        const audioTrack = audioTracks[0];
        const speakers =
            localStorage.getItem("selectedDevices") && JSON.parse(localStorage.getItem("selectedDevices")).speakers;
        if (audioTrack) {
            audioTrack.attach(audioRef.current);
            if (speakers) {
                changeSpeakers(audioRef.current, speakers);
            }
        }

        return () => {
            audioTrack?.detach();
        };
    }, [audioTracks]);

    useEffect(() => {
        if (newSpeaker && audioRef.current) {
            changeSpeakers(audioRef.current, newSpeaker);
        }
    }, [newSpeaker]);
    return { videoDisabled, videoRef, audioRef, dataTracks, audioTracks, videoTracks, netWorkLevel };
};
export default useParticipantTracks;
