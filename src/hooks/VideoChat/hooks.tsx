import { Auth } from "aws-amplify";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
    connect,
    createLocalTracks,
    LocalDataTrack,
    LocalParticipant,
    RemoteParticipant,
    DataTrack,
} from "twilio-video";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";
import actions from "../../state/videoChat/videoChatAction";

enum VIDEO_CHAT_TRACK_TYPE {
    VIDEO_TRACK_KIND = "video",
    AUDIO_TRACK_KIND = "audio",
}
const dataTrack = new LocalDataTrack({ maxPacketLifeTime: null, maxRetransmits: null });

export function useDataTrack(tracks: DataTrack[]): void {
    const { dispatch } = useContext(GlobalStateContext);
    useEffect(() => {
        const parseMessage = (data: string) => {
            try {
                dispatch(actions.sendMessage(JSON.parse(data)));
            } catch {
                // TODO: Decide how to handle errors
            }
        };
        const handleMessages = (on: boolean) => {
            return tracks.forEach((track) =>
                on ? track.on("message", parseMessage) : track.off("message", parseMessage)
            );
        };

        handleMessages(true);

        return () => {
            handleMessages(false);
        };
    }, [tracks, dispatch]);
}

const configParticipantsListeners = (room, dispatch) => {
    const participantConnected = (participant: LocalParticipant | RemoteParticipant) => {
        if (participant.state === "connected" && room) {
            dispatch(actions.addRemoteParticipant(participant));
        }
    };

    const participantDisconnected = (participant: LocalParticipant | RemoteParticipant) => {
        if (room) {
            dispatch(actions.removeRemoteParticipant(participant));
        }
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
        const room = await createLocalTracks({ audio: true, video: { aspectRatio: 1.777777777777778 } }).then(
            (localTracks) => {
                return connect(token, { name: roomName, tracks: [...localTracks, dataTrack] });
            }
        );
        // Add a listener to disconnect from the room when a user closes their browser
        window.addEventListener("beforeunload", () => {
            disconnect(room, dispatch);
        });
        dispatch(actions.addDataTrack(dataTrack));
        dispatch(actions.joinToRoom(room));
        configParticipantsListeners(room, dispatch);
    }, []);
};

export const disconnect = (room, dispatch, killRoom?) => {
    if (room && room.localParticipant.state === "connected") {
        room.localParticipant.tracks.forEach((trackPublication) => {
            return trackPublication.kind === "audio" || trackPublication.kind === "video"
                ? trackPublication.track.stop()
                : null;
        });
        room.disconnect();
        dispatch(actions.disconnect());
    }
    return killRoom ? endRoom(room.name) : room;
};

export const useVideoChatRef = (participant: LocalParticipant | RemoteParticipant) => {
    const [dataTracks, setDataTracks] = useState([]);
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
        setDataTracks(trackpubsToTracks(participant.dataTracks));

        const trackSubscribed = (track) => {
            if (track.kind === VIDEO_CHAT_TRACK_TYPE.VIDEO_TRACK_KIND) {
                return setVideoTracks((videoTracks) => [...videoTracks, track]);
            }
            if (track.kind === VIDEO_CHAT_TRACK_TYPE.AUDIO_TRACK_KIND) {
                return setAudioTracks((audioTracks) => [...audioTracks, track]);
            }

            return setDataTracks((dataTracks) => [...dataTracks, track]);
        };

        const trackUnsubscribed = (track) => {
            if (track.kind === VIDEO_CHAT_TRACK_TYPE.VIDEO_TRACK_KIND) {
                return setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
            }
            if (track.kind === VIDEO_CHAT_TRACK_TYPE.AUDIO_TRACK_KIND) {
                return setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
            }

            setDataTracks((dataTracks) => dataTracks.filter((dt) => dt !== track));
        };

        participant.on("trackSubscribed", trackSubscribed);
        participant.on("trackUnsubscribed", trackUnsubscribed);

        return () => {
            setVideoTracks([]);
            setAudioTracks([]);
            setDataTracks([]);
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
    return { videoRef, audioRef, dataTracks };
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

export const useEndDepo = () => {
    const [endDepo, setEndDepo] = useState(false);
    const { state, dispatch } = useContext(GlobalStateContext);
    const { dataTrack, currentRoom } = state.room;

    useEffect(() => {
        if (endDepo) {
            dataTrack.send(JSON.stringify({ module: "endDepo", value: "" }));
            disconnect(currentRoom, dispatch, true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endDepo]);

    return { setEndDepo };
};
