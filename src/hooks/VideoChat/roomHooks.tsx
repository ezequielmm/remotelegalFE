import { Auth } from "aws-amplify";
import { useContext } from "react";
import { connect, createLocalTracks, LocalDataTrack } from "twilio-video";
import { GlobalStateContext } from "../../state/GlobalState";
import configParticipantListeners from "../../helpers/configParticipantListeners";
import useAsyncCallback from "../useAsyncCallback";
import actions from "../../state/videoChat/videoChatAction";
import generateToken from "../../helpers/generateToken";

const endRoom = async (roomName: string) => {
    // TODO: CONNECT NEW ENDPOINT, ADD DEPENDENCY INJECTION FOR THE TOKEN AND MOVE THIS API CALL ELSEWHERE
    const session = await Auth.currentSession();
    const idToken = session.getIdToken();
    const jwt = idToken.getJwtToken();

    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: roomName }),
    };
    return fetch(`${process.env.REACT_APP_BASE_BE_URL}/api/rooms/endRoom`, requestOptions);
};

export const disconnect = (room, dispatch, killRoom?) => {
    const initialState = {
        token: "",
        info: null,
        currentRoom: null,
        error: "",
        dataTrack: null,
        message: { module: "", value: "" },
    };
    const doesRoomExistAndIsParticipantConnected = room?.localParticipant?.state === "connected";
    if (doesRoomExistAndIsParticipantConnected) {
        room.localParticipant.tracks.forEach((trackPublication) => {
            return trackPublication.kind === "audio" || trackPublication.kind === "video"
                ? trackPublication.track.stop()
                : null;
        });
        room.disconnect();
        dispatch(actions.disconnect(initialState));
    }
    return killRoom ? endRoom(room.name) : room;
};

export const useJoinToRoom = () => {
    const dataTrack = new LocalDataTrack({ maxPacketLifeTime: null, maxRetransmits: null });
    const { dispatch } = useContext(GlobalStateContext);
    return useAsyncCallback(async (roomName) => {
        const { token } = await generateToken(roomName);
        if (!token) {
            return;
        }

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
        configParticipantListeners(room, dispatch);
    }, []);
};
