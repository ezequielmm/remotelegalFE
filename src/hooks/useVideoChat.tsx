import { Auth } from "aws-amplify";
import { useCallback, useContext, useState } from "react";
import { connect, LocalParticipant, RemoteParticipant } from "twilio-video";
import { GlobalStateContext } from "../state/GlobalState";
import actions from "../state/videoChat/videoChatAction";

const useVideoChat = () => {
    const [error, setError] = useState(null);
    const [connected, setConnected] = useState(false);
    const { state, dispatch } = useContext(GlobalStateContext);

    const generateToken = useCallback(
        async (roomName: string) => {
            try {
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
                const response = await fetch(`${process.env.REACT_APP_BASE_BE_URL}/api/rooms/token`, requestOptions);
                if (!response.ok) throw new Error(response.statusText);
                const tokenResult = await response.json();

                dispatch(actions.setToken({ token: tokenResult.token, roomName }));
                return tokenResult.token;
            } catch (error) {
                setError(error.toString());
                dispatch(actions.setTokenFail(JSON.stringify(error)));
            }
        },
        [dispatch]
    );

    const endRoom = useCallback(async (roomName: string) => {
        try {
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
        } catch (error) {
            setError(error);
        }
    }, []);

    const participantConnected = (participant: LocalParticipant | RemoteParticipant) => {
        if (participant.state === "connected") {
            dispatch(actions.addRemoteParticipant(participant));
        }
    };

    const participantDisconnected = (participant: LocalParticipant | RemoteParticipant) => {
        dispatch(actions.removeRemoteParticipant(participant));
    };

    const configParticipantsListeners = (room) => {
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.participants.forEach(participantConnected);
    };

    const joinToRoom = useCallback(
        async (roomName: string) => {
            try {
                setConnected(false);
                const token = await generateToken(roomName);
                const room = await connect(token, {
                    name: roomName,
                });
                // Add a listener to disconnect from the room when a user closes their browser
                window.addEventListener("beforeunload", () => {
                    disconnect(room);
                });
                dispatch(actions.joinToRoom(room));
                configParticipantsListeners(room);
                setConnected(true);
            } catch (error) {
                setConnected(false);
                setError(JSON.stringify(error));
            }
        },
        // eslint-disable-next-line
        [dispatch]
    );

    const disconnect = (room) => {
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
    return {
        room: state.room,
        token: state.room.token,
        joinToRoom,
        connected,
        disconnect,
        error,
    };
};

export default useVideoChat;
