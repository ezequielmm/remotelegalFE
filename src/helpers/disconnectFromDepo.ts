import { LocalTrack, Room } from "twilio-video";
import actions from "../state/InDepo/InDepoActions";
import stopAllTracks from "./stopAllTracks";

const disconnectFromDepo = (
    room: Room,
    dispatch: React.SetStateAction<any>,
    history?,
    depositionID?: string,
    tracks?: LocalTrack[]
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
        tracks: [],
    };

    if (tracks?.length) {
        stopAllTracks(tracks);
    }
    const doesRoomExistAndIsParticipantConnected = room?.localParticipant?.state === "connected";

    if (doesRoomExistAndIsParticipantConnected) {
        room.disconnect();
    }
    dispatch(actions.disconnect(initialState));
    return history?.push("/deposition/end", { depositionID, isWitness: false });
};
export default disconnectFromDepo;
