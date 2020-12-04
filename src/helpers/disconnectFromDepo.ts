import { Room } from "twilio-video";
import actions from "../state/InDepo/InDepoActions";

const disconnectFromDepo = (room: Room, dispatch: React.SetStateAction<any>, killDepo?: (depoID: string) => void) => {
    const initialState = {
        info: null,
        currentRoom: null,
        error: "",
        dataTrack: null,
        message: { module: "", value: "" },
        witness: "",
    };
    const doesRoomExistAndIsParticipantConnected = room?.localParticipant?.state === "connected";
    if (doesRoomExistAndIsParticipantConnected) {
        room.localParticipant.tracks.forEach((trackPublication: any) => {
            return trackPublication.track.kind === "audio" || trackPublication.kind === "video"
                ? trackPublication.track.stop()
                : null;
        });
        dispatch(actions.disconnect(initialState));
        room.disconnect();
    }
    return killDepo ? killDepo(room.name) : room;
};
export default disconnectFromDepo;
