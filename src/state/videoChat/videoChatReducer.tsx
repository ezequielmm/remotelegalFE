import { Reducer } from "react";
import { LocalDataTrack, Room } from "twilio-video";
import { IAction, DataTrackMessage } from "../types";
import { ACTION_TYPE } from "./videoChatAction";

interface IRoom {
    token?: string;
    info?: object;
    currentRoom?: Room;
    error?: string;
    message?: DataTrackMessage;
    dataTrack?: LocalDataTrack | null;
}

export const RoomReducerIntialState: IRoom = {
    token: "",
    info: null,
    currentRoom: null,
    error: "",
    dataTrack: null,
    message: { module: "", value: "" },
};

const RoomReducer: Reducer<IRoom, IAction> = (state: IRoom, action: IAction): IRoom => {
    switch (action.type) {
        case ACTION_TYPE.VIDEO_CHAT_SET_ROOM_INFO:
            return {
                ...state,
                info: action.payload,
            };
        case ACTION_TYPE.VIDEO_CHAT_SET_TOKEN:
            return {
                ...state,
                token: action.payload.token,
            };
        case ACTION_TYPE.VIDEO_CHAT_SET_TOKEN_FAIL:
            return {
                ...state,
                error: action.payload,
            };
        case ACTION_TYPE.VIDEO_CHAT_ADD_DATA_TRACK:
            return {
                ...state,
                dataTrack: action.payload,
            };
        case ACTION_TYPE.VIDEO_CHAT_JOIN_TO_ROOM:
            return {
                ...state,
                currentRoom: action.payload,
            };
        case ACTION_TYPE.SEND_MESSAGE:
            return {
                ...state,
                message: action.payload,
            };
        case ACTION_TYPE.VIDEO_CHAT_DISCONNECT:
            return { ...state, token: "", message: { module: "", value: "" }, currentRoom: null, dataTrack: null };
        case ACTION_TYPE.VIDEO_CHAT_ADD_PARTICIPANT:
            const currentRoomToAddParticipant = state.currentRoom;
            currentRoomToAddParticipant?.participants?.set(action.payload.sid, action.payload);
            return {
                ...state,
                currentRoom: currentRoomToAddParticipant,
            };
        case ACTION_TYPE.VIDEO_CHAT_REMOVE_PARTICIPANT:
            const currentRoomToRemoveParticipant = state.currentRoom;
            currentRoomToRemoveParticipant?.participants?.delete(action.payload.sid);

            return {
                ...state,
                currentRoom: currentRoomToRemoveParticipant,
            };

        default:
            return state;
    }
};

export default RoomReducer;
