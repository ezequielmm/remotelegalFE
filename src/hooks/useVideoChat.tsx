import { Auth } from "aws-amplify";
import { useCallback, useContext, useState } from "react";
import { connect, LocalParticipant, RemoteParticipant } from "twilio-video";
import { GlobalStateContext } from "../state/GlobalState";
import actions from "../state/videoChat/videoChatAction";

const useVideoChat = () => {
    const [error, setError] = useState(null);
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
                const tokenResult = await response.json();

                dispatch(actions.setToken({ token: tokenResult.token, roomName }));
            } catch (error) {
                dispatch(actions.setTokenFail(JSON.stringify(error)));
            }
        },
        [dispatch]
    );

    const createRoom = useCallback(
        async (roomName) => {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: roomName }),
            };

            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_BE_URL}/api/rooms/`, requestOptions);
                const roomInfo = await response.json();
                dispatch(actions.setRoomInfo(roomInfo));
                return true;
            } catch (error) {
                setError(JSON.stringify(error));
                return false;
            }
        },
        [dispatch]
    );

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
        async (token: string, roomName: string) => {
            try {
                const room = await connect(token, {
                    name: roomName,
                });
                dispatch(actions.joinToRoom(room));
                configParticipantsListeners(room);
            } catch (error) {
                setError(JSON.stringify(error));
            }
        },
        // eslint-disable-next-line
        [dispatch]
    );

    const disconnect = (room) => {
        if (room && room.localParticipant.state === "connected") {
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
        generateToken,
        createRoom,
        disconnect,
        error,
    };
};

export default useVideoChat;
