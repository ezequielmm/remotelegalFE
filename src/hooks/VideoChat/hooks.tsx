import { Auth } from "aws-amplify";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { connect, LocalParticipant, RemoteParticipant } from "twilio-video";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";
import actions from "../../state/videoChat/videoChatAction";

enum VIDEO_CHAT_TRACK_TYPE {
    VIDEO_TRACK_KIND = "video",
    AUDIO_TRACK_KIND = "audio",
}

const configParticipantsListeners = (room, dispatch) => {
    const participantConnected = (participant: LocalParticipant | RemoteParticipant) => {
        if (participant.state === "connected") {
            dispatch(actions.addRemoteParticipant(participant));
        }
    };

    const participantDisconnected = (participant: LocalParticipant | RemoteParticipant) => {
        dispatch(actions.removeRemoteParticipant(participant));
    };
    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
};

const generateToken = async (roomName: string) => {
    const session = await Auth.currentSession();
    let idToken = session.getIdToken();
    let jwt = idToken.getJwtToken();

    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + jwt,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: roomName }),
    };
    const tokenResponse = await fetch(`${process.env.REACT_APP_BASE_BE_URL}/api/rooms/token`, requestOptions);
    if (!tokenResponse.ok) throw new Error(tokenResponse.statusText);
    return await tokenResponse.json();
};

const endRoom = async (roomName: string) => {
    const session = await Auth.currentSession();
    let idToken = session.getIdToken();
    let jwt = idToken.getJwtToken();

    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + jwt,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: roomName }),
    };
    return await fetch(`${process.env.REACT_APP_BASE_BE_URL}/api/rooms/endRoom`, requestOptions);
};

export const useJoinToRoom = () => {
    const { dispatch } = useContext(GlobalStateContext);
    return useAsyncCallback(async (roomName) => {
        const { token } = await generateToken(roomName);
        const room = await connect(token, {
            name: roomName,
            audio: true,
            video: {
                aspectRatio: 1.777777777777778,
            },
        });
        // Add a listener to disconnect from the room when a user closes their browser
        window.addEventListener("beforeunload", () => {
            disconnect(room, disconnect);
        });
        dispatch(actions.joinToRoom(room));
        configParticipantsListeners(room, dispatch);
    }, []);
};

export const disconnect = (room, dispatch) => {
    if (room && room.localParticipant.state === "connected") {
        endRoom(room.name);

        room.localParticipant.tracks.forEach((trackPublication) => {
            trackPublication.track.stop();
        });
        room.disconnect();
        dispatch(actions.disconnect());
        return null;
    } else {
        return room;
    }
};

export const useVideoChatRef = (participant: LocalParticipant | RemoteParticipant) => {
    const [videoTracks, setVideoTracks] = useState([]);
    const [audioTracks, setAudioTracks] = useState([]);

    const videoRef = useRef();
    const audioRef = useRef();

    const trackpubsToTracks = (trackMap) =>
        Array.from(trackMap.values())
            // @ts-ignore
            .map((publication) => publication.track)
            .filter((track) => track !== null);

    useEffect(() => {
        setVideoTracks(trackpubsToTracks(participant.videoTracks));
        setAudioTracks(trackpubsToTracks(participant.audioTracks));

        const trackSubscribed = (track) => {
            if (track.kind === VIDEO_CHAT_TRACK_TYPE.VIDEO_TRACK_KIND) {
                setVideoTracks((videoTracks) => [...videoTracks, track]);
            } else if (track.kind === VIDEO_CHAT_TRACK_TYPE.AUDIO_TRACK_KIND) {
                setAudioTracks((audioTracks) => [...audioTracks, track]);
            }
        };

        const trackUnsubscribed = (track) => {
            if (track.kind === VIDEO_CHAT_TRACK_TYPE.VIDEO_TRACK_KIND) {
                setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
            } else if (track.kind === VIDEO_CHAT_TRACK_TYPE.AUDIO_TRACK_KIND) {
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
        const videoTrack = videoTracks[0];
        if (videoTrack) {
            videoTrack.attach(videoRef.current);
            return () => {
                videoTrack.detach();
            };
        }
    }, [videoTracks]);

    useEffect(() => {
        const audioTrack = audioTracks[0];
        if (audioTrack) {
            audioTrack.attach(audioRef.current);
            return () => {
                audioTrack.detach();
            };
        }
    }, [audioTracks]);
    return { videoRef, audioRef };
};

export const useVideoStatus = (participant: LocalParticipant | any) => {
    const [audioTracks, setAudioTracks] = useState([]);
    const [videoTracks, setVideoTracks] = useState([]);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);

    const trackpubsToTracks = (trackMap) => {
        return Array.from(trackMap.values())
            .filter(({ track }) => track !== null)
            .map(({ track }) => track);
    };

    useEffect(() => {
        if (participant) {
            setVideoTracks(trackpubsToTracks(participant.videoTracks));
            setAudioTracks(trackpubsToTracks(participant.audioTracks));

            return () => {
                setVideoTracks([]);
                setAudioTracks([]);
            };
        }
    }, [participant]);

    useEffect(() => {
        audioTracks.forEach((audioTrack) => {
            !isAudioEnabled && audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
        });
    }, [isAudioEnabled, audioTracks]);

    useEffect(() => {
        videoTracks.forEach((videoTrack) => {
            !cameraEnabled && videoTrack.isEnabled ? videoTrack.disable() : videoTrack.enable();
        });
    }, [cameraEnabled, videoTracks]);

    const toggleAudio = useCallback(() => setIsAudioEnabled(!isAudioEnabled), [isAudioEnabled]);
    const toggleVideo = useCallback(() => setCameraEnabled(!cameraEnabled), [cameraEnabled]);
    return { isAudioEnabled, cameraEnabled, toggleAudio, toggleVideo };
};
