import { Reducer } from "react";
import moment from "moment-timezone";
import { LocalDataTrack, Room } from "twilio-video";
import { TimeZones } from "../../models/general";
import { TranscriptionModel } from "../../models";
import { IAction, DataTrackMessage } from "../types";
import { ACTION_TYPE } from "./InDepoActions";

export interface IRoom {
    info?: object;
    currentRoom?: Room;
    error?: string;
    message?: DataTrackMessage;
    dataTrack?: LocalDataTrack | null;
    witness?: string;
    timeZone?: TimeZones;
    transcriptions?: TranscriptionModel.Transcription[];
    permissions?: string[];
}

export const RoomReducerInitialState: IRoom = {
    info: null,
    currentRoom: null,
    error: "",
    dataTrack: null,
    message: { module: "", value: "" },
    witness: "",
    timeZone: null,
    transcriptions: [],
    permissions: [],
};

const RoomReducer: Reducer<IRoom, IAction> = (state: IRoom, action: IAction): IRoom => {
    switch (action.type) {
        case ACTION_TYPE.IN_DEPO_ADD_DATA_TRACK:
            return {
                ...state,
                dataTrack: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_ADD_TRANSCRIPTION: {
            const newTranscription = action.payload;
            if (newTranscription.text === "") return state;
            const laterTranscriptionIndex = state.transcriptions.findIndex((transcription) => {
                return moment(newTranscription.time).isBefore(moment(transcription.time), "second");
            });
            const transcriptions =
                laterTranscriptionIndex === -1
                    ? [...state.transcriptions, newTranscription]
                    : [
                          ...state.transcriptions.slice(0, laterTranscriptionIndex),
                          newTranscription,
                          ...state.transcriptions.slice(laterTranscriptionIndex),
                      ];
            return {
                ...state,
                transcriptions,
            };
        }
        case ACTION_TYPE.IN_DEPO_SET_PERMISSIONS:
            return {
                ...state,
                permissions: action.payload,
            };
        case ACTION_TYPE.SET_TRANSCRIPTIONS:
            return {
                ...state,
                transcriptions: action.payload,
            };
        case ACTION_TYPE.ADD_WITNESS:
            return {
                ...state,
                witness: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_JOIN_TO_ROOM:
            return {
                ...state,
                currentRoom: action.payload,
            };
        case ACTION_TYPE.SEND_MESSAGE:
            return {
                ...state,
                message: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_DISCONNECT:
            return { ...state, ...action.payload };
        case ACTION_TYPE.IN_DEPO_ADD_PARTICIPANT:
            return {
                ...state,
                currentRoom: action.payload,
            };
        case ACTION_TYPE.IN_DEPO_REMOVE_PARTICIPANT:
            return {
                ...state,
                currentRoom: action.payload,
            };
        case ACTION_TYPE.SET_TIMEZONE:
            return {
                ...state,
                timeZone: action.payload,
            };

        default:
            return state;
    }
};

export default RoomReducer;
