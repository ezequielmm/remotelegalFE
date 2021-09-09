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
    const { newSpeaker, tracks } = state.room;
    const [dataTracks, setDataTracks] = useState<DataTrack[]>([]);
    const [videoTracks, setVideoTracks] = useState<VideoTrack[]>([]);
    const [videoDisabled, setVideoDisabled] = useState<boolean>(false);
    const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
    const [netWorkLevel, setNetWorkLevel] = useState<number>(null);
    const audioRef = useRef<HTMLAudioElement & AudioTrack>();
    const videoRef = useRef<HTMLVideoElement & VideoTrack>();
    const localParticipantVideoTrackRef = useRef<VideoTrack>(null);

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
        const resetVideoRefStylesOnReconnection = () => {
            if (videoRef.current) {
                // We have to do this because, for some reason, the reconnected event gets
                // triggered on first load
                if (localParticipantVideoTrackRef.current?.isEnabled) {
                    videoRef.current.style.display = "block";
                }
            }
        };
        const onReconnecting = (remoteParticipant: RemoteParticipant) => {
            if (videoRef.current) {
                videoRef.current.style.display = participant?.sid === remoteParticipant?.sid ? "none" : "block";
                setVideoTracks((videos) =>
                    videos.filter((v) => remoteParticipant?.videoTracks.size && v !== remoteParticipant.videoTracks[0])
                );
                setAudioTracks((audios) =>
                    audios.filter((a) => remoteParticipant?.audioTracks.size && a !== remoteParticipant.audioTracks[0])
                );
                setDataTracks((dataTracks) =>
                    dataTracks.filter(
                        (d) => remoteParticipant?.dataTracks.size && d !== remoteParticipant.audioTracks[0]
                    )
                );
            }
            return null;
        };
        if (!participant) {
            return;
        }
        setDataTracks(trackpubsToTracks(participant.dataTracks));
        participant.on("trackSubscribed", trackSubscribed);
        participant.on("reconnecting", onReconnecting);
        participant.on("reconnected", resetVideoRefStylesOnReconnection);
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
        const setParticipantTracks = () => {
            setVideoTracks((oldTracks) => [...trackpubsToTracks(participant.videoTracks), ...oldTracks]);
            setAudioTracks((oldTracks) => [...trackpubsToTracks(participant.audioTracks), ...oldTracks]);
        };
        if (!participant) {
            return;
        }
        setParticipantTracks();
    }, [participant, tracks]);

    useEffect(() => {
        const videoTrack = videoTracks[0];

        if (videoTrack) {
            localParticipantVideoTrackRef.current = videoTrack;
            if (videoRef.current) {
                videoRef.current.name = videoTrack.name;
            }
            videoTrack.attach(videoRef.current);
        }
        return () => {
            videoTrack?.detach();
        };
    }, [videoTracks]);

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
