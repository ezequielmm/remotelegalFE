import { Room } from "twilio-video";
import actions from "../state/InDepo/InDepoActions";

const disconnectFromDepo = async (
    room: Room,
    dispatch: React.SetStateAction<any>,
    history?,
    killDepo?: () => Promise<void>,
    depositionID?: string
) => {
    const initialState = {
        info: null,
        currentRoom: null,
        currentBreakroom: null,
        error: "",
        transcriptions: null,
        dataTrack: null,
        breakroomDataTrack: null,
        timeZone: null,
        message: { module: "", value: "" },
    };
    const doesRoomExistAndIsParticipantConnected = room?.localParticipant?.state === "connected";
    if (killDepo && typeof killDepo === "function") {
        // TODO: Handle errors when closing the room
        await killDepo();
    }
    if (doesRoomExistAndIsParticipantConnected) {
        room.localParticipant.tracks.forEach((trackPublication: any) => {
            return trackPublication.track.kind === "audio" || trackPublication.kind === "video"
                ? trackPublication.track.stop()
                : null;
        });
        room.disconnect();
        dispatch(actions.disconnect(initialState));
    }
    return history?.push("/deposition/end", { depositionID });
};
export default disconnectFromDepo;
