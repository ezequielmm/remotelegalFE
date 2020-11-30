import { LocalDataTrack, Room } from "twilio-video";
import { DataTrackMessage, DisconnectRoomState } from "../types";

export enum ACTION_TYPE {
    VIDEO_CHAT_SET_TOKEN = "VIDEO_CHAT_SET_TOKEN",
    SEND_MESSAGE = "SEND_MESSAGE",
    VIDEO_CHAT_JOIN_TO_ROOM = "VIDEO_CHAT_JOIN_TO_ROOM",
    VIDEO_CHAT_DISCONNECT = "VIDEO_CHAT_DISCONNECT",
    VIDEO_CHAT_ADD_PARTICIPANT = "VIDEO_CHAT_ADD_PARTICIPANT",
    VIDEO_CHAT_REMOVE_PARTICIPANT = "VIDEO_CHAT_REMOVE_PARTICIPANT",
    VIDEO_CHAT_ADD_DATA_TRACK = "VIDEO_CHAT_ADD_DATA_TRACK",
}

const actions = {
    addDataTrack: (dataTrack: LocalDataTrack) => ({
        type: ACTION_TYPE.VIDEO_CHAT_ADD_DATA_TRACK,
        payload: dataTrack,
    }),
    setToken: (payload: string) => ({
        type: ACTION_TYPE.VIDEO_CHAT_SET_TOKEN,
        payload,
    }),

    joinToRoom: (payload: Room) => ({
        type: ACTION_TYPE.VIDEO_CHAT_JOIN_TO_ROOM,
        payload,
    }),
    sendMessage: (payload: DataTrackMessage) => ({
        type: ACTION_TYPE.SEND_MESSAGE,
        payload,
    }),
    disconnect: (payload: DisconnectRoomState) => ({
        type: ACTION_TYPE.VIDEO_CHAT_DISCONNECT,
        payload,
    }),
    addRemoteParticipant: (payload: Room) => ({
        type: ACTION_TYPE.VIDEO_CHAT_ADD_PARTICIPANT,
        payload,
    }),
    removeRemoteParticipant: (payload: Room) => ({
        type: ACTION_TYPE.VIDEO_CHAT_REMOVE_PARTICIPANT,
        payload,
    }),
};

export default actions;
