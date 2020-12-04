import { LocalParticipant, RemoteParticipant } from "twilio-video";
import actions from "../state/InDepo/InDepoActions";

const configParticipantsListeners = (room, dispatchFunc) => {
    const participantConnected = (participant: LocalParticipant | RemoteParticipant) => {
        if (participant.state === "connected" && room) {
            room.participants.set(participant.sid, participant);
            return dispatchFunc(actions.addRemoteParticipant(room));
        }
        return null;
    };

    const participantDisconnected = (participant: LocalParticipant | RemoteParticipant) => {
        if (room) {
            room.participants.delete(participant);
            return dispatchFunc(actions.removeRemoteParticipant(room));
        }
        return null;
    };
    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
};
export default configParticipantsListeners;
