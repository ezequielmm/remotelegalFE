import { LocalDataTrack } from "twilio-video";

export enum ACTION_TYPE {
    VIDEO_CHAT_SET_TOKEN = "VIDEO_CHAT_SET_TOKEN",
    SEND_MESSAGE = "SEND_MESSAGE",
    VIDEO_CHAT_SET_TOKEN_FAIL = "VIDEO_CHAT_SET_TOKEN_FAIL",
    VIDEO_CHAT_JOIN_TO_ROOM = "VIDEO_CHAT_JOIN_TO_ROOM",
    VIDEO_CHAT_DISCONNECT = "VIDEO_CHAT_DISCONNECT",
    VIDEO_CHAT_SET_ROOM_INFO = "VIDEO_CHAT_SET_ROOM_INFO",
    VIDEO_CHAT_ADD_PARTICIPANT = "VIDEO_CHAT_ADD_PARTICIPANT",
    VIDEO_CHAT_REMOVE_PARTICIPANT = "VIDEO_CHAT_REMOVE_PARTICIPANT",
    VIDEO_CHAT_ADD_DATA_TRACK = "VIDEO_CHAT_ADD_DATA_TRACK",
}

const actions = {
    addDataTrack: (dataTrack: LocalDataTrack) => ({
        type: ACTION_TYPE.VIDEO_CHAT_ADD_DATA_TRACK,
        payload: dataTrack,
    }),
    setToken: (payload: any) => ({
        type: ACTION_TYPE.VIDEO_CHAT_SET_TOKEN,
        payload,
    }),
    setTokenFail: (payload: any) => ({
        type: ACTION_TYPE.VIDEO_CHAT_SET_TOKEN_FAIL,
        payload,
    }),
    joinToRoom: (payload: any) => ({
        type: ACTION_TYPE.VIDEO_CHAT_JOIN_TO_ROOM,
        payload,
    }),
    sendMessage: (payload: any) => ({
        type: ACTION_TYPE.SEND_MESSAGE,
        payload,
    }),
    disconnect: () => ({
        type: ACTION_TYPE.VIDEO_CHAT_DISCONNECT,
        payload: {},
    }),
    setRoomInfo: (payload: any) => ({
        type: ACTION_TYPE.VIDEO_CHAT_SET_ROOM_INFO,
        payload,
    }),
    addRemoteParticipant: (payload: any) => ({
        type: ACTION_TYPE.VIDEO_CHAT_ADD_PARTICIPANT,
        payload,
    }),
    removeRemoteParticipant: (payload: any) => ({
        type: ACTION_TYPE.VIDEO_CHAT_REMOVE_PARTICIPANT,
        payload,
    }),
};

export default actions;
