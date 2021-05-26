import { LocalTrack, Room } from "twilio-video";
import actions from "../state/InDepo/InDepoActions";
import stopAllTracks from "./stopAllTracks";

const disconnectFromDepo = (
    room: Room,
    dispatch: React.SetStateAction<any>,
    history?,
    depositionID?: string,
    tracks?: LocalTrack[],
    isWitness?: boolean
) => {
    const initialState = {
        info: null,
        startTime: "",
        mockDepoRoom: null,
        shouldSendToPreDepo: null,
        userStatus: null,
        currentRoom: null,
        dominantSpeaker: null,
        currentBreakroom: null,
        error: "",
        tracks: [],
        dataTrack: null,
        breakroomDataTrack: null,
        message: { module: "", value: "" },
        isRecording: null,
        timeZone: null,
        transcriptions: [],
        permissions: [],
        currentExhibit: null,
        currentExhibitPage: null,
        isCurrentExhibitOwner: false,
        exhibitTab: "myExhibits",
        currentExhibitTabName: "",
        lastAnnotationId: "",
        currentUser: null,
        stampLabel: "",
        exhibitDocument: null,
        participants: [],
        token: null,
        isMuted: false,
        jobNumber: "",
    };

    if (tracks?.length) {
        stopAllTracks(tracks);
    }
    const doesRoomExistAndIsParticipantConnected = room?.localParticipant?.state === "connected";

    if (doesRoomExistAndIsParticipantConnected) {
        room.disconnect();
    }
    dispatch(actions.disconnect(initialState));
    return history?.push("/deposition/end", { depositionID, isWitness });
};
export default disconnectFromDepo;
