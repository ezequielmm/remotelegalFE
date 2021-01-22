import { LocalParticipant, RemoteParticipant } from "twilio-video";

const configParticipantListeners = (room, addRemoteParticipant, removeRemoteParticipant) => {
    const participantConnected = (participant: LocalParticipant | RemoteParticipant) => {
        if (participant.state === "connected" && room) {
            room.participants.set(participant.sid, participant);
            return addRemoteParticipant(room);
        }
        return null;
    };

    const participantDisconnected = (participant: LocalParticipant | RemoteParticipant) => {
        if (room) {
            room.participants.delete(participant);
            return removeRemoteParticipant(room);
        }
        return null;
    };
    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
};
export default configParticipantListeners;
