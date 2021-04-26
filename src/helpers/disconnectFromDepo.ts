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
        mockDepoRoom: null,
        info: null,
        dominantSpeaker: null,
        currentRoom: null,
        currentBreakroom: null,
        error: "",
        transcriptions: null,
        dataTrack: null,
        breakroomDataTrack: null,
        timeZone: null,
        message: { module: "", value: "" },
        currentExhibit: null,
        exhibitDocument: null,
        stampLabel: "",
        annotations: [],
        lastAnnotationId: "",
        startTime: "",
    };
    const doesRoomExistAndIsParticipantConnected = room?.localParticipant?.state === "connected";
    if (doesRoomExistAndIsParticipantConnected) {
        room.localParticipant.tracks.forEach((trackPublication: any) => {
            return trackPublication.track.kind === "audio" || trackPublication.kind === "video"
                ? trackPublication.track.stop()
                : null;
        });
        room.disconnect();
        dispatch(actions.disconnect(initialState));
    }
    history?.push("/deposition/end", { depositionID, isWitness: false });
    if (killDepo && typeof killDepo === "function") {
        // TODO: Handle errors when closing the room
        await killDepo();
    }
};
export default disconnectFromDepo;
