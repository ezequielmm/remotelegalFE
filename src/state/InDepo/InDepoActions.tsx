import { LocalDataTrack, Room } from "twilio-video";
import { DataTrackMessage, DisconnectRoomState } from "../types";

export enum ACTION_TYPE {
    SEND_MESSAGE = "SEND_MESSAGE",
    IN_DEPO_JOIN_TO_ROOM = "IN_DEPO_JOIN_TO_ROOM",
    IN_DEPO_DISCONNECT = "IN_DEPO_DISCONNECT",
    IN_DEPO_ADD_PARTICIPANT = "IN_DEPO_ADD_PARTICIPANT",
    IN_DEPO_REMOVE_PARTICIPANT = "IN_DEPO_REMOVE_PARTICIPANT",
    IN_DEPO_ADD_DATA_TRACK = "IN_DEPO_ADD_DATA_TRACK",
    ADD_WITNESS = "IN_DEPO_ADD_WITNESS",
}

const actions = {
    addDataTrack: (dataTrack: LocalDataTrack) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_DATA_TRACK,
        payload: dataTrack,
    }),

    joinToRoom: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_JOIN_TO_ROOM,
        payload,
    }),
    sendMessage: (payload: DataTrackMessage) => ({
        type: ACTION_TYPE.SEND_MESSAGE,
        payload,
    }),
    disconnect: (payload: DisconnectRoomState) => ({
        type: ACTION_TYPE.IN_DEPO_DISCONNECT,
        payload,
    }),
    addRemoteParticipant: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_ADD_PARTICIPANT,
        payload,
    }),
    addWitness: (payload: string) => ({
        type: ACTION_TYPE.ADD_WITNESS,
        payload,
    }),
    removeRemoteParticipant: (payload: Room) => ({
        type: ACTION_TYPE.IN_DEPO_REMOVE_PARTICIPANT,
        payload,
    }),
};

export default actions;
